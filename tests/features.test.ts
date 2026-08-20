import { describe, expect, it } from "vitest";
import { joinFeatures, parseFeatureList, repairSplitThousands } from "@/lib/features";

describe("parseFeatureList", () => {
  it("keeps thousands grouping in mileage", () => {
    expect(parseFeatureList("Bianco Avus exterior, Right-hand drive, 4,000 km, 3.9L twin-turbo V8")).toEqual([
      "Bianco Avus exterior",
      "Right-hand drive",
      "4,000 km",
      "3.9L twin-turbo V8",
    ]);
  });

  it("keeps multi-group numbers", () => {
    expect(parseFeatureList("FOB ¥30,024,000, Export from Japan")).toEqual([
      "FOB ¥30,024,000",
      "Export from Japan",
    ]);
  });

  it("splits on newlines", () => {
    expect(parseFeatureList("MagneRide\nCarbon fiber trim")).toEqual([
      "MagneRide",
      "Carbon fiber trim",
    ]);
  });

  it("repairs already-split thousands tokens", () => {
    expect(repairSplitThousands(["4", "000 km", "7-speed F1 DCT"])).toEqual([
      "4,000 km",
      "7-speed F1 DCT",
    ]);
  });
});

describe("joinFeatures", () => {
  it("repairs then joins for the admin textarea", () => {
    expect(joinFeatures(["4", "000 km", "RHD"])).toBe("4,000 km, RHD");
  });
});
