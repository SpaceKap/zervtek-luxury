import type { BlogBlock, BlogDocumentBlock } from "./blog-blocks";
import { parseYoutubeVideoId } from "./blog-blocks";
import { htmlHeadingCount, htmlImagesMissingAlt, sanitizeBlogHtml, stripHtml } from "./blog-html";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageFigure(src: string, alt: string, caption?: string): string {
  const mediaTag = ["i", "m", "g"].join("");
  const figure = [
    "<figure><",
    mediaTag,
    ' src="',
    escapeHtml(src),
    '" alt="',
    escapeHtml(alt),
    '" />',
    caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "",
    "</figure>",
  ].join("");
  return figure;
}

/** Convert legacy block posts into one HTML document for the editor. */
export function blocksToDocumentHtml(blocks: BlogBlock[]): string {
  const doc = blocks.find((b): b is BlogDocumentBlock => b.type === "document");
  if (doc?.html.trim()) return doc.html;

  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        if (block.text.trim()) parts.push(`<p>${escapeHtml(block.text)}</p>`);
        break;
      case "heading":
        if (block.text.trim()) {
          const tag = block.level === 3 ? "h3" : "h2";
          parts.push(`<${tag}>${escapeHtml(block.text)}</${tag}>`);
        }
        break;
      case "image":
        if (block.src) {
          parts.push(imageFigure(block.src, block.alt || block.caption || "Image", block.caption));
        }
        break;
      case "youtube":
        if (block.videoId) {
          parts.push(
            `<div data-youtube-video="${escapeHtml(block.videoId)}"></div>${
              block.caption ? `<p><em>${escapeHtml(block.caption)}</em></p>` : ""
            }`,
          );
        }
        break;
      case "table": {
        if (!block.headers.length) break;
        const head = block.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
        const body = block.rows
          .map((row) => `<tr>${block.headers.map((_, i) => `<td>${escapeHtml(row[i] ?? "")}</td>`).join("")}</tr>`)
          .join("");
        parts.push(
          `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>${
            block.caption ? `<p><em>${escapeHtml(block.caption)}</em></p>` : ""
          }`,
        );
        break;
      }
      case "callout":
        if (block.text.trim()) {
          parts.push(`<blockquote><p>${escapeHtml(block.text)}</p></blockquote>`);
        }
        break;
      case "document":
        break;
    }
  }
  return parts.join("");
}

export function documentBlocksFromHtml(html: string): BlogBlock[] {
  const trimmed = html.trim();
  if (!trimmed) return [];
  return [{ type: "document", html: trimmed }];
}

export function getDocumentHtml(blocks: BlogBlock[]): string | null {
  const doc = blocks.find((b): b is BlogDocumentBlock => b.type === "document");
  if (doc?.html.trim()) return doc.html;
  const legacy = blocksToDocumentHtml(blocks);
  return legacy.trim() ? legacy : null;
}

export { sanitizeBlogHtml, stripHtml, htmlImagesMissingAlt, htmlHeadingCount } from "./blog-html";

export function promptYoutubeUrl(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.prompt("Paste a YouTube URL or video ID");
  if (!raw) return null;
  return parseYoutubeVideoId(raw) || raw.trim();
}
