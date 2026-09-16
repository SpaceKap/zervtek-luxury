import { describe, expect, it } from "vitest";
import {
  blogArticleJsonLd,
  compactJsonLd,
  organizationJsonLd,
  productListJsonLd,
  productSchema,
  websiteJsonLd,
} from "@/lib/seo";

const sampleVehicle = {
  id: "abc123",
  slug: "porsche/911/turbo-for-sale",
  year: 2020,
  registrationMonth: 3,
  make: "Porsche",
  model: "911",
  variant: "Turbo",
  description: "Low mileage example.",
  images: ["/media/vehicles/abc/medium/1.jpg"],
  price: 20000000,
  status: "AVAILABLE",
  vin: null,
  bodyType: "COUPE",
  exteriorColor: "Black",
  fuelType: "PETROL",
  transmission: "DCT",
  engineCc: 3800,
  mileage: 18000,
  steering: "RHD",
  drivetrain: "AWD",
} as const;

describe("seo schema", () => {
  it("omits offers for inquire (no list price) listings", () => {
    const schema = productSchema({ ...sampleVehicle, price: null } as never);
    expect(schema).not.toHaveProperty("offers");
    const list = productListJsonLd([{ ...sampleVehicle, price: null } as never]);
    const item = list.itemListElement[0].item as Record<string, unknown>;
    expect(item).not.toHaveProperty("offers");
  });

  it("uses human-readable vehicle enums", () => {
    const schema = productSchema(sampleVehicle as never);
    expect(schema.bodyType).toBe("Coupe");
    expect(schema.fuelType).toBe("Petrol");
    expect(schema.vehicleTransmission).toBe("DCT");
    expect(schema.driveWheelConfiguration).toBe("https://schema.org/AllWheelDriveConfiguration");
    expect(schema.vehicleConfiguration).toContain("Right-hand drive");
  });

  it("omits fictional offer validity and shipping transit", () => {
    const schema = productSchema(sampleVehicle as never);
    expect(schema.offers?.description).toContain("JPY");
    expect(schema.offers).not.toHaveProperty("priceValidUntil");
    expect(schema.offers).not.toHaveProperty("shippingDetails");
  });

  it("emits year-month registration date when month is known", () => {
    const schema = productSchema(sampleVehicle as never);
    expect(schema).not.toHaveProperty("vehicleModelDate");
    expect(schema.dateVehicleFirstRegistered).toBe("2020-03");
  });

  it("omits registration date when month is unknown", () => {
    const { registrationMonth: _m, ...yearOnly } = sampleVehicle;
    const schema = productSchema(yearOnly as never);
    expect(schema).not.toHaveProperty("dateVehicleFirstRegistered");
  });

  it("does not invent January for list cards without registrationMonth", () => {
    const list = productListJsonLd([
      {
        id: "card1",
        slug: "porsche/911/turbo-for-sale",
        year: 2020,
        make: "Porsche",
        model: "911",
        variant: "Turbo",
        images: ["/media/vehicles/abc/medium/1.jpg"],
        price: 20000000,
        status: "AVAILABLE",
      } as never,
    ]);
    const item = list.itemListElement[0].item as Record<string, unknown>;
    expect(item).not.toHaveProperty("dateVehicleFirstRegistered");
  });

  it("excludes sold vehicles from item lists", () => {
    const list = productListJsonLd([
      sampleVehicle as never,
      { ...sampleVehicle, id: "sold1", status: "SOLD" } as never,
    ]);
    expect(list.numberOfItems).toBe(1);
    expect(list.itemListElement).toHaveLength(1);
  });

  it("uses lightweight product entries in item lists", () => {
    const list = productListJsonLd([sampleVehicle as never]);
    const item = list.itemListElement[0].item as Record<string, unknown>;
    expect(item).not.toHaveProperty("description");
    expect(item.image).toBe("https://performance.zervtek.com/media/vehicles/abc/medium/1.jpg");
    expect(Array.isArray(item.image)).toBe(false);
  });

  it("adds dealer logo and opening hours", () => {
    const org = organizationJsonLd();
    expect(org.logo?.url).toContain("/logo.png");
    expect(org.openingHoursSpecification?.[0]?.dayOfWeek).toContain("Monday");
    expect(org.areaServed?.name).toBe("Worldwide");
  });

  it("does not advertise a keyword SearchAction", () => {
    const site = websiteJsonLd();
    expect(site).not.toHaveProperty("potentialAction");
  });

  it("strips undefined blog fields and adds publisher logo", () => {
    const article = blogArticleJsonLd({
      title: "Import guide",
      slug: "import-guide",
      excerpt: "How to import.",
      updatedAt: new Date("2026-01-15T00:00:00.000Z"),
      publishedAt: null,
      coverImage: null,
    });
    expect(article).not.toHaveProperty("datePublished");
    expect(article).not.toHaveProperty("image");
    expect(article.publisher?.logo?.url).toContain("/logo.png");
    expect(article.mainEntityOfPage).toMatchObject({
      "@type": "WebPage",
      "@id": expect.stringContaining("/blog/import-guide"),
    });
  });

  it("removes undefined values recursively", () => {
    expect(compactJsonLd({ a: 1, b: undefined, c: { d: undefined, e: 2 } })).toEqual({
      a: 1,
      c: { e: 2 },
    });
  });
});
