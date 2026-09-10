"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleCard } from "@/components/VehicleCard";
import type { PublicVehicleCard } from "@/lib/vehicle-public";
import { STOCK_PAGE_SIZE } from "@/lib/stock";
import { trackViewItemList } from "@/lib/analytics";

type Props = {
  initialItems: PublicVehicleCard[];
  total: number;
  initialPage?: number;
};

export function StockInfiniteGrid({ initialItems, total, initialPage = 1 }: Props) {
  const params = useSearchParams();
  const filterKey = params.toString();

  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialPage * STOCK_PAGE_SIZE < total);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(initialPage);
  const hasMoreRef = useRef(initialPage * STOCK_PAGE_SIZE < total);

  // Reset when SSR payload or filters change (new navigation).
  useEffect(() => {
    setItems(initialItems);
    setPage(initialPage);
    pageRef.current = initialPage;
    const more = initialPage * STOCK_PAGE_SIZE < total;
    setHasMore(more);
    hasMoreRef.current = more;
    setError(null);
    setLoading(false);
    loadingRef.current = false;
    trackViewItemList({ listName: "stock_grid", vehicles: initialItems });
  }, [initialItems, total, filterKey, initialPage]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const nextPage = pageRef.current + 1;
    const qs = new URLSearchParams(params.toString());
    qs.set("page", String(nextPage));
    qs.set("pageSize", String(STOCK_PAGE_SIZE));

    try {
      const res = await fetch(`/api/stock?${qs.toString()}`);
      if (!res.ok) throw new Error(`Load failed (${res.status})`);
      const data = (await res.json()) as {
        items: PublicVehicleCard[];
        total: number;
        hasMore: boolean;
      };

      setItems((prev) => {
        const seen = new Set(prev.map((v) => v.id));
        const appended = data.items.filter((v) => !seen.has(v.id));
        return [...prev, ...appended];
      });
      pageRef.current = nextPage;
      setPage(nextPage);
      hasMoreRef.current = data.hasMore;
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, items.length]);

  if (items.length === 0) return null;

  return (
    <>
      <div className="vehicle-grid stock-grid">
        {items.map((v) => (
          <VehicleCard key={v.id} v={v} />
        ))}
      </div>

      <div className="stock-infinite" aria-live="polite">
        {hasMore ? (
          <>
            <div ref={sentinelRef} className="stock-infinite-sentinel" aria-hidden />
            {loading ? (
              <p className="stock-infinite-status muted">Loading more…</p>
            ) : error ? (
              <div className="stock-infinite-error">
                <p className="muted">{error}</p>
                <button type="button" className="btn btn-outline" onClick={() => void loadMore()}>
                  Try again
                </button>
              </div>
            ) : (
              <p className="stock-infinite-status muted">
                Showing {items.length} of {total}
              </p>
            )}
          </>
        ) : (
          <p className="stock-infinite-status muted">
            Showing all {total} vehicle{total === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </>
  );
}
