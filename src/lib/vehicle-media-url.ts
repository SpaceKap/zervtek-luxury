/** Stock / home grid cards — use 1200px medium assets for Retina sharpness. */
export function vehicleGridImageUrl(url: string): string {
  return url;
}

/** Small UI thumbs (carousel strip, admin lists) — 400px variants. */
export function vehicleThumbImageUrl(url: string): string {
  if (url.includes("/medium/")) {
    return url.replace("/medium/", "/thumbnail/");
  }
  return url;
}
