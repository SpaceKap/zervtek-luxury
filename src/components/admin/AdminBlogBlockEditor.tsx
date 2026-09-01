"use client";

import type { BlogBlock, BlogBlockType } from "@/lib/blog-blocks";
import { BLOG_BLOCK_LABELS, emptyBlock, parseYoutubeVideoId } from "@/lib/blog-blocks";

type Props = {
  blocks: BlogBlock[];
  onChange: (blocks: BlogBlock[]) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  uploading: boolean;
};

function updateBlock<T extends BlogBlock>(
  blocks: BlogBlock[],
  index: number,
  next: T,
): BlogBlock[] {
  return blocks.map((b, i) => (i === index ? next : b));
}

export function AdminBlogBlockEditor({ blocks, onChange, onUploadImage, uploading }: Props) {
  function moveBlock(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function addBlock(type: BlogBlockType) {
    onChange([...blocks, emptyBlock(type)]);
  }

  return (
    <div className="admin-blog-blocks">
      {blocks.map((block, index) => (
        <div key={index} className="admin-blog-block glass">
          <div className="admin-blog-block-head">
            <strong>{BLOG_BLOCK_LABELS[block.type]}</strong>
            <div className="admin-blog-block-actions">
              <button type="button" className="admin-photo-btn" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                ↑
              </button>
              <button
                type="button"
                className="admin-photo-btn"
                onClick={() => moveBlock(index, 1)}
                disabled={index === blocks.length - 1}
              >
                ↓
              </button>
              <button type="button" className="admin-photo-btn admin-photo-btn-danger" onClick={() => removeBlock(index)}>
                ×
              </button>
            </div>
          </div>

          {block.type === "paragraph" || block.type === "callout" ? (
            <textarea
              className="textarea"
              rows={block.type === "callout" ? 3 : 5}
              value={block.text}
              onChange={(e) =>
                onChange(updateBlock(blocks, index, { ...block, text: e.target.value }))
              }
              placeholder={block.type === "callout" ? "Highlight an important note…" : "Write a paragraph…"}
            />
          ) : null}

          {block.type === "heading" ? (
            <div className="form-grid">
              <div className="field">
                <label>Level</label>
                <select
                  className="input"
                  value={block.level}
                  onChange={(e) =>
                    onChange(
                      updateBlock(blocks, index, {
                        ...block,
                        level: Number(e.target.value) === 3 ? 3 : 2,
                      }),
                    )
                  }
                >
                  <option value={2}>H2 section</option>
                  <option value={3}>H3 subsection</option>
                </select>
              </div>
              <div className="field">
                <label>Heading text</label>
                <input
                  className="input"
                  value={block.text}
                  onChange={(e) =>
                    onChange(updateBlock(blocks, index, { ...block, text: e.target.value }))
                  }
                />
              </div>
            </div>
          ) : null}

          {block.type === "image" ? (
            <div className="stack" style={{ gap: 12 }}>
              {block.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={block.src} alt={block.alt || ""} className="admin-blog-block-preview" />
              ) : null}
              <div className="field">
                <label>Image URL</label>
                <input
                  className="input"
                  value={block.src}
                  onChange={(e) =>
                    onChange(updateBlock(blocks, index, { ...block, src: e.target.value }))
                  }
                  placeholder="/uploads/…"
                />
              </div>
              <div className="field">
                <label>Upload image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await onUploadImage(file);
                    if (url) onChange(updateBlock(blocks, index, { ...block, src: url }));
                    e.target.value = "";
                  }}
                />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Alt text *</label>
                  <input
                    className="input"
                    value={block.alt}
                    onChange={(e) =>
                      onChange(updateBlock(blocks, index, { ...block, alt: e.target.value }))
                    }
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                <div className="field">
                  <label>Caption</label>
                  <input
                    className="input"
                    value={block.caption || ""}
                    onChange={(e) =>
                      onChange(updateBlock(blocks, index, { ...block, caption: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}

          {block.type === "youtube" ? (
            <div className="stack" style={{ gap: 12 }}>
              <div className="field">
                <label>YouTube URL or video ID</label>
                <input
                  className="input"
                  value={block.videoId}
                  onChange={(e) => {
                    const parsed = parseYoutubeVideoId(e.target.value);
                    onChange(
                      updateBlock(blocks, index, {
                        ...block,
                        videoId: parsed || e.target.value.trim(),
                      }),
                    );
                  }}
                  placeholder="https://www.youtube.com/watch?v=…"
                />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Video title</label>
                  <input
                    className="input"
                    value={block.title || ""}
                    onChange={(e) =>
                      onChange(updateBlock(blocks, index, { ...block, title: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Caption</label>
                  <input
                    className="input"
                    value={block.caption || ""}
                    onChange={(e) =>
                      onChange(updateBlock(blocks, index, { ...block, caption: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}

          {block.type === "table" ? (
            <div className="stack" style={{ gap: 12 }}>
              <div className="field">
                <label>Table caption</label>
                <input
                  className="input"
                  value={block.caption || ""}
                  onChange={(e) =>
                    onChange(updateBlock(blocks, index, { ...block, caption: e.target.value }))
                  }
                />
              </div>
              <div className="admin-blog-table-editor">
                <table>
                  <thead>
                    <tr>
                      {block.headers.map((header, hi) => (
                        <th key={hi}>
                          <input
                            className="input"
                            value={header}
                            onChange={(e) => {
                              const headers = [...block.headers];
                              headers[hi] = e.target.value;
                              onChange(updateBlock(blocks, index, { ...block, headers }));
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri}>
                        {block.headers.map((_, ci) => (
                          <td key={ci}>
                            <input
                              className="input"
                              value={row[ci] ?? ""}
                              onChange={(e) => {
                                const rows = block.rows.map((r) => [...r]);
                                rows[ri][ci] = e.target.value;
                                onChange(updateBlock(blocks, index, { ...block, rows }));
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "8px 12px", fontSize: 13 }}
                  onClick={() =>
                    onChange(
                      updateBlock(blocks, index, {
                        ...block,
                        headers: [...block.headers, `Column ${block.headers.length + 1}`],
                        rows: block.rows.map((row) => [...row, ""]),
                      }),
                    )
                  }
                >
                  Add column
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "8px 12px", fontSize: 13 }}
                  onClick={() =>
                    onChange(
                      updateBlock(blocks, index, {
                        ...block,
                        rows: [...block.rows, Array(block.headers.length).fill("")],
                      }),
                    )
                  }
                >
                  Add row
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ))}

      <div className="admin-blog-add-blocks">
        {(Object.keys(BLOG_BLOCK_LABELS) as BlogBlockType[]).map((type) => (
          <button
            key={type}
            type="button"
            className="btn btn-outline"
            style={{ padding: "8px 12px", fontSize: 13 }}
            onClick={() => addBlock(type)}
          >
            + {BLOG_BLOCK_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
