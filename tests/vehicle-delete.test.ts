import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  collectStoredImagePaths,
  deleteVehicleImageTree,
  relativePathFromMediaUrl,
} from "@/lib/vehicle-images";

let tempRoot = "";

beforeEach(async () => {
  tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "luxury-vehicle-images-"));
  process.env.VEHICLE_UPLOAD_DIR = tempRoot;
});

afterEach(async () => {
  delete process.env.VEHICLE_UPLOAD_DIR;
  if (tempRoot) await fs.rm(tempRoot, { recursive: true, force: true });
});

describe("vehicle image deletion", () => {
  it("maps public media URLs back to storage paths", () => {
    expect(relativePathFromMediaUrl("/media/vehicles/abc/medium/1.jpg")).toBe(
      "abc/medium/1.jpg",
    );
    expect(relativePathFromMediaUrl("https://example.com/photo.jpg")).toBeNull();
  });

  it("collects all variant paths for a vehicle", () => {
    const paths = collectStoredImagePaths(
      [
        {
          originalPath: "veh/original/a.jpg",
          largePath: "veh/large/a.jpg",
          mediumPath: "veh/medium/a.jpg",
          thumbnailPath: "veh/thumbnail/a.jpg",
        },
      ],
      ["/media/vehicles/veh/medium/a.jpg"],
    );
    expect(paths).toEqual(
      expect.arrayContaining([
        "veh/original/a.jpg",
        "veh/large/a.jpg",
        "veh/medium/a.jpg",
        "veh/thumbnail/a.jpg",
      ]),
    );
  });

  it("removes the full vehicle image directory", async () => {
    const vehicleId = "veh-delete-test";
    const file = path.join(tempRoot, vehicleId, "medium", "photo.jpg");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, "bytes");

    await deleteVehicleImageTree(vehicleId);

    await expect(fs.access(path.join(tempRoot, vehicleId))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });
});
