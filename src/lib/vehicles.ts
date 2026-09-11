import type { Prisma, Vehicle } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { pickDailyItems } from "./daily-shuffle";
import { prisma } from "./prisma";
import { PUBLIC_VEHICLE_STATUSES, ACTIVE_LISTING_STATUSES, isPublicVehicleStatus } from "./vehicle-constants";
import {
  toPublicVehicle,
  toPublicVehicleCard,
  type PublicVehicle,
  type PublicVehicleCard,
} from "./vehicle-public";
import { mergeCatalogWithStock, type CatalogMake } from "./vehicle-catalog";

export type { Vehicle, PublicVehicle, PublicVehicleCard, CatalogMake };

/** Thrown when Prisma/DB fails — callers must not treat as empty inventory / missing listing. */
export class DatabaseUnavailableError extends Error {
  constructor(operation: string, cause?: unknown) {
    super(`Database unavailable during ${operation}`);
    this.name = "DatabaseUnavailableError";
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

function rethrowDb(operation: string, err: unknown): never {
  console.error(`[${operation}]`, err);
  throw new DatabaseUnavailableError(operation, err);
}

export type VehicleFilters = {
  q?: string;
  make?: string;
  model?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  steering?: string;
  transmission?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "year_desc";
  status?: string;
};

function buildWhere(f: VehicleFilters, publicOnly: boolean): Prisma.VehicleWhereInput {
  const and: Prisma.VehicleWhereInput[] = [];

  if (publicOnly) {
    and.push({ status: { in: [...ACTIVE_LISTING_STATUSES] } });
  } else if (f.status) {
    and.push({ status: f.status });
  }

  if (f.q?.trim()) {
    const q = f.q.trim();
    and.push({
      OR: [
        { make: { contains: q, mode: "insensitive" } },
        { model: { contains: q, mode: "insensitive" } },
        { variant: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  if (f.make) and.push({ make: { equals: f.make, mode: "insensitive" } });

  if (f.model) and.push({ model: { equals: f.model, mode: "insensitive" } });

  if (f.bodyType) {
    and.push({
      OR: [
        { bodyType: { equals: f.bodyType, mode: "insensitive" } },
        { bodyType: { equals: f.bodyType.toUpperCase() } },
      ],
    });
  }

  if (f.transmission) {
    and.push({ transmission: { equals: f.transmission, mode: "insensitive" } });
  }

  if (f.minPrice || f.maxPrice) {
    const price: Prisma.IntFilter = {};
    if (f.minPrice) price.gte = f.minPrice;
    if (f.maxPrice) price.lte = f.maxPrice;
    and.push({ price });
  }

  if (f.minYear || f.maxYear) {
    const year: Prisma.IntFilter = {};
    if (f.minYear) year.gte = f.minYear;
    if (f.maxYear) year.lte = f.maxYear;
    and.push({ year });
  }

  if (f.minMileage != null || f.maxMileage != null) {
    const mileage: Prisma.IntFilter = {};
    if (f.minMileage != null) mileage.gte = f.minMileage;
    if (f.maxMileage != null) mileage.lte = f.maxMileage;
    and.push({ mileage });
  }

  if (f.steering) {
    and.push({ steering: { equals: f.steering, mode: "insensitive" } });
  }

  return and.length ? { AND: and } : {};
}

function orderBy(sort?: VehicleFilters["sort"]): Prisma.VehicleOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ price: { sort: "asc", nulls: "last" } }, { id: "asc" }];
    case "price_desc":
      return [{ price: { sort: "desc", nulls: "last" } }, { id: "asc" }];
    case "year_desc":
      return [{ year: "desc" }, { id: "asc" }];
    default:
      return [{ createdAt: "desc" }, { id: "asc" }];
  }
}

/** Public search — active listings only (AVAILABLE + RESERVED). Sold stays on detail URLs. */
export async function searchVehicles(
  filters: VehicleFilters,
  page = 1,
  pageSize = 12,
): Promise<{ items: PublicVehicleCard[]; total: number }> {
  try {
    const where = buildWhere(filters, true);
    const [items, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy: orderBy(filters.sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.vehicle.count({ where }),
    ]);
    return { items: items.map(toPublicVehicleCard), total };
  } catch (err) {
    rethrowDb("searchVehicles", err);
  }
}

/** Homepage featured grid — daily sample without loading every available row. */
export async function getFeaturedVehicles(limit = 4): Promise<PublicVehicleCard[]> {
  return getFeaturedVehiclesCached(limit);
}

const getFeaturedVehiclesCached = unstable_cache(
  async (limit: number) => {
    try {
      const ids = await prisma.vehicle.findMany({
        where: { status: "AVAILABLE" },
        select: { id: true },
        orderBy: { id: "asc" },
      });
      const picked = pickDailyItems(ids, limit);
      if (picked.length === 0) return [];
      const rows = await prisma.vehicle.findMany({
        where: { id: { in: picked.map((p) => p.id) } },
      });
      const byId = new Map(rows.map((r) => [r.id, r]));
      return picked
        .map((p) => byId.get(p.id))
        .filter((v): v is Vehicle => Boolean(v))
        .map(toPublicVehicleCard);
    } catch {
      return [];
    }
  },
  ["featured-vehicles"],
  { revalidate: 60 },
);

/** Public detail — null when not publicly listable. */
export async function getVehicleBySlug(slug: string): Promise<PublicVehicle | null> {
  try {
    const v = await prisma.vehicle.findUnique({ where: { slug } });
    if (!v || !isPublicVehicleStatus(v.status)) return null;
    return toPublicVehicle(v);
  } catch (err) {
    rethrowDb("getVehicleBySlug", err);
  }
}

/** Admin / internal: fetch by slug including non-public. */
export async function getVehicleBySlugAdmin(slug: string): Promise<Vehicle | null> {
  try {
    return await prisma.vehicle.findUnique({ where: { slug } });
  } catch (err) {
    rethrowDb("getVehicleBySlugAdmin", err);
  }
}

export async function getAllVehicleSlugs(): Promise<
  { slug: string; updatedAt: Date; images: string[] }[]
> {
  try {
    return await prisma.vehicle.findMany({
      where: { status: { in: [...PUBLIC_VEHICLE_STATUSES] } },
      select: { slug: true, updatedAt: true, images: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    rethrowDb("getAllVehicleSlugs", err);
  }
}

/** Min/max odometer (km) across publicly listable stock — for filter dropdowns. */
export async function getStockMileageBounds(): Promise<{ min: number; max: number }> {
  const meta = await getStockFilterMeta();
  return meta.mileageBounds;
}

/** Min/max model year across publicly listable stock — for filter dropdowns. */
export async function getStockYearBounds(): Promise<{ min: number; max: number }> {
  const meta = await getStockFilterMeta();
  return meta.yearBounds;
}

/** Make/model options from vehicles currently in public stock. */
export async function getStockFilterCatalog(): Promise<CatalogMake[]> {
  const meta = await getStockFilterMeta();
  return meta.catalog;
}

export type StockFilterMeta = {
  catalog: CatalogMake[];
  yearBounds: { min: number; max: number };
  mileageBounds: { min: number; max: number };
};

/** Cached catalog + year/mileage bounds for the stock filter UI. */
export const getStockFilterMeta = unstable_cache(
  async (): Promise<StockFilterMeta> => {
    try {
      const [rows, agg] = await Promise.all([
        prisma.vehicle.findMany({
          where: { status: { in: [...ACTIVE_LISTING_STATUSES] } },
          select: { make: true, model: true },
          orderBy: [{ make: "asc" }, { model: "asc" }],
        }),
        prisma.vehicle.aggregate({
          where: { status: { in: [...ACTIVE_LISTING_STATUSES] } },
          _min: { mileage: true, year: true },
          _max: { mileage: true, year: true },
        }),
      ]);

      const map = new Map<string, Set<string>>();
      for (const row of rows) {
        const make = row.make.trim();
        const model = row.model.trim();
        if (!make || !model) continue;
        if (!map.has(make)) map.set(make, new Set());
        map.get(make)!.add(model);
      }

      const catalog = Array.from(map.entries())
        .map(([make, models]) => ({
          make,
          country: "Other",
          models: Array.from(models).sort((a, b) => a.localeCompare(b)),
        }))
        .sort((a, b) => a.make.localeCompare(b.make));

      const now = new Date().getFullYear();
      return {
        catalog,
        yearBounds: {
          min: agg._min.year ?? now - 30,
          max: agg._max.year ?? now,
        },
        mileageBounds: {
          min: agg._min.mileage ?? 0,
          max: agg._max.mileage ?? 200_000,
        },
      };
    } catch (err) {
      rethrowDb("getStockFilterMeta", err);
    }
  },
  ["stock-filter-meta"],
  { revalidate: 300 },
);

export async function getCatalogMakeModels(): Promise<CatalogMake[]> {
  try {
    const rows = await prisma.vehicle.findMany({
      where: { status: { in: ["AVAILABLE", "RESERVED"] } },
      select: { make: true, model: true },
      orderBy: [{ make: "asc" }, { model: "asc" }],
    });

    const map = new Map<string, Set<string>>();
    for (const row of rows) {
      const make = row.make.trim();
      const model = row.model.trim();
      if (!make || !model) continue;
      if (!map.has(make)) map.set(make, new Set());
      map.get(make)!.add(model);
    }

    const stock = Array.from(map.entries()).map(([make, models]) => ({
      make,
      country: "Other",
      models: Array.from(models),
    }));

    return mergeCatalogWithStock(stock);
  } catch {
    return mergeCatalogWithStock([]);
  }
}

/** Related active stock — same model first, then same make. */
export async function getRelatedVehicles(
  v: Pick<Vehicle | PublicVehicle, "id" | "make" | "model">,
  limit = 4,
): Promise<PublicVehicleCard[]> {
  try {
    const sameModel = await prisma.vehicle.findMany({
      where: {
        status: { in: [...ACTIVE_LISTING_STATUSES] },
        id: { not: v.id },
        make: { equals: v.make, mode: "insensitive" },
        model: { equals: v.model, mode: "insensitive" },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: limit,
    });
    if (sameModel.length >= limit) {
      return sameModel.map(toPublicVehicleCard);
    }

    const remaining = limit - sameModel.length;
    const sameMake = await prisma.vehicle.findMany({
      where: {
        status: { in: [...ACTIVE_LISTING_STATUSES] },
        id: { notIn: [v.id, ...sameModel.map((row) => row.id)] },
        make: { equals: v.make, mode: "insensitive" },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: remaining,
    });
    return [...sameModel, ...sameMake].map(toPublicVehicleCard);
  } catch {
    return [];
  }
}

export async function findSlugRedirect(fromSlug: string): Promise<string | null> {
  try {
    const row = await prisma.vehicleSlugRedirect.findUnique({ where: { fromSlug } });
    return row?.toSlug ?? null;
  } catch (err) {
    rethrowDb("findSlugRedirect", err);
  }
}

/** Record old→new slug when a public URL changes. */
export async function recordSlugRedirect(fromSlug: string, toSlug: string): Promise<void> {
  if (!fromSlug || !toSlug || fromSlug === toSlug) return;
  try {
    await prisma.vehicleSlugRedirect.upsert({
      where: { fromSlug },
      create: { fromSlug, toSlug },
      update: { toSlug },
    });
  } catch (err) {
    console.error("[recordSlugRedirect]", err);
  }
}
