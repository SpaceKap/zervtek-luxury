import Link from "next/link";
import type { PublicBlogPost } from "@/lib/blog";

function formatDate(value: Date | null): string {
  if (!value) return "";
  return value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: PublicBlogPost }) {
  return (
    <article className="blog-card glass">
      <Link href={`/blog/${post.slug}`} className="blog-card-link">
        {post.coverImage ? (
          <div className="blog-card-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt="" className="blog-card-image" loading="lazy" />
          </div>
        ) : (
          <div className="blog-card-media blog-card-media--placeholder" aria-hidden />
        )}
        <div className="blog-card-body">
          {post.publishedAt ? (
            <time className="blog-card-date" dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
          ) : null}
          <h2 className="blog-card-title">{post.title}</h2>
          <p className="blog-card-excerpt muted">{post.excerpt}</p>
          <span className="blog-card-cta">Read article</span>
        </div>
      </Link>
    </article>
  );
}
