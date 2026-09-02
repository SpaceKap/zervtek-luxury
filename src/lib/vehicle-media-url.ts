/** Grid cards — use pre-generated thumbs instead of 1200px medium assets. */
export function vehicleGridImageUrl(url: string): string {
  if (url.includes("/medium/")) {
    return url.replace("/medium/", "/thumbnail/");
  }
  return url;
}
