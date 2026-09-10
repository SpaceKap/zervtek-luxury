import Link from "next/link";
import { buildStockHref } from "@/lib/stock";

type Props = {
  page: number;
  totalPages: number;
  query: Record<string, string | undefined>;
};

export function StockPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => buildStockHref({ ...query, page: String(p) });

  return (
    <nav className="stock-pagination" aria-label="Stock pagination">
      {page > 1 ? (
        <Link className="btn btn-outline" href={hrefFor(page - 1)} rel="prev">
          Previous
        </Link>
      ) : (
        <span className="stock-pagination-spacer" />
      )}
      <span className="stock-pagination-label">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link className="btn btn-outline" href={hrefFor(page + 1)} rel="next">
          Next
        </Link>
      ) : (
        <span className="stock-pagination-spacer" />
      )}
    </nav>
  );
}
