"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BlogPost } from "@prisma/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogEditor } from "@/components/admin/AdminBlogEditor";
import { blocksToDocumentHtml, documentBlocksFromHtml } from "@/lib/blog-document";
import { normalizeBlogBlocks } from "@/lib/blog-blocks";
import {
  buildBlogMetaDescription,
  buildBlogMetaTitle,
  blogSeoSuggestions,
  resolveBlogMetaDescription,
  resolveBlogMetaTitle,
} from "@/lib/blog-seo";
import { slugify } from "@/lib/slug";

type AdminMessage = {
  type: "ok" | "err";
  text: string;
  detail?: string;
  href?: string;
  hrefLabel?: string;
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  metaTitle: "",
  metaDescription: "",
  status: "DRAFT",
};

export function AdminBlogDashboard({ initialPostId }: { initialPostId?: string }) {
  const router = useRouter();
  const [list, setList] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [contentHtml, setContentHtml] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<AdminMessage | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const loadList = useCallback(async () => {
    const res = await fetch("/api/admin/blog");
    if (res.ok) setList((await res.json()).items);
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  function applyPost(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      status: post.status,
    });
    setContentHtml(blocksToDocumentHtml(normalizeBlogBlocks(post.blocks)));
  }

  function startNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setContentHtml("");
    setMessage(null);
    setLastSavedAt(null);
  }

  function startEdit(post: BlogPost) {
    setMessage(null);
    applyPost(post);
    requestAnimationFrame(() => {
      actionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  useEffect(() => {
    if (!initialPostId) return;
    (async () => {
      const res = await fetch(`/api/admin/blog/${initialPostId}`);
      if (res.ok) {
        const { post } = await res.json();
        applyPost(post);
      }
    })();
  }, [initialPostId]);

  const blocks = useMemo(() => documentBlocksFromHtml(contentHtml), [contentHtml]);

  const seoInput = useMemo(
    () => ({
      title: form.title,
      excerpt: form.excerpt,
      slug: form.slug || slugify(form.title),
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      blocks,
      coverImage: form.coverImage || null,
    }),
    [form, blocks],
  );

  const seoSuggestions = useMemo(() => blogSeoSuggestions(seoInput), [seoInput]);
  const previewMetaTitle = resolveBlogMetaTitle(seoInput);
  const previewMetaDescription = resolveBlogMetaDescription(seoInput);

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      setMessage({ type: "err", text: "Upload failed", detail: "Could not upload image." });
      return null;
    }
    const { urls } = await res.json();
    return urls[0] || null;
  }

  async function save(explicitStatus?: string) {
    if (!form.title.trim()) {
      setMessage({ type: "err", text: "Title required", detail: "Add a post title before saving." });
      return;
    }
    setSaving(true);
    setMessage(null);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      coverImage: form.coverImage || null,
      status: explicitStatus || form.status,
      blocks,
    };
    const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setMessage({
        type: "err",
        text: "Save failed",
        detail: body.error || "Something went wrong.",
      });
      return;
    }

    const { post } = await res.json();
    applyPost(post);
    setLastSavedAt(new Date());
    loadList();

    const published = post.status === "PUBLISHED";
    setMessage({
      type: "ok",
      text: published ? "Published" : "Saved",
      detail: published
        ? "This article is live on the blog."
        : "Draft saved. Publish when you are ready.",
      href: published ? `/blog/${post.slug}` : undefined,
      hrefLabel: published ? "View live article" : undefined,
    });

    if (!editingId) {
      router.replace(`/admin/blog/${post.id}`);
    }

    requestAnimationFrame(() => {
      actionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (editingId === id) startNew();
      loadList();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function generateSeo() {
    setForm((f) => ({
      ...f,
      metaTitle: buildBlogMetaTitle({ title: f.title }),
      metaDescription: buildBlogMetaDescription({
        title: f.title,
        excerpt: f.excerpt,
        blocks,
      }),
    }));
  }

  return (
    <AdminShell
      title="Blog manager"
      subtitle="Write articles with images, YouTube embeds, tables, and SEO guidance."
      actions={
        <button className="btn btn-outline" onClick={logout}>
          Sign out
        </button>
      }
    >
      <div className="admin-blog-layout">
        <section className="admin-blog-editor glass">
          <div className="admin-blog-editor-head">
            <div>
              <h2 className="heading" style={{ fontSize: 22, margin: 0 }}>
                {editingId ? "Edit post" : "New post"}
              </h2>
              {lastSavedAt ? (
                <p className="muted" style={{ margin: "6px 0 0", fontSize: 12 }}>
                  Last saved {lastSavedAt.toLocaleTimeString()}
                </p>
              ) : null}
            </div>
            <button type="button" className="btn btn-outline" onClick={startNew}>
              New post
            </button>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Title *</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Importing a Porsche 911 from Japan"
              />
            </div>
            <div className="field">
              <label>URL slug</label>
              <input
                className="input mono"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder={slugify(form.title) || "importing-porsche-from-japan"}
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label>Excerpt</label>
            <textarea
              className="textarea"
              rows={3}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short summary for the blog index and search snippets…"
            />
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label>Cover image</label>
            <div className="form-grid">
              <input
                className="input"
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                placeholder="/uploads/…"
              />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setForm((f) => ({ ...f, coverImage: url }));
                  e.target.value = "";
                }}
              />
            </div>
            {form.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="" className="admin-blog-cover-preview" />
            ) : null}
          </div>

          <h3 className="heading" style={{ fontSize: 16, marginTop: 28, marginBottom: 12 }}>
            Content
          </h3>
          <AdminBlogEditor
            content={contentHtml}
            onChange={setContentHtml}
            onUploadImage={uploadImage}
            uploading={uploading}
          />

          <div ref={actionRef} className="admin-publish-panel">
            {message ? (
              <div className={`admin-feedback admin-feedback--${message.type}`} role="status">
                <div className="admin-feedback-body">
                  <strong>{message.text}</strong>
                  {message.detail ? <span>{message.detail}</span> : null}
                  {message.href ? (
                    <a className="admin-feedback-link" href={message.href} target="_blank" rel="noopener noreferrer">
                      {message.hrefLabel || "Open"}
                    </a>
                  ) : null}
                </div>
                <button type="button" className="admin-feedback-dismiss" onClick={() => setMessage(null)}>
                  ×
                </button>
              </div>
            ) : null}
            <div className="admin-action-bar">
              <button type="button" className="btn btn-outline" disabled={saving} onClick={() => save("DRAFT")}>
                {saving ? "Saving…" : "Save draft"}
              </button>
              <button type="button" className="btn btn-gold" disabled={saving} onClick={() => save("PUBLISHED")}>
                {saving ? "Saving…" : form.status === "PUBLISHED" ? "Save changes" : "Publish"}
              </button>
              {form.slug ? (
                <Link className="btn btn-outline" href={`/blog/${form.slug}`} target="_blank">
                  Preview
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="admin-blog-sidebar">
          <div className="glass admin-blog-seo-panel">
            <div className="admin-blog-seo-head">
              <h3 className="heading" style={{ fontSize: 16, margin: 0 }}>
                SEO
              </h3>
              <button type="button" className="btn btn-outline" style={{ padding: "6px 10px", fontSize: 12 }} onClick={generateSeo}>
                Generate
              </button>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label>Meta title</label>
              <input
                className="input"
                value={form.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                placeholder={buildBlogMetaTitle({ title: form.title })}
              />
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label>Meta description</label>
              <textarea
                className="textarea"
                rows={4}
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                placeholder={buildBlogMetaDescription({ title: form.title, excerpt: form.excerpt, blocks })}
              />
            </div>

            <div className="glass" style={{ marginTop: 12, padding: 12, borderRadius: 12 }}>
              <div className="muted" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Google preview
              </div>
              <div style={{ fontSize: 15, color: "#1a0dab", fontWeight: 500, lineHeight: 1.3 }}>
                {previewMetaTitle}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                performance.zervtek.com/blog/{form.slug || slugify(form.title) || "…"}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                {previewMetaDescription}
              </div>
            </div>

            <ul className="admin-seo-suggestions">
              {seoSuggestions.map((item) => (
                <li key={item.id} className={`admin-seo-suggestion admin-seo-suggestion--${item.level}`}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass admin-blog-list-panel">
            <h3 className="heading" style={{ fontSize: 16, marginTop: 0 }}>
              Posts ({list.length})
            </h3>
            <div className="stack" style={{ gap: 10, marginTop: 12 }}>
              {list.map((post) => (
                <div key={post.id} className="admin-blog-list-item">
                  <div>
                    <strong style={{ display: "block", lineHeight: 1.35 }}>{post.title}</strong>
                    <span className="muted" style={{ fontSize: 12 }}>
                      {STATUS_LABELS[post.status] || post.status} · /blog/{post.slug}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button type="button" className="btn btn-outline" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => startEdit(post)}>
                      Edit
                    </button>
                    <Link className="btn btn-outline" href={`/admin/blog/${post.id}`} style={{ padding: "6px 10px", fontSize: 12 }}>
                      Open
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: "6px 10px", fontSize: 12, borderColor: "var(--crimson)", color: "var(--crimson)" }}
                      onClick={() => remove(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {list.length === 0 ? <p className="muted">No posts yet.</p> : null}
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
