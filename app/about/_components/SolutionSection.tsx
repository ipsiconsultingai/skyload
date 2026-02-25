import { ScanText, Target, Lightbulb, BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";

import { FadeIn } from "../../_components/FadeIn";
import styles from "./SolutionSection.module.css";

interface SolutionItem {
  icon: ReactNode;
  title: string;
  description: string;
  colorClass: string;
}

const SOLUTIONS: SolutionItem[] = [
  {
    icon: <ScanText size={24} />,
    title: "세특 문장 단위 정밀 분석",
    description:
      "과목별 세부능력 및 특기사항을 문장 단위로 분석하여 강점과 보완점을 진단합니다",
    colorClass: "cardIconPrimary",
  },
  {
    icon: <Target size={24} />,
    title: "전공 적합성 매칭",
    description:
      "희망 전공과 활동 기록의 일치도를 분석하여 합격 가능성을 검증합니다",
    colorClass: "cardIconPurple",
  },
  {
    icon: <Lightbulb size={24} />,
    title: "맞춤형 활동 추천",
    description:
      "남은 학기에 채워야 할 활동과 탐구 주제를 구체적으로 제시합니다",
    colorClass: "cardIconGreen",
  },
  {
    icon: <BadgeCheck size={24} />,
    title: "합리적 가격의 전문가 리포트",
    description: "오프라인 컨설팅 수준의 분석을 온라인 가격으로 받아보세요",
    colorClass: "cardIconOrange",
  },
];

export const SolutionSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <span className={styles.label}>Solutions</span>
          <h2 className={styles.sectionTitle}>SKYROAD가 해결합니다</h2>
          <p className={styles.sectionSubtitle}>
            AI 기술과 입시 전문가의 경험을 결합한 4가지 핵심 기능
          </p>
        </FadeIn>

        <div className={styles.cardsGrid}>
          {SOLUTIONS.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08}>
              <div className={styles.card}>
                <div
                  className={`${styles.cardIconWrapper} ${styles[item.colorClass]}`}
                >
                  {item.icon}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
