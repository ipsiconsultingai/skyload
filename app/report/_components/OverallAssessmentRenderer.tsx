import type { OverallAssessmentSection } from "@/libs/report/types";

import { ReportProgress } from "./ReportProgress";
import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface OverallAssessmentRendererProps {
  data: OverallAssessmentSection;
  sectionNumber: number;
}

export const OverallAssessmentRenderer = ({
  data,
  sectionNumber,
}: OverallAssessmentRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Overall fill rate as large score display */}
      <div className={`${styles.statCardLarge} ${styles.mb16}`}>
        <span className={styles.statCardLargeValue}>
          {data.overallFillRate}%
        </span>
        <span className={styles.statCardLargeLabel}>전체 기록 충실도</span>
      </div>
      <ReportProgress
        label="기록 충실도"
        value={data.overallFillRate}
        variant={data.overallFillRate >= 70 ? "strength" : "weakness"}
      />

      {/* Volume analysis table with fill rate progress bars */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        항목별 기록 분량
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>항목</th>
            <th className={styles.tableAlignCenter}>최대 용량</th>
            <th className={styles.tableAlignCenter}>실제 분량</th>
            <th className={styles.tableAlignCenter}>충실도</th>
            <th>평가</th>
          </tr>
        </thead>
        <tbody>
          {data.volumeAnalysis.map((item) => (
            <tr key={item.category}>
              <td className={styles.tableCellBold}>{item.category}</td>
              <td className={styles.tableAlignCenter}>{item.maxCapacity}</td>
              <td className={styles.tableAlignCenter}>{item.actualVolume}</td>
              <td className={styles.tableAlignCenter}>
                <div className={styles.progressBar}>
                  <div
                    className={
                      item.fillRate >= 70
                        ? styles.progressFillStrength
                        : styles.progressFill
                    }
                    style={{ width: `${item.fillRate}%` }}
                  />
                </div>
                <span
                  className={
                    item.fillRate >= 70
                      ? styles.textStrength
                      : styles.textWeakness
                  }
                >
                  {item.fillRate}%
                </span>
              </td>
              <td className={styles.small}>{item.assessment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Quality assessment */}
      <div className={`${styles.card} ${styles.mt20}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>분량 대비 질 평가</div>
        </div>
        <p className={`${styles.body} ${styles.mt8}`}>
          {data.qualityAssessment}
        </p>
      </div>

      {/* Competitiveness summary */}
      <div className={`${styles.cardHighlight} ${styles.mt16}`}>
        <div className={styles.cardTitle}>경쟁력 종합 요약</div>
        <p className={`${styles.body} ${styles.mt8}`}>
          {data.competitivenessSum}
        </p>
      </div>

      {/* Final comment */}
      <div className={`${styles.aiCommentary} ${styles.mt20}`}>
        <div className={styles.aiCommentaryIcon}>AI</div>
        <div className={styles.aiCommentaryContent}>
          <div className={styles.aiCommentaryLabel}>최종 종합 의견</div>
          <div className={styles.aiCommentaryText}>{data.finalComment}</div>
        </div>
      </div>
    </div>
  );
};
