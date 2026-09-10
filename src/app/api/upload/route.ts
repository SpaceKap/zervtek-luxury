import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { detectImageType } from "@/lib/vehicle-images";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_FILES = 12;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Too many files (max ${MAX_FILES})` }, { status: 400 });
  }

  const totalDeclared = files.reduce((sum, f) => sum + f.size, 0);
  if (totalDeclared > MAX_TOTAL_BYTES) {
    return NextResponse.json({ error: "Total upload too large" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const detected = detectImageType(bytes);
    if (!detected) {
      return NextResponse.json(
        { error: "Unsupported or invalid image file" },
        { status: 400 },
      );
    }

    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${detected.ext}`;
    const outPath = path.join(dir, name);
    // Re-encode to strip metadata / active content; keep original dimensions.
    await sharp(bytes)
      .rotate()
      .toFormat(detected.ext === "png" ? "png" : "jpeg", { quality: 90 })
      .toFile(outPath);
    urls.push(`/uploads/${name}`);
  }

  return NextResponse.json({ urls });
}
