import { describe, expect, it } from "vitest";
import {
  normalizeBlogBlocks,
  parseYoutubeVideoId,
  blogPlainText,
} from "@/lib/blog-blocks";
import { blogSeoSuggestions, buildBlogMetaDescription } from "@/lib/blog-seo";

describe("blog blocks", () => {
  it("parses youtube URLs", () => {
    expect(parseYoutubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYoutubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYoutubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("normalizes mixed blocks", () => {
    const blocks = normalizeBlogBlocks([
      { type: "paragraph", text: " Hello " },
      { type: "table", headers: ["A", "B"], rows: [["1", "2"]] },
      { type: "image", src: "/x.jpg", alt: "Car" },
    ]);
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toMatchObject({ type: "paragraph", text: "Hello" });
    expect(blocks[2]).toMatchObject({ type: "image", alt: "Car" });
  });

  it("extracts plain text for SEO", () => {
    const text = blogPlainText([
      { type: "heading", level: 2, text: "Guide" },
      { type: "paragraph", text: "Import tips from Japan." },
    ]);
    expect(text).toContain("Guide");
    expect(text).toContain("Import tips");
  });
});

describe("blog seo", () => {
  it("flags missing image alt text", () => {
    const suggestions = blogSeoSuggestions({
      title: "Importing Porsche 911 from Japan",
      excerpt: "A practical guide to buying and shipping a Porsche from Japan with transparent pricing and inspection.",
      slug: "importing-porsche-911-from-japan",
      blocks: [{ type: "image", src: "/uploads/a.jpg", alt: "" }],
      coverImage: null,
    });
    expect(suggestions.some((s) => s.id === "alt-missing")).toBe(true);
  });

  it("builds meta description from excerpt", () => {
    const desc = buildBlogMetaDescription({
      title: "Test",
      excerpt: "Short excerpt for search.",
      blocks: [],
    });
    expect(desc).toBe("Short excerpt for search.");
  });
});
