import { Bot, Check, ShieldCheck } from "lucide-react";

import { FadeIn } from "../../_components/FadeIn";
import styles from "./DifferenceSection.module.css";

const AI_ONLY = [
  "키워드 기반 단순 매칭",
  "할루시네이션 검증 없음",
  "일반적인 대학 추천",
  "정확도 편차가 큰 결과",
];

const SKYROAD = [
  "문장 맥락 + 교과 연계 + 성장 서사 정밀 판단",
  "전임 컨설턴트가 사실관계 및 해석 오류 직접 수정",
  "최신 입시 데이터 기반 맞춤 전략",
  "이중 검수로 일관된 분석 품질 보장",
];

export const DifferenceSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <span className={styles.label}>Comparison</span>
          <h2 className={styles.sectionTitle}>
            AI <span className={styles.accent}>분석만</span>으로는 부족합니다
          </h2>
          <p className={styles.sectionSubtitle}>
            AI가 놓치는 맥락을, 전문가가 잡아냅니다
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className={styles.compareGrid}>
            <div className={styles.cardWeak}>
              <div className={styles.cardHeader}>
                <Bot size={20} />
                <span>AI만 사용</span>
              </div>
              <ul className={styles.list}>
                {AI_ONLY.map((item) => (
                  <li key={item} className={styles.listItem}>
                    <span className={styles.bullet} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.cardStrongWrapper}>
              <div className={styles.cardStrong}>
                <div className={styles.cardHeaderStrong}>
                  <ShieldCheck size={20} />
                  <span>AI + 전문가 (SKYROAD)</span>
                  <span className={styles.badge}>추천</span>
                </div>
                <ul className={styles.list}>
                  {SKYROAD.map((item) => (
                    <li key={item} className={styles.listItem}>
                      <Check size={16} className={styles.checkIcon} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
