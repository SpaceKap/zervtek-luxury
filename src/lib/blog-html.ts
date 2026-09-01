export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeBlogHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
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
