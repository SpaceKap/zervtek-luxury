/** YYYY-MM-DD in Japan — homepage featured rotation resets at JST midnight. */
export function getDailySeedKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable pseudo-random score for one item on a given day. */
export function dailySortKey(id: string, seed: string): number {
  return hashString(`${seed}:${id}`);
}

/** Pick up to `limit` items; same order all day, changes daily. */
export function pickDailyItems<T extends { id: string }>(
  items: T[],
  limit: number,
  seed = getDailySeedKey(),
): T[] {
  if (items.length <= limit) return items;
  return [...items]
    .sort((a, b) => dailySortKey(a.id, seed) - dailySortKey(b.id, seed))
    .slice(0, limit);
}
