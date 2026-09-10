import { NextRequest, NextResponse } from "next/server";
import { hermesGuard } from "@/lib/hermes-auth";
import { retryPendingInquiryNotifications } from "@/lib/inquiry-delivery";

export const dynamic = "force-dynamic";

/**
 * Scheduled enquiry notification drain.
 * Cron (every 1–5 min):
 *   curl -X POST -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
 *     https://performance.zervtek.com/api/internal/inquiries/notify-retry
 */
export async function POST(req: NextRequest) {
  const denied = hermesGuard(req);
  if (denied) return denied;

  const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const limit = Number.isFinite(limitRaw) ? Math.min(50, Math.max(1, limitRaw)) : 20;

  try {
    const delivered = await retryPendingInquiryNotifications(limit);
    return NextResponse.json({ ok: true, delivered, limit });
  } catch (err) {
    console.error("[inquiries/notify-retry]", err);
    return NextResponse.json({ ok: false, error: "Retry drain failed" }, { status: 500 });
  }
}
