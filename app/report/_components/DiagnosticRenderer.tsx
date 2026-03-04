import type { DiagnosticSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface DiagnosticRendererProps {
  data: DiagnosticSection;
  sectionNumber: number;
}

const CATEGORY_LABEL: Record<string, string> = {
  academic: "학업 역량",
  career: "진로 역량",
  community: "공동체 역량",
  growth: "발전 가능성",
};

export const DiagnosticRenderer = ({
  data,
  sectionNumber,
}: DiagnosticRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* One-liner as large callout */}
      <div className={styles.callout}>
        <div className={styles.calloutContent}>
          <span className={styles.emphasis}>{data.oneLiner}</span>
        </div>
      </div>

      {/* Keywords as 3 tagAccent tags with descriptions */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        핵심 키워드
      </div>
      <div className={styles.tagGroup}>
        {data.keywords.map((kw) => (
          <span key={kw.label} className={styles.tagAccent}>
            {kw.label}
          </span>
        ))}
      </div>
      <div className={styles.mt12}>
        {data.keywords.map((kw) => (
          <p key={kw.label} className={`${styles.small} ${styles.mt8}`}>
            <span className={styles.emphasis}>{kw.label}:</span>{" "}
            {kw.description}
          </p>
        ))}
      </div>

      {/* Competency summary as 2x2 card grid */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        역량별 진단
      </div>
      <div className={styles.cardGrid}>
        {data.competencySummary.map((item) => (
          <div key={item.category} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                {CATEGORY_LABEL[item.category] ?? item.label}
              </div>
            </div>
            <p className={styles.body}>{item.summary}</p>
          </div>
        ))}
      </div>

      {/* Admission positioning (Standard+) */}
      {data.admissionPositioning && (
        <div className={`${styles.cardAccent} ${styles.mt20}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>입시 포지셔닝</div>
          </div>
          <p className={styles.body}>{data.admissionPositioning}</p>
        </div>
      )}

      {/* Strategy overview (Premium) */}
      {data.strategyOverview && (
        <div className={`${styles.cardAccent} ${styles.mt16}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>합격 전략 요약</div>
          </div>
          <p className={styles.body}>{data.strategyOverview}</p>
        </div>
      )}
    </div>
  );
};
