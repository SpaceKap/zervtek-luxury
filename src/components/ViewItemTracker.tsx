"use client";

import { useEffect } from "react";
import { trackViewItem, type AnalyticsVehicle } from "@/lib/analytics";

/** Fires a single `view_item` dataLayer event for a vehicle detail page. */
export function ViewItemTracker({ vehicle }: { vehicle: AnalyticsVehicle }) {
  useEffect(() => {
    trackViewItem(vehicle);
    // Only re-fire when the vehicle itself changes.
  }, [vehicle.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
