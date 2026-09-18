import { describe, expect, it } from "vitest";
import {
  filterVehiclesBySearch,
  normalizeSearchText,
  vehicleMatchesSearch,
} from "@/lib/admin-listing-search";

const sample = {
  slug: "porsche/911/gt3-touring-for-sale",
  make: "Porsche",
  model: "911",
  variant: "GT3 Touring PDK",
  year: 2026,
  description: "Low-mileage GT3 Touring with PCCB and front axle lift.",
  features: ["PCCB", "Front lift", "Sport Chrono"],
  status: "AVAILABLE",
  vin: "WP0ZZZ99ZTS123456",
  sourceListingId: "carsensor-AU6962926389-perfseo3",
  sourceUrl: "https://www.carsensor.net/usedcar/detail/AU6962926389/index.html",
  sourceType: "Dealer",
  availabilityEvidence: "carsensor page still live",
};

describe("admin listing search", () => {
  it("normalizes punctuation and case", () => {
    expect(normalizeSearchText("GT3-Touring!")).toBe("gt3 touring");
  });

  it("matches partial tokens across title and description", () => {
    expect(vehicleMatchesSearch(sample, "tour")).toBe(true);
    expect(vehicleMatchesSearch(sample, "gt3 pdk")).toBe(true);
    expect(vehicleMatchesSearch(sample, "pccb lift")).toBe(true);
    expect(vehicleMatchesSearch(sample, "chrono")).toBe(true);
  });

  it("requires every token (AND)", () => {
    expect(vehicleMatchesSearch(sample, "porsche ferrari")).toBe(false);
  });

  it("ignores source information fields", () => {
    expect(vehicleMatchesSearch(sample, "carsensor")).toBe(false);
    expect(vehicleMatchesSearch(sample, "AU6962926389")).toBe(false);
    expect(vehicleMatchesSearch(sample, "perfseo3")).toBe(false);
  });

  it("filters a list", () => {
    const items = [
      sample,
      {
        slug: "bentley/continental-gt/speed-for-sale",
        make: "Bentley",
        model: "Continental GT",
        variant: "Speed",
        year: 2022,
        description: "W12 coupe in Beluga",
        features: ["Naim"],
        status: "AVAILABLE",
        vin: "SCBCG",
        sourceListingId: "carsensor-other",
        sourceUrl: "https://www.carsensor.net/other",
        sourceType: "Dealer",
        availabilityEvidence: "carsensor page still live",
      },
    ];
    expect(filterVehiclesBySearch(items, "bent").map((v) => v.make)).toEqual(["Bentley"]);
    expect(filterVehiclesBySearch(items, "gt3").map((v) => v.make)).toEqual(["Porsche"]);
    expect(filterVehiclesBySearch(items, "")).toHaveLength(2);
  });
});