import Link from "next/link";
import { buildStockHref } from "@/lib/stock";

type Props = {
  page: number;
  totalPages: number;
  query: Record<string, string | undefined>;
};

/** Compact page list: 1 … 4 5 6 … 20 */
function pageItems(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    set.add(2);
    set.add(3);
    set.add(4);
  }
  if (current >= total - 2) {
    set.add(total - 1);
    set.add(total - 2);
    set.add(total - 3);
  }

  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) out.push("gap");
    out.push(sorted[i]!);
  }
  return out;
}

export function StockPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => buildStockHref({ ...query, page: String(p) });
  const items = pageItems(page, totalPages);

  return (
    <nav className="stock-pagination" aria-label="Stock pagination">
      {page > 1 ? (
        <Link className="btn btn-outline stock-pagination-dir" href={hrefFor(page - 1)} rel="prev">
          Previous
        </Link>
      ) : (
        <span className="stock-pagination-dir stock-pagination-disabled" aria-hidden>
          Previous
        </span>
      )}

      <ol className="stock-pagination-pages">
        {items.map((item, idx) =>
          item === "gap" ? (
            <li key={`gap-${idx}`} className="stock-pagination-gap" aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span className="stock-pagination-page is-current" aria-current="page">
                  {item}
                </span>
              ) : (
                <Link className="stock-pagination-page" href={hrefFor(item)}>
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ol>

      {page < totalPages ? (
        <Link className="btn btn-outline stock-pagination-dir" href={hrefFor(page + 1)} rel="next">
          Next
        </Link>
      ) : (
        <span className="stock-pagination-dir stock-pagination-disabled" aria-hidden>
          Next
        </span>
      )}
    </nav>
  );
}
