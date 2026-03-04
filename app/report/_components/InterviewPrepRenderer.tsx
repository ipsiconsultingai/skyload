import type { InterviewPrepSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface InterviewPrepRendererProps {
  data: InterviewPrepSection;
  sectionNumber: number;
}

export const InterviewPrepRenderer = ({
  data,
  sectionNumber,
}: InterviewPrepRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="면접에서 예상되는 질문과 대비 전략을 제시합니다"
      />

      {data.questions.map((q, idx) => (
        <div key={idx} className={styles.interviewCard}>
          <div className={styles.interviewNumber}>{idx + 1}</div>
          {q.questionType && (
            <span className={styles.interviewTag}>{q.questionType}</span>
          )}
          <div className={styles.interviewQuestion}>{q.question}</div>
          {q.intent && <div className={styles.interviewHint}>{q.intent}</div>}

          {/* Answer strategy (Premium) */}
          {q.answerStrategy && (
            <div className={`${styles.callout} ${styles.mt12}`}>
              <div className={styles.calloutContent}>
                <span className={styles.emphasis}>답변 전략:</span>{" "}
                {q.answerStrategy}
              </div>
            </div>
          )}

          {/* Sample answer (Premium) */}
          {q.sampleAnswer && (
            <div className={`${styles.quoteBox} ${styles.mt12}`}>
              <div className={styles.quoteText}>{q.sampleAnswer}</div>
              <div className={styles.quoteEvaluation}>모범 답변 가이드</div>
            </div>
          )}

          {/* Follow-up questions (Premium) */}
          {q.followUpQuestions && q.followUpQuestions.length > 0 && (
            <div className={styles.mt16}>
              <div className={`${styles.overline} ${styles.mb8}`}>
                예상 꼬리질문
              </div>
              {q.followUpQuestions.map((fq, fqIdx) => (
                <div
                  key={fqIdx}
                  className={`${styles.cardNeutral} ${styles.mt8}`}
                >
                  <div className={styles.emphasis}>{fq.question}</div>
                  <p className={`${styles.small} ${styles.mt4}`}>
                    {fq.context}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
