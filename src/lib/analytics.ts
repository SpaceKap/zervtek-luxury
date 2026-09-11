/**
 * Lean dataLayer events for GTM / GA4.
 *
 * Only business-meaningful events live here. GTM's auto "Link Click",
 * "History" and "gtm.formInteract" events are noise — build GA4 tags off
 * these named events instead.
 */

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushEvent(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/** Minimal vehicle shape needed for ecommerce-style events. */
export type AnalyticsVehicle = {
  id: string;
  make: string;
  model: string;
  variant?: string | null;
  year: number;
  price: number | null;
  bodyType?: string | null;
  slug: string;
};

export function vehicleItem(v: AnalyticsVehicle) {
  return {
    item_id: v.id,
    item_name: `${v.year} ${v.make} ${v.model}${v.variant ? ` ${v.variant}` : ""}`,
    item_brand: v.make,
    item_category: v.bodyType || undefined,
    item_variant: v.variant || undefined,
    ...(v.price != null ? { price: v.price } : {}),
    currency: "JPY",
    quantity: 1,
  };
}

/** Vehicle detail page viewed. */
export function trackViewItem(v: AnalyticsVehicle) {
  pushEvent({
    event: "view_item",
    ecommerce: {
      currency: "JPY",
      ...(v.price != null ? { value: v.price } : {}),
      items: [vehicleItem(v)],
    },
  });
}

/** Vehicle card clicked from a grid. */
export function trackSelectItem(v: AnalyticsVehicle, listName: string) {
  pushEvent({
    event: "select_item",
    item_list_name: listName,
    ecommerce: { currency: "JPY", items: [vehicleItem(v)] },
  });
}

/** Inquiry submitted AND accepted by the API. */
export function trackGenerateLead(params: {
  formLocation: string;
  leadType?: "general_inquiry" | "vehicle_inquiry";
  vehicleId?: string;
  vehicleName?: string;
  vehicleMake?: string;
  destinationCountry?: string;
}) {
  const leadType =
    params.leadType ??
    (params.vehicleId ? "vehicle_inquiry" : "general_inquiry");

  pushEvent({
    event: "generate_lead",
    lead_type: leadType,
    form_location: params.formLocation,
    ...(params.vehicleId ? { vehicle_id: params.vehicleId } : {}),
    ...(params.vehicleName ? { vehicle_name: params.vehicleName } : {}),
    ...(params.vehicleMake ? { vehicle_make: params.vehicleMake } : {}),
    ...(params.destinationCountry
      ? { destination_country: params.destinationCountry }
      : {}),
    currency: "JPY",
  });
}

export type ContactMethod = "whatsapp" | "email" | "phone";

/** Outbound contact intent (WhatsApp / email). */
export function trackContact(params: {
  method: ContactMethod;
  location: string;
  vehicleId?: string;
  vehicleName?: string;
}) {
  pushEvent({
    event: `contact_${params.method}`,
    contact_method: params.method,
    location: params.location,
    vehicle_id: params.vehicleId,
    vehicle_name: params.vehicleName,
  });
}

/** Listing shared or link copied. */
export function trackShare(params: {
  method: "web_share" | "copy_link";
  vehicleId?: string;
  vehicleName?: string;
}) {
  pushEvent({
    event: "share",
    method: params.method,
    vehicle_id: params.vehicleId,
    vehicle_name: params.vehicleName,
  });
}

/** Stock / featured grid impressions (bounded list, not full inventory dump). */
export function trackViewItemList(params: {
  listName: string;
  vehicles: AnalyticsVehicle[];
}) {
  const items = params.vehicles.slice(0, 12).map(vehicleItem);
  if (items.length === 0) return;
  pushEvent({
    event: "view_item_list",
    item_list_name: params.listName,
    ecommerce: { currency: "JPY", items },
  });
}

/** Stock search / filter applied. */
export function trackStockFilter(filters: Record<string, string | undefined>) {
  const active = Object.fromEntries(
    Object.entries(filters).filter(([, val]) => val),
  );
  if (Object.keys(active).length === 0) return;
  pushEvent({ event: "filter_stock", ...active });
}
