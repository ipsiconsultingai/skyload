import { Check, X } from "lucide-react";

import { FadeIn } from "../../_components/FadeIn";
import styles from "./ComparisonTable.module.css";

type FeatureValue = boolean | string;

interface ComparisonFeature {
  name: string;
  lite: FeatureValue;
  standard: FeatureValue;
  premium: FeatureValue;
}

const FEATURES: ComparisonFeature[] = [
  {
    name: "리포트 분량",
    lite: "10~12p",
    standard: "15~18p",
    premium: "20~25p",
  },
  { name: "전체 요약 분석", lite: true, standard: true, premium: true },
  { name: "세특 분석", lite: "기본", standard: "상세", premium: "문장 단위" },
  { name: "보완 활동 추천", lite: true, standard: true, premium: true },
  {
    name: "탐구 주제 추천",
    lite: true,
    standard: true,
    premium: "+ 활동 설계",
  },
  {
    name: "면접 질문",
    lite: "8~10개",
    standard: "8~10개",
    premium: "+ 모범 답변",
  },
  {
    name: "내신 + 모의고사 분석",
    lite: true,
    standard: true,
    premium: true,
  },
  { name: "대학 지원 조합", lite: true, standard: true, premium: true },
  { name: "등급 변화 가능성", lite: false, standard: true, premium: true },
  { name: "합격 가능성 분석", lite: false, standard: true, premium: true },
  {
    name: "지원 전략 (상향/안정/하향)",
    lite: false,
    standard: true,
    premium: true,
  },
  {
    name: "생기부 스토리 분석",
    lite: false,
    standard: false,
    premium: true,
  },
  { name: "컨설팅급 보완 전략", lite: false, standard: false, premium: true },
  {
    name: "중요도 % + 평가 영향도",
    lite: false,
    standard: false,
    premium: true,
  },
  { name: "실행 로드맵", lite: false, standard: false, premium: true },
  {
    name: "전임 컨설턴트 검수",
    lite: true,
    standard: true,
    premium: true,
  },
];

const CellValue = ({ value }: { value: FeatureValue }) => {
  if (typeof value === "string") {
    return <span className={styles.cellText}>{value}</span>;
  }
  if (value) {
    return (
      <Check
        size={18}
        className={`${styles.cellIcon} ${styles.cellIconSuccess}`}
      />
    );
  }
  return (
    <X
      size={18}
      className={`${styles.cellIcon} ${styles.cellIconMuted}`}
    />
  );
};

export const ComparisonTable = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <p className={styles.sectionLabel}>Compare</p>
          <h2 className={styles.sectionTitle}>플랜별 상세 비교</h2>
          <p className={styles.sectionSubtitle}>
            어떤 차이가 있는지 한눈에 확인하세요
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerFeature}>기능</th>
                  <th className={styles.headerPlan}>Lite</th>
                  <th className={`${styles.headerPlan} ${styles.headerPopular}`}>
                    Standard
                  </th>
                  <th className={styles.headerPlan}>Premium</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature) => (
                  <tr key={feature.name} className={styles.row}>
                    <td className={styles.featureCell}>{feature.name}</td>
                    <td className={styles.valueCell}>
                      <CellValue value={feature.lite} />
                    </td>
                    <td
                      className={`${styles.valueCell} ${styles.valueCellPopular}`}
                    >
                      <CellValue value={feature.standard} />
                    </td>
                    <td className={styles.valueCell}>
                      <CellValue value={feature.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
