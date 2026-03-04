import type { ActivityAnalysisSection } from "@/libs/report/types";

import { ReportBadge } from "./ReportBadge";
import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface ActivityAnalysisRendererProps {
  data: ActivityAnalysisSection;
  sectionNumber: number;
}

export const ActivityAnalysisRenderer = ({
  data,
  sectionNumber,
}: ActivityAnalysisRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Curriculum version tag */}
      <div className={styles.mb16}>
        <span className={styles.tag}>
          {data.curriculumVersion === "2015"
            ? "2015 개정 교육과정 (4영역)"
            : "2022 개정 교육과정 (3영역)"}
        </span>
      </div>

      {/* Activity type cards */}
      {data.activities.map((activity) => (
        <div
          key={activity.type}
          className={`${styles.cardAccent} ${styles.mt16}`}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{activity.type}</div>
          </div>

          {/* Yearly analysis */}
          {activity.yearlyAnalysis.map((year) => (
            <div
              key={year.year}
              className={`${styles.cardNeutral} ${styles.mt12}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.emphasis}>{year.year}학년</span>
                <ReportBadge rating={year.rating} />
              </div>
              <p className={styles.body}>{year.summary}</p>
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
            </div>
          ))}

          {/* Volume assessment */}
          {activity.volumeAssessment && (
            <p className={`${styles.small} ${styles.mt12}`}>
              <span className={styles.emphasis}>기록 분량:</span>{" "}
              {activity.volumeAssessment}
            </p>
          )}

          {/* Overall comment per activity */}
          <p className={`${styles.body} ${styles.mt12}`}>
            {activity.overallComment}
          </p>

          {/* Key activities (Standard+) */}
          {activity.keyActivities && activity.keyActivities.length > 0 && (
            <div className={styles.mt16}>
              <div className={`${styles.overline} ${styles.mb8}`}>
                핵심 활동
              </div>
              {activity.keyActivities.map((ka, idx) => (
                <div
                  key={idx}
                  className={`${styles.cardHighlight} ${styles.mt8}`}
                >
                  <div className={styles.cardTitle}>{ka.activity}</div>
                  <p className={`${styles.small} ${styles.mt6}`}>
                    {ka.evaluation}
                  </p>
                  <div className={`${styles.tagGroup} ${styles.mt8}`}>
                    {ka.competencyTags.map((tag, tagIdx) => (
                      <span key={tagIdx} className={styles.tag}>
                        {tag.subcategory}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Improvement direction (Standard+) */}
          {activity.improvementDirection && (
            <div
              className={`${styles.callout} ${styles.calloutCaution} ${styles.mt16}`}
            >
              <div className={styles.calloutContent}>
                <span className={styles.emphasis}>개선 방향:</span>{" "}
                {activity.improvementDirection}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Overall comment */}
      <div className={`${styles.aiCommentary} ${styles.mt20}`}>
        <div className={styles.aiCommentaryIcon}>AI</div>
        <div className={styles.aiCommentaryContent}>
          <div className={styles.aiCommentaryLabel}>창체 종합 평가</div>
          <div className={styles.aiCommentaryText}>{data.overallComment}</div>
        </div>
      </div>
    </div>
  );
};
