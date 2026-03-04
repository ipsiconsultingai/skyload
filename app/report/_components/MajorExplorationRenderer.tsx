import type { MajorExplorationSection } from "@/libs/report/types";

import { ReportProgress } from "./ReportProgress";
import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface MajorExplorationRendererProps {
  data: MajorExplorationSection;
  sectionNumber: number;
}

export const MajorExplorationRenderer = ({
  data,
  sectionNumber,
}: MajorExplorationRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="AI가 추천하는 전공과 적합도를 분석합니다"
      />

      {/* Current target assessment */}
      {data.currentTargetAssessment && (
        <div className={styles.cardAccent}>
          <div className={styles.cardTitle}>현재 목표 학과 평가</div>
          <p className={`${styles.body} ${styles.mt8}`}>
            {data.currentTargetAssessment}
          </p>
        </div>
      )}

      {/* Major suggestion cards */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        추천 전공
      </div>
      {data.suggestions.map((suggestion, idx) => (
        <div key={idx} className={`${styles.card} ${styles.borderAccentLeft}`}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>{suggestion.major}</div>
              {suggestion.university && (
                <div className={`${styles.tagGroup} ${styles.mt4}`}>
                  <span className={styles.tagAccent}>
                    {suggestion.university}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fit score progress bar */}
          <ReportProgress
            label="적합도"
            value={suggestion.fitScore}
            variant={suggestion.fitScore >= 70 ? "strength" : "default"}
          />

          <p className={`${styles.body} ${styles.mt12}`}>
            {suggestion.rationale}
          </p>

          {/* Strength matches */}
          {suggestion.strengthMatch.length > 0 && (
            <div className={styles.mt12}>
              <div className={`${styles.overline} ${styles.mb8}`}>
                강점 매칭
              </div>
              <div className={styles.tagGroup}>
                {suggestion.strengthMatch.map((strength) => (
                  <span key={strength} className={styles.tagStrength}>
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gap analysis */}
          {suggestion.gapAnalysis && (
            <div
              className={`${styles.callout} ${styles.calloutCaution} ${styles.mt12}`}
            >
              <div className={styles.calloutContent}>
                <span className={styles.emphasis}>보완 필요:</span>{" "}
                {suggestion.gapAnalysis}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
