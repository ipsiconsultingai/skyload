import type { AdmissionStrategySection } from "@/libs/report/types";

import { ReportBadge } from "./ReportBadge";
import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface AdmissionStrategyRendererProps {
  data: AdmissionStrategySection;
  sectionNumber: number;
}

const SUITABILITY_CLASS: Record<string, string> = {
  적합: styles.ratingExcellent,
  보통: styles.ratingAverage,
  부적합: styles.ratingWeak,
};

export const AdmissionStrategyRenderer = ({
  data,
  sectionNumber,
}: AdmissionStrategyRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="입시 전략과 대학 추천을 종합적으로 분석합니다"
      />

      {/* Recommended path */}
      <div className={styles.cardHighlight}>
        <div className={styles.cardTitle}>추천 입시 경로</div>
        <p className={`${styles.body} ${styles.mt8}`}>{data.recommendedPath}</p>
      </div>

      {/* Recommendations table */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        추천 대학
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>대학</th>
            <th>학과</th>
            <th>전형</th>
            <th className={styles.tableAlignCenter}>지원 전략</th>
            {data.recommendations.some((r) => r.chance) && (
              <th className={styles.tableAlignCenter}>합격 가능성</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.recommendations.map((rec, idx) => (
            <tr key={idx}>
              <td className={styles.tableCellBold}>{rec.university}</td>
              <td>{rec.department}</td>
              <td>{rec.admissionType}</td>
              <td className={styles.tableAlignCenter}>
                <ReportBadge strategy={rec.tier} />
              </td>
              {data.recommendations.some((r) => r.chance) && (
                <td className={styles.tableAlignCenter}>
                  {rec.chance && <ReportBadge chance={rec.chance} />}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chance rationale details */}
      {data.recommendations.some((r) => r.chanceRationale) && (
        <div className={styles.mt16}>
          {data.recommendations
            .filter((r) => r.chanceRationale)
            .map((rec, idx) => (
              <div key={idx} className={`${styles.cardNeutral} ${styles.mt8}`}>
                <div className={styles.emphasis}>
                  {rec.university} {rec.department}
                </div>
                <p className={`${styles.small} ${styles.mt4}`}>
                  {rec.chanceRationale}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Type strategies (Standard+) */}
      {data.typeStrategies && data.typeStrategies.length > 0 && (
        <>
          <hr className={styles.divider} />
          <div className={`${styles.h3} ${styles.mb12}`}>전형별 전략</div>
          <div className={styles.cardGrid}>
            {data.typeStrategies.map((ts) => (
              <div key={ts.type} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{ts.type}</div>
                  <span className={SUITABILITY_CLASS[ts.suitability]}>
                    {ts.suitability}
                  </span>
                </div>
                <p className={`${styles.body} ${styles.mt8}`}>{ts.analysis}</p>
                <p className={`${styles.small} ${styles.mt8}`}>
                  <span className={styles.emphasis}>판단 근거:</span>{" "}
                  {ts.reason}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* School type analysis (Standard+) */}
      {data.schoolTypeAnalysis && (
        <div className={`${styles.card} ${styles.mt20}`}>
          <div className={styles.cardTitle}>학교 유형 분석</div>
          <p className={`${styles.body} ${styles.mt8}`}>
            {data.schoolTypeAnalysis.rationale}
          </p>
          {data.schoolTypeAnalysis.advantageTypes.length > 0 && (
            <div className={`${styles.tagGroup} ${styles.mt8}`}>
              {data.schoolTypeAnalysis.advantageTypes.map((t) => (
                <span key={t} className={styles.tagStrength}>
                  {t}
                </span>
              ))}
            </div>
          )}
          {data.schoolTypeAnalysis.cautionTypes.length > 0 && (
            <div className={`${styles.tagGroup} ${styles.mt8}`}>
              {data.schoolTypeAnalysis.cautionTypes.map((t) => (
                <span key={t} className={styles.tagWeakness}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CSat minimum strategy (Premium) */}
      {data.csatMinimumStrategy && (
        <div className={`${styles.card} ${styles.mt16}`}>
          <div className={styles.cardTitle}>수능 최저 전략</div>
          <p className={`${styles.body} ${styles.mt8}`}>
            {data.csatMinimumStrategy}
          </p>
        </div>
      )}

      {/* Application simulation (Premium) */}
      {data.applicationSimulation && (
        <div className={`${styles.cardAccent} ${styles.mt16}`}>
          <div className={styles.cardTitle}>지원 조합 시뮬레이션</div>
          <p className={`${styles.body} ${styles.mt8}`}>
            {data.applicationSimulation.description}
          </p>
          <table className={`${styles.compactTable} ${styles.mt12}`}>
            <thead>
              <tr>
                <th>전형</th>
                <th className={styles.tableAlignCenter}>지원 수</th>
                <th>목표 대학</th>
              </tr>
            </thead>
            <tbody>
              {data.applicationSimulation.details.map((detail, idx) => (
                <tr key={idx}>
                  <td className={styles.tableCellBold}>
                    {detail.admissionType}
                  </td>
                  <td className={styles.tableAlignCenter}>{detail.count}</td>
                  <td>{detail.targetUniversities.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* University guide matching (Premium) */}
      {data.universityGuideMatching &&
        data.universityGuideMatching.length > 0 && (
          <>
            <hr className={styles.divider} />
            <div className={`${styles.h3} ${styles.mb12}`}>
              대학별 인재상 매칭
            </div>
            {data.universityGuideMatching.map((match, idx) => (
              <div key={idx} className={`${styles.card} ${styles.mt8}`}>
                <div className={styles.cardTitle}>{match.university}</div>
                <div className={`${styles.tagGroup} ${styles.mt8}`}>
                  {match.emphasisKeywords.map((kw) => (
                    <span key={kw} className={styles.tagAccent}>
                      {kw}
                    </span>
                  ))}
                </div>
                {match.studentStrengthMatch.length > 0 && (
                  <div className={styles.mt8}>
                    <span className={styles.overline}>강점 매칭</span>
                    <div className={`${styles.tagGroup} ${styles.mt4}`}>
                      {match.studentStrengthMatch.map((s) => (
                        <span key={s} className={styles.tagStrength}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {match.studentWeaknessMatch.length > 0 && (
                  <div className={styles.mt8}>
                    <span className={styles.overline}>보완 필요</span>
                    <div className={`${styles.tagGroup} ${styles.mt4}`}>
                      {match.studentWeaknessMatch.map((w) => (
                        <span key={w} className={styles.tagWeakness}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
    </div>
  );
};
