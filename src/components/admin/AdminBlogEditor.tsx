"use client";

import { useEffect, useRef } from "react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { promptYoutubeUrl } from "@/lib/blog-document";

type Props = {
  content: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  uploading: boolean;
};

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`admin-blog-toolbar-btn${active ? " is-active" : ""}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function AdminBlogEditor({ content, onChange, onUploadImage, uploading }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const syncingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ HTMLAttributes: { class: "blog-image" } }),
      Youtube.configure({
        inline: false,
        nocookie: true,
        HTMLAttributes: { class: "blog-youtube-embed" },
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Write your article here. Use the toolbar for headings, links, images, and YouTube embeds.",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "admin-blog-editor-body ProseMirror",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (syncingRef.current) return;
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current === content) return;
    syncingRef.current = true;
    editor.commands.setContent(content || "<p></p>", { emitUpdate: false });
    syncingRef.current = false;
  }, [content, editor]);

  if (!editor) return null;

  async function insertImage(file: File) {
    const url = await onUploadImage(file);
    if (!url) return;
    const alt = window.prompt("Alt text for this image (for accessibility and SEO)", "") || "";
    editor?.chain().focus().setImage({ src: url, alt }).run();
  }

  function setLink() {
    const prev = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (!url) {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertYoutube() {
    const videoIdOrUrl = promptYoutubeUrl();
    if (!videoIdOrUrl || !editor) return;
    const src = /^[\w-]{11}$/.test(videoIdOrUrl)
      ? `https://www.youtube.com/watch?v=${videoIdOrUrl}`
      : videoIdOrUrl;
    editor.chain().focus().setYoutubeVideo({ src }).run();
  }

  return (
    <div className="admin-blog-editor-shell">
      <div className="admin-blog-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton label="B" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton label="I" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarButton label="U" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <span className="admin-blog-toolbar-divider" aria-hidden />
        <ToolbarButton label="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton label="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <span className="admin-blog-toolbar-divider" aria-hidden />
        <ToolbarButton label="• List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolbarButton label="1. List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <span className="admin-blog-toolbar-divider" aria-hidden />
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink} />
        <ToolbarButton
          label="Image"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        />
        <ToolbarButton label="YouTube" onClick={insertYoutube} />
        <ToolbarButton
          label="Table"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="photo-dropzone-input"
        disabled={uploading}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await insertImage(file);
          e.target.value = "";
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}
