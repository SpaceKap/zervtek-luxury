import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  return (
    <main className="container" style={{ maxWidth: 440, paddingBlock: 100 }}>
      <span className="eyebrow">ZervTek Performance</span>
      <h1 className="heading" style={{ fontSize: 34, margin: "10px 0 24px" }}>
        Admin sign in
      </h1>
      <AdminLogin />
    </main>
  );
}
