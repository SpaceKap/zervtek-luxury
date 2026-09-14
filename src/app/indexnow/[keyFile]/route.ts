import { getIndexNowKey, indexNowKeyFileName } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

/** IndexNow ownership key file (https://www.indexnow.org/documentation). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ keyFile: string }> },
) {
  const { keyFile } = await params;
  const key = getIndexNowKey();
  const expected = indexNowKeyFileName();

  if (!key || !expected || keyFile !== expected) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
