"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import styles from "./page.module.css";

const MAX_RETRY = 3;

const GeneratingContent = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  const calledRef = useRef(false);

  const generateReport = useCallback(async () => {
    if (!orderId) {
      setError("주문 정보가 없습니다. 결제 내역에서 다시 시도해 주세요.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        router.replace(`/report/${id}`);
        return;
      }

      const body = await res
        .json()
        .catch(() => ({ error: "서버 오류가 발생했습니다." }));
      const errorMessage = body.error ?? "알 수 없는 오류가 발생했습니다.";

      if (res.status === 409) {
        if (errorMessage.includes("완료")) {
          router.replace(`/report/${id}`);
          return;
        }
        // 이미 생성 중
        setError("다른 탭에서 이미 생성 중입니다. 잠시 후 다시 시도해 주세요.");
        setIsGenerating(false);
        return;
      }

      setError(errorMessage);
    } catch {
      setError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  }, [orderId, id, router]);

  // 마운트 시 자동 호출
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    generateReport();
  }, [generateReport]);

  // beforeunload 이탈 방지
  useEffect(() => {
    if (!isGenerating) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isGenerating]);

  const handleRetry = () => {
    const nextRetry = retryCount + 1;
    if (nextRetry >= MAX_RETRY) {
      setExhausted(true);
      return;
    }
    setRetryCount(nextRetry);
    calledRef.current = false;
    generateReport();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {isGenerating ? (
          <>
            <div
              className={styles.spinner}
              role="status"
              aria-label="리포트 생성 중"
            />
            <h1 className={styles.title}>AI가 생기부를 분석하고 있습니다</h1>
            <p className={styles.description}>
              잠시만 기다려 주세요. 분석에 3~5분 정도 소요됩니다.
            </p>
            <p className={styles.warning}>페이지를 닫지 마세요.</p>
          </>
        ) : error ? (
          <>
            <h1 className={styles.title}>리포트 생성 중 문제가 발생했습니다</h1>
            <div className={styles.errorBox}>
              <p className={styles.errorMessage}>{error}</p>
              {exhausted ? (
                <p className={styles.contactMessage}>
                  여러 번 시도했지만 문제가 해결되지 않았습니다.
                  <br />
                  고객센터에 문의해 주세요.
                </p>
              ) : (
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={handleRetry}
                >
                  다시 시도
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.spinner}
              role="status"
              aria-label="준비 중"
            />
            <h1 className={styles.title}>준비 중입니다</h1>
          </>
        )}
      </div>
    </div>
  );
};

const GeneratingPage = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div
              className={styles.spinner}
              role="status"
              aria-label="로딩 중"
            />
            <h1 className={styles.title}>준비 중입니다</h1>
          </div>
        </div>
      }
    >
      <GeneratingContent />
    </Suspense>
  );
};

export default GeneratingPage;
