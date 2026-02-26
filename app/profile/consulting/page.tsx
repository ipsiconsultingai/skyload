import { redirect } from "next/navigation";

import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import { createClient } from "@/libs/supabase/server";

import styles from "./page.module.css";

export const metadata = {
  title: "컨설팅 내역 | SKYROAD",
};

const ConsultingHistoryPage = async () => {
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
          <h1 className={styles.title}>컨설팅 내역</h1>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>아직 컨설팅 내역이 없습니다.</p>
            <p className={styles.emptySubtext}>
              생기부 진단을 시작하면 이곳에서 내역을 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultingHistoryPage;
