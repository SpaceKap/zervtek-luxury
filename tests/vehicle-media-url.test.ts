import { describe, expect, it } from "vitest";
import {
  vehicleGridImageUrl,
  vehicleThumbImageUrl,
} from "@/lib/vehicle-media-url";

describe("vehicleGridImageUrl", () => {
  it("keeps medium assets for sharp stock cards", () => {
    expect(
      vehicleGridImageUrl("/media/vehicles/abc/medium/photo.jpg"),
    ).toBe("/media/vehicles/abc/medium/photo.jpg");
  });

  it("leaves other urls unchanged", () => {
    expect(vehicleGridImageUrl("/placeholder.svg")).toBe("/placeholder.svg");
  });
});

describe("vehicleThumbImageUrl", () => {
  it("maps medium assets to thumbnail variants", () => {
    expect(
      vehicleThumbImageUrl("/media/vehicles/abc/medium/photo.jpg"),
    ).toBe("/media/vehicles/abc/thumbnail/photo.jpg");
  });

  it("leaves other urls unchanged", () => {
    expect(vehicleThumbImageUrl("/placeholder.svg")).toBe("/placeholder.svg");
  });
});
