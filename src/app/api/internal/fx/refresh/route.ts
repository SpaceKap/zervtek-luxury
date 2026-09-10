import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auditHermes, clientIp, hermesGuard, safeHermesError } from "@/lib/hermes-auth";
import { refreshFxRatesFromFrankfurter } from "@/lib/fx";

export const dynamic = "force-dynamic";

/**
 * Pull ECB rates via Frankfurter and store JPY-per-USD / JPY-per-EUR.
 *
 *   curl -X POST -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
 *     https://performance.zervtek.com/api/internal/fx/refresh
 */
export async function POST(req: NextRequest) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);

  try {
    const result = await refreshFxRatesFromFrankfurter();
    revalidateTag("fx-rates", "max");

    await auditHermes({
      action: "fx.refresh",
      ip,
      detail: `USD=${result.USD.toFixed(2)} EUR=${result.EUR.toFixed(2)} asOf=${result.asOfDate}`,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    await auditHermes({
      action: "fx.refresh_error",
      ip,
      detail: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json(safeHermesError(err, "FX_REFRESH_FAILED"), { status: 502 });
  }
}
