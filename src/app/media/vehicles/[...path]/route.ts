import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { resolveSafeMediaPath } from "@/lib/vehicle-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/** Public media URLs: /media/vehicles/<vehicleId>/<variant>/<file> */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;
  if (!parts?.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const abs = resolveSafeMediaPath(parts);
  if (!abs) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(abs);
    const ext = path.extname(abs).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noimageindex",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
