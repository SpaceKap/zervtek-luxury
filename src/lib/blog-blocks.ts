import { stripHtml } from "./blog-html";

export type BlogParagraphBlock = { type: "paragraph"; text: string };
export type BlogHeadingBlock = { type: "heading"; level: 2 | 3; text: string };
export type BlogImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
};
export type BlogYoutubeBlock = {
  type: "youtube";
  videoId: string;
  title?: string;
  caption?: string;
};
export type BlogTableBlock = {
  type: "table";
  caption?: string;
  headers: string[];
  rows: string[][];
};
export type BlogCalloutBlock = { type: "callout"; text: string };
export type BlogDocumentBlock = { type: "document"; html: string };

export type BlogBlock =
  | BlogParagraphBlock
  | BlogHeadingBlock
  | BlogImageBlock
  | BlogYoutubeBlock
  | BlogTableBlock
  | BlogCalloutBlock
  | BlogDocumentBlock;

export type BlogBlockType = BlogBlock["type"];

export const BLOG_BLOCK_LABELS: Record<Exclude<BlogBlockType, "document">, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  image: "Image",
  youtube: "YouTube video",
  table: "Table",
  callout: "Callout",
};

export function emptyBlock(type: Exclude<BlogBlockType, "document">): BlogBlock {
  switch (type) {
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "heading":
      return { type: "heading", level: 2, text: "" };
    case "image":
      return { type: "image", src: "", alt: "", caption: "" };
    case "youtube":
      return { type: "youtube", videoId: "", title: "", caption: "" };
    case "table":
      return { type: "table", caption: "", headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "callout":
      return { type: "callout", text: "" };
  }
}

/** Extract YouTube video ID from URL or raw ID. */
export function parseYoutubeVideoId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const embed = url.pathname.match(/\/embed\/([\w-]{11})/);
      if (embed) return embed[1];
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeBlogBlocks(raw: unknown): BlogBlock[] {
  if (!Array.isArray(raw)) return [];
  const out: BlogBlock[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const b = item as Record<string, unknown>;
    switch (b.type) {
      case "paragraph":
        out.push({ type: "paragraph", text: String(b.text || "").trim() });
        break;
      case "heading": {
        const level = Number(b.level) === 3 ? 3 : 2;
        out.push({ type: "heading", level, text: String(b.text || "").trim() });
        break;
      }
      case "image":
        out.push({
          type: "image",
          src: String(b.src || "").trim(),
          alt: String(b.alt || "").trim(),
          caption: b.caption ? String(b.caption).trim() : undefined,
        });
        break;
      case "youtube": {
        const fromUrl = parseYoutubeVideoId(String(b.videoId || b.url || ""));
        out.push({
          type: "youtube",
          videoId: fromUrl || String(b.videoId || "").trim(),
          title: b.title ? String(b.title).trim() : undefined,
          caption: b.caption ? String(b.caption).trim() : undefined,
        });
        break;
      }
      case "table": {
        const headers = Array.isArray(b.headers)
          ? b.headers.map((h) => String(h ?? "").trim()).filter(Boolean)
          : ["Column 1"];
        const rows = Array.isArray(b.rows)
          ? b.rows.map((row) =>
              Array.isArray(row) ? row.map((cell) => String(cell ?? "").trim()) : [],
            )
          : [];
        out.push({
          type: "table",
          caption: b.caption ? String(b.caption).trim() : undefined,
          headers: headers.length ? headers : ["Column 1"],
          rows,
        });
        break;
      }
      case "callout":
        out.push({ type: "callout", text: String(b.text || "").trim() });
        break;
      case "document":
        out.push({ type: "document", html: String(b.html || "") });
        break;
    }
  }
  return out;
}

export function blogPlainText(blocks: BlogBlock[]): string {
  const doc = blocks.find((b): b is BlogDocumentBlock => b.type === "document");
  if (doc?.html.trim()) {
    return stripHtml(doc.html);
  }

  return blocks
    .map((b) => {
      switch (b.type) {
        case "paragraph":
        case "heading":
        case "callout":
          return b.text;
        case "image":
          return [b.alt, b.caption].filter(Boolean).join(" ");
        case "youtube":
          return [b.title, b.caption].filter(Boolean).join(" ");
        case "table":
          return [
            b.caption,
            b.headers.join(" "),
            ...b.rows.map((r) => r.join(" ")),
          ]
            .filter(Boolean)
            .join(" ");
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}
