import { BookOpenCheck, GraduationCap, Heart, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import { FadeIn } from "../../_components/FadeIn";
import styles from "./TargetSection.module.css";

interface TargetItem {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  colorClass: string;
}

const TARGETS: TargetItem[] = [
  {
    icon: <GraduationCap size={28} />,
    title: "고1~고2",
    subtitle: "아직 시간이 있을 때",
    description:
      "지금 생기부 상태를 점검하고 남은 학기에 어떤 활동을 해야 할지 방향을 잡으세요.",
    colorClass: "blue",
  },
  {
    icon: <BookOpenCheck size={28} />,
    title: "고3",
    subtitle: "지원 전략이 필요할 때",
    description:
      "수시 지원 조합, 내 생기부 강점을 살릴 대학 및 학과를 알고 싶다면.",
    colorClass: "purple",
  },
  {
    icon: <RefreshCw size={28} />,
    title: "재수생/N수생",
    subtitle: "전략을 재설계할 때",
    description:
      "작년과 달라진 전략, 객관적 데이터 기반 합격 가능성 분석이 필요하다면.",
    colorClass: "green",
  },
  {
    icon: <Heart size={28} />,
    title: "학부모",
    subtitle: "근거 있는 정보가 필요할 때",
    description:
      "아이의 생기부 상태를 객관적 수치로 확인하고 전문 분석을 받고 싶다면.",
    colorClass: "orange",
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  blue: { bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)", text: "#4f46e5" },
  purple: {
    bg: "linear-gradient(135deg, #faf5ff, #ede9fe)",
    text: "#7c3aed",
  },
  green: { bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", text: "#059669" },
  orange: { bg: "linear-gradient(135deg, #fff7ed, #ffedd5)", text: "#ea580c" },
};

const CARD_COLOR_MAP: Record<string, string> = {
  blue: "cardBlue",
  purple: "cardPurple",
  green: "cardGreen",
  orange: "cardOrange",
};

export const TargetSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <span className={styles.label}>Target Users</span>
          <h2 className={styles.sectionTitle}>
            이런 고민이 있다면, <span className={styles.accent}>SKYROAD</span>가
            답입니다
          </h2>
        </FadeIn>

        <div className={styles.cardsGrid}>
          {TARGETS.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08}>
              <div
                className={`${styles.card} ${styles[CARD_COLOR_MAP[item.colorClass]]}`}
              >
                <div
                  className={styles.cardIcon}
                  style={{
                    background: COLOR_MAP[item.colorClass].bg,
                    color: COLOR_MAP[item.colorClass].text,
                  }}
                >
                  {item.icon}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSubtitle}>{item.subtitle}</p>
                <p className={styles.cardDesc}>{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
