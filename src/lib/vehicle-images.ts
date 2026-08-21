import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const ALLOWED_MAGIC: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  {
    mime: "image/jpeg",
    ext: "jpg",
    test: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: "image/png",
    ext: "png",
    test: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47,
  },
  {
    mime: "image/webp",
    ext: "webp",
    test: (b) =>
      b.length >= 12 &&
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
  {
    mime: "image/avif",
    ext: "avif",
    test: (b) =>
      b.length >= 12 &&
      b.toString("ascii", 4, 8) === "ftyp" &&
      (b.toString("ascii", 8, 12) === "avif" ||
        b.toString("ascii", 8, 12) === "avis" ||
        b.includes(Buffer.from("avif"))),
  },
];

export function getUploadRoot(): string {
  return (
    process.env.VEHICLE_UPLOAD_DIR ||
    path.join(process.cwd(), "storage", "vehicle-images")
  );
}

export function getMediaUrlPrefix(): string {
  return process.env.VEHICLE_MEDIA_URL_PREFIX || "/media/vehicles";
}

export function mediaUrlFromPath(mediumPath: string): string {
  const prefix = getMediaUrlPrefix().replace(/\/$/, "");
  return `${prefix}/${mediumPath.replace(/\\/g, "/")}`;
}

/**
 * Align VehicleImage.sortOrder / isCover with the public `images` URL list.
 * Cover = first URL that matches a VehicleImage row.
 */
export async function syncVehicleMediaOrder(
  vehicleId: string,
  orderedUrls: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaClient: { vehicleImage: any },
) {
  const rows: { id: string; mediumPath: string }[] =
    await prismaClient.vehicleImage.findMany({ where: { vehicleId } });
  if (rows.length === 0) return;

  const byUrl = new Map(rows.map((r) => [mediaUrlFromPath(r.mediumPath), r]));
  const placed = new Set<string>();
  const updates: { id: string; sortOrder: number; isCover: boolean }[] = [];

  for (const url of orderedUrls) {
    const row = byUrl.get(url);
    if (!row || placed.has(row.id)) continue;
    placed.add(row.id);
    updates.push({
      id: row.id,
      sortOrder: updates.length,
      isCover: false,
    });
  }

  for (const row of rows) {
    if (placed.has(row.id)) continue;
    updates.push({
      id: row.id,
      sortOrder: updates.length,
      isCover: false,
    });
  }

  if (updates.length > 0) updates[0].isCover = true;

  await Promise.all(
    updates.map((u) =>
      prismaClient.vehicleImage.update({
        where: { id: u.id },
        data: { sortOrder: u.sortOrder, isCover: u.isCover },
      }),
    ),
  );
}

export function maxImages(): number {
  const n = Number(process.env.VEHICLE_MAX_IMAGES || 100);
  return Number.isFinite(n) && n > 0 ? n : 100;
}

export function maxImageBytes(): number {
  const mb = Number(process.env.VEHICLE_MAX_IMAGE_SIZE_MB || 15);
  return (Number.isFinite(mb) && mb > 0 ? mb : 15) * 1024 * 1024;
}

export function detectImageType(buf: Buffer): { mime: string; ext: string } | null {
  // Reject SVG explicitly (text-based)
  const head = buf.subarray(0, Math.min(256, buf.length)).toString("utf8").toLowerCase();
  if (head.includes("<svg") || head.includes("<?xml")) return null;
  for (const entry of ALLOWED_MAGIC) {
    if (entry.test(buf)) return { mime: entry.mime, ext: entry.ext };
  }
  return null;
}

export type ProcessedImage = {
  sha256: string;
  mimeType: string;
  byteSize: number;
  width: number;
  height: number;
  originalPath: string;
  largePath: string;
  mediumPath: string;
  thumbnailPath: string;
  publicUrl: string;
};

async function ensureDirs(vehicleId: string) {
  const root = path.join(getUploadRoot(), vehicleId);
  for (const sub of ["original", "large", "medium", "thumbnail"]) {
    await fs.mkdir(path.join(root, sub), { recursive: true });
  }
  return root;
}

/** Process and persist one image under vehicle-id folders. Returns relative paths + public URL (medium). */
export async function processAndStoreVehicleImage(
  vehicleId: string,
  bytes: Buffer,
): Promise<ProcessedImage> {
  if (bytes.length > maxImageBytes()) {
    throw new Error("IMAGE_TOO_LARGE");
  }
  const detected = detectImageType(bytes);
  if (!detected) {
    throw new Error("INVALID_IMAGE");
  }

  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const id = crypto.randomBytes(12).toString("hex");
  const base = `${id}.jpg`; // normalize variants to jpeg
  const originalName = `${id}.${detected.ext}`;

  await ensureDirs(vehicleId);

  const originalRel = path.join(vehicleId, "original", originalName);
  const largeRel = path.join(vehicleId, "large", base);
  const mediumRel = path.join(vehicleId, "medium", base);
  const thumbRel = path.join(vehicleId, "thumbnail", base);

  try {
    await fs.writeFile(path.join(getUploadRoot(), originalRel), bytes);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`STORAGE_WRITE_FAILED: ${msg}`);
  }

  let width = 0;
  let height = 0;
  try {
    const meta = await sharp(bytes).rotate().metadata();
    width = meta.width || 0;
    height = meta.height || 0;

    await sharp(bytes)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(getUploadRoot(), largeRel));

    await sharp(bytes)
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(getUploadRoot(), mediumRel));

    await sharp(bytes)
      .rotate()
      .resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(getUploadRoot(), thumbRel));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`SHARP_FAILED: ${msg}`);
  }
  const prefix = getMediaUrlPrefix().replace(/\/$/, "");
  return {
    sha256,
    mimeType: detected.mime,
    byteSize: bytes.length,
    width,
    height,
    originalPath: originalRel,
    largePath: largeRel,
    mediumPath: mediumRel,
    thumbnailPath: thumbRel,
    publicUrl: `${prefix}/${mediumRel.split(path.sep).join("/")}`,
  };
}

export async function deleteVehicleImageFiles(paths: string[]) {
  for (const rel of paths) {
    try {
      await fs.unlink(path.join(getUploadRoot(), rel));
    } catch {
      // ignore missing
    }
  }
}

export async function deleteVehicleImageTree(vehicleId: string) {
  try {
    await fs.rm(path.join(getUploadRoot(), vehicleId), { recursive: true, force: true });
  } catch {
    // ignore
  }
}

/** Resolve a relative storage path safely (no traversal). */
export function resolveSafeMediaPath(relParts: string[]): string | null {
  if (relParts.some((p) => p === ".." || p.includes("\0") || path.isAbsolute(p))) {
    return null;
  }
  const abs = path.resolve(getUploadRoot(), ...relParts);
  const root = path.resolve(getUploadRoot());
  if (!abs.startsWith(root + path.sep) && abs !== root) return null;
  return abs;
}
