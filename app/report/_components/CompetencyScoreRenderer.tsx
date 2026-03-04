import type {
  CompetencyGrade,
  CompetencyScoreSection,
} from "@/libs/report/types";

import { ReportProgress } from "./ReportProgress";
import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface CompetencyScoreRendererProps {
  data: CompetencyScoreSection;
  sectionNumber: number;
}

const CATEGORY_LABEL: Record<string, string> = {
  academic: "학업 역량",
  career: "진로 역량",
  community: "공동체 역량",
  growth: "발전 가능성",
};

const GRADE_BADGE_CLASS: Record<CompetencyGrade, string> = {
  S: styles.ratingExcellent,
  A: styles.ratingGood,
  B: styles.ratingAverage,
  C: styles.ratingWeak,
  D: styles.ratingWeak,
};

export const CompetencyScoreRenderer = ({
  data,
  sectionNumber,
}: CompetencyScoreRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Total score + growth grade + percentile */}
      <div className={`${styles.cardGridThree} ${styles.mb20}`}>
        <div className={styles.statCardLarge}>
          <span className={styles.statCardLargeValue}>{data.totalScore}</span>
          <span className={styles.statCardLargeLabel}>총점 (300점 만점)</span>
        </div>
        <div className={styles.statCardLarge}>
          <span className={GRADE_BADGE_CLASS[data.growthGrade]}>
            {data.growthGrade}
          </span>
          <span className={styles.statCardLargeLabel}>발전가능성 등급</span>
        </div>
        {data.percentile !== undefined && (
          <div className={styles.statCardLarge}>
            <span className={styles.statCardLargeValue}>
              상위 {data.percentile}%
            </span>
            <span className={styles.statCardLargeLabel}>
              {data.percentileLabel ?? "백분위 추정"}
            </span>
          </div>
        )}
      </div>

      {/* Growth grade comment */}
      <div className={styles.callout}>
        <div className={styles.calloutContent}>
          <span className={styles.emphasis}>발전가능성:</span>{" "}
          {data.growthComment}
        </div>
      </div>

      {/* 3 category score cards */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        역량별 점수 상세
      </div>
      <div className={styles.cardGridThree}>
        {data.scores.map((score) => (
          <div key={score.category} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                {CATEGORY_LABEL[score.category] ?? score.label}
              </div>
              <span className={styles.emphasis}>
                {score.score} / {score.maxScore}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(score.score / score.maxScore) * 100}%` }}
              />
            </div>

            {/* Subcategories */}
            {score.subcategories.map((sub) => (
              <ReportProgress
                key={sub.name}
                label={sub.name}
                value={sub.score}
                max={sub.maxScore}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Comparison (Standard+) */}
      {data.comparison && (
        <div className={`${styles.cardHighlight} ${styles.mt20}`}>
          <div className={styles.cardTitle}>점수 비교</div>
          <div className={`${styles.cardGridThree} ${styles.mt12}`}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>
                {data.comparison.myScore}
              </span>
              <span className={styles.miniStatLabel}>내 점수</span>
            </div>
            {data.comparison.targetRangeAvg !== undefined && (
              <div className={styles.miniStat}>
                <span className={styles.miniStatValue}>
                  {data.comparison.targetRangeAvg}
                </span>
                <span className={styles.miniStatLabel}>지원적정 평균</span>
              </div>
            )}
            {data.comparison.overallAvg !== undefined && (
              <div className={styles.miniStat}>
                <span className={styles.miniStatValue}>
                  {data.comparison.overallAvg}
                </span>
                <span className={styles.miniStatLabel}>전체 평균</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interpretation */}
      <div className={`${styles.aiCommentary} ${styles.mt20}`}>
        <div className={styles.aiCommentaryIcon}>AI</div>
        <div className={styles.aiCommentaryContent}>
          <div className={styles.aiCommentaryLabel}>점수 해석</div>
          <div className={styles.aiCommentaryText}>{data.interpretation}</div>
        </div>
      </div>
    </div>
  );
};
