/**
 * Feature / equipment list parsing.
 * Commas inside thousands (4,000 km) must not become extra pills.
 */

const THOUSANDS_TAIL = /^(\d{3})(\s*(km|mi|miles|cc|kg))?$/i;
const NUMBER_HEAD = /^\d{1,3}(,\d{3})*$/;

/** Merge "4" + "000 km" (and 30 + 024 + 000) back into one token. */
export function repairSplitThousands(parts: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    let cur = parts[i].trim();
    if (!cur) continue;
    while (i + 1 < parts.length && NUMBER_HEAD.test(cur)) {
      const tail = parts[i + 1].trim().match(THOUSANDS_TAIL);
      if (!tail) break;
      cur = `${cur},${tail[1]}${tail[2] ?? ""}`;
      i += 1;
    }
    out.push(cur);
  }
  return out;
}

function splitLine(line: string): string[] {
  // Do not split 4,000 / 1,234,567 — comma + exactly three digits.
  return line.split(/,(?!\d{3}(?:\D|$))/);
}

export function parseFeatureList(value: unknown): string[] {
  let raw: string[] = [];
  if (Array.isArray(value)) {
    raw = value.map((x) => String(x).trim()).filter(Boolean);
  } else if (typeof value === "string") {
    raw = value
      .split(/\n+/)
      .flatMap(splitLine)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return repairSplitThousands(raw);
}

export function joinFeatures(parts: string[]): string {
  return parseFeatureList(parts).join(", ");
}
