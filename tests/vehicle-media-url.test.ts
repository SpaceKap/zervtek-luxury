import { describe, expect, it } from "vitest";
import { vehicleGridImageUrl } from "@/lib/vehicle-media-url";

describe("vehicleGridImageUrl", () => {
  it("maps medium assets to thumbnail variants", () => {
    expect(
      vehicleGridImageUrl("/media/vehicles/abc/medium/photo.jpg"),
    ).toBe("/media/vehicles/abc/thumbnail/photo.jpg");
  });

  it("leaves other urls unchanged", () => {
    expect(vehicleGridImageUrl("/placeholder.svg")).toBe("/placeholder.svg");
  });
});
