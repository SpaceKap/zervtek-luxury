import type { Prisma, Vehicle } from "@prisma/client";
import { pickDailyItems } from "./daily-shuffle";
import { prisma } from "./prisma";
import { PUBLIC_VEHICLE_STATUSES, isPublicVehicleStatus } from "./vehicle-constants";
import { toPublicVehicle, type PublicVehicle } from "./vehicle-public";
import { mergeCatalogWithStock, type CatalogMake } from "./vehicle-catalog";

export type { Vehicle, PublicVehicle, CatalogMake };

export type VehicleFilters = {
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
    and.push({ status: { in: [...PUBLIC_VEHICLE_STATUSES] } });
  } else if (f.status) {
    and.push({ status: f.status });
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

function orderBy(sort?: VehicleFilters["sort"]): Prisma.VehicleOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "year_desc":
      return { year: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

/** Public search — never returns DRAFT / NEEDS_REVIEW / UNAVAILABLE / ARCHIVED. */
export async function searchVehicles(
  filters: VehicleFilters,
  page = 1,
  pageSize = 12,
): Promise<{ items: PublicVehicle[]; total: number }> {
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
    return { items: items.map(toPublicVehicle), total };
  } catch {
    return { items: [], total: 0 };
  }
}

/** Homepage featured grid — daily random sample from available CMS stock. */
export async function getFeaturedVehicles(limit = 4): Promise<PublicVehicle[]> {
  try {
    const pool = await prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { id: "asc" },
    });
    return pickDailyItems(pool, limit).map(toPublicVehicle);
  } catch {
    return [];
  }
}

/** Public detail — null when not publicly listable. */
export async function getVehicleBySlug(slug: string): Promise<PublicVehicle | null> {
  try {
    const v = await prisma.vehicle.findUnique({ where: { slug } });
    if (!v || !isPublicVehicleStatus(v.status)) return null;
    return toPublicVehicle(v);
  } catch {
    return null;
  }
}

/** Admin / internal: fetch by slug including non-public. */
export async function getVehicleBySlugAdmin(slug: string): Promise<Vehicle | null> {
  try {
    return await prisma.vehicle.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function getAllVehicleSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  try {
    return await prisma.vehicle.findMany({
      where: { status: { in: [...PUBLIC_VEHICLE_STATUSES] } },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

/** Min/max odometer (km) across publicly listable stock — for filter dropdowns. */
export async function getStockMileageBounds(): Promise<{ min: number; max: number }> {
  try {
    const agg = await prisma.vehicle.aggregate({
      where: { status: { in: [...PUBLIC_VEHICLE_STATUSES] } },
      _min: { mileage: true },
      _max: { mileage: true },
    });
    return {
      min: agg._min.mileage ?? 0,
      max: agg._max.mileage ?? 200_000,
    };
  } catch {
    return { min: 0, max: 200_000 };
  }
}

/** Min/max model year across publicly listable stock — for filter dropdowns. */
export async function getStockYearBounds(): Promise<{ min: number; max: number }> {
  try {
    const agg = await prisma.vehicle.aggregate({
      where: { status: { in: [...PUBLIC_VEHICLE_STATUSES] } },
      _min: { year: true },
      _max: { year: true },
    });
    const now = new Date().getFullYear();
    return {
      min: agg._min.year ?? now - 30,
      max: agg._max.year ?? now,
    };
  } catch {
    const now = new Date().getFullYear();
    return { min: now - 30, max: now };
  }
}

/** Make/model options from vehicles currently in public stock. */
export async function getStockFilterCatalog(): Promise<CatalogMake[]> {
  try {
    const rows = await prisma.vehicle.findMany({
      where: { status: { in: [...PUBLIC_VEHICLE_STATUSES] } },
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

    return Array.from(map.entries())
      .map(([make, models]) => ({
        make,
        country: "Other",
        models: Array.from(models).sort((a, b) => a.localeCompare(b)),
      }))
      .sort((a, b) => a.make.localeCompare(b.make));
  } catch {
    return [];
  }
}

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
