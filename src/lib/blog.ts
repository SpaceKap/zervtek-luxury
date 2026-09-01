import type { BlogPost, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { normalizeBlogBlocks, type BlogBlock } from "./blog-blocks";
import { slugify } from "./slug";

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  blocks: BlogBlock[];
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

function toPublic(post: BlogPost): PublicBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    blocks: normalizeBlogBlocks(post.blocks),
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  };
}

export async function allocateUniqueBlogSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || "post";
  let candidate = base;
  let n = 2;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

export async function listPublishedBlogPosts(limit = 50, offset = 0): Promise<PublicBlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip: offset,
    take: limit,
  });
  return rows.map(toPublic);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const row = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  return row ? toPublic(row) : null;
}

export async function listAllBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({ where: { id } });
}

export type BlogPostWriteInput = {
  title: string;
  slug?: string;
  excerpt: string;
  coverImage?: string | null;
  blocks: BlogBlock[];
  status: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export function normalizeBlogWriteInput(body: Record<string, unknown>): BlogPostWriteInput | null {
  const title = String(body.title || "").trim();
  const excerpt = String(body.excerpt || "").trim();
  if (!title) return null;

  const status = String(body.status || "DRAFT").trim().toUpperCase();
  const allowed = new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]);
  const blocks = normalizeBlogBlocks(body.blocks);

  return {
    title,
    slug: body.slug ? String(body.slug).trim() : undefined,
    excerpt,
    coverImage:
      body.coverImage === "" || body.coverImage == null ? null : String(body.coverImage).trim(),
    blocks,
    status: allowed.has(status) ? status : "DRAFT",
    metaTitle: body.metaTitle ? String(body.metaTitle).trim() : null,
    metaDescription: body.metaDescription ? String(body.metaDescription).trim() : null,
  };
}

export async function createBlogPost(input: BlogPostWriteInput): Promise<BlogPost> {
  const slug = input.slug ? slugify(input.slug) : await allocateUniqueBlogSlug(input.title);
  const publishedAt = input.status === "PUBLISHED" ? new Date() : null;
  return prisma.blogPost.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      blocks: input.blocks as Prisma.InputJsonValue,
      status: input.status,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      publishedAt,
    },
  });
}

export async function updateBlogPost(id: string, input: BlogPostWriteInput): Promise<BlogPost> {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("NOT_FOUND");

  const slug = input.slug
    ? slugify(input.slug)
    : existing.slug || (await allocateUniqueBlogSlug(input.title, id));

  let publishedAt = existing.publishedAt;
  if (input.status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  }
  if (input.status !== "PUBLISHED") {
    publishedAt = input.status === "ARCHIVED" ? publishedAt : publishedAt;
  }

  return prisma.blogPost.update({
    where: { id },
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      blocks: input.blocks as Prisma.InputJsonValue,
      status: input.status,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      publishedAt,
    },
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } });
}
