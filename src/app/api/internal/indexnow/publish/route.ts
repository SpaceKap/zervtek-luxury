import { NextRequest, NextResponse } from "next/server";
import { auditHermes, clientIp, hermesGuard } from "@/lib/hermes-auth";
import {
  getIndexNowKey,
  indexNowKeyLocation,
  submitIndexNowSitemap,
  submitIndexNowUrls,
} from "@/lib/indexnow";

export const dynamic = "force-dynamic";

type Body = { urls?: string[] };

/**
 * Notify Bing/Yandex et al. via IndexNow.
 *
 * Empty body → all sitemap URLs. Optional `{ "urls": ["https://…"] }` for targeted pings.
 *
 *   curl -X POST -H "Authorization: Bearer $HERMES_VEHICLE_API_TOKEN" \
 *     https://performance.zervtek.com/api/internal/indexnow/publish
 */
export async function POST(req: NextRequest) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);

  if (!getIndexNowKey()) {
    return NextResponse.json(
      {
        success: false,
        error: "INDEXNOW_NOT_CONFIGURED",
        hint: "Set INDEXNOW_KEY in .env (openssl rand -hex 16)",
      },
      { status: 503 },
    );
  }

  let body: Body = {};
  try {
    const raw = await req.text();
    if (raw.trim()) body = JSON.parse(raw) as Body;
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  try {
    const result =
      Array.isArray(body.urls) && body.urls.length > 0
        ? await submitIndexNowUrls(body.urls)
        : await submitIndexNowSitemap();

    await auditHermes({
      action: result.ok ? "indexnow.publish.ok" : "indexnow.publish.fail",
      ip,
      detail: `status=${result.status} submitted=${result.submitted} keyLocation=${indexNowKeyLocation()}`,
    });

    return NextResponse.json({
      success: result.ok,
      status: result.status,
      submitted: result.submitted,
      keyLocation: indexNowKeyLocation(),
    });
  } catch (err) {
    await auditHermes({
      action: "indexnow.publish.error",
      ip,
      detail: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "INDEXNOW_SUBMIT_FAILED" },
      { status: 502 },
    );
  }
}
