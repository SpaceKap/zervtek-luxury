import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogContent } from "@/components/blog/BlogContent";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedBlogPostBySlug } from "@/lib/blog";
import {
  resolveBlogMetaDescription,
  resolveBlogMetaTitle,
} from "@/lib/blog-seo";
import {
  blogArticleJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const title = resolveBlogMetaTitle({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    blocks: post.blocks,
    coverImage: post.coverImage,
  });
  const description = resolveBlogMetaDescription({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    blocks: post.blocks,
    coverImage: post.coverImage,
  });

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE.url}/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage.startsWith("http") ? post.coverImage : `${SITE.url}${post.coverImage}` }] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
  };
}

function formatDate(value: Date | null): string {
  if (!value) return "";
  return value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Blog", url: `${SITE.url}/blog` },
          { name: post.title, url: `${SITE.url}/blog/${post.slug}` },
        ])}
      />
      <JsonLd data={blogArticleJsonLd(post)} />

      <article className="container blog-article">
        <Breadcrumbs
          className="page-breadcrumbs"
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        {post.publishedAt ? (
          <time className="blog-article-date" dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
        ) : null}

        <h1 className="heading blog-article-title">{post.title}</h1>
        {post.excerpt ? <p className="blog-article-excerpt muted">{post.excerpt}</p> : null}

        {post.coverImage ? (
          <figure className="blog-article-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt="" className="blog-article-hero-image" />
          </figure>
        ) : null}

        <BlogContent blocks={post.blocks} />

        <div className="blog-article-footer">
          <Link href="/blog" className="btn btn-outline">
            Back to blog
          </Link>
          <Link href="/stock" className="btn btn-gold">
            Browse stock
          </Link>
        </div>
      </article>
    </main>
  );
}
