import type { AdmissionPredictionSection } from "@/libs/report/types";

import { ReportBadge } from "./ReportBadge";
import { ReportComparisonBar } from "./ReportProgress";
import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface AdmissionPredictionRendererProps {
  data: AdmissionPredictionSection;
  sectionNumber: number;
}

export const AdmissionPredictionRenderer = ({
  data,
  sectionNumber,
}: AdmissionPredictionRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Recommended type */}
      <div className={styles.cardAccent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>추천 전형</div>
          <span className={styles.tagAccent}>{data.recommendedType}</span>
        </div>
        <p className={styles.body}>{data.recommendedTypeReason}</p>
      </div>

      {/* Prediction cards */}
      {data.predictions.map((pred) => (
        <div key={pred.admissionType} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={`${styles.flexRow} ${styles.gap10}`}>
              <div className={styles.cardTitle}>{pred.admissionType}</div>
              <span className={styles.tagAccent}>{pred.passRateLabel}</span>
            </div>
          </div>

          {/* Pass rate range */}
          <ReportComparisonBar
            myValue={(pred.passRateRange[0] + pred.passRateRange[1]) / 2}
            rangeStart={pred.passRateRange[0]}
            rangeEnd={pred.passRateRange[1]}
            myLabel="예측 중앙"
            rangeLabel="합격률 범위"
          />

          <p className={styles.body}>{pred.analysis}</p>

          {/* University predictions (Standard+) */}
          {pred.universityPredictions &&
            pred.universityPredictions.length > 0 && (
              <div className={styles.mt16}>
                <div className={`${styles.overline} ${styles.mb8}`}>
                  대학별 예측
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>대학</th>
                      <th>학과</th>
                      <th className={styles.tableAlignCenter}>합격 가능성</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pred.universityPredictions.map((up) => (
                      <tr key={`${up.university}-${up.department}`}>
                        <td className={styles.tableCellBold}>
                          {up.university}
                        </td>
                        <td>{up.department}</td>
                        <td className={styles.tableAlignCenter}>
                          <ReportBadge chance={up.chance} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pred.universityPredictions.map((up) => (
                  <p
                    key={`${up.university}-rationale`}
                    className={`${styles.small} ${styles.mt8}`}
                  >
                    <span className={styles.emphasis}>{up.university}:</span>{" "}
                    {up.rationale}
                  </p>
                ))}
              </div>
            )}
        </div>
      ))}

      {/* Overall comment */}
      <div className={`${styles.aiCommentary} ${styles.mt20}`}>
        <div className={styles.aiCommentaryIcon}>AI</div>
        <div className={styles.aiCommentaryContent}>
          <div className={styles.aiCommentaryLabel}>종합 코멘트</div>
          <div className={styles.aiCommentaryText}>{data.overallComment}</div>
        </div>
      </div>
    </div>
  );
};
