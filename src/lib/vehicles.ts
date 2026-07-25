import type { Prisma, Vehicle } from "@prisma/client";
import { prisma } from "./prisma";
import { PUBLIC_VEHICLE_STATUSES, isPublicVehicleStatus } from "./vehicle-constants";
import { toPublicVehicle, type PublicVehicle } from "./vehicle-public";

export type { Vehicle, PublicVehicle };

export type VehicleFilters = {
  q?: string;
  make?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
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

  if (f.q) {
    and.push({
      OR: [
        { make: { contains: f.q, mode: "insensitive" } },
        { model: { contains: f.q, mode: "insensitive" } },
        { variant: { contains: f.q, mode: "insensitive" } },
        { description: { contains: f.q, mode: "insensitive" } },
      ],
    });
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

export async function getFeaturedVehicles(limit = 4): Promise<PublicVehicle[]> {
  try {
    const featured = await prisma.vehicle.findMany({
      where: { featured: true, status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    if (featured.length > 0) return featured.map(toPublicVehicle);
    const latest = await prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return latest.map(toPublicVehicle);
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

export type CatalogMake = {
  make: string;
  models: string[];
};

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

    return Array.from(map.entries())
      .map(([make, models]) => ({
        make,
        models: Array.from(models).sort((a, b) => a.localeCompare(b)),
      }))
      .sort((a, b) => a.make.localeCompare(b.make));
  } catch {
    return [];
  }
}
