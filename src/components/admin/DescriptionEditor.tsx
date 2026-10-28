"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Bold, Heading2, Italic, Link2, List, ListOrdered } from "lucide-react";
import { RichDescription } from "@/components/RichDescription";

type Edit = { text: string; start: number; end: number };

function lineBounds(value: string, start: number, end: number) {
  const from = value.lastIndexOf("\n", start - 1) + 1;
  const nl = value.indexOf("\n", end);
  return { from, to: nl === -1 ? value.length : nl };
}

function wrap(value: string, start: number, end: number, marker: string, fallback: string): Edit {
  const selected = value.slice(start, end);
  const before = value.slice(start - marker.length, start);
  const after = value.slice(end, end + marker.length);
  if (selected && before === marker && after === marker) {
    const text = value.slice(0, start - marker.length) + selected + value.slice(end + marker.length);
    return { text, start: start - marker.length, end: end - marker.length };
  }
  const inner = selected || fallback;
  const text = value.slice(0, start) + marker + inner + marker + value.slice(end);
  return { text, start: start + marker.length, end: start + marker.length + inner.length };
}

const LIST_PREFIX = /^(\s*)(?:[-*•]|\d{1,3}[.)])\s+/;
const HEADING_PREFIX = /^#{1,6}\s+/;

function prefixLines(value: string, start: number, end: number, kind: "ul" | "ol" | "h"): Edit {
  const { from, to } = lineBounds(value, start, end);
  const lines = value.slice(from, to).split("\n");
  const has = (l: string) =>
    kind === "h" ? HEADING_PREFIX.test(l) : kind === "ul" ? /^\s*[-*•]\s+/.test(l) : /^\s*\d{1,3}[.)]\s+/.test(l);
  const removing = lines.filter((l) => l.trim()).every(has);
  let n = 0;
  const next = lines.map((line) => {
    if (!line.trim()) return line;
    const bare = line.replace(kind === "h" ? HEADING_PREFIX : LIST_PREFIX, "").replace(HEADING_PREFIX, "");
    if (removing) return bare;
    n += 1;
    return (kind === "h" ? "## " : kind === "ul" ? "- " : `${n}. `) + bare.replace(LIST_PREFIX, "");
  });
  const block = next.join("\n");
  return { text: value.slice(0, from) + block + value.slice(to), start: from, end: from + block.length };
}

const ACTIONS = [
  { id: "bold", label: "Bold (Ctrl/Cmd+B)", icon: Bold },
  { id: "italic", label: "Italic (Ctrl/Cmd+I)", icon: Italic },
  { id: "heading", label: "Section heading", icon: Heading2 },
  { id: "ul", label: "Bullet list", icon: List },
  { id: "ol", label: "Numbered list", icon: ListOrdered },
  { id: "link", label: "Link", icon: Link2 },
] as const;

type ActionId = (typeof ACTIONS)[number]["id"];

export function DescriptionEditor({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const apply = (make: (v: string, s: number, e: number) => Edit) => {
    const el = ref.current;
    if (!el) return;
    const edit = make(el.value, el.selectionStart, el.selectionEnd);
    onChange(edit.text);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(edit.start, edit.end);
    });
  };

  const run = (action: ActionId) => {
    if (action === "bold") return apply((v, s, e) => wrap(v, s, e, "**", "bold text"));
    if (action === "italic") return apply((v, s, e) => wrap(v, s, e, "*", "italic text"));
    if (action === "heading") return apply((v, s, e) => prefixLines(v, s, e, "h"));
    if (action === "ul") return apply((v, s, e) => prefixLines(v, s, e, "ul"));
    if (action === "ol") return apply((v, s, e) => prefixLines(v, s, e, "ol"));
    const url = window.prompt("Link URL (https://…)")?.trim();
    if (!url || !/^https?:\/\//i.test(url)) return;
    apply((v, s, e) => {
      const label = v.slice(s, e) || "link text";
      const md = `[${label}](${url})`;
      return { text: v.slice(0, s) + md + v.slice(e), start: s + 1, end: s + 1 + label.length };
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
    const key = e.key.toLowerCase();
    if (key === "b" || key === "i") {
      e.preventDefault();
      run(key === "b" ? "bold" : "italic");
    }
  };

  return (
    <div className="desc-editor">
      <div className="desc-editor-bar" role="toolbar" aria-label="Description formatting">
        <div className="desc-editor-tools">
          {ACTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="desc-editor-btn"
              onClick={() => run(id)}
              disabled={preview}
              title={label}
              aria-label={label}
            >
              <Icon size={16} aria-hidden />
            </button>
          ))}
        </div>
        <div className="desc-editor-tabs">
          <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>
            Write
          </button>
          <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>
            Preview
          </button>
        </div>
      </div>
      {preview ? (
        <div className="desc-editor-preview">
          {value.trim() ? (
            <RichDescription source={value} />
          ) : (
            <p className="muted">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={ref}
          className="textarea desc-editor-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          required={required}
          placeholder={placeholder}
        />
      )}
      <p className="desc-editor-hint muted">
        Markdown: **bold**, *italic*, ## Heading, - bullet, 1. numbered. Ctrl/Cmd+B and Ctrl/Cmd+I work too.
      </p>
    </div>
  );
}
