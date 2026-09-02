import { type ReactNode } from "react";

/** Route shell without view-transition remounts (Ssgoi caused scroll jank). */
export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <div className="route-fill">{children}</div>;
}
