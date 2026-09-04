import { NextRequest, NextResponse } from "next/server";
import { searchVehicles, type VehicleFilters } from "@/lib/vehicles";
import { STOCK_PAGE_SIZE } from "@/lib/stock";

export const dynamic = "force-dynamic";

function first(v: string | null): string | undefined {
  return v?.trim() || undefined;
}

function filtersFromSearchParams(sp: URLSearchParams): VehicleFilters {
  return {
    q: first(sp.get("q")),
    make: first(sp.get("make")),
    model: first(sp.get("model")),
    bodyType: first(sp.get("bodyType")),
    transmission: first(sp.get("transmission")),
    minYear: first(sp.get("minYear")) ? Number(first(sp.get("minYear"))) : undefined,
    maxYear: first(sp.get("maxYear")) ? Number(first(sp.get("maxYear"))) : undefined,
    minMileage: first(sp.get("minMileage")) ? Number(first(sp.get("minMileage"))) : undefined,
    maxMileage: first(sp.get("maxMileage")) ? Number(first(sp.get("maxMileage"))) : undefined,
    steering: first(sp.get("steering")),
    minPrice: first(sp.get("minPrice")) ? Number(first(sp.get("minPrice"))) : undefined,
    maxPrice: first(sp.get("maxPrice")) ? Number(first(sp.get("maxPrice"))) : undefined,
    sort: (first(sp.get("sort")) as VehicleFilters["sort"]) ?? "newest",
  };
}

/** Public stock search — used by infinite scroll on /stock. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    48,
    Math.max(1, parseInt(sp.get("pageSize") ?? String(STOCK_PAGE_SIZE), 10) || STOCK_PAGE_SIZE),
  );

  const { items, total } = await searchVehicles(filtersFromSearchParams(sp), page, pageSize);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  });
}
