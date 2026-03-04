import type { ActionRoadmapSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface ActionRoadmapRendererProps {
  data: ActionRoadmapSection;
  sectionNumber: number;
}

export const ActionRoadmapRenderer = ({
  data,
  sectionNumber,
}: ActionRoadmapRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="구체적인 실행 계획을 제시합니다"
      />

      {/* Completion strategy */}
      <div className={styles.cardHighlight}>
        <div className={styles.cardTitle}>생기부 마무리 전략</div>
        <p className={`${styles.body} ${styles.mt8}`}>
          {data.completionStrategy}
        </p>
      </div>

      {/* Phases as timeline */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        학기별 실행 계획
      </div>
      <div className={styles.timeline}>
        {data.phases.map((phase, idx) => (
          <div key={idx} className={styles.timelineItem}>
            <div className={styles.timelineDot}>{idx + 1}</div>
            <div className={styles.timelineContent}>
              <div className={styles.timelinePeriod}>{phase.period}</div>
              <div className={styles.cardTitle}>{phase.phase}</div>

              <div
                className={`${styles.overline} ${styles.mt12} ${styles.mb6}`}
              >
                목표
              </div>
              <ul className={`${styles.list} ${styles.mb16}`}>
                {phase.goals.map((goal, gIdx) => (
                  <li key={gIdx} className={styles.listItem}>
                    {goal}
                  </li>
                ))}
              </ul>

              <div className={`${styles.overline} ${styles.mb6}`}>
                실행 과제
              </div>
              <ol className={styles.numberedList}>
                {phase.tasks.map((task, tIdx) => (
                  <li key={tIdx} className={styles.numberedListItem}>
                    <span className={styles.numberedListNumber}>
                      {tIdx + 1}
                    </span>
                    {task}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* Prewrite proposals (Premium) */}
      {data.prewriteProposals && data.prewriteProposals.length > 0 && (
        <>
          <hr className={styles.divider} />
          <div className={`${styles.h3} ${styles.mb12}`}>
            사전 준비 활동 제안
          </div>
          {data.prewriteProposals.map((proposal, idx) => (
            <div key={idx} className={`${styles.card} ${styles.mt8}`}>
              <div className={`${styles.flexRowStart} ${styles.gap10}`}>
                <span
                  className={`${styles.sectionNumber} ${styles.sizeCircleSm}`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className={styles.body}>{proposal}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Evaluation writing guide (Premium) */}
      {data.evaluationWritingGuide && (
        <>
          <hr className={styles.divider} />
          <div className={`${styles.h3} ${styles.mb12}`}>
            세특 서술 전략 가이드
          </div>

          <div className={`${styles.overline} ${styles.mb8}`}>서술 구조</div>
          <ol className={styles.numberedList}>
            {data.evaluationWritingGuide.structure.map((item, idx) => (
              <li key={idx} className={styles.numberedListItem}>
                <span className={styles.numberedListNumber}>{idx + 1}</span>
                {item}
              </li>
            ))}
          </ol>

          <div className={`${styles.quoteBoxHighlight} ${styles.mt16}`}>
            <div className={`${styles.overline} ${styles.mb6}`}>좋은 예시</div>
            <div className={styles.quoteText}>
              {data.evaluationWritingGuide.goodExample}
            </div>
          </div>

          <div className={`${styles.quoteBox} ${styles.mt12}`}>
            <div className={`${styles.overline} ${styles.mb6}`}>
              개선이 필요한 예시
            </div>
            <div className={styles.quoteText}>
              {data.evaluationWritingGuide.badExample}
            </div>
          </div>
        </>
      )}

      {/* Interview timeline (Premium) */}
      {data.interviewTimeline && (
        <div className={`${styles.card} ${styles.mt20}`}>
          <div className={styles.cardTitle}>면접 대비 타임라인</div>
          <p className={`${styles.body} ${styles.mt8}`}>
            {data.interviewTimeline}
          </p>
        </div>
      )}
    </div>
  );
};
