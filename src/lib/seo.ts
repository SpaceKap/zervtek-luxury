import type { Vehicle } from "@prisma/client";
import type { PublicVehicle } from "./vehicle-public";
import { formatJPY, formatKm } from "./format";
import { SITE } from "./site";
import { vehicleStockPath } from "./slug";

function absUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.url}${src}`;
}

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

/** Meta title from vehicle title. */
export function buildVehicleMetaTitle(v: VehicleSeoInput): string {
  const title = vehicleListingTitle(v);
  if (!title) return `${SITE.name} | Luxury Cars from Japan`;
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
  return `${bits.join(" — ")}. Inspected and exported worldwide by ${SITE.name}.`;
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

/** Product (+ Car) schema object without @context — safe to nest in ItemList. */
export function productSchema(v: ProductVehicle | PublicVehicle) {
  const name = vehicleName(v);
  const url = `${SITE.url}${vehicleStockPath(v.slug)}`;
  const images = v.images.map(absUrl);

  return {
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
    ...(v.bodyType ? { bodyType: v.bodyType } : {}),
    ...(v.exteriorColor ? { color: v.exteriorColor } : {}),
    ...(v.fuelType ? { fuelType: v.fuelType } : {}),
    ...(v.transmission ? { vehicleTransmission: v.transmission } : {}),
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
    offers: {
      "@type": "Offer",
      url,
      price: String(v.price),
      priceCurrency: "JPY",
      availability: offerAvailability(v.status),
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "AutoDealer",
        name: SITE.name,
        url: SITE.url,
      },
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
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
    sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.linkedin],
  };
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
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Product schema for a single vehicle detail page. */
export function productJsonLd(v: ProductVehicle | PublicVehicle) {
  return {
    "@context": "https://schema.org",
    ...productSchema(v),
  };
}

/** @deprecated Prefer productJsonLd — kept as alias. */
export function vehicleJsonLd(v: ProductVehicle | PublicVehicle, _absImage?: (src: string) => string) {
  return productJsonLd(v);
}

/** ItemList of Product schemas for stock / featured grids. */
export function productListJsonLd(vehicles: Array<ProductVehicle | PublicVehicle>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(v),
    })),
  };
}

/** @deprecated Prefer productListJsonLd. */
export function itemListJsonLd(
  vehicles: Array<ProductVehicle | PublicVehicle>,
  _slugToUrl?: (slug: string) => string,
) {
  return productListJsonLd(vehicles);
}
