import { AlertTriangle, HelpCircle, Shield, Target } from "lucide-react";

import { FadeIn } from "./FadeIn";
import styles from "./PainPointSection.module.css";

const PAIN_POINTS = [
  {
    icon: HelpCircle,
    title: "내 생기부, 객관적으로 어느 수준일까?",
    description:
      "선생님 말씀만으로는 판단이 어렵고, 비교 기준이 없어 불안합니다.",
    colorClass: "iconPrimary",
  },
  {
    icon: AlertTriangle,
    title: "남은 학기에 뭘 해야 할지 모르겠다",
    description: "활동은 많이 했는데, 방향이 맞는 건지 확신이 없습니다.",
    colorClass: "iconOrange",
  },
  {
    icon: Target,
    title: "수시 지원, 어디에 써야 할까?",
    description: "내 생기부 강점을 살릴 대학과 전형을 모르겠습니다.",
    colorClass: "iconGreen",
  },
  {
    icon: Shield,
    title: "AI 분석만으로 충분할까?",
    description: "ChatGPT에 넣어봤지만 정확한 건지 의문이 듭니다.",
    colorClass: "iconPurple",
  },
] as const;

export const PainPointSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <p className={styles.sectionLabel}>Pain Points</p>
          <h2 className={styles.sectionTitle}>
            혹시 이런 고민, 하고 계신가요?
          </h2>
        </FadeIn>

        <div className={styles.grid}>
          {PAIN_POINTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className={styles.card}>
                  <div
                    className={`${styles.iconCircle} ${styles[item.colorClass]}`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
