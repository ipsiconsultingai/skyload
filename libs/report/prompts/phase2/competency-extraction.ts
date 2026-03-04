/** Call A: 역량 추출 (내부용) */

export interface CompetencyExtractionInput {
  studentProfile: string;
  recordData: string;
}

export const buildCompetencyExtractionPrompt = (
  input: CompetencyExtractionInput
): string => {
  return `당신은 생기부에서 4대 평가 역량의 증거를 추출하는 분석가입니다.

## 작업
아래 생기부 데이터에서 학업역량, 진로역량, 공동체역량, 발전가능성의 증거를 체계적으로 추출하세요.

## 규칙
1. 각 증거는 반드시 원문 인용과 함께 기록합니다.
2. 인용의 출처(학년, 과목명 또는 활동 영역)를 명시합니다.
3. 긍정적 증거와 부정적 증거(약점)를 모두 추출합니다.
4. 형식적 표현("적극적으로 참여함" 등)은 약점으로 분류합니다.
5. 과목 간/학년 간 연결되는 탐구 주제가 있으면 별도로 식별합니다.

## 학생 프로필
${input.studentProfile}

## 생기부 데이터
${input.recordData}`;
};

/**
 * Call A 출력 스키마 (Gemini responseSchema용)
 * 실제 Schema 객체는 schemas/phase2-schemas.ts에서 정의
 */
export interface CompetencyExtractionOutput {
  academic: {
    achievement: EvidenceItem[];
    attitude: EvidenceItem[];
    inquiry: EvidenceItem[];
  };
  career: {
    courseEffort: EvidenceItem[];
    courseAchievement: EvidenceItem[];
    exploration: EvidenceItem[];
  };
  community: {
    caring: EvidenceItem[];
    collaboration: EvidenceItem[];
    leadership: EvidenceItem[];
    integrity: EvidenceItem[];
  };
  growth: {
    selfDirected: EvidenceItem[];
    diversity: EvidenceItem[];
    progression: EvidenceItem[];
    creativeProblemSolving: EvidenceItem[];
  };
  crossSubjectConnections: CrossSubjectConnection[];
  formalExpressions: FormalExpression[];
}

interface EvidenceItem {
  evidence: string;
  source: string;
  sentiment: "positive" | "negative";
}

interface CrossSubjectConnection {
  theme: string;
  subjects: string[];
  gradeProgression: string;
  depthAssessment: "deepening" | "maintaining" | "superficial";
}

interface FormalExpression {
  expression: string;
  source: string;
  issue: string;
}
