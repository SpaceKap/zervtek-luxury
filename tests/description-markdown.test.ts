import { describe, expect, it } from "vitest";
import { descriptionToPlainText, parseDescription, parseInline } from "@/lib/description-markdown";

const HERMES_SAMPLE = `A 2023 Jaguar F-Pace SVR in black.

## Vehicle specification

- First registration: 2023
- Mileage: 8,000 km

## Why this car is worth considering

The **supercharged V8** is the point of this car.`;

describe("description markdown", () => {
  it("parses Hermes headings, bullets and bold", () => {
    const blocks = parseDescription(HERMES_SAMPLE);
    expect(blocks.map((b) => b.type)).toEqual(["paragraph", "heading", "list", "heading", "paragraph"]);
    expect(blocks[1]).toEqual({ type: "heading", children: ["Vehicle specification"] });
    expect(blocks[2]).toMatchObject({ type: "list", ordered: false, items: [["First registration: 2023"], ["Mileage: 8,000 km"]] });
    expect(blocks[4]).toMatchObject({
      lines: [["The ", { type: "strong", children: ["supercharged V8"] }, " is the point of this car."]],
    });
  });

  it("treats a short label above a list as a heading", () => {
    const blocks = parseDescription("Intro sentence.\n\nEquipment\n\n- Air conditioning\n- Alloy wheels");
    expect(blocks[1]).toEqual({ type: "heading", children: ["Equipment"] });
  });

  it("keeps sentences above lists as paragraphs", () => {
    const blocks = parseDescription("The car comes with the following.\n- Book pack");
    expect(blocks[0].type).toBe("paragraph");
  });

  it("supports numbered lists, italic, ##bold## and safe links only", () => {
    const blocks = parseDescription("1. First\n2. Second");
    expect(blocks[0]).toMatchObject({ type: "list", ordered: true });
    expect(parseInline("*soft* ##loud##")).toEqual([
      { type: "em", children: ["soft"] },
      " ",
      { type: "strong", children: ["loud"] },
    ]);
    expect(parseInline("[x](javascript:alert(1))")).toEqual(["[x](javascript:alert(1))"]);
    expect(parseInline("[spec](https://example.com/a)")).toEqual([
      { type: "link", href: "https://example.com/a", children: ["spec"] },
    ]);
  });

  it("does not treat #hashtags or stray asterisks as formatting", () => {
    expect(parseDescription("#1 owner car")[0].type).toBe("paragraph");
    expect(parseInline("5 * 3 = 15")).toEqual(["5 * 3 = 15"]);
  });

  it("strips markdown for plain-text SEO use", () => {
    expect(descriptionToPlainText(HERMES_SAMPLE)).toBe(
      "A 2023 Jaguar F-Pace SVR in black. Vehicle specification: First registration: 2023, Mileage: 8,000 km. Why this car is worth considering: The supercharged V8 is the point of this car.",
    );
  });
});
