import type { TopicRecommendationSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface TopicRecommendationRendererProps {
  data: TopicRecommendationSection;
  sectionNumber: number;
}

export const TopicRecommendationRenderer = ({
  data,
  sectionNumber,
}: TopicRecommendationRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="생기부와 연계할 수 있는 탐구 주제를 추천합니다"
      />

      {data.topics.map((topic, idx) => (
        <div key={idx} className={styles.cardAccent}>
          {/* Numbered header */}
          <div className={`${styles.flexRowStart} ${styles.gap14}`}>
            <span className={`${styles.sectionNumber} ${styles.sizeCircleSm}`}>
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className={styles.flexOne}>
              <div className={styles.cardTitle}>{topic.topic}</div>
              <div className={`${styles.tagGroup} ${styles.mt8}`}>
                {topic.relatedSubjects.map((subject) => (
                  <span key={subject} className={styles.tagAccent}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className={`${styles.body} ${styles.mt14}`}>{topic.description}</p>

          {/* Rationale (Standard+) */}
          {topic.rationale && (
            <div className={`${styles.callout} ${styles.mt14}`}>
              <div className={styles.calloutContent}>
                <span className={styles.emphasis}>주제 선정 이유:</span>{" "}
                {topic.rationale}
              </div>
            </div>
          )}

          {/* Existing connection (Standard+) */}
          {topic.existingConnection && (
            <div className={`${styles.cardHighlight} ${styles.mt14}`}>
              <div className={`${styles.overline} ${styles.mb6}`}>
                기존 탐구와의 연결
              </div>
              <p className={styles.body}>{topic.existingConnection}</p>
            </div>
          )}

          {/* Activity design (Premium) */}
          {topic.activityDesign && (
            <div className={styles.mt20}>
              <div className={`${styles.overline} ${styles.mb12}`}>
                활동 설계 ({topic.activityDesign.duration})
              </div>
              <ol className={styles.numberedList}>
                {topic.activityDesign.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className={styles.numberedListItem}>
                    <span className={styles.numberedListNumber}>
                      {stepIdx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className={`${styles.small} ${styles.mt8}`}>
                <span className={styles.emphasis}>예상 결과물:</span>{" "}
                {topic.activityDesign.expectedResult}
              </p>
            </div>
          )}

          {/* Sample evaluation (Premium) */}
          {topic.sampleEvaluation && (
            <div className={`${styles.quoteBox} ${styles.mt14}`}>
              <div className={styles.quoteText}>{topic.sampleEvaluation}</div>
              <div className={styles.quoteEvaluation}>세특 서술 예시</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
