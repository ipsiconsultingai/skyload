/** Call B: 성적 맥락 분석 (내부용) */

export interface AcademicContextAnalysisInput {
  preprocessedAcademicData: string;
  rawAcademicData: string;
  studentProfile: string;
}

export const buildAcademicContextAnalysisPrompt = (
  input: AcademicContextAnalysisInput
): string => {
  return `당신은 고등학교 교과 성적 데이터를 해석하는 입시 전문가입니다.

## 작업
아래 성적 분석 결과(코드에서 사전 계산됨)를 바탕으로 학생의 성적 특성을 해석하세요.

## 중요: 수치 계산 금지
- 아래 제공된 수치(평균 등급, Z-score, 백분위 등)는 이미 코드에서 정확히 계산된 값입니다.
- 이 수치를 그대로 인용하여 해석에 활용하세요.
- 절대로 수치를 직접 계산하거나 재계산하지 마세요.

## 해석 항목
1. **등급 추이 해석**: 학년별 등급 변화의 의미 (상승이면 왜 긍정적인지, 하락이면 어떤 리스크인지)
2. **과목별 실질 위치 해석**: Z-score와 수강자수를 종합한 각 과목의 실질 경쟁력 분석
3. **과목 간 편차 해석**: 학종에서의 리스크 + 편차가 큰 이유 추론
4. **전공 관련 교과 해석**: 전공 관련 과목 성적이 전체 대비 어떤 의미인지
5. **고교 유형 환산 해석**: 환산 등급이 의미하는 대학 경쟁력
6. **진로선택과목 해석**: 성취도 분포 기반 실질 위치 분석

## 성적 해석 기준
| 조합 | 해석 |
|------|------|
| 표준편차 크고 + 원점수 높음 | 어려운 시험에서 우수 -> 높은 평가 |
| 표준편차 작고 + 원점수 높음 | 쉬운 시험 -> 높은 등급이어도 변별력 낮음 |
| 수강자수 많고 + 등급 높음 | 큰 경쟁에서의 성과 -> 높은 평가 |
| 수강자수 적고 + 등급 높음 | 경쟁 구조 제한 -> 맥락적 해석 필요 |

## 코드 전처리 결과 (계산 완료)
${input.preprocessedAcademicData}

## 교과 성적 원데이터 (참조용)
${input.rawAcademicData}

## 학생 프로필
${input.studentProfile}`;
};

export interface AcademicContextAnalysisOutput {
  gradeTrendInterpretation: string;
  subjectInterpretations: {
    subject: string;
    year: number;
    semester: number;
    interpretation: string;
    competitiveness: "high" | "medium" | "low";
  }[];
  varianceInterpretation: {
    riskLevel: "high" | "medium" | "low";
    analysis: string;
    recommendation: string;
  };
  majorRelevanceInterpretation: {
    comparison: string;
    strengths: string[];
    weaknesses: string[];
  };
  convertedGradeInterpretation: {
    universityLine: string;
    competitivenessAnalysis: string;
  };
  careerSubjectInterpretations: {
    subject: string;
    interpretation: string;
  }[];
  overallAssessment: string;
}
