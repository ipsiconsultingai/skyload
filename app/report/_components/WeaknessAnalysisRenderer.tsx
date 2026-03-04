import type { WeaknessAnalysisSection, Priority } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface WeaknessAnalysisRendererProps {
  data: WeaknessAnalysisSection;
  sectionNumber: number;
}

const PRIORITY_CLASS: Record<Priority, string> = {
  high: styles.tagWeakness,
  medium: styles.tagAccent,
  low: styles.tag,
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export const WeaknessAnalysisRenderer = ({
  data,
  sectionNumber,
}: WeaknessAnalysisRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="보완이 필요한 영역과 구체적 활동을 제안합니다"
      />

      {data.areas.map((area, idx) => (
        <div key={idx} className={styles.cardWeakness}>
          {/* Header with area name and priority */}
          <div className={styles.cardHeader}>
            <div className={`${styles.flexRow} ${styles.gap10}`}>
              <span className={`${styles.overline} ${styles.colorWeakness}`}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className={styles.cardTitle}>{area.area}</div>
            </div>
            {area.priority && (
              <span className={PRIORITY_CLASS[area.priority]}>
                우선순위: {PRIORITY_LABEL[area.priority]}
              </span>
            )}
          </div>

          {/* Description */}
          <p className={styles.body}>{area.description}</p>

          {/* Evidence (Standard+) */}
          {area.evidence && (
            <div className={`${styles.callout} ${styles.mt12}`}>
              <div className={styles.calloutContent}>
                <span className={styles.emphasis}>근거:</span> {area.evidence}
              </div>
            </div>
          )}

          {/* Competency tag (Standard+) */}
          {area.competencyTag && (
            <div className={`${styles.tagGroup} ${styles.mt8}`}>
              <span className={styles.tag}>
                {area.competencyTag.subcategory}
                {area.competencyTag.assessment &&
                  ` (${area.competencyTag.assessment})`}
              </span>
            </div>
          )}

          {/* Urgency & Effectiveness (Premium) */}
          {(area.urgency || area.effectiveness) && (
            <div className={`${styles.tagGroup} ${styles.mt12}`}>
              {area.urgency && (
                <span className={PRIORITY_CLASS[area.urgency]}>
                  시급도: {PRIORITY_LABEL[area.urgency]}
                </span>
              )}
              {area.effectiveness && (
                <span className={PRIORITY_CLASS[area.effectiveness]}>
                  효과도: {PRIORITY_LABEL[area.effectiveness]}
                </span>
              )}
            </div>
          )}

          {/* Suggested activities */}
          <div className={styles.mt16}>
            <div className={`${styles.overline} ${styles.mb10}`}>
              추천 보완 활동
            </div>
            <ol className={styles.numberedList}>
              {area.suggestedActivities.map((activity, actIdx) => (
                <li key={actIdx} className={styles.numberedListItem}>
                  <span className={styles.numberedListNumber}>
                    {actIdx + 1}
                  </span>
                  {activity}
                </li>
              ))}
            </ol>
          </div>

          {/* Execution strategy (Premium) */}
          {area.executionStrategy && (
            <div className={`${styles.cardHighlight} ${styles.mt16}`}>
              <div className={`${styles.overline} ${styles.mb6}`}>
                실행 전략
              </div>
              <p className={styles.body}>{area.executionStrategy}</p>
            </div>
          )}

          {/* Subject link strategy (Premium) */}
          {area.subjectLinkStrategy && (
            <div className={`${styles.cardHighlight} ${styles.mt12}`}>
              <div className={`${styles.overline} ${styles.mb6}`}>
                진로-선택과목 연계 전략
              </div>
              <p className={styles.body}>{area.subjectLinkStrategy}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
