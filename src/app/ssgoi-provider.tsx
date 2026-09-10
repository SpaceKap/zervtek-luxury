import { type ReactNode } from "react";
import { ScrollToTop } from "@/components/ScrollToTop";

/** Route shell without view-transition remounts (Ssgoi caused scroll jank). */
export function SsgoiProvider({ children }: { children: ReactNode }) {
  return (
    <div className="route-fill">
      <ScrollToTop />
      {children}
    </div>
  );
}
