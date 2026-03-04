import type { ReportMeta } from "@/libs/report/types";

import styles from "./report.module.css";

interface ReportCoverProps {
  meta: ReportMeta;
}

const PLAN_LABEL: Record<string, string> = {
  lite: "Lite",
  standard: "Standard",
  premium: "Premium",
};

export const ReportCover = ({ meta }: ReportCoverProps) => {
  const { plan, studentInfo, createdAt } = meta;
  const isPremium = plan === "premium";
  const date = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`${styles.coverPage} ${isPremium ? styles.coverPremiumAccent : ""}`}
    >
      <div className={styles.watermark}>SKYLOAD</div>

      {/* Background decorations */}
      <div className={styles.coverDecoration} />
      <div className={styles.coverDecorationSmall} />

      {/* Top section */}
      <div className={styles.coverTop}>
        <div className={styles.coverBrand}>SKYLOAD</div>

        <div className={styles.coverPlanBadge}>{PLAN_LABEL[plan]} Report</div>

        <h1
          className={`${styles.coverTitle} ${isPremium ? styles.coverPremiumTitle : ""}`}
        >
          생활기록부
          <br />
          분석 리포트
        </h1>

        <div className={styles.coverDivider} />

        <p className={styles.coverSubtitle}>
          {studentInfo.name} 학생의 생기부를 AI가 정밀 분석하여
          <br />
          맞춤형 입시 전략을 제안합니다.
        </p>
      </div>

      {/* Bottom: Student info card */}
      <div className={styles.coverStudentCard}>
        <div className={styles.coverStudentField}>
          <span className={styles.coverStudentLabel}>학생</span>
          <span className={styles.coverStudentValue}>{studentInfo.name}</span>
        </div>
        <div className={styles.coverStudentField}>
          <span className={styles.coverStudentLabel}>학년 / 계열</span>
          <span className={styles.coverStudentValue}>
            {studentInfo.grade}학년 / {studentInfo.track}
          </span>
        </div>
        {studentInfo.targetUniversity && (
          <div className={styles.coverStudentField}>
            <span className={styles.coverStudentLabel}>목표 대학</span>
            <span className={styles.coverStudentValue}>
              {studentInfo.targetUniversity} {studentInfo.targetDepartment}
            </span>
          </div>
        )}
        <div className={styles.coverStudentField}>
          <span className={styles.coverStudentLabel}>발행일</span>
          <span className={styles.coverStudentValue}>{date}</span>
        </div>
      </div>
    </div>
  );
};
