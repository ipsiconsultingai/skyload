import type {
  CompetencyEvaluationSection,
  CompetencyGrade,
} from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface CompetencyEvaluationRendererProps {
  data: CompetencyEvaluationSection;
  sectionNumber: number;
}

const CATEGORY_LABEL: Record<string, string> = {
  academic: "학업 역량",
  career: "진로 역량",
  community: "공동체 역량",
  growth: "발전 가능성",
};

const GRADE_CLASS: Record<CompetencyGrade, string> = {
  S: styles.ratingExcellent,
  A: styles.ratingGood,
  B: styles.ratingAverage,
  C: styles.ratingWeak,
  D: styles.ratingWeak,
};

export const CompetencyEvaluationRenderer = ({
  data,
  sectionNumber,
}: CompetencyEvaluationRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Strengths */}
      <div className={`${styles.h3} ${styles.mb12}`}>
        <span className={styles.textStrength}>강점 분석</span>
      </div>
      {data.strengths.map((item) => (
        <div key={item.label} className={styles.cardStrength}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{item.label}</div>
            <span className={styles.tag}>{item.competencyTag.subcategory}</span>
          </div>
          <p className={styles.body}>{item.evidence}</p>
        </div>
      ))}

      {/* Weaknesses */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        <span className={styles.textWeakness}>약점 분석</span>
      </div>
      {data.weaknesses.map((item) => (
        <div key={item.label} className={styles.cardWeakness}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{item.label}</div>
            <span className={styles.tag}>{item.competencyTag.subcategory}</span>
          </div>
          <p className={styles.body}>{item.evidence}</p>
        </div>
      ))}

      <hr className={styles.divider} />

      {/* Competency ratings */}
      <div className={`${styles.h3} ${styles.mb12}`}>역량별 등급</div>
      {data.competencyRatings.map((rating) => (
        <div key={rating.category} className={`${styles.card} ${styles.mt12}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              {CATEGORY_LABEL[rating.category] ?? rating.label}
            </div>
            <span className={GRADE_CLASS[rating.grade]}>{rating.grade}</span>
          </div>
          <p className={styles.body}>{rating.comment}</p>

          {/* Subcategories (Premium) */}
          {rating.subcategories && rating.subcategories.length > 0 && (
            <div className={styles.mt12}>
              {rating.subcategories.map((sub) => (
                <div
                  key={sub.name}
                  className={`${styles.cardNeutral} ${styles.mt8}`}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.emphasis}>{sub.name}</span>
                    <span className={GRADE_CLASS[sub.grade]}>{sub.grade}</span>
                  </div>
                  <p className={styles.small}>{sub.comment}</p>
                </div>
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
