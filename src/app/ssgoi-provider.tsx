"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";

const config = {
  transitions: [fade({ paths: ["/", "/about", "/stock", "/stock/*", "/shipping"] })],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return (
    <Ssgoi config={config}>
      <SsgoiTransitionBoundary className="route-fill">{children}</SsgoiTransitionBoundary>
    </Ssgoi>
  );
}
