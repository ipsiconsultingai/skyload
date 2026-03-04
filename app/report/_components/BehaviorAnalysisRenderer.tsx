import type { BehaviorAnalysisSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface BehaviorAnalysisRendererProps {
  data: BehaviorAnalysisSection;
  sectionNumber: number;
}

export const BehaviorAnalysisRenderer = ({
  data,
  sectionNumber,
}: BehaviorAnalysisRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Yearly analysis cards */}
      {data.yearlyAnalysis.map((year) => (
        <div key={year.year} className={`${styles.card} ${styles.mt16}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{year.year}학년</div>
          </div>
          <p className={styles.body}>{year.summary}</p>

          {/* Competency tags */}
          {year.competencyTags.length > 0 && (
            <div className={`${styles.tagGroup} ${styles.mt8}`}>
              {year.competencyTags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>
                  {tag.subcategory}
                  {tag.assessment && ` (${tag.assessment})`}
                </span>
              ))}
            </div>
          )}

          {/* Key quotes (Standard+) */}
          {year.keyQuotes && year.keyQuotes.length > 0 && (
            <div className={styles.mt12}>
              {year.keyQuotes.map((quote, idx) => (
                <div key={idx} className={styles.quoteBox}>
                  <div className={styles.quoteText}>{quote}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <hr className={styles.divider} />

      {/* Consistent traits */}
      <div className={`${styles.h3} ${styles.mb12}`}>일관된 특성</div>
      <div className={styles.tagGroup}>
        {data.consistentTraits.map((trait) => (
          <span key={trait} className={styles.tagAccent}>
            {trait}
          </span>
        ))}
      </div>

      {/* Overall comment */}
      <div className={`${styles.aiCommentary} ${styles.mt20}`}>
        <div className={styles.aiCommentaryIcon}>AI</div>
        <div className={styles.aiCommentaryContent}>
          <div className={styles.aiCommentaryLabel}>종합 평가</div>
          <div className={styles.aiCommentaryText}>{data.overallComment}</div>
        </div>
      </div>

      {/* Admission relevance */}
      <div className={`${styles.aiCommentary} ${styles.mt16}`}>
        <div className={styles.aiCommentaryIcon}>AI</div>
        <div className={styles.aiCommentaryContent}>
          <div className={styles.aiCommentaryLabel}>입시 활용 포인트</div>
          <div className={styles.aiCommentaryText}>
            {data.admissionRelevance}
          </div>
        </div>
      </div>
    </div>
  );
};
