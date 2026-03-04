import { ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "결제 실패 - SKYROAD",
};

interface FailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
}

const CheckoutFailPage = async ({ searchParams }: FailPageProps) => {
  const params = await searchParams;
  const errorMessage = params.message ?? "결제가 완료되지 않았습니다.";

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <XCircle
          size={48}
          style={{ color: "var(--color-error-600)", margin: "0 auto" }}
        />
        <h1 className={styles.title} style={{ marginTop: 16 }}>
          결제에 실패했습니다
        </h1>
        <p className={styles.subtitle}>{errorMessage}</p>
      </div>

      <div className={styles.container}>
        {params.code && (
          <div className={styles.errorBox}>오류 코드: {params.code}</div>
        )}

        <Link href="/pricing" className={styles.backLink}>
          <ArrowLeft size={16} />
          가격표로 돌아가기
        </Link>
      </div>
    </section>
  );
};

export default CheckoutFailPage;
