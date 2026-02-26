import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createClient } from "@/libs/supabase/server";

import { AdminHeader } from "./_components/AdminHeader";
import { AdminLayoutClient } from "./_components/AdminLayoutClient";
import { AdminSidebar } from "./_components/AdminSidebar";
import styles from "./admin-layout.module.css";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const adminName = profile.name ?? user.email ?? "관리자";

  return (
    <AdminLayoutClient>
      <div className={`${styles.adminRoot} ${styles.layout}`}>
        <AdminSidebar />
        <div className={styles.main}>
          <AdminHeader adminName={adminName} />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </AdminLayoutClient>
  );
};

export default AdminLayout;
