import type { Vehicle } from "@prisma/client";
import type { PublicVehicle } from "./vehicle-public";
import { formatJPY, formatKm } from "./format";
import { SITE } from "./site";
import { vehicleStockPath } from "./slug";
import {
  BODY_TYPE_LABELS,
  type BodyTypeValue,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  displayEnum,
} from "./vehicle-constants";

function absUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.url}${src}`;
}

/** Drop undefined values so JSON-LD validates cleanly. */
export function compactJsonLd<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => compactJsonLd(item)).filter((item) => item !== undefined) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined) continue;
      out[key] = compactJsonLd(val);
    }
    return out as T;
  }
  return value;
}

function siteLogoImageObject() {
  return {
    "@type": "ImageObject" as const,
    url: absUrl("/logo.png"),
  };
}

function offerPriceValidUntil(days = 90): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const DRIVETRAIN_SCHEMA: Record<string, string> = {
  FWD: "https://schema.org/FrontWheelDriveConfiguration",
  RWD: "https://schema.org/RearWheelDriveConfiguration",
  AWD: "https://schema.org/AllWheelDriveConfiguration",
  FOUR_WD: "https://schema.org/FourWheelDriveConfiguration",
};

export type VehicleSeoInput = {
  year: number | string;
  make: string;
  model: string;
  variant?: string | null;
  description?: string | null;
  mileage?: number | string | null;
  price?: number | string | null;
};

type ProductVehicle = Pick<
  Vehicle,
  | "id"
  | "slug"
  | "year"
  | "make"
  | "model"
  | "variant"
  | "description"
  | "images"
  | "price"
  | "status"
  | "vin"
  | "bodyType"
  | "exteriorColor"
  | "fuelType"
  | "transmission"
  | "engineCc"
  | "mileage"
  | "steering"
  | "drivetrain"
>;

/** Display / listing title: "2023 Mercedes-AMG C-Class C43 …" */
export function vehicleListingTitle(v: VehicleSeoInput): string {
  const year = String(v.year ?? "").trim();
  const make = String(v.make ?? "").trim();
  const model = String(v.model ?? "").trim();
  const variant = v.variant ? String(v.variant).trim() : "";
  return [year, make, model, variant].filter(Boolean).join(" ");
}

function vehicleName(v: ProductVehicle | PublicVehicle): string {
  return vehicleListingTitle(v);
}

function schemaBodyType(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const key = value.toUpperCase() as BodyTypeValue;
  return BODY_TYPE_LABELS[key] || value;
}

function schemaFuelType(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return displayEnum(value, FUEL_LABELS as Record<string, string>) || value;
}

function schemaTransmission(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return displayEnum(value, TRANSMISSION_LABELS as Record<string, string>) || value;
}

function vehicleConfiguration(v: ProductVehicle | PublicVehicle): string | undefined {
  const parts: string[] = [];
  if (v.variant?.trim()) parts.push(v.variant.trim());
  if (v.steering === "RHD") parts.push("Right-hand drive");
  if (v.steering === "LHD") parts.push("Left-hand drive");
  return parts.length ? parts.join(", ") : undefined;
}

/** Meta title from vehicle title. */
export function buildVehicleMetaTitle(v: VehicleSeoInput): string {
  const title = vehicleListingTitle(v);
  if (!title) return `${SITE.name} | Performance Cars from Japan`;
  return `${title} for Sale`;
}

/** Meta description from SEO description, with a compact fallback. */
export function buildVehicleMetaDescription(v: VehicleSeoInput): string {
  const fromDesc = String(v.description ?? "").trim().replace(/\s+/g, " ");
  if (fromDesc) {
    if (fromDesc.length <= 160) return fromDesc;
    const cut = fromDesc.slice(0, 157).replace(/\s+\S*$/, "");
    return `${cut || fromDesc.slice(0, 157)}…`;
  }

  const title = vehicleListingTitle(v) || "Luxury vehicle";
  const mileage = v.mileage != null && v.mileage !== "" ? Number(v.mileage) : null;
  const price = v.price != null && v.price !== "" ? Number(v.price) : null;
  const bits = [
    title,
    Number.isFinite(mileage) ? formatKm(mileage as number) : null,
    Number.isFinite(price) ? `${formatJPY(price as number)} total` : null,
  ].filter(Boolean);
  return `${bits.join(", ")}. Inspected and exported worldwide by ${SITE.name}.`;
}

export function resolveVehicleMetaTitle(v: VehicleSeoInput & { metaTitle?: string | null }): string {
  const custom = String(v.metaTitle ?? "").trim();
  return custom || buildVehicleMetaTitle(v);
}

export function resolveVehicleMetaDescription(
  v: VehicleSeoInput & { metaDescription?: string | null },
): string {
  const custom = String(v.metaDescription ?? "").trim();
  return custom || buildVehicleMetaDescription(v);
}

function offerAvailability(status: string): string {
  if (status === "SOLD") return "https://schema.org/SoldOut";
  if (status === "RESERVED") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

function vehicleOffers(v: ProductVehicle | PublicVehicle, url: string) {
  return {
    "@type": "Offer" as const,
    url,
    price: String(v.price),
    priceCurrency: "JPY",
    priceValidUntil: offerPriceValidUntil(),
    availability: offerAvailability(v.status),
    itemCondition: "https://schema.org/UsedCondition",
    description: "Vehicle price in JPY. Shipping to your destination port is quoted separately.",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 4,
          maxValue: 8,
          unitCode: "WK",
        },
      },
    },
    seller: {
      "@type": "AutoDealer",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

/** Product (+ Car) schema object without @context — safe to nest in ItemList. */
export function productSchema(v: ProductVehicle | PublicVehicle) {
  const name = vehicleName(v);
  const url = `${SITE.url}${vehicleStockPath(v.slug)}`;
  const images = v.images.map(absUrl);
  const bodyType = schemaBodyType(v.bodyType);
  const fuelType = schemaFuelType(v.fuelType);
  const transmission = schemaTransmission(v.transmission);
  const configuration = vehicleConfiguration(v);
  const drivetrain = v.drivetrain ? DRIVETRAIN_SCHEMA[v.drivetrain] : undefined;

  return compactJsonLd({
    "@type": ["Product", "Car"] as const,
    "@id": `${url}#product`,
    name,
    description: v.description,
    image: images.length > 0 ? images : [`${SITE.url}/placeholder.svg`],
    url,
    sku: v.id,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.year),
    ...(v.vin ? { vehicleIdentificationNumber: v.vin } : {}),
    ...(bodyType ? { bodyType } : {}),
    ...(configuration ? { vehicleConfiguration: configuration } : {}),
    ...(v.exteriorColor ? { color: v.exteriorColor } : {}),
    ...(fuelType ? { fuelType } : {}),
    ...(transmission ? { vehicleTransmission: transmission } : {}),
    ...(drivetrain ? { driveWheelConfiguration: drivetrain } : {}),
    ...(v.engineCc
      ? {
          vehicleEngine: {
            "@type": "EngineSpecification",
            engineDisplacement: {
              "@type": "QuantitativeValue",
              value: v.engineCc,
              unitCode: "CMQ",
            },
          },
        }
      : {}),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: v.mileage,
      unitCode: "KMT",
    },
    itemCondition: "https://schema.org/UsedCondition",
    offers: vehicleOffers(v, url),
  });
}

