import { describe, expect, it } from "vitest";
import { sanitizeBlogHtml, stripHtml } from "@/lib/blog-html";
import { serializeJsonLd } from "@/lib/json-ld";

describe("sanitizeBlogHtml", () => {
  it("strips script tags and event handlers", () => {
    const html = sanitizeBlogHtml(
      `<p onclick="alert(1)">Hello</p><script>alert(2)</script><img src=x onerror="alert(3)">`,
    );
    expect(html).not.toMatch(/script/i);
    expect(html).not.toMatch(/onclick/i);
    expect(html).not.toMatch(/onerror/i);
    expect(html).toContain("Hello");
  });

  it("rejects javascript: and data: URLs", () => {
    const html = sanitizeBlogHtml(
      `<a href="javascript:alert(1)">x</a><a href="https://example.com">ok</a><img src="data:text/html;base64,xxx">`,
    );
    expect(html).not.toMatch(/javascript:/i);
    expect(html).not.toMatch(/data:/i);
    expect(html).toContain('href="https://example.com"');
  });

  it("keeps safe editor markup", () => {
    const html = sanitizeBlogHtml(
      `<h2>Title</h2><p>Text <strong>bold</strong></p><ul><li>One</li></ul><table><tr><td>Cell</td></tr></table>`,
    );
    expect(html).toContain("<h2>");
    expect(html).toContain("<strong>");
    expect(html).toContain("<li>");
    expect(html).toContain("<td>");
  });

  it("forces noopener on target=_blank links", () => {
    const html = sanitizeBlogHtml(`<a href="https://example.com" target="_blank">x</a>`);
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe("stripHtml", () => {
  it("returns plain text", () => {
    expect(stripHtml("<p>Hello <em>world</em></p>")).toBe("Hello world");
  });
});

describe("serializeJsonLd", () => {
  it("escapes HTML-sensitive characters so script cannot break out", () => {
    const raw = serializeJsonLd({
      name: `Car</script><script>alert(1)</script>`,
      note: "a & b < c > d",
    });
    expect(raw).not.toContain("</script>");
    expect(raw).toContain("\\u003c");
    expect(raw).toContain("\\u003e");
    expect(raw).toContain("\\u0026");
    expect(JSON.parse(raw).name).toContain("</script>");
  });
});
