import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminBlogDashboard } from "@/components/admin/AdminBlogDashboard";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  return <AdminBlogDashboard initialPostId={id} />;
}
