import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminBlogDashboard } from "@/components/admin/AdminBlogDashboard";

export const metadata: Metadata = {
  title: "Blog Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return <AdminBlogDashboard />;
}
