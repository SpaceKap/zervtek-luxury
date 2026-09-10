"use client";

import { useEffect } from "react";
import type { PublicVehicleCard } from "@/lib/vehicle-public";
import { trackViewItemList } from "@/lib/analytics";

/** Fires view_item_list once per SSR page payload. */
export function StockViewItemListTracker({
  vehicles,
  listName = "stock_grid",
}: {
  vehicles: PublicVehicleCard[];
  listName?: string;
}) {
  useEffect(() => {
    trackViewItemList({ listName, vehicles });
  }, [listName, vehicles]);

  return null;
}
