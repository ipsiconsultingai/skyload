import { redirect } from "next/navigation";

import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import { createClient } from "@/libs/supabase/server";

import styles from "./page.module.css";

export const metadata = {
  title: "목표 대학 수정 | SKYROAD",
};

const TargetUniversityPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>목표 대학 수정</h1>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>준비 중인 기능입니다.</p>
            <p className={styles.emptySubtext}>
              곧 목표 대학을 설정하고 관리할 수 있습니다.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TargetUniversityPage;
