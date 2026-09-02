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
  it("uses human-readable vehicle enums", () => {
    const schema = productSchema(sampleVehicle);
    expect(schema.bodyType).toBe("Coupe");
    expect(schema.fuelType).toBe("Petrol");
    expect(schema.vehicleTransmission).toBe("DCT");
    expect(schema.driveWheelConfiguration).toBe("https://schema.org/AllWheelDriveConfiguration");
    expect(schema.vehicleConfiguration).toContain("Right-hand drive");
  });

  it("includes offer shipping and price validity", () => {
    const schema = productSchema(sampleVehicle);
    expect(schema.offers?.description).toContain("JPY");
    expect(schema.offers?.priceValidUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(schema.offers?.shippingDetails?.deliveryTime?.transitTime?.unitCode).toBe("WK");
  });

  it("excludes sold vehicles from item lists", () => {
    const list = productListJsonLd([
      sampleVehicle,
      { ...sampleVehicle, id: "sold1", status: "SOLD" },
    ]);
    expect(list.numberOfItems).toBe(1);
    expect(list.itemListElement).toHaveLength(1);
  });

  it("adds dealer logo and opening hours", () => {
    const org = organizationJsonLd();
    expect(org.logo?.url).toContain("/logo.png");
    expect(org.openingHoursSpecification?.[0]?.dayOfWeek).toContain("Monday");
    expect(org.areaServed?.name).toBe("Worldwide");
  });

  it("keeps sitelinks search target on stock q param", () => {
    const site = websiteJsonLd();
    expect(site.potentialAction?.target).toContain("/stock?q={search_term_string}");
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
