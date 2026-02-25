import { FadeIn } from "./FadeIn";
import styles from "./ProcessSection.module.css";

interface Step {
  step: string;
  title: string;
  description: string;
  details: string[];
  accentClass: string;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "생기부 업로드",
    description:
      "PDF 파일을 업로드하거나 텍스트를 직접 붙여넣기 하세요. 1분이면 충분합니다.",
    details: ["한글 HWP 파일 지원", "NEIS 생기부 자동 파싱"],
    accentClass: "accentBlue",
  },
  {
    step: "02",
    title: "AI 1차 정밀 분석",
    description:
      "최신 AI가 세특, 창체, 내신, 모의고사 등 생기부 전 영역을 빠짐없이 분석합니다.",
    details: ["5개 핵심 지표 분석", "합격 사례 데이터 기반 비교"],
    accentClass: "accentPurple",
  },
  {
    step: "03",
    title: "전문가 검수 & 리포트 전달",
    description:
      "전임 입시 컨설턴트가 AI 분석 결과를 직접 재검토하고 수정합니다. 48시간 이내 리포트 전달.",
    details: ["20페이지 분량 심층 분석", "맞춤 전략 & 보완점 제시"],
    accentClass: "accentGreen",
  },
];

export const ProcessSection = () => {
  return (
    <section id="process" className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <p className={styles.sectionLabel}>How it works</p>
          <h2 className={styles.sectionTitle}>3단계로 완성되는 전문 리포트</h2>
          <p className={styles.sectionSubtitle}>
            3단계만으로 전문 수준의 생기부 분석 리포트를 받아보세요
          </p>
        </FadeIn>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          {STEPS.map((item, index) => (
            <FadeIn key={item.step} delay={index * 0.15}>
              <div
                className={`${styles.timelineItem} ${index === STEPS.length - 1 ? styles.timelineItemLast : ""}`}
              >
                <div className={`${styles.dot} ${styles[item.accentClass]}`} />
                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <span
                      className={`${styles.stepNumber} ${styles[item.accentClass]}`}
                    >
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDescription}>{item.description}</p>
                  <div className={styles.divider} />
                  <ul className={styles.detailList}>
                    {item.details.map((detail) => (
                      <li key={detail} className={styles.detailItem}>
                        <span
                          className={`${styles.detailDot} ${styles[item.accentClass]}`}
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
