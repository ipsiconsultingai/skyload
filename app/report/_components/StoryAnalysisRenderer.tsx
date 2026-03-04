import type {
  CompetencyGrade,
  StoryAnalysisSection,
} from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface StoryAnalysisRendererProps {
  data: StoryAnalysisSection;
  sectionNumber: number;
}

const GRADE_BADGE: Record<CompetencyGrade, string> = {
  S: styles.ratingExcellent,
  A: styles.ratingGood,
  B: styles.ratingAverage,
  C: styles.ratingWeak,
  D: styles.ratingWeak,
};

const GRADE_LABEL: Record<CompetencyGrade, string> = {
  S: "매우 우수",
  A: "우수",
  B: "보통",
  C: "미흡",
  D: "부족",
};

const DEPTH_CLASS: Record<string, string> = {
  심화: styles.tagStrength,
  확장: styles.tagAccent,
  반복: styles.tag,
  무관: styles.tagWeakness,
};

export const StoryAnalysisRenderer = ({
  data,
  sectionNumber,
}: StoryAnalysisRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="생기부 전체의 스토리 구조를 분석합니다"
      />

      {/* Main storyline */}
      <div className={styles.cardHighlight}>
        <div className={styles.cardTitle}>메인 스토리라인</div>
        <p className={`${styles.body} ${styles.mt8}`}>{data.mainStoryline}</p>
      </div>

      {/* Year progressions as timeline */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        학년별 심화 흐름
      </div>
      <div className={styles.timeline}>
        {data.yearProgressions.map((yp, idx) => (
          <div key={idx} className={styles.timelineItem}>
            <div className={styles.timelineDot}>{yp.year}</div>
            <div className={styles.timelineContent}>
              <div className={styles.timelinePeriod}>{yp.year}학년</div>
              <div className={styles.cardTitle}>{yp.theme}</div>
              <p className={`${styles.body} ${styles.mt8}`}>{yp.description}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* Career consistency grade */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>진로 일관성</div>
          <span className={GRADE_BADGE[data.careerConsistencyGrade]}>
            {GRADE_LABEL[data.careerConsistencyGrade]}
          </span>
        </div>
        <p className={`${styles.body} ${styles.mt8}`}>
          {data.careerConsistencyComment}
        </p>
      </div>

      {/* Cross-subject links (Premium) */}
      {data.crossSubjectLinks && data.crossSubjectLinks.length > 0 && (
        <>
          <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
            과목 간 연결
          </div>
          <div className={styles.cardGrid}>
            {data.crossSubjectLinks.map((link, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.emphasis}>
                    {link.from} → {link.to}
                  </div>
                  <span className={DEPTH_CLASS[link.depth]}>{link.depth}</span>
                </div>
                <p className={`${styles.small} ${styles.mt8}`}>{link.topic}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Story enhancement suggestions (Premium) */}
      {data.storyEnhancementSuggestions &&
        data.storyEnhancementSuggestions.length > 0 && (
          <div className={styles.mt20}>
            <div className={`${styles.h3} ${styles.mb12}`}>
              스토리 강화 제안
            </div>
            <ol className={styles.numberedList}>
              {data.storyEnhancementSuggestions.map((suggestion, idx) => (
                <li key={idx} className={styles.numberedListItem}>
                  <span className={styles.numberedListNumber}>{idx + 1}</span>
                  {suggestion}
                </li>
              ))}
            </ol>
          </div>
        )}

      {/* Interview story guide (Premium) */}
      {data.interviewStoryGuide && (
        <div className={`${styles.aiCommentary} ${styles.mt20}`}>
          <div className={styles.aiCommentaryIcon}>AI</div>
          <div className={styles.aiCommentaryContent}>
            <div className={styles.aiCommentaryLabel}>
              면접 스토리텔링 가이드
            </div>
            <div className={styles.aiCommentaryText}>
              {data.interviewStoryGuide}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