export function organizationJsonLd() {
  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: siteLogoImageObject(),
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.linkedin],
  });
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/stock?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: stripHtml(f.a) },
    })),
  };
}

/** Product schema for a single vehicle detail page. */
export function productJsonLd(v: ProductVehicle | PublicVehicle) {
  return compactJsonLd({
    "@context": "https://schema.org",
    ...productSchema(v),
  });
}

/** @deprecated Prefer productJsonLd — kept as alias. */
export function vehicleJsonLd(v: ProductVehicle | PublicVehicle, _absImage?: (src: string) => string) {
  return productJsonLd(v);
}

/** ItemList of Product schemas for stock / featured grids (excludes sold listings). */
export function productListJsonLd(vehicles: Array<ProductVehicle | PublicVehicle>) {
  const listed = vehicles.filter((v) => v.status !== "SOLD");
  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: listed.length,
    itemListElement: listed.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(v),
    })),
  });
}

/** @deprecated Prefer productListJsonLd. */
export function itemListJsonLd(
  vehicles: Array<ProductVehicle | PublicVehicle>,
  _slugToUrl?: (slug: string) => string,
) {
  return productListJsonLd(vehicles);
}

export function blogArticleJsonLd(post: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
  metaTitle?: string | null;
  metaDescription?: string | null;
}) {
  const headline = post.metaTitle?.trim() || post.title;
  const description = post.metaDescription?.trim() || post.excerpt;
  const url = `${SITE.url}/blog/${post.slug}`;

  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      url: SITE.url,
      logo: siteLogoImageObject(),
    },
    image: post.coverImage ? absUrl(post.coverImage) : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  });
}

export function blogListingJsonLd(
  posts: Array<{ title: string; slug: string; excerpt: string; publishedAt?: Date | null }>,
) {
  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.name} Blog`,
    url: `${SITE.url}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      description: p.excerpt,
      datePublished: p.publishedAt?.toISOString(),
    })),
  });
}
