import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  createBlogPost,
  listAllBlogPosts,
  normalizeBlogWriteInput,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listAllBlogPosts();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const input = normalizeBlogWriteInput(body);
  if (!input) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  try {
    const post = await createBlogPost(input);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create post";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
