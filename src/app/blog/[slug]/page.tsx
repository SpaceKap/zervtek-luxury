import { redirect } from "next/navigation";

/** Public blog temporarily hidden — admin CMS still available at /admin/blog. */
export default function BlogArticlePage() {
  redirect("/");
}
