import type { BlogBlock } from "@/lib/blog-blocks";
import { sanitizeBlogHtml } from "@/lib/blog-html";

function BlogYoutubeEmbed({ videoId, title }: { videoId: string; title?: string }) {
  if (!videoId) return null;
  return (
    <figure className="blog-embed blog-embed--youtube">
      <div className="blog-embed-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title || "YouTube video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </figure>
  );
}

export function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  const documentBlock = blocks.find((b): b is Extract<BlogBlock, { type: "document" }> => b.type === "document");
  if (documentBlock?.html.trim()) {
    return (
      <div
        className="blog-content blog-prose"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(documentBlock.html) }}
      />
    );
  }

  return (
    <div className="blog-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            if (!block.text.trim()) return null;
            return (
              <p key={index} className="blog-p">
                {block.text}
              </p>
            );
          case "heading":
            if (!block.text.trim()) return null;
            if (block.level === 3) {
              return (
                <h3 key={index} className="blog-h3">
                  {block.text}
                </h3>
              );
            }
            return (
              <h2 key={index} className="blog-h2">
                {block.text}
              </h2>
            );
          case "image":
            if (!block.src) return null;
            return (
              <figure key={index} className="blog-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={block.alt || ""} className="blog-image" loading="lazy" />
                {block.caption ? <figcaption className="blog-caption">{block.caption}</figcaption> : null}
              </figure>
            );
          case "youtube":
            if (!block.videoId) return null;
            return (
              <figure key={index} className="blog-figure">
                <BlogYoutubeEmbed videoId={block.videoId} title={block.title} />
                {block.caption ? <figcaption className="blog-caption">{block.caption}</figcaption> : null}
              </figure>
            );
          case "table":
            if (!block.headers.length) return null;
            return (
              <figure key={index} className="blog-table-wrap">
                <div className="blog-table-scroll">
                  <table className="blog-table">
                    <thead>
                      <tr>
                        {block.headers.map((header, hi) => (
                          <th key={hi} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, ri) => (
                        <tr key={ri}>
                          {block.headers.map((_, ci) => (
                            <td key={ci}>{row[ci] ?? ""}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption ? <figcaption className="blog-caption">{block.caption}</figcaption> : null}
              </figure>
            );
          case "callout":
            if (!block.text.trim()) return null;
            return (
              <aside key={index} className="blog-callout">
                {block.text}
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
