"use client";

import Link from "next/link";
import { Price } from "@/components/Price";
import { formatKm } from "@/lib/format";
import { vehicleStockPath } from "@/lib/slug";
import { trackSelectItem } from "@/lib/analytics";
import {
  BODY_TYPE_LABELS,
  TRANSMISSION_LABELS,
  displayEnum,
} from "@/lib/vehicle-constants";
import type { PublicVehicle } from "@/lib/vehicle-public";

export function VehicleCard({
  v,
  listName = "stock_grid",
}: {
  v: PublicVehicle;
  listName?: string;
}) {
  const img = v.images[0] || "/placeholder.svg";
  const body = displayEnum(v.bodyType, BODY_TYPE_LABELS);
  const transmission = displayEnum(v.transmission, TRANSMISSION_LABELS);
  return (
    <Link
      href={vehicleStockPath(v.slug)}
      className="vcard"
      onClick={() => trackSelectItem(v, listName)}
    >
      <div className="vcard-media">
        {v.status === "SOLD" && <span className="vcard-badge sold">Sold</span>}
        {v.status === "RESERVED" && (
          <span className="vcard-badge">Reserved</span>
        )}
        {/* Pre-sized /medium/ assets — skip /_next/image optimizer on the grid. */}
        <img
          src={img}
          alt={`${v.year} ${v.make} ${v.model}${v.variant ? " " + v.variant : ""} for sale`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
      <div className="vcard-body">
        <div className="vcard-make">{v.make}</div>
        <div className="vcard-title">
          {v.model}
          {v.variant ? ` ${v.variant}` : ""}
        </div>
        <div className="vcard-meta">
          <span>{formatKm(v.mileage)}</span>
          {body ? <span>{body}</span> : null}
          {transmission ? <span>{transmission}</span> : null}
        </div>
        <div className="vcard-price">
          <Price amount={v.price} />
          <small>Plus shipping</small>
        </div>
      </div>
    </Link>
  );
}
