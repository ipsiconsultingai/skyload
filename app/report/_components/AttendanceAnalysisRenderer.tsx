import type { AttendanceAnalysisSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface AttendanceAnalysisRendererProps {
  data: AttendanceAnalysisSection;
  sectionNumber: number;
}

const RATING_CLASS: Record<string, string> = {
  "\uC6B0\uC218": styles.ratingExcellent,
  "\uC591\uD638": styles.ratingGood,
  "\uC8FC\uC758": styles.ratingAverage,
  "\uACBD\uACE0": styles.ratingWeak,
};

export const AttendanceAnalysisRenderer = ({
  data,
  sectionNumber,
}: AttendanceAnalysisRendererProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Overall rating badge */}
      <div className={styles.cardAccent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>출결 종합 평가</div>
          <span className={RATING_CLASS[data.overallRating]}>
            {data.overallRating}
          </span>
        </div>
      </div>

      {/* Summary by year table */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        학년별 출결 현황
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>학년</th>
            <th className={styles.tableAlignCenter}>총 결석</th>
            <th className={styles.tableAlignCenter}>질병</th>
            <th className={styles.tableAlignCenter}>미인정</th>
            <th className={styles.tableAlignCenter}>기타</th>
            <th className={styles.tableAlignCenter}>지각</th>
            <th className={styles.tableAlignCenter}>조퇴</th>
          </tr>
        </thead>
        <tbody>
          {data.summaryByYear.map((row) => (
            <tr key={row.year}>
              <td className={styles.tableCellBold}>{row.year}학년</td>
              <td className={styles.tableAlignCenter}>{row.totalAbsence}</td>
              <td className={styles.tableAlignCenter}>{row.illness}</td>
              <td className={styles.tableAlignCenter}>{row.unauthorized}</td>
              <td className={styles.tableAlignCenter}>{row.etc}</td>
              <td className={styles.tableAlignCenter}>{row.lateness}</td>
              <td className={styles.tableAlignCenter}>{row.earlyLeave}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Impact analysis and integrity contribution */}
      <div className={`${styles.card} ${styles.mt20}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>출결 영향 분석</div>
        </div>
        <p className={`${styles.body} ${styles.mt8}`}>
          <span className={styles.emphasis}>입시 영향:</span>{" "}
          {data.impactAnalysis}
        </p>
        <p className={`${styles.body} ${styles.mt8}`}>
          <span className={styles.emphasis}>성실성 기여:</span>{" "}
          {data.integrityContribution}
        </p>
      </div>

      {/* Improvement advice (Standard+, only when needed) */}
      {data.improvementAdvice && (
        <div
          className={`${styles.callout} ${styles.calloutCaution} ${styles.mt16}`}
        >
          <div className={styles.calloutContent}>
            <span className={styles.emphasis}>개선 방향:</span>{" "}
            {data.improvementAdvice}
          </div>
        </div>
      )}
    </div>
  );
};
