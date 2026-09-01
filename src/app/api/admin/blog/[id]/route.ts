import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { normalizeBlogBlocks } from "@/lib/blog-blocks";
import {
  deleteBlogPost,
  getBlogPostById,
  normalizeBlogWriteInput,
  updateBlogPost,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    post: { ...post, blocks: normalizeBlogBlocks(post.blocks) },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const input = normalizeBlogWriteInput(body);
  if (!input) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  try {
    const post = await updateBlogPost(id, input);
    return NextResponse.json({
      post: { ...post, blocks: normalizeBlogBlocks(post.blocks) },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update post";
    if (msg === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteBlogPost(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 404 });
  }
}
