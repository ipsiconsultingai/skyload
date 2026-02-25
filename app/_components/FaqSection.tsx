"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { FadeIn } from "./FadeIn";
import styles from "./FaqSection.module.css";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "분석 결과는 언제 받을 수 있나요?",
    answer:
      "결제 완료 후 48시간 이내에 이메일로 전달됩니다. AI가 1차 분석한 결과를 전임 컨설턴트가 직접 재검토하고 수정하는 과정이 포함되어 있어, 단순 AI 분석보다 훨씬 높은 정확도를 보장합니다.",
  },
  {
    question: "생기부 파일은 안전하게 관리되나요?",
    answer:
      "모든 파일은 암호화되어 안전하게 저장됩니다. 분석 완료 후 일정 기간이 지나면 자동으로 삭제되며, 개인정보 보호법에 따라 엄격하게 관리됩니다.",
  },
  {
    question: "어떤 학년의 생기부도 분석 가능한가요?",
    answer:
      "고1부터 고3까지, 그리고 재수생/N수생 모두 분석 가능합니다. 단, 대학 지원 조합은 고2 이상의 생기부 데이터가 포함되어야 제공됩니다. 고1 생기부만으로는 대학 지원 조합 분석이 어렵습니다.",
  },
  {
    question: "분석 결과의 정확도는 어느 정도인가요?",
    answer:
      "최신 AI 모델이 생기부 전 영역을 빠짐없이 분석한 후, 전임 입시 컨설턴트가 결과를 직접 재검토하고 수정합니다. AI 해석만 제공하는 다른 서비스와 달리, 전문가의 눈으로 한 번 더 검증하기 때문에 높은 정확도를 보장합니다.",
  },
  {
    question: "환불은 가능한가요?",
    answer:
      "AI 분석이 시작되기 전에는 전액 환불이 가능합니다. 분석이 시작된 이후에는 이미 리소스가 투입되므로 환불이 어렵습니다. 자세한 환불 정책은 이용약관을 확인해주세요.",
  },
  {
    question: "PDF 업로드가 안 되면 어떻게 하나요?",
    answer:
      "PDF 업로드가 어려운 경우, 생기부 텍스트를 직접 복사하여 텍스트 입력 방식으로 제출하실 수 있습니다. 두 가지 방식 모두 동일한 품질의 분석 결과를 제공합니다.",
  },
];

const FaqAccordionItem = ({ item }: { item: FaqItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.accordionItem}>
      <button
        type="button"
        className={styles.accordionTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.accordionQuestion}>{item.question}</span>
        <ChevronDown
          size={20}
          className={`${styles.accordionIcon} ${isOpen ? styles.accordionIconOpen : ""}`}
        />
      </button>
      <div
        className={`${styles.accordionContent} ${isOpen ? styles.accordionContentOpen : styles.accordionContentClosed}`}
      >
        <div className={styles.accordionInner}>
          <p className={styles.accordionAnswer}>{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

export const FaqSection = () => {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <p className={styles.sectionLabel}>FAQ</p>
          <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>
          <p className={styles.sectionSubtitle}>
            궁금한 점이 있으시면 언제든 문의해주세요
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className={styles.faqList}>
            {FAQ_DATA.map((item) => (
              <FaqAccordionItem key={item.question} item={item} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
