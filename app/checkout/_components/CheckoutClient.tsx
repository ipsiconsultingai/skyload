"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import type { TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { ArrowLeft, CreditCard, Info, Loader2 } from "lucide-react";
import Link from "next/link";

import styles from "../page.module.css";

interface CheckoutPlan {
  name: string;
  displayName: string;
  price: number;
}

interface CheckoutClientProps {
  plan: CheckoutPlan;
  userEmail: string;
  userName: string;
  userId: string;
}

const PLAN_FEATURES: Record<string, string[]> = {
  lite: [
    "핵심 키워드 분석",
    "전체 요약 분석 (강점/약점)",
    "세특 분석",
    "탐구 주제 추천",
    "예상 면접 질문",
  ],
  standard: [
    "Lite 전체 포함",
    "세특 분석 강화",
    "등급 변화 가능성 분석",
    "대학 지원 전략",
    "합격 가능성 분석",
  ],
  premium: [
    "Standard 전체 포함",
    "문장 단위 정밀 분석",
    "생기부 스토리 구조 분석",
    "컨설팅급 보완 전략",
    "면접 심화 대비 + 모범 답변",
  ],
};

const formatPrice = (price: number): string => {
  return price.toLocaleString("ko-KR");
};

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

export const CheckoutClient = ({
  plan,
  userEmail,
  userName,
  userId,
}: CheckoutClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [agreedRequired, setAgreedRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);

  const features = PLAN_FEATURES[plan.name] ?? [];

  // 위젯 초기화 및 렌더링
  useEffect(() => {
    if (!CLIENT_KEY) {
      setError("결제 서비스가 설정되지 않았습니다.");
      return;
    }

    let destroyed = false;

    const initWidget = async () => {
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY);
        const widgets = tossPayments.widgets({ customerKey: userId });

        if (destroyed) return;

        widgetsRef.current = widgets;

        await widgets.setAmount({
          currency: "KRW",
          value: plan.price,
        });

        if (destroyed) return;

        const [, agreementWidget] = await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
          }),
        ]);

        if (destroyed) return;

        agreementWidget.on("agreementStatusChange", (status) => {
          setAgreedRequired(status.agreedRequiredTerms);
        });

        setIsWidgetReady(true);
      } catch (err) {
        if (!destroyed) {
          setError(
            err instanceof Error
              ? err.message
              : "결제 위젯을 불러오는 중 오류가 발생했습니다."
          );
        }
      }
    };

    initWidget();

    return () => {
      destroyed = true;
    };
  }, [userId, plan.price]);

  const handlePayment = async () => {
    if (!widgetsRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. 주문 생성
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: plan.name }),
      });

      if (!orderRes.ok) {
        const orderErr = await orderRes.json();
        throw new Error(orderErr.error ?? "주문 생성에 실패했습니다.");
      }

      const { tossOrderId, orderName } = await orderRes.json();

      // 2. 결제 요청 (위젯에서 선택한 결제수단으로 결제창 열림)
      await widgetsRef.current.requestPayment({
        orderId: tossOrderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerEmail: userEmail || undefined,
        customerName: userName || undefined,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("취소")) {
        setIsLoading(false);
        return;
      }
      setError(
        err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다."
      );
      setIsLoading(false);
    }
  };

  const isPayDisabled = isLoading || !isWidgetReady || !agreedRequired;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={styles.title}>결제하기</h1>
        <p className={styles.subtitle}>주문 내용을 확인해주세요</p>
      </div>

      <div className={styles.container}>
        {/* 주문 요약 카드 */}
        <div className={styles.card}>
          <div className={styles.planBadge}>{plan.displayName} Report</div>
          <h2 className={styles.planName}>SKYROAD {plan.displayName} 리포트</h2>

          <div className={styles.divider} />

          {features.map((feature) => (
            <div key={feature} className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{feature}</span>
              <span className={styles.summaryValue}>포함</span>
            </div>
          ))}

          <div className={styles.divider} />

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>상품 금액</span>
            <span className={styles.summaryValue}>
              {formatPrice(plan.price)}원
            </span>
          </div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>총 결제 금액</span>
            <span className={styles.totalValue}>
              {formatPrice(plan.price)}원
            </span>
          </div>
        </div>

        {/* 결제수단 위젯 */}
        <div id="payment-method" className={styles.widgetBox} />

        {/* 약관 위젯 */}
        <div id="agreement" className={styles.widgetBox} />

        {/* 안내 */}
        <div className={styles.infoBox}>
          <Info size={16} />
          <span>
            결제 완료 후 AI 분석이 자동으로 시작되며, 약 3~5분 소요됩니다.
            브라우저를 닫아도 분석은 계속 진행됩니다.
          </span>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <button
          type="button"
          className={styles.payButton}
          onClick={handlePayment}
          disabled={isPayDisabled}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              {formatPrice(plan.price)}원 결제하기
            </>
          )}
        </button>

        <Link href="/pricing" className={styles.backLink}>
          <ArrowLeft size={16} />
          가격표로 돌아가기
        </Link>
      </div>
    </section>
  );
};
