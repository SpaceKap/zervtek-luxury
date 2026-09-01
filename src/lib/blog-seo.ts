import type { BlogBlock } from "./blog-blocks";
import { blogPlainText } from "./blog-blocks";
import { htmlHeadingCount, htmlImagesMissingAlt } from "./blog-html";
import { slugify } from "./slug";
import { SITE } from "./site";

export type BlogSeoInput = {
  title: string;
  excerpt: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  blocks: BlogBlock[];
  coverImage?: string | null;
};

export type SeoSuggestion = {
  id: string;
  level: "good" | "warn" | "error";
  title: string;
  detail: string;
};

export function buildBlogMetaTitle(input: Pick<BlogSeoInput, "title">): string {
  const title = input.title.trim();
  if (!title) return `${SITE.name} Blog`;
  return `${title} | ${SITE.name}`;
}

export function buildBlogMetaDescription(
  input: Pick<BlogSeoInput, "title" | "excerpt" | "blocks">,
): string {
  const excerpt = input.excerpt.trim().replace(/\s+/g, " ");
  if (excerpt) {
    if (excerpt.length <= 160) return excerpt;
    return `${excerpt.slice(0, 157).replace(/\s+\S*$/, "")}…`;
  }
  const fromBody = blogPlainText(input.blocks).replace(/\s+/g, " ").trim();
  if (fromBody) {
    if (fromBody.length <= 160) return fromBody;
    return `${fromBody.slice(0, 157).replace(/\s+\S*$/, "")}…`;
  }
  return `${input.title.trim()} — insights on importing performance cars from Japan by ${SITE.name}.`;
}

export function resolveBlogMetaTitle(input: BlogSeoInput): string {
  const custom = String(input.metaTitle ?? "").trim();
  return custom || buildBlogMetaTitle(input);
}

export function resolveBlogMetaDescription(input: BlogSeoInput): string {
  const custom = String(input.metaDescription ?? "").trim();
  return custom || buildBlogMetaDescription(input);
}

export function blogSeoSuggestions(input: BlogSeoInput): SeoSuggestion[] {
  const suggestions: SeoSuggestion[] = [];
  const metaTitle = resolveBlogMetaTitle(input);
  const metaDescription = resolveBlogMetaDescription(input);
  const wordCount = blogPlainText(input.blocks).split(/\s+/).filter(Boolean).length;
  const slug = input.slug.trim();

  if (!input.title.trim()) {
    suggestions.push({
      id: "title-missing",
      level: "error",
      title: "Add a title",
      detail: "Every post needs a clear H1 title for search and social previews.",
    });
  } else if (input.title.trim().length < 30) {
    suggestions.push({
      id: "title-short",
      level: "warn",
      title: "Title may be too short",
      detail: "Aim for a descriptive title (roughly 40–70 characters) with the main keyword.",
    });
  } else {
    suggestions.push({
      id: "title-ok",
      level: "good",
      title: "Title length looks good",
      detail: `${input.title.trim().length} characters.`,
    });
  }

  if (metaTitle.length > 60) {
    suggestions.push({
      id: "meta-title-long",
      level: "warn",
      title: "Meta title is long",
      detail: `${metaTitle.length} chars — Google often truncates around 60.`,
    });
  } else if (metaTitle.length >= 30) {
    suggestions.push({
      id: "meta-title-ok",
      level: "good",
      title: "Meta title length",
      detail: `${metaTitle.length} characters.`,
    });
  }

  if (!input.excerpt.trim() && !input.metaDescription?.trim()) {
    suggestions.push({
      id: "description-missing",
      level: "warn",
      title: "Add an excerpt or meta description",
      detail: "Search snippets work best with a unique 120–160 character summary.",
    });
  } else if (metaDescription.length > 160) {
    suggestions.push({
      id: "meta-desc-long",
      level: "warn",
      title: "Meta description is long",
      detail: `${metaDescription.length} chars — trim to about 160 for cleaner SERP display.`,
    });
  } else if (metaDescription.length >= 120) {
    suggestions.push({
      id: "meta-desc-ok",
      level: "good",
      title: "Meta description length",
      detail: `${metaDescription.length} characters.`,
    });
  }

  if (!slug) {
    suggestions.push({
      id: "slug-missing",
      level: "error",
      title: "Add a URL slug",
      detail: "Use lowercase words separated by hyphens, e.g. importing-porsche-from-japan.",
    });
  } else if (slug !== slugify(slug)) {
    suggestions.push({
      id: "slug-format",
      level: "warn",
      title: "Slug has special characters",
      detail: "Stick to lowercase letters, numbers, and hyphens only.",
    });
  } else {
    suggestions.push({
      id: "slug-ok",
      level: "good",
      title: "URL slug format",
      detail: `/blog/${slug}`,
    });
  }

  if (!input.coverImage) {
    suggestions.push({
      id: "cover-missing",
      level: "warn",
      title: "Add a cover image",
      detail: "Cover images improve click-through on the blog index and social shares.",
    });
  }

  const documentBlock = input.blocks.find(
    (b): b is Extract<BlogBlock, { type: "document" }> => b.type === "document",
  );
  const documentHtml = documentBlock?.html.trim() ? documentBlock.html : null;
  if (documentHtml) {
    const missingAlt = htmlImagesMissingAlt(documentHtml);
    const imageCount = (documentHtml.match(/<img\b/gi) || []).length;
    if (missingAlt) {
      suggestions.push({
        id: "alt-missing",
        level: "error",
        title: "Images missing alt text",
        detail: `${missingAlt} image(s) need descriptive alt text for accessibility and SEO.`,
      });
    } else if (imageCount) {
      suggestions.push({
        id: "alt-ok",
        level: "good",
        title: "Image alt text",
        detail: `${imageCount} image(s) have alt descriptions.`,
      });
    }
  } else {
    const images = input.blocks.filter((b) => b.type === "image");
    const imagesMissingAlt = images.filter((b) => b.type === "image" && !b.alt.trim());
    if (imagesMissingAlt.length) {
      suggestions.push({
        id: "alt-missing",
        level: "error",
        title: "Images missing alt text",
        detail: `${imagesMissingAlt.length} image block(s) need descriptive alt text for accessibility and SEO.`,
      });
    } else if (images.length) {
      suggestions.push({
        id: "alt-ok",
        level: "good",
        title: "Image alt text",
        detail: `${images.length} image(s) have alt descriptions.`,
      });
    }

    const videos = input.blocks.filter((b) => b.type === "youtube");
    const videosMissingTitle = videos.filter((b) => b.type === "youtube" && !b.title?.trim());
    if (videosMissingTitle.length) {
      suggestions.push({
        id: "youtube-title",
        level: "warn",
        title: "YouTube blocks missing titles",
        detail: "Add a short title for each embed — helps accessibility and rich results.",
      });
    }
  }

  if (wordCount < 300) {
    suggestions.push({
      id: "word-count-low",
      level: "warn",
      title: "Content is short",
      detail: `${wordCount} words — longer guides (600+ words) often rank better for informational queries.`,
    });
  } else {
    suggestions.push({
      id: "word-count-ok",
      level: "good",
      title: "Content depth",
      detail: `${wordCount} words in the body.`,
    });
  }

  const h2Count = documentHtml
    ? htmlHeadingCount(documentHtml, 2)
    : input.blocks.filter((b) => b.type === "heading" && b.level === 2).length;
  if (wordCount > 400 && h2Count === 0) {
    suggestions.push({
      id: "headings-missing",
      level: "warn",
      title: "Add section headings",
      detail: "Use H2 blocks to break up long articles for readers and search engines.",
    });
  }

  return suggestions;
}
