import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, blogListingJsonLd } from "@/lib/seo";
import { listPublishedBlogPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Performance Cars from Japan",
  description:
    "Guides, market insights, and export advice on buying performance cars, supercars and luxury vehicles from Japan with ZervTek Performance.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await listPublishedBlogPosts(48);

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Blog", url: `${SITE.url}/blog` },
        ])}
      />
      <JsonLd data={blogListingJsonLd(posts)} />

      <section className="container blog-index-intro">
        <Breadcrumbs className="page-breadcrumbs" items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <span className="eyebrow">Blog</span>
        <h1 className="heading blog-index-title">Insights from Japan&apos;s performance car market</h1>
        <p className="muted blog-index-lead">
          Export guides, buying advice, and updates from the {SITE.name} team.
        </p>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        {posts.length ? (
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state glass">
            <p className="muted" style={{ margin: 0 }}>
              New articles are on the way. Check back soon or{" "}
              <Link href="/about#contact-form">contact us</Link> for export advice.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
