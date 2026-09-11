"use client";

import Link from "next/link";
import { Price } from "@/components/Price";
import { formatKm } from "@/lib/format";
import { vehicleStockPath } from "@/lib/slug";
import { trackSelectItem } from "@/lib/analytics";
import { vehicleGridImageUrl } from "@/lib/vehicle-media-url";
import {
  BODY_TYPE_LABELS,
  TRANSMISSION_LABELS,
  displayEnum,
} from "@/lib/vehicle-constants";
import type { PublicVehicleCard } from "@/lib/vehicle-public";

export function VehicleCard({
  v,
  listName = "stock_grid",
}: {
  v: PublicVehicleCard;
  listName?: string;
}) {
  const img = vehicleGridImageUrl(v.images[0] || "/placeholder.svg");
  const body = displayEnum(v.bodyType, BODY_TYPE_LABELS);
  const transmission = displayEnum(v.transmission, TRANSMISSION_LABELS);
  const hasPrice = v.price != null;

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
        {v.steering === "LHD" || v.steering === "RHD" ? (
          <span
            className={`vcard-steer ${v.steering === "LHD" ? "lhd" : "rhd"}`}
          >
            {v.steering}
          </span>
        ) : null}
        <img
          src={img}
          alt={`${v.year} ${v.make} ${v.model}${v.variant ? " " + v.variant : ""} for sale`}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
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
          <span>{v.year}</span>
          <span>{formatKm(v.mileage)}</span>
          {body ? <span>{body}</span> : null}
          {transmission ? <span>{transmission}</span> : null}
        </div>
        <div className={`vcard-price${hasPrice ? "" : " vcard-price--inquire"}`}>
          {hasPrice ? (
            <>
              <Price amount={v.price} />
              <small>Plus shipping</small>
            </>
          ) : (
            <span className="vcard-inquire-btn">Inquire</span>
          )}
        </div>
      </div>
    </Link>
  );
}
