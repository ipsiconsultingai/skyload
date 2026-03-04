import type {
  SubjectAnalysisItem,
  SubjectAnalysisSection,
  SubjectRating,
} from "@/libs/report/types";

import { ReportBadge } from "./ReportBadge";
import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface SubjectAnalysisRendererProps {
  data: SubjectAnalysisSection;
  sectionNumber: number;
}

const HIGHLIGHT_CLASS: Record<string, string> = {
  positive: styles.quoteBoxHighlight,
  negative: styles.quoteBoxImprove,
  neutral: styles.quoteBox,
};

const SubjectCard = ({ subject }: { subject: SubjectAnalysisItem }) => {
  return (
    <div className={`${styles.card} ${styles.mt16}`}>
      {/* Header: name, year, rating */}
      <div className={styles.cardHeader}>
        <div className={`${styles.flexRow} ${styles.gap10}`}>
          <div className={styles.cardTitle}>{subject.subjectName}</div>
          <span className={styles.tag}>{subject.year}학년</span>
          <ReportBadge rating={subject.rating} />
        </div>
        {subject.importancePercent !== undefined && (
          <span className={styles.emphasis}>{subject.importancePercent}%</span>
        )}
      </div>

      {/* Competency tags */}
      {subject.competencyTags.length > 0 && (
        <div className={`${styles.tagGroup} ${styles.mt8}`}>
          {subject.competencyTags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag.subcategory}
              {tag.assessment && ` (${tag.assessment})`}
            </span>
          ))}
        </div>
      )}

      {/* Activity summary */}
      <p className={`${styles.body} ${styles.mt12}`}>
        {subject.activitySummary}
      </p>

      {/* Evaluation comment */}
      <p className={`${styles.small} ${styles.mt8}`}>
        {subject.evaluationComment}
      </p>

      {/* Key quotes (Standard+) */}
      {subject.keyQuotes && subject.keyQuotes.length > 0 && (
        <div className={styles.mt12}>
          <div className={`${styles.overline} ${styles.mb8}`}>핵심 인용</div>
          {subject.keyQuotes.map((quote, idx) => (
            <div key={idx} className={styles.quoteBox}>
              <div className={styles.quoteText}>{quote}</div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed evaluation (Standard+) */}
      {subject.detailedEvaluation && (
        <div className={`${styles.aiCommentary} ${styles.mt12}`}>
          <div className={styles.aiCommentaryIcon}>AI</div>
          <div className={styles.aiCommentaryContent}>
            <div className={styles.aiCommentaryLabel}>상세 평가</div>
            <div className={styles.aiCommentaryText}>
              {subject.detailedEvaluation}
            </div>
          </div>
        </div>
      )}

      {/* Improvement direction (Standard+) */}
      {subject.improvementDirection && (
        <div
          className={`${styles.callout} ${styles.calloutCaution} ${styles.mt12}`}
        >
          <div className={styles.calloutContent}>
            <span className={styles.emphasis}>개선 방향:</span>{" "}
            {subject.improvementDirection}
          </div>
        </div>
      )}

      {/* Improvement example (Standard+) */}
      {subject.improvementExample && (
        <div className={`${styles.quoteBox} ${styles.mt8}`}>
          <div className={styles.quoteText}>{subject.improvementExample}</div>
          <div className={styles.quoteEvaluation}>개선 예시 문장</div>
        </div>
      )}

      {/* Cross-subject connections (Standard+) */}
      {subject.crossSubjectConnections &&
        subject.crossSubjectConnections.length > 0 && (
          <div className={styles.mt12}>
            <div className={`${styles.overline} ${styles.mb8}`}>
              교과 간 연결
            </div>
            {subject.crossSubjectConnections.map((conn, idx) => (
              <div key={idx} className={`${styles.cardNeutral} ${styles.mt8}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.emphasis}>{conn.targetSubject}</span>
                  <span className={styles.tag}>{conn.connectionType}</span>
                </div>
                <p className={styles.small}>{conn.description}</p>
              </div>
            ))}
          </div>
        )}

      {/* Sentence analysis (Premium) */}
      {subject.sentenceAnalysis && subject.sentenceAnalysis.length > 0 && (
        <div className={styles.mt16}>
          <div className={`${styles.overline} ${styles.mb8}`}>
            문장 단위 분석
          </div>
          {subject.sentenceAnalysis.map((sa, idx) => (
            <div
              key={idx}
              className={`${HIGHLIGHT_CLASS[sa.highlight] ?? styles.quoteBox} ${styles.mt8}`}
            >
              <div className={styles.quoteText}>{sa.sentence}</div>
              <div className={styles.quoteEvaluation}>{sa.evaluation}</div>
              {sa.improvementSuggestion && (
                <p className={`${styles.small} ${styles.mt6}`}>
                  <span className={styles.emphasis}>개선:</span>{" "}
                  {sa.improvementSuggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Evaluation impact (Premium) */}
      {subject.evaluationImpact && (
        <p className={`${styles.small} ${styles.mt8}`}>
          <span className={styles.emphasis}>평가 영향도:</span>{" "}
          {subject.evaluationImpact === "high"
            ? "높음"
            : subject.evaluationImpact === "medium"
              ? "보통"
              : "낮음"}
        </p>
      )}
    </div>
  );
};

const RATING_ORDER: Record<SubjectRating, number> = {
  excellent: 0,
  good: 1,
  average: 2,
  weak: 3,
};

export const SubjectAnalysisRenderer = ({
  data,
  sectionNumber,
}: SubjectAnalysisRendererProps) => {
  const sortedSubjects = [...data.subjects].sort(
    (a, b) => RATING_ORDER[a.rating] - RATING_ORDER[b.rating]
  );

  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Summary table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>과목</th>
            <th className={styles.tableAlignCenter}>학년</th>
            <th className={styles.tableAlignCenter}>평가</th>
          </tr>
        </thead>
        <tbody>
          {sortedSubjects.map((subject) => (
            <tr key={`${subject.subjectName}-${subject.year}`}>
              <td className={styles.tableCellBold}>{subject.subjectName}</td>
              <td className={styles.tableAlignCenter}>{subject.year}학년</td>
              <td className={styles.tableAlignCenter}>
                <ReportBadge rating={subject.rating} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className={styles.divider} />

      {/* Individual subject detail cards */}
      {sortedSubjects.map((subject) => (
        <SubjectCard
          key={`${subject.subjectName}-${subject.year}`}
          subject={subject}
        />
      ))}
    </div>
  );
};
