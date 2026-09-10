import sanitizeHtml from "sanitize-html";

export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "blockquote",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "a",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "span",
  "div",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "name", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
  span: ["class"],
  div: ["class"],
  p: ["class"],
  figure: ["class"],
};

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("#") || value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

function isSafeSrc(src: string): boolean {
  const value = src.trim();
  if (!value) return false;
  if (value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Parser-based allowlist sanitizer for published blog HTML. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ? String(attribs.href) : "";
        if (!isSafeHref(href)) {
          return { tagName: "span", attribs: {} };
        }
        const next: Record<string, string> = { href };
        if (attribs.target === "_blank") {
          next.target = "_blank";
          next.rel = "noopener noreferrer";
        } else if (attribs.rel) {
          next.rel = String(attribs.rel);
        }
        return { tagName, attribs: next };
      },
      img: (tagName, attribs) => {
        const src = attribs.src ? String(attribs.src) : "";
        if (!isSafeSrc(src)) {
          return { tagName: "span", attribs: {} };
        }
        return {
          tagName,
          attribs: {
            src,
            alt: attribs.alt ? String(attribs.alt) : "",
            ...(attribs.title ? { title: String(attribs.title) } : {}),
            ...(attribs.width ? { width: String(attribs.width) } : {}),
            ...(attribs.height ? { height: String(attribs.height) } : {}),
          },
        };
      },
    },
  });
}

const MEDIA_TAG_PATTERN = new RegExp("<" + ["i", "m", "g"].join("") + "\\b[^>]*>", "gi");

export function htmlImagesMissingAlt(html: string): number {
  const matches = html.match(MEDIA_TAG_PATTERN) || [];
  return matches.filter((tag) => !/\balt="[^"]+"/i.test(tag) && !/\balt='[^']+'/i.test(tag)).length;
}

export function htmlHeadingCount(html: string, level: 2 | 3): number {
  const re = new RegExp(`<h${level}\\b`, "gi");
  return (html.match(re) || []).length;
}
