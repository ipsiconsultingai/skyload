"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { createClient } from "@/libs/supabase/client";

import styles from "./OnboardingHeader.module.css";

export const OnboardingHeader = () => {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/skyroad-logo.png"
              alt="SKYROAD"
              width={150}
              height={60}
            />
          </Link>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </header>
      <div className={styles.spacer} />
    </>
  );
};
