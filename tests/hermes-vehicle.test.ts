import { describe, expect, it } from "vitest";
import { applyAvailabilityResult } from "@/lib/availability";
import { validateHermesMetadata } from "@/lib/hermes-vehicle";
import { detectImageType } from "@/lib/vehicle-images";
import { isPublicVehicleStatus } from "@/lib/vehicle-constants";
import { toPublicVehicle } from "@/lib/vehicle-public";
import type { Vehicle } from "@prisma/client";

function baseVehicle(over: Partial<Vehicle> = {}): Vehicle {
  return {
    id: "v1",
    slug: "2025-test",
    make: "Mercedes-AMG",
    model: "C-Class",
    variant: "C43",
    year: 2025,
    registrationMonth: 3,
    price: 9000000,
    mileage: 1000,
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    drivetrain: "AWD",
    steering: "RHD",
    bodyType: "WAGON",
    engineCc: 3000,
    exteriorColor: "Black",
    interiorColor: "Black",
    location: "Osaka",
    vin: "FRAME-1",
    description: "Desc",
    features: [],
    images: ["/media/vehicles/x.jpg"],
    status: "AVAILABLE",
    statusBeforeUnavailable: null,
    featured: false,
    metaTitle: null,
    metaDescription: null,
    createdByType: "AUTOMATION",
    createdByName: "Hermes",
    sourceType: "DEALER",
    sourceListingId: "dealer-1",
    sourceUrl: "https://dealer.example/1",
    idempotencyKey: "dealer:1",
    lastAvailabilityCheckAt: null,
    lastAvailabilityResult: null,
    consecutiveUnavailableChecks: 0,
    availabilityCheckLocked: false,
    availabilityEvidence: null,
    availabilityHttpStatus: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

describe("Hermes metadata validation", () => {
  it("accepts valid metadata and maps totalPriceJpy", () => {
    const res = validateHermesMetadata({
      make: "Mercedes-AMG",
      model: "C-Class",
      variant: "C43 4MATIC Wagon",
      registrationYear: 2025,
      registrationMonth: 3,
      totalPriceJpy: 9000000,
      mileageKm: 80000,
      engineCc: 3000,
      transmission: "AUTOMATIC",
      fuel: "PETROL",
      drivetrain: "AWD",
      steering: "RHD",
      bodyType: "WAGON",
      exteriorColour: "Obsidian Black",
      interiorColour: "Black leather",
      location: "Osaka, Japan",
      frameNumber: "205264-123456",
      description: "Vehicle description",
      features: ["Burmester sound system"],
      sourceType: "DEALER",
      sourceListingId: "dealer-983214",
      sourceUrl: "https://dealer.example/vehicle/983214",
    });
    expect(res.ok).toBe(true);
    expect(res.data?.price).toBe(9000000);
    expect(res.data?.year).toBe(2025);
    expect(res.data?.mileage).toBe(80000);
    expect(res.data?.bodyType).toBe("WAGON");
    expect(res.data?.vin).toBe("205264-123456");
  });

  it("rejects missing required fields", () => {
    const res = validateHermesMetadata({ make: "X" });
    expect(res.ok).toBe(false);
    expect(res.missingFields).toContain("model");
    expect(res.missingFields).toContain("registrationYear");
    expect(res.missingFields).toContain("totalPriceJpy");
  });

  it("rejects invalid bodyType and fee breakdown fields", () => {
    const res = validateHermesMetadata({
      make: "A",
      model: "B",
      description: "C",
      registrationYear: 2024,
      totalPriceJpy: 1000,
      mileageKm: 10,
      bodyType: "HYBRID",
      vehiclePriceJpy: 500,
    });
    expect(res.ok).toBe(false);
    expect(res.invalidFields.bodyType).toBeTruthy();
    expect(res.invalidFields.vehiclePriceJpy).toBeTruthy();
  });

  it("forces mapped status path to NEEDS_REVIEW at API layer (data has no status)", () => {
    const res = validateHermesMetadata({
      make: "A",
      model: "B",
      description: "C",
      registrationYear: 2024,
      totalPriceJpy: 1000,
      mileageKm: 10,
      status: "AVAILABLE",
    });
    expect(res.ok).toBe(true);
    expect((res.data as { status?: string } | undefined)?.status).toBeUndefined();
  });
});

describe("Availability transition rules", () => {
  it("first unavailable does not hide", () => {
    const r = applyAvailabilityResult({
      currentStatus: "AVAILABLE",
      consecutiveUnavailableChecks: 0,
      statusBeforeUnavailable: null,
      result: "UNAVAILABLE",
    });
    expect(r.nextStatus).toBe("AVAILABLE");
    expect(r.consecutiveUnavailableChecks).toBe(1);
  });

  it("second consecutive unavailable sets UNAVAILABLE", () => {
    const r = applyAvailabilityResult({
      currentStatus: "AVAILABLE",
      consecutiveUnavailableChecks: 1,
      statusBeforeUnavailable: null,
      result: "UNAVAILABLE",
    });
    expect(r.nextStatus).toBe("UNAVAILABLE");
    expect(r.consecutiveUnavailableChecks).toBe(2);
    expect(r.statusBeforeUnavailable).toBe("AVAILABLE");
  });

  it("unknown does not change status or counter", () => {
    const r = applyAvailabilityResult({
      currentStatus: "AVAILABLE",
      consecutiveUnavailableChecks: 1,
      statusBeforeUnavailable: null,
      result: "UNKNOWN",
    });
    expect(r.nextStatus).toBe("AVAILABLE");
    expect(r.consecutiveUnavailableChecks).toBe(1);
  });

  it("available resets unavailable counter", () => {
    const r = applyAvailabilityResult({
      currentStatus: "AVAILABLE",
      consecutiveUnavailableChecks: 1,
      statusBeforeUnavailable: null,
      result: "AVAILABLE",
    });
    expect(r.consecutiveUnavailableChecks).toBe(0);
    expect(r.nextStatus).toBe("AVAILABLE");
  });
});

describe("Public visibility", () => {
  it("hides draft needs_review unavailable archived", () => {
    expect(isPublicVehicleStatus("AVAILABLE")).toBe(true);
    expect(isPublicVehicleStatus("RESERVED")).toBe(true);
    expect(isPublicVehicleStatus("SOLD")).toBe(true);
    expect(isPublicVehicleStatus("DRAFT")).toBe(false);
    expect(isPublicVehicleStatus("NEEDS_REVIEW")).toBe(false);
    expect(isPublicVehicleStatus("UNAVAILABLE")).toBe(false);
    expect(isPublicVehicleStatus("ARCHIVED")).toBe(false);
  });

  it("strips sourceUrl and internal fields from public vehicle", () => {
    const pub = toPublicVehicle(baseVehicle());
    expect((pub as { sourceUrl?: string }).sourceUrl).toBeUndefined();
    expect((pub as { sourceListingId?: string }).sourceListingId).toBeUndefined();
    expect((pub as { idempotencyKey?: string }).idempotencyKey).toBeUndefined();
    expect((pub as { createdByType?: string }).createdByType).toBeUndefined();
    expect(pub.make).toBe("Mercedes-AMG");
    expect(pub.price).toBe(9000000);
  });
});

describe("Image magic detection", () => {
  it("accepts JPEG magic bytes", () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(detectImageType(buf)?.mime).toBe("image/jpeg");
  });

  it("rejects SVG", () => {
    const buf = Buffer.from('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"></svg>');
    expect(detectImageType(buf)).toBeNull();
  });

  it("rejects random bytes", () => {
    expect(detectImageType(Buffer.from("not-an-image"))).toBeNull();
  });
});
