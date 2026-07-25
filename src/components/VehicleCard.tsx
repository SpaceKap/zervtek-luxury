import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/Price";
import { formatKm } from "@/lib/format";
import { vehicleStockPath } from "@/lib/slug";
import {
  BODY_TYPE_LABELS,
  TRANSMISSION_LABELS,
  displayEnum,
} from "@/lib/vehicle-constants";
import type { PublicVehicle } from "@/lib/vehicle-public";

export function VehicleCard({ v }: { v: PublicVehicle }) {
  const img = v.images[0] || "/placeholder.svg";
  const body = displayEnum(v.bodyType, BODY_TYPE_LABELS);
  const transmission = displayEnum(v.transmission, TRANSMISSION_LABELS);
  return (
    <Link href={vehicleStockPath(v.slug)} className="vcard">
      <div className="vcard-media">
        {v.status === "SOLD" && <span className="vcard-badge sold">Sold</span>}
        {v.status === "RESERVED" && <span className="vcard-badge">Reserved</span>}
        <Image
          src={img}
          alt={`${v.year} ${v.make} ${v.model}${v.variant ? " " + v.variant : ""} for sale`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          draggable={false}
          style={{ objectFit: "cover" }}
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
