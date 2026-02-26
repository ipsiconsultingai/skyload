"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  Settings,
} from "lucide-react";

import { useSidebar } from "./AdminLayoutClient";
import styles from "./AdminSidebar.module.css";

const MENU_ITEMS = [
  {
    label: "대시보드",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "유저 관리",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "생기부 관리",
    href: "/admin/records",
    icon: FileText,
  },
  {
    label: "리포트 관리",
    href: "/admin/reports",
    icon: ClipboardCheck,
  },
] as const;

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.logoArea}>
          <LayoutDashboard size={20} color="#818cf8" strokeWidth={1.75} />
          <span className={styles.logoText}>
            SKYROAD
            <span className={styles.logoAccent}> Admin</span>
          </span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.sectionLabel}>MENU</div>
          {MENU_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                onClick={closeSidebar}
              >
                <item.icon size={20} strokeWidth={1.75} />
                <span className={styles.menuLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.bottomSection}>
          <Link
            href="/admin/settings"
            className={`${styles.menuItem} ${pathname === "/admin/settings" ? styles.menuItemActive : ""}`}
            onClick={closeSidebar}
          >
            <Settings size={20} strokeWidth={1.75} />
            <span className={styles.menuLabel}>설정</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
