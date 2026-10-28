/**
 * Minimal Markdown for vehicle descriptions (admin editor + Hermes agent).
 *
 * Supported: `#`–`######` headings, `- ` / `* ` / `• ` bullets, `1. ` numbered lists,
 * `**bold**`, `__bold__`, `##bold##`, `*italic*`, `[text](https://…)`, blank-line paragraphs.
 * Anything else stays literal text, so plain descriptions render unchanged.
 */

export type InlineNode =
  | string
  | { type: "strong"; children: InlineNode[] }
  | { type: "em"; children: InlineNode[] }
  | { type: "link"; href: string; children: InlineNode[] };

export type DescriptionBlock =
  | { type: "heading"; children: InlineNode[] }
  | { type: "paragraph"; lines: InlineNode[][] }
  | { type: "list"; ordered: boolean; items: InlineNode[][] };

const HEADING_RE = /^\s{0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$/;
const BULLET_RE = /^\s*[-*•]\s+(.*)$/;
const ORDERED_RE = /^\s*\d{1,3}[.)]\s+(.*)$/;
const INLINE_RE =
  /(\*\*|__|##)(?=\S)(.+?)(?<=\S)\1|\*(?=[^\s*])([^*]+?)(?<=\S)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;

/** Short label line directly above a list reads as a section title (pre-Markdown descriptions). */
const IMPLIED_HEADING_MAX = 60;

export function parseInline(text: string): InlineNode[] {
  const out: InlineNode[] = [];
  let rest = text;
  while (rest) {
    const m = INLINE_RE.exec(rest);
    if (!m) {
      out.push(rest);
      break;
    }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    if (m[1]) out.push({ type: "strong", children: parseInline(m[2]) });
    else if (m[3]) out.push({ type: "em", children: parseInline(m[3]) });
    else out.push({ type: "link", href: m[5], children: parseInline(m[4]) });
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

export function parseDescription(source: string | null | undefined): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: "paragraph", lines: para.map(parseInline) });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: "list", ordered: list.ordered, items: list.items.map(parseInline) });
    list = null;
  };

  for (const raw of String(source ?? "").replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    const heading = HEADING_RE.exec(line);
    const bullet = BULLET_RE.exec(line);
    const ordered = bullet ? null : ORDERED_RE.exec(line);
    if (heading) {
      flushPara();
      flushList();
      blocks.push({ type: "heading", children: parseInline(heading[1]) });
    } else if (bullet || ordered) {
      flushPara();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      list ??= { ordered: isOrdered, items: [] };
      list.items.push((bullet ?? ordered)![1]);
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();

  return blocks.map((block, i) => {
    const next = blocks[i + 1];
    if (block.type !== "paragraph" || block.lines.length !== 1 || next?.type !== "list") return block;
    const text = inlineToText(block.lines[0]);
    if (text.length > IMPLIED_HEADING_MAX || /[.!?,;]$/.test(text)) return block;
    return { type: "heading", children: block.lines[0] };
  });
}

export function inlineToText(nodes: InlineNode[]): string {
  return nodes.map((n) => (typeof n === "string" ? n : inlineToText(n.children))).join("");
}

/** Markdown-free text for meta descriptions, JSON-LD and other plain-text contexts. */
export function descriptionToPlainText(source: string | null | undefined): string {
  return parseDescription(source)
    .map((b) => {
      if (b.type === "heading") return `${inlineToText(b.children)}:`;
      if (b.type === "paragraph") return b.lines.map(inlineToText).join(" ");
      return b.items.map(inlineToText).join(", ") + ".";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
