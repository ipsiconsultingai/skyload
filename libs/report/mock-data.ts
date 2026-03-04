// ============================================================
// 리포트 Mock 데이터 (v3)
//
// 학생: 김민수, 고2, 이과, 일반고, 목표: 서울대 컴퓨터공학과
// 3개 플랜별 완전한 mock 데이터 제공
// ============================================================

import type {
  ReportContent,
  StudentProfileSection,
  CompetencyScoreSection,
  AdmissionPredictionSection,
  DiagnosticSection,
  CompetencyEvaluationSection,
  AcademicAnalysisSection,
  CourseAlignmentSection,
  AttendanceAnalysisSection,
  ActivityAnalysisSection,
  SubjectAnalysisSection,
  BehaviorAnalysisSection,
  OverallAssessmentSection,
  WeaknessAnalysisSection,
  TopicRecommendationSection,
  InterviewPrepSection,
  AdmissionStrategySection,
  StoryAnalysisSection,
  ActionRoadmapSection,
  BookRecommendationSection,
  MajorExplorationSection,
  WordCloudSection,
  ReportMeta,
} from "./types";

// ============================================================
// 공통 메타 정보
// ============================================================

const BASE_STUDENT_INFO = {
  name: "김민수",
  grade: 2 as const,
  track: "이과" as const,
  schoolType: "일반고" as const,
  targetUniversity: "서울대학교",
  targetDepartment: "컴퓨터공학과",
  hasMockExamData: true,
};

// ============================================================
// Part 1: 진단
// ============================================================

// ─── 섹션 1: 학생 프로필 ───

const studentProfile: StudentProfileSection = {
  sectionId: "studentProfile",
  title: "학생 프로필",
  typeName: "논리형 탐구러",
  typeDescription:
    "수학적 사고력과 알고리즘 설계 역량이 뛰어나며, 문제 해결 과정에서 체계적이고 분석적인 접근을 선호하는 학생입니다. 코딩과 수학을 접목한 융합 탐구에 강점을 보입니다.",
  radarChart: {
    academic: 82,
    career: 78,
    community: 65,
    growth: 75,
  },
  tags: ["알고리즘", "수학적 사고", "자기주도 탐구", "코딩 역량"],
  catchPhrase: "코드로 문제를 풀고, 수학으로 세상을 설계하는 논리형 탐구러",
};

// ─── 섹션 2: 역량 정량 스코어 ───

const competencyScoreLite: CompetencyScoreSection = {
  sectionId: "competencyScore",
  title: "역량 정량 스코어",
  totalScore: 225,
  growthGrade: "B",
  growthComment:
    "1학년 대비 2학년에서 전공 관련 교과 성적과 탐구 활동이 눈에 띄게 성장하였으며, 자기주도적 학습 태도가 형성되고 있습니다.",
  scores: [
    {
      category: "academic",
      label: "학업 역량",
      score: 82,
      maxScore: 100,
      subcategories: [
        {
          name: "교과 성취도",
          score: 85,
          maxScore: 100,
          comment: "주요 교과 평균 2.1등급으로 상위권 유지",
        },
        {
          name: "탐구 역량",
          score: 78,
          maxScore: 100,
          comment:
            "정보 교과에서 독립적 프로젝트 수행 경험이 있으나 깊이 보완 필요",
        },
        {
          name: "세특 충실도",
          score: 80,
          maxScore: 100,
          comment:
            "전공 관련 교과 세특은 우수하나, 비전공 교과 서술이 다소 평이함",
        },
      ],
    },
    {
      category: "career",
      label: "진로 역량",
      score: 78,
      maxScore: 100,
      subcategories: [
        {
          name: "전공 적합성",
          score: 82,
          maxScore: 100,
          comment:
            "컴퓨터공학 관련 활동(코딩, 알고리즘 대회)이 일관되게 기록됨",
        },
        {
          name: "진로 탐색 활동",
          score: 75,
          maxScore: 100,
          comment:
            "동아리와 세특을 통한 진로 탐색은 있으나 외부 활동 연계가 부족",
        },
        {
          name: "진로 일관성",
          score: 78,
          maxScore: 100,
          comment: "1학년부터 IT 분야에 대한 관심이 꾸준히 드러나고 있음",
        },
      ],
    },
    {
      category: "community",
      label: "공동체 역량",
      score: 65,
      maxScore: 100,
      subcategories: [
        {
          name: "리더십",
          score: 60,
          maxScore: 100,
          comment: "소규모 프로젝트 리더 경험은 있으나 공식적 리더 역할 부족",
        },
        {
          name: "협업 능력",
          score: 68,
          maxScore: 100,
          comment:
            "팀 프로젝트에서 기술적 역할을 주로 담당하며 조율 역할은 제한적",
        },
        {
          name: "봉사 및 나눔",
          score: 62,
          maxScore: 100,
          comment: "진로 연계 봉사 경험이 부족하여 인성 영역 보완이 필요",
        },
      ],
    },
  ],
  interpretation:
    "학업 역량과 진로 역량에서 강점을 보이나, 공동체 역량이 상대적으로 약합니다. 리더십과 봉사 활동을 통해 균형 잡힌 역량 프로필을 만들 필요가 있습니다.",
};

const competencyScoreStandard: CompetencyScoreSection = {
  ...competencyScoreLite,
  percentile: 78,
  percentileLabel: "상위 22%",
  comparison: {
    myScore: 225,
    targetRangeAvg: 250,
    overallAvg: 195,
  },
};

// ─── 섹션 3: 합격 예측 ───

const admissionPredictionLite: AdmissionPredictionSection = {
  sectionId: "admissionPrediction",
  title: "합격 예측",
  recommendedType: "학종",
  recommendedTypeReason:
    "컴퓨터공학 관련 세특 활동과 탐구 경험이 풍부하여 학생부종합전형에서 전공 적합성을 어필할 수 있습니다. 내신 2.1등급으로 교과전형 상위권 대학 지원은 다소 어려우나, 활동 기반 평가에서 강점을 발휘할 수 있습니다.",
  predictions: [
    {
      admissionType: "학종",
      passRateLabel: "55~65%",
      passRateRange: [55, 65],
      analysis:
        "세특 활동의 전공 적합성이 높고 탐구 역량이 우수하여 학종에서 경쟁력이 있으나, 공동체 역량 보완이 필요합니다.",
    },
    {
      admissionType: "교과",
      passRateLabel: "30~40%",
      passRateRange: [30, 40],
      analysis:
        "내신 2.1등급은 서울대 교과전형 합격선(1.5등급 이내)에 미달하여 교과전형으로의 지원은 권장하지 않습니다.",
    },
    {
      admissionType: "정시",
      passRateLabel: "40~50%",
      passRateRange: [40, 50],
      analysis:
        "모의고사 성적이 양호하나, 수능 변동성을 고려하면 정시는 보조 전략으로 활용하는 것이 적절합니다.",
    },
  ],
  overallComment:
    "학생부종합전형을 주력으로 준비하되, 3학년 1학기 세특 보강과 공동체 활동 강화에 집중하면 합격 가능성을 높일 수 있습니다.",
};

const admissionPredictionStandard: AdmissionPredictionSection = {
  ...admissionPredictionLite,
  predictions: admissionPredictionLite.predictions.map((p) => ({
    ...p,
    universityPredictions:
      p.admissionType === "학종"
        ? [
            {
              university: "서울대학교",
              department: "컴퓨터공학과",
              chance: "medium" as const,
              rationale:
                "전공 적합성은 우수하나 내신과 공동체 역량 보완 시 경쟁력 상승",
            },
            {
              university: "KAIST",
              department: "전산학부",
              chance: "medium" as const,
              rationale: "알고리즘 대회 경험과 수학 역량이 긍정적 평가 요소",
            },
            {
              university: "고려대학교",
              department: "컴퓨터학과",
              chance: "high" as const,
              rationale:
                "현재 스펙으로 안정적 합격 가능, 활동 우수형 전형 적합",
            },
          ]
        : undefined,
  })),
};

// ─── 섹션 4: 종합 진단 ───

const diagnosticLite: DiagnosticSection = {
  sectionId: "diagnostic",
  title: "종합 진단",
  oneLiner:
    "컴퓨터공학에 대한 뚜렷한 진로 목표와 알고리즘 탐구 역량을 갖추었으나, 공동체 활동과 인문학적 소양 보완이 서울대 합격의 관건입니다.",
  keywords: [
    {
      label: "알고리즘 탐구 역량",
      description:
        "정보 교과와 수학 세특에서 알고리즘 설계 및 구현 능력을 꾸준히 보여줌",
    },
    {
      label: "융합적 사고 필요",
      description:
        "컴퓨터과학과 타 교과(물리, 사회) 간 융합 활동이 부족하여 사고의 폭 확장 필요",
    },
    {
      label: "공동체 역량 보완",
      description:
        "팀 프로젝트 경험은 있으나, 공식적 리더 역할이나 진로 연계 봉사 경험이 제한적",
    },
  ],
  competencySummary: [
    {
      category: "academic",
      label: "학업 역량",
      summary:
        "수학과 정보 교과에서 상위권 성취를 유지하며, 알고리즘 기반 문제 해결 역량이 돋보입니다.",
    },
    {
      category: "career",
      label: "진로 역량",
      summary:
        "1학년부터 컴퓨터공학 관련 활동을 일관되게 수행하여 진로 방향이 명확합니다.",
    },
    {
      category: "community",
      label: "공동체 역량",
      summary:
        "협업 프로젝트 경험은 있으나, 리더십과 봉사 활동의 양적·질적 확대가 필요합니다.",
    },
    {
      category: "growth",
      label: "발전가능성",
      summary:
        "1학년 대비 2학년에서 탐구 깊이와 자기주도성이 성장하고 있어 향후 발전 가능성이 높습니다.",
    },
  ],
};

const diagnosticStandard: DiagnosticSection = {
  ...diagnosticLite,
  admissionPositioning:
    "학생부종합전형(학종)을 주력 전형으로, 전공 적합성과 탐구 역량을 중심으로 어필하는 것이 가장 효과적입니다. 3학년 1학기에 공동체 역량과 융합 활동을 보강하면 서울대 합격 가능성이 크게 상승합니다.",
};

const diagnosticPremium: DiagnosticSection = {
  ...diagnosticStandard,
  strategyOverview:
    "상향 1곳(서울대) + 안정 3곳(KAIST, 고려대, 성균관대) + 하향 2곳(한양대, 서울시립대)의 6개 대학 조합을 추천합니다. 학종 4장 + 교과 1장 + 정시 대비 병행 전략이 최적입니다.",
};

// ============================================================
// Part 2: 분석
// ============================================================

// ─── 섹션 5: 역량별 종합 평가 ───

const competencyEvaluationLite: CompetencyEvaluationSection = {
  sectionId: "competencyEvaluation",
  title: "역량별 종합 평가",
  strengths: [
    {
      competencyTag: {
        category: "academic",
        subcategory: "탐구 역량",
        assessment: "우수",
      },
      label: "알고리즘 설계 및 구현",
      evidence:
        "정보 세특에서 다익스트라 알고리즘을 활용한 최단 경로 탐색 프로그램을 독립적으로 설계하고 Python으로 구현한 경험이 기록됨",
    },
    {
      competencyTag: {
        category: "academic",
        subcategory: "교과 성취도",
        assessment: "우수",
      },
      label: "수학 교과 우수 성취",
      evidence:
        "수학Ⅱ 1등급, 미적분 2등급으로 수리적 사고력이 높으며, 수학적 모델링 활동도 우수",
    },
    {
      competencyTag: {
        category: "career",
        subcategory: "전공 적합성",
        assessment: "우수",
      },
      label: "컴퓨터공학 진로 일관성",
      evidence:
        "1학년 정보 교과 → 2학년 알고리즘 심화 탐구 → 코딩 동아리 활동으로 진로가 일관되게 심화됨",
    },
  ],
  weaknesses: [
    {
      competencyTag: {
        category: "community",
        subcategory: "리더십",
        assessment: "미흡",
      },
      label: "공식적 리더 역할 부족",
      evidence:
        "동아리나 학급에서 공식적 임원 경험이 없으며, 주로 기술적 기여에 집중",
    },
    {
      competencyTag: {
        category: "community",
        subcategory: "봉사 및 나눔",
        assessment: "부족",
      },
      label: "진로 연계 봉사 부재",
      evidence:
        "봉사 활동이 단순 참여 수준이며, 코딩 교육 봉사 등 진로 연계 봉사 경험이 전무",
    },
    {
      competencyTag: {
        category: "academic",
        subcategory: "융합 사고",
        assessment: "미흡",
      },
      label: "인문-과학 융합 활동 부족",
      evidence:
        "국어, 사회 등 인문 교과에서 IT와의 연결점을 찾는 활동이 기록되지 않음",
    },
  ],
  overallComment:
    "컴퓨터공학에 대한 학업적 역량과 진로 적합성은 우수하나, 공동체 역량(리더십, 봉사)과 인문학적 융합 사고가 부족합니다. 서울대가 강조하는 '균형 잡힌 인재상'에 부합하기 위해 3학년에 이 부분을 집중적으로 보완해야 합니다.",
  competencyRatings: [
    {
      category: "academic",
      label: "학업 역량",
      grade: "A",
      comment:
        "주요 교과 성적과 탐구 활동 모두 우수한 수준. 세특 서술의 깊이도 양호함",
    },
    {
      category: "career",
      label: "진로 역량",
      grade: "A",
      comment:
        "명확한 진로 방향과 일관된 활동이 강점. 외부 대회 실적이 추가되면 더욱 강력해짐",
    },
    {
      category: "community",
      label: "공동체 역량",
      grade: "C",
      comment:
        "리더십과 봉사 활동이 현저히 부족. 서울대 합격을 위해 반드시 보강해야 하는 영역",
    },
    {
      category: "growth",
      label: "발전가능성",
      grade: "B",
      comment:
        "1학년 대비 탐구 깊이가 성장 중이나, 성장 서사가 더 명확해질 필요가 있음",
    },
  ],
};

const competencyEvaluationPremium: CompetencyEvaluationSection = {
  ...competencyEvaluationLite,
  strengths: [
    ...competencyEvaluationLite.strengths,
    {
      competencyTag: {
        category: "academic",
        subcategory: "자기주도 학습",
        assessment: "양호",
      },
      label: "독립적 프로젝트 수행 능력",
      evidence:
        "정보 교과 외에도 개인적으로 웹 애플리케이션 개발 프로젝트를 수행한 경험이 세특에 기록됨",
    },
    {
      competencyTag: {
        category: "career",
        subcategory: "진로 탐색",
        assessment: "양호",
      },
      label: "IT 산업 트렌드 이해",
      evidence:
        "AI, 빅데이터 등 최신 기술 트렌드를 교과 활동과 연결하여 탐구한 경험이 있음",
    },
  ],
  weaknesses: [
    ...competencyEvaluationLite.weaknesses,
    {
      competencyTag: {
        category: "growth",
        subcategory: "자기 성찰",
        assessment: "미흡",
      },
      label: "실패 경험 기반 성장 서사 부족",
      evidence:
        "도전적 활동에서의 실패와 극복 과정이 세특에 구체적으로 드러나지 않음",
    },
    {
      competencyTag: {
        category: "academic",
        subcategory: "학업 관리",
        assessment: "미흡",
      },
      label: "비전공 교과 관리 소홀",
      evidence:
        "국어, 사회 교과의 세특이 평이하여 학업 성실성에 대한 의구심을 줄 수 있음",
    },
  ],
  competencyRatings: competencyEvaluationLite.competencyRatings.map((r) => ({
    ...r,
    subcategories:
      r.category === "academic"
        ? [
            {
              name: "교과 성취도",
              grade: "A" as const,
              comment: "주요 교과 평균 2.1등급, 수학 1등급",
            },
            {
              name: "탐구 역량",
              grade: "A" as const,
              comment: "알고리즘 설계, 코딩 프로젝트 등 심화 탐구 활동 우수",
            },
            {
              name: "세특 충실도",
              grade: "B" as const,
              comment: "전공 교과 세특 우수, 비전공 교과 보완 필요",
            },
          ]
        : r.category === "career"
          ? [
              {
                name: "전공 적합성",
                grade: "A" as const,
                comment: "컴퓨터공학 관련 활동의 일관성과 깊이가 우수",
              },
              {
                name: "진로 탐색 활동",
                grade: "B" as const,
                comment: "교내 활동 중심, 외부 활동 확대 필요",
              },
            ]
          : r.category === "community"
            ? [
                {
                  name: "리더십",
                  grade: "C" as const,
                  comment: "공식적 리더 역할 경험 부족",
                },
                {
                  name: "협업 능력",
                  grade: "B" as const,
                  comment: "팀 프로젝트 참여 경험은 있으나 조율 역할 제한적",
                },
                {
                  name: "봉사 및 나눔",
                  grade: "D" as const,
                  comment: "진로 연계 봉사 경험 전무",
                },
              ]
            : undefined,
  })),
};

// ─── 섹션 6: 성적 분석 ───

const academicAnalysisLite: AcademicAnalysisSection = {
  sectionId: "academicAnalysis",
  title: "성적 분석",
  overallAverageGrade: 2.1,
  gradesByYear: [
    { year: 1, semester: 1, averageGrade: 2.5 },
    { year: 1, semester: 2, averageGrade: 2.3 },
    { year: 2, semester: 1, averageGrade: 1.9 },
    { year: 2, semester: 2, averageGrade: 1.8 },
  ],
  subjectCombinations: [
    { combination: "수학+정보+물리", averageGrade: 1.7 },
    { combination: "국영수 주요 교과", averageGrade: 2.0 },
    { combination: "전 교과", averageGrade: 2.1 },
  ],
  gradeTrend: "상승",
  subjectGrades: [
    {
      subject: "수학Ⅱ",
      year: 2,
      semester: 1,
      grade: 1,
      rawScore: 95,
      classAverage: 65,
      standardDeviation: 15,
      studentCount: 120,
    },
    {
      subject: "미적분",
      year: 2,
      semester: 2,
      grade: 2,
      rawScore: 88,
      classAverage: 62,
      standardDeviation: 14,
      studentCount: 118,
    },
    {
      subject: "정보",
      year: 2,
      semester: 1,
      grade: 1,
      rawScore: 97,
      classAverage: 70,
      standardDeviation: 12,
      studentCount: 115,
    },
    {
      subject: "물리학Ⅰ",
      year: 2,
      semester: 1,
      grade: 2,
      rawScore: 90,
      classAverage: 68,
      standardDeviation: 13,
      studentCount: 110,
    },
    {
      subject: "영어Ⅱ",
      year: 2,
      semester: 1,
      grade: 2,
      rawScore: 91,
      classAverage: 72,
      standardDeviation: 11,
      studentCount: 122,
    },
    {
      subject: "국어",
      year: 2,
      semester: 1,
      grade: 3,
      rawScore: 82,
      classAverage: 70,
      standardDeviation: 12,
      studentCount: 122,
    },
    {
      subject: "화학Ⅰ",
      year: 2,
      semester: 1,
      grade: 2,
      rawScore: 89,
      classAverage: 67,
      standardDeviation: 13,
      studentCount: 108,
    },
    {
      subject: "한국사",
      year: 2,
      semester: 1,
      grade: 3,
      rawScore: 80,
      classAverage: 72,
      standardDeviation: 10,
      studentCount: 122,
    },
  ],
  interpretation:
    "1학년 대비 2학년 성적이 꾸준히 상승하고 있으며, 특히 전공 관련 교과(수학, 정보)에서 1등급을 기록하여 전공 적합성이 높습니다. 다만 국어와 한국사 등 인문 교과가 3등급대로 교과 균형을 맞출 필요가 있습니다.",
};

const academicAnalysisStandard: AcademicAnalysisSection = {
  ...academicAnalysisLite,
  subjectStatAnalyses: [
    {
      subject: "수학Ⅱ",
      year: 2,
      semester: 1,
      zScore: 2.0,
      percentileEstimate: 97,
      interpretation:
        "원점수 95점으로 학급 평균 대비 2 표준편차 이상 높아 최상위권 성취를 보임",
    },
    {
      subject: "정보",
      year: 2,
      semester: 1,
      zScore: 2.25,
      percentileEstimate: 99,
      interpretation:
        "원점수 97점으로 전교 최상위 수준이며, z-score 기준 매우 우수한 성취",
    },
  ],
  gradeDeviationAnalysis: {
    highestSubject: "정보",
    lowestSubject: "국어",
    deviationRange: 2,
    riskAssessment:
      "전공 교과와 비전공 교과 간 2등급 편차는 학종 평가에서 '학업 성실성' 항목에서 감점 요인이 될 수 있습니다. 국어, 한국사 등 인문 교과를 2등급대로 끌어올리는 것이 중요합니다.",
  },
  majorRelevanceAnalysis: {
    enrollmentEffort:
      "컴퓨터공학 관련 권장 교과(정보, 수학, 물리)를 모두 이수하고 있으며, 진로선택 과목인 인공지능 수학도 이수하여 적극적인 교과 선택이 돋보임",
    achievement: "전공 관련 교과 평균 1.5등급으로 매우 우수한 성취를 보임",
    recommendedSubjects: ["기하", "프로그래밍"],
  },
  gradeChangeAnalysis: {
    currentTrend: "상승",
    prediction:
      "현재 상승 추세가 유지되면 3학년 1학기에 전 교과 평균 1.8등급 달성이 가능합니다.",
    actionItems: [
      "국어 교과 주 3회 추가 학습 및 비문학 독해 연습",
      "한국사 개념 정리 노트 작성 및 기출 풀이",
      "전 교과 세특에서 진로 연결 활동 기록 강화",
    ],
  },
};

const academicAnalysisPremium: AcademicAnalysisSection = {
  ...academicAnalysisStandard,
  fiveGradeSimulation: [
    {
      subject: "수학Ⅱ",
      currentGrade: 1,
      simulatedGrade: 1,
      interpretation: "5등급제 전환 시에도 A등급(상위 10%) 유지가 예상됨",
    },
    {
      subject: "국어",
      currentGrade: 3,
      simulatedGrade: 2,
      interpretation:
        "5등급제 전환 시 B등급(상위 35%)으로 약간의 이점이 있을 수 있음",
    },
  ],
  universityGradeSimulations: [
    {
      university: "서울대학교",
      department: "컴퓨터공학과",
      reflectionMethod: "학종 종합평가 (등급 + 세특 + 활동)",
      calculatedScore: 78,
      interpretation:
        "전공 교과 성적은 합격선에 근접하나, 비전공 교과와 활동 보강 시 경쟁력 상승",
    },
    {
      university: "고려대학교",
      department: "컴퓨터학과",
      reflectionMethod: "학종 학업우수형 (교과 중심 평가)",
      calculatedScore: 85,
      interpretation:
        "교과 성적과 세특 활동 모두 합격선 이상으로 안정적 합격 예상",
    },
  ],
  improvementPriority: [
    "국어 교과 2등급 달성",
    "한국사 2등급 달성",
    "전 교과 세특에서 진로 연결점 확보",
  ],
};

// ─── 섹션 7: 권장과목 이수 분석 ───

const courseAlignment: CourseAlignmentSection = {
  sectionId: "courseAlignment",
  title: "권장과목 이수 분석",
  targetMajor: "컴퓨터공학",
  matchRate: 85,
  courses: [
    { course: "정보", status: "이수", importance: "필수" },
    { course: "수학Ⅱ", status: "이수", importance: "필수" },
    { course: "미적분", status: "이수", importance: "필수" },
    { course: "확률과 통계", status: "이수", importance: "필수" },
    { course: "물리학Ⅰ", status: "이수", importance: "권장" },
    { course: "인공지능 수학", status: "이수", importance: "권장" },
    { course: "기하", status: "미이수", importance: "권장" },
    { course: "물리학Ⅱ", status: "미이수", importance: "권장" },
  ],
  missingCourseImpact:
    "기하와 물리학Ⅱ 미이수가 컴퓨터그래픽스, 로보틱스 등 세부 분야 지원 시 약점이 될 수 있으나, 소프트웨어 중심 지원에는 큰 영향이 없습니다.",
  recommendation:
    "3학년에 기하를 추가 이수하면 권장과목 이수율이 92%까지 상승합니다. 물리학Ⅱ는 선택적으로 이수를 고려하세요.",
};

// ─── 섹션 8: 출결 분석 ───

const attendanceAnalysis: AttendanceAnalysisSection = {
  sectionId: "attendanceAnalysis",
  title: "출결 분석",
  summaryByYear: [
    {
      year: 1,
      totalAbsence: 2,
      illness: 2,
      unauthorized: 0,
      etc: 0,
      lateness: 1,
      earlyLeave: 0,
    },
    {
      year: 2,
      totalAbsence: 1,
      illness: 1,
      unauthorized: 0,
      etc: 0,
      lateness: 0,
      earlyLeave: 0,
    },
  ],
  overallRating: "우수",
  impactAnalysis:
    "무단결석·지각·조퇴가 전혀 없으며, 질병 결석도 최소 수준으로 입시에서 출결 관련 감점 요인은 없습니다.",
  integrityContribution:
    "출결 상태가 매우 양호하여 성실성 평가에서 긍정적으로 작용합니다.",
};

// ─── 섹션 9: 창체 활동 분석 ───

const activityAnalysisLite: ActivityAnalysisSection = {
  sectionId: "activityAnalysis",
  title: "창체 활동 분석",
  curriculumVersion: "2015",
  activities: [
    {
      type: "자율·자치",
      yearlyAnalysis: [
        {
          year: 1,
          summary:
            "학급 환경 개선 프로젝트에 참여하여 교실 IT 환경 구축을 제안하고 실행",
          rating: "good",
          competencyTags: [
            {
              category: "community",
              subcategory: "협업 능력",
              assessment: "양호",
            },
          ],
        },
        {
          year: 2,
          summary:
            "학교 홈페이지 개선 TF팀에 참여하여 UI/UX 개선안을 제안하고 프로토타입 제작",
          rating: "excellent",
          competencyTags: [
            {
              category: "career",
              subcategory: "전공 적합성",
              assessment: "우수",
            },
            {
              category: "community",
              subcategory: "협업 능력",
              assessment: "양호",
            },
          ],
        },
      ],
      overallComment:
        "IT 역량을 학교 공동체에 기여하는 방식으로 발휘하고 있어 긍정적. 공식 리더 역할을 맡으면 더욱 좋겠음.",
    },
    {
      type: "동아리",
      yearlyAnalysis: [
        {
          year: 1,
          summary:
            "코딩 동아리에 가입하여 Python 기초 학습 및 간단한 프로그램 개발",
          rating: "good",
          competencyTags: [
            {
              category: "career",
              subcategory: "전공 적합성",
              assessment: "양호",
            },
          ],
        },
        {
          year: 2,
          summary: "코딩 동아리에서 알고리즘 스터디 리드 및 교내 해커톤 참가",
          rating: "excellent",
          competencyTags: [
            {
              category: "academic",
              subcategory: "탐구 역량",
              assessment: "우수",
            },
            {
              category: "career",
              subcategory: "전공 적합성",
              assessment: "우수",
            },
          ],
        },
      ],
      overallComment:
        "코딩 동아리에서의 성장이 뚜렷하며, 알고리즘 스터디 리드 경험은 리더십으로도 연결 가능. 동아리 부장 역할을 맡는 것을 권장.",
    },
    {
      type: "진로",
      yearlyAnalysis: [
        {
          year: 1,
          summary: "IT 기업 탐방(네이버 본사) 및 진로 체험 활동 참여",
          rating: "average",
          competencyTags: [
            { category: "career", subcategory: "진로 탐색 활동" },
          ],
        },
        {
          year: 2,
          summary:
            "소프트웨어 개발자 직업 탐구 보고서 작성 및 AI 관련 진로 특강 참여",
          rating: "good",
          competencyTags: [
            {
              category: "career",
              subcategory: "진로 탐색 활동",
              assessment: "양호",
            },
          ],
        },
      ],
      overallComment:
        "진로 탐색이 점진적으로 심화되고 있으나, 보다 구체적이고 깊이 있는 진로 연계 활동이 필요합니다.",
    },
  ],
  overallComment:
    "창체 활동에서 컴퓨터공학 진로와의 연결이 꾸준히 유지되고 있으며, 특히 2학년 동아리 활동이 우수합니다. 다만 자율·자치에서 공식 리더 역할이 없는 점과 봉사 활동의 진로 연계성 부족이 아쉽습니다.",
};

const activityAnalysisStandard: ActivityAnalysisSection = {
  ...activityAnalysisLite,
  activities: activityAnalysisLite.activities.map((a) => ({
    ...a,
    keyActivities:
      a.type === "동아리"
        ? [
            {
              activity: "알고리즘 스터디 리드 (2학년)",
              evaluation:
                "주 1회 스터디를 기획하고 문제 선정부터 풀이까지 이끌며, 리더십과 학업 역량을 동시에 보여줌",
              competencyTags: [
                {
                  category: "academic",
                  subcategory: "탐구 역량",
                  assessment: "우수" as const,
                },
                {
                  category: "community",
                  subcategory: "리더십",
                  assessment: "양호" as const,
                },
              ],
            },
            {
              activity: "교내 해커톤 참가 (2학년)",
              evaluation:
                "팀원 3명과 함께 24시간 해커톤에 참가하여 학교 급식 추천 앱 프로토타입 개발. 협업과 문제 해결 역량이 돋보임",
              competencyTags: [
                {
                  category: "academic",
                  subcategory: "탐구 역량",
                  assessment: "우수" as const,
                },
                {
                  category: "community",
                  subcategory: "협업 능력",
                  assessment: "우수" as const,
                },
              ],
            },
          ]
        : undefined,
    improvementDirection:
      a.type === "진로"
        ? "진로 활동에서 단순 탐방·특강 참여를 넘어, 직접 소프트웨어를 개발하여 사회 문제를 해결하는 프로젝트를 수행하면 진로 역량 평가에서 큰 차별화가 가능합니다."
        : undefined,
  })),
};

// ─── 섹션 10: 교과 세특 분석 ───

const subjectAnalysisLite: SubjectAnalysisSection = {
  sectionId: "subjectAnalysis",
  title: "교과 세특 분석",
  subjects: [
    {
      subjectName: "정보",
      year: 2,
      rating: "excellent",
      competencyTags: [
        { category: "academic", subcategory: "탐구 역량", assessment: "우수" },
        { category: "career", subcategory: "전공 적합성", assessment: "우수" },
      ],
      activitySummary:
        "다익스트라 알고리즘을 활용한 최단 경로 탐색 프로그램을 Python으로 구현하고, 시간 복잡도 분석까지 수행",
      evaluationComment:
        "단순 구현을 넘어 알고리즘의 효율성까지 분석한 점이 우수합니다. 컴퓨터공학 전공 적합성을 직접적으로 보여주는 핵심 세특입니다.",
    },
    {
      subjectName: "수학Ⅱ",
      year: 2,
      rating: "excellent",
      competencyTags: [
        {
          category: "academic",
          subcategory: "교과 성취도",
          assessment: "우수",
        },
        { category: "academic", subcategory: "융합 사고", assessment: "양호" },
      ],
      activitySummary:
        "함수의 극한 개념을 활용하여 머신러닝의 경사하강법 원리를 탐구하고 발표",
      evaluationComment:
        "수학 개념을 AI 기술과 연결한 융합적 사고가 돋보입니다. 수학적 도구를 컴퓨터과학에 적용하는 역량을 잘 보여줍니다.",
    },
    {
      subjectName: "물리학Ⅰ",
      year: 2,
      rating: "good",
      competencyTags: [
        {
          category: "academic",
          subcategory: "교과 성취도",
          assessment: "양호",
        },
      ],
      activitySummary:
        "전자기학 단원에서 반도체의 원리를 탐구하고, 컴퓨터 하드웨어와의 연결을 분석하는 보고서 작성",
      evaluationComment:
        "물리학과 컴퓨터공학의 연결을 시도한 점은 좋으나, 탐구의 깊이가 조금 아쉽습니다. 실험적 검증이 추가되면 더 강력한 세특이 됩니다.",
    },
    {
      subjectName: "영어Ⅱ",
      year: 2,
      rating: "good",
      competencyTags: [
        {
          category: "academic",
          subcategory: "교과 성취도",
          assessment: "양호",
        },
        { category: "career", subcategory: "전공 적합성", assessment: "양호" },
      ],
      activitySummary:
        "실리콘밸리 기업 문화에 대한 영어 에세이 작성 및 TED 강연(컴퓨터과학 관련) 요약 발표",
      evaluationComment:
        "영어 교과에서도 진로를 연결하려는 시도가 좋습니다. 기술 관련 영어 논문 읽기 활동이 추가되면 학술 역량을 더 잘 보여줄 수 있습니다.",
    },
    {
      subjectName: "국어",
      year: 2,
      rating: "average",
      competencyTags: [{ category: "academic", subcategory: "교과 성취도" }],
      activitySummary:
        "문학 작품 감상문 작성 및 토론 참여. 디지털 시대의 언어 변화에 대한 발표 수행",
      evaluationComment:
        "국어 세특이 진로와의 연결이 부족합니다. 'IT와 언어'를 주제로 자연어 처리, 코딩 언어와 자연어의 관계 등을 탐구하면 진로 연결성을 확보할 수 있습니다.",
    },
  ],
};

const subjectAnalysisStandard: SubjectAnalysisSection = {
  sectionId: "subjectAnalysis",
  title: "교과 세특 분석",
  subjects: subjectAnalysisLite.subjects.map((s) => ({
    ...s,
    keyQuotes:
      s.subjectName === "정보"
        ? [
            "다익스트라 알고리즘의 시간 복잡도를 분석하여 O(V²)에서 우선순위 큐를 활용해 O((V+E)logV)로 최적화하는 과정을 탐구함.",
            "실제 지도 데이터를 활용한 최단 경로 탐색 프로그램을 구현하여 알고리즘의 실용성을 검증함.",
          ]
        : s.subjectName === "수학Ⅱ"
          ? [
              "경사하강법의 학습률이 수렴 속도에 미치는 영향을 수학적으로 분석하고 시각화 프로그램으로 검증함.",
            ]
          : undefined,
    detailedEvaluation:
      s.subjectName === "정보"
        ? "알고리즘의 이론적 이해뿐 아니라 실제 데이터에 적용하는 과정까지 수행한 점이 매우 우수합니다. 시간 복잡도 분석에서 빅오 표기법을 정확히 사용하였고, 우선순위 큐를 활용한 최적화까지 시도한 점에서 컴퓨터과학의 핵심 역량인 '효율적 문제 해결 능력'이 잘 드러납니다. 서울대 평가 기준에서 '학업 역량'과 '발전가능성' 항목에서 높은 평가가 예상됩니다."
        : s.subjectName === "수학Ⅱ"
          ? "함수의 극한이라는 수학 개념을 머신러닝의 경사하강법이라는 실제 기술에 적용한 융합적 사고가 돋보입니다. 다만 수학적 증명의 엄밀성이 조금 부족하며, 3학년에서는 미적분을 활용한 더 깊이 있는 최적화 문제 탐구를 권장합니다."
          : s.subjectName === "국어"
            ? "국어 세특이 진로와의 연결 없이 일반적인 문학 감상에 머물고 있습니다. 디지털 시대의 언어 변화 발표는 좋은 시도이나, 자연어 처리(NLP)와의 연결까지 확장하면 컴퓨터공학 진로와의 접점을 만들 수 있습니다."
            : undefined,
    improvementDirection:
      s.subjectName === "국어"
        ? "국어 세특에서 '자연어 처리와 인간 언어의 관계' 또는 '프로그래밍 언어와 자연어의 구조적 유사성'을 주제로 탐구하면 진로 연결성을 확보할 수 있습니다."
        : undefined,
    crossSubjectConnections:
      s.subjectName === "정보"
        ? [
            {
              targetSubject: "수학Ⅱ",
              connectionType: "주제연결" as const,
              description:
                "정보의 알고리즘 효율성 분석과 수학의 함수 극한 개념이 '최적화'라는 주제로 연결됨",
            },
          ]
        : undefined,
  })),
};

const subjectAnalysisPremium: SubjectAnalysisSection = {
  sectionId: "subjectAnalysis",
  title: "교과 세특 분석",
  subjects: subjectAnalysisStandard.subjects.map((s) => ({
    ...s,
    importancePercent:
      s.subjectName === "정보"
        ? 35
        : s.subjectName === "수학Ⅱ"
          ? 25
          : s.subjectName === "물리학Ⅰ"
            ? 15
            : s.subjectName === "영어Ⅱ"
              ? 10
              : 15,
    evaluationImpact:
      s.subjectName === "정보"
        ? ("high" as const)
        : s.subjectName === "수학Ⅱ"
          ? ("high" as const)
          : s.subjectName === "물리학Ⅰ"
            ? ("medium" as const)
            : ("low" as const),
    sentenceAnalysis:
      s.subjectName === "정보"
        ? [
            {
              sentence:
                "다익스트라 알고리즘의 시간 복잡도를 분석하여 O(V²)에서 우선순위 큐를 활용해 O((V+E)logV)로 최적화하는 과정을 탐구함.",
              evaluation:
                "알고리즘 최적화 역량을 직접적으로 보여주는 핵심 문장. 빅오 표기법의 정확한 사용이 돋보임.",
              competencyTags: [
                {
                  category: "academic" as const,
                  subcategory: "탐구 역량",
                  assessment: "우수" as const,
                },
              ],
              highlight: "positive" as const,
            },
            {
              sentence:
                "실제 지도 데이터를 활용한 최단 경로 탐색 프로그램을 구현하여 알고리즘의 실용성을 검증함.",
              evaluation:
                "이론을 실제 데이터에 적용하는 실용적 역량을 보여주는 우수한 서술.",
              competencyTags: [
                {
                  category: "career" as const,
                  subcategory: "전공 적합성",
                  assessment: "우수" as const,
                },
              ],
              highlight: "positive" as const,
            },
            {
              sentence: "모둠 활동에서 프로그램 시연을 담당하여 발표함.",
              evaluation:
                "역할이 구체적으로 드러나지 않는 일반적 서술. 어떤 기여를 했는지 구체적으로 기록되어야 함.",
              competencyTags: [
                { category: "community" as const, subcategory: "협업 능력" },
              ],
              highlight: "neutral" as const,
              improvementSuggestion:
                "'팀 내 백엔드 로직 설계를 주도하고, 프론트엔드 담당 팀원과 협업하여 사용자 인터페이스를 구현함'과 같이 구체적 역할을 드러내야 합니다.",
            },
          ]
        : s.subjectName === "수학Ⅱ"
          ? [
              {
                sentence:
                  "함수의 극한 개념을 활용하여 머신러닝의 경사하강법 원리를 탐구하고 발표함.",
                evaluation:
                  "수학과 AI를 연결하는 융합적 사고가 돋보이는 핵심 문장.",
                competencyTags: [
                  {
                    category: "academic" as const,
                    subcategory: "융합 사고",
                    assessment: "우수" as const,
                  },
                ],
                highlight: "positive" as const,
              },
            ]
          : undefined,
  })),
};

// ─── 섹션 11: 행동특성 분석 ───

const behaviorAnalysis: BehaviorAnalysisSection = {
  sectionId: "behaviorAnalysis",
  title: "행동특성 분석",
  yearlyAnalysis: [
    {
      year: 1,
      summary:
        "수업 시간에 집중력이 높고 과제 제출이 성실하며, 모둠 활동에서 맡은 역할을 묵묵히 수행하는 학생으로 평가됨",
      competencyTags: [
        { category: "growth", subcategory: "성실성", assessment: "양호" },
      ],
      keyQuotes: ["맡은 일에 대한 책임감이 강하고, 수업 태도가 모범적임"],
    },
    {
      year: 2,
      summary:
        "자기주도적 학습 태도가 형성되어 궁금한 부분을 스스로 찾아 학습하는 모습이 돋보이며, 정보 교과에서 특히 뛰어난 집중력과 탐구 열정을 보임",
      competencyTags: [
        { category: "growth", subcategory: "자기주도성", assessment: "우수" },
        { category: "academic", subcategory: "탐구 역량", assessment: "우수" },
      ],
      keyQuotes: [
        "컴퓨터 프로그래밍에 대한 강한 열정과 자기주도적 학습 태도가 돋보이는 학생",
        "어려운 문제에도 포기하지 않고 끝까지 해결하려는 끈기가 인상적임",
      ],
    },
  ],
  consistentTraits: ["성실성", "집중력", "탐구 열정", "끈기"],
  overallComment:
    "1학년부터 2학년까지 일관되게 성실하고 집중력 높은 학생으로 평가받고 있으며, 2학년에서 자기주도적 학습 태도가 뚜렷이 형성되었습니다. 다만 리더십이나 타인과의 소통에 대한 서술이 부족하여, 3학년에는 리더 역할이나 멘토링 경험을 통해 이 부분을 보완할 필요가 있습니다.",
  admissionRelevance:
    "행동특성에서 '자기주도성'과 '끈기'가 일관되게 드러나는 것은 서울대가 중시하는 '발전가능성' 평가에서 긍정적으로 작용합니다. 3학년에 리더십 관련 서술이 추가되면 '공동체 의식' 항목도 보강됩니다.",
};

// ─── 섹션 12: 기록 충실도 종합 ───

const overallAssessment: OverallAssessmentSection = {
  sectionId: "overallAssessment",
  title: "기록 충실도 종합",
  volumeAnalysis: [
    {
      category: "교과 세특",
      maxCapacity: "500자 x 전 과목",
      actualVolume: "평균 420자",
      fillRate: 84,
      assessment:
        "양호. 전공 교과는 480자 이상 충실, 비전공 교과 350자 수준으로 보완 필요",
    },
    {
      category: "창체 - 자율",
      maxCapacity: "500자",
      actualVolume: "380자",
      fillRate: 76,
      assessment:
        "보통. IT 관련 자율활동은 기록되었으나 리더십 활동이 빠져 있음",
    },
    {
      category: "창체 - 동아리",
      maxCapacity: "500자",
      actualVolume: "470자",
      fillRate: 94,
      assessment: "우수. 코딩 동아리 활동이 구체적이고 풍부하게 기록됨",
    },
    {
      category: "창체 - 진로",
      maxCapacity: "700자",
      actualVolume: "450자",
      fillRate: 64,
      assessment: "미흡. 진로 탐색 활동의 깊이와 분량이 부족",
    },
    {
      category: "행동특성 및 종합의견",
      maxCapacity: "500자",
      actualVolume: "440자",
      fillRate: 88,
      assessment: "양호. 성실성과 탐구 열정이 잘 드러나나 리더십 언급 부족",
    },
  ],
  overallFillRate: 81,
  qualityAssessment:
    "전공 관련 기록(정보, 수학, 동아리)은 질적으로 우수하나, 비전공 교과와 진로 활동 기록의 질적 수준을 높일 필요가 있습니다.",
  competitivenessSum:
    "학업: 수학/정보 중심 우수 | 진로: 컴퓨터공학 일관성 확보 | 공동체: 리더십·봉사 보강 시급 | 발전가능성: 상승 추세 긍정적",
  finalComment:
    "전체 기록 충실도 81%로 양호한 수준이나, 서울대 합격을 위해서는 90% 이상의 충실도가 권장됩니다. 3학년 1학기에 진로 활동 기록 강화, 비전공 교과 세특 보완, 리더십 활동 추가가 필요합니다.",
};

// ============================================================
// Part 3: 전략
// ============================================================

// ─── 섹션 13: 부족한 부분 + 보완 전략 ───

const weaknessAnalysisLite: WeaknessAnalysisSection = {
  sectionId: "weaknessAnalysis",
  title: "부족한 부분 분석 및 보완 전략",
  areas: [
    {
      area: "공동체 역량 (리더십·봉사)",
      description:
        "동아리나 학급에서 공식적 리더 역할 경험이 없으며, 진로 연계 봉사 활동이 전무합니다. 서울대가 중시하는 '공동체 의식' 평가에서 감점 요인입니다.",
      suggestedActivities: [
        "3학년 코딩 동아리 부장 또는 학급 부반장 지원",
        "지역 아동센터 코딩 교육 봉사 (주 1회)",
        "교내 SW 멘토링 프로그램 참여 (후배 대상 프로그래밍 지도)",
      ],
    },
    {
      area: "인문 교과 연계 부족",
      description:
        "국어, 한국사 등 인문 교과의 세특이 진로와 연결되지 않아 '균형 잡힌 학업 역량'을 보여주기 어렵습니다.",
      suggestedActivities: [
        "국어 세특: 자연어 처리(NLP)와 한국어의 형태론적 특성 탐구",
        "한국사 세특: 조선 시대 수학·과학 기술의 현대적 의의 탐구",
        "사회 세특: AI 윤리와 개인정보 보호 관련 에세이 작성",
      ],
    },
    {
      area: "외부 활동 및 대회 실적",
      description:
        "교내 활동 위주로 외부 코딩 대회(정보올림피아드 등)나 프로젝트 경험이 부족하여 차별화가 어렵습니다.",
      suggestedActivities: [
        "한국정보올림피아드(KOI) 지역 예선 참가",
        "교내 SW 경진대회 출전 및 수상 목표",
        "개인 포트폴리오용 오픈소스 프로젝트 기여 경험",
      ],
    },
  ],
};

const weaknessAnalysisStandard: WeaknessAnalysisSection = {
  sectionId: "weaknessAnalysis",
  title: "부족한 부분 분석 및 보완 전략",
  areas: weaknessAnalysisLite.areas.map((a) => ({
    ...a,
    evidence:
      a.area === "공동체 역량 (리더십·봉사)"
        ? "2년간 임원 경험 0회, 봉사시간은 있으나 전부 일반 봉사. 동아리에서 알고리즘 스터디 리드 경험은 있으나 공식 직함 없음."
        : a.area === "인문 교과 연계 부족"
          ? "국어 세특: 일반적 문학 감상에 머무름. 한국사 세특: 단원 요약 수준. 사회 세특: 진로 연결 없음."
          : "교내 해커톤 1회 참가가 유일한 경쟁 활동. 정보올림피아드, SW 경진대회 등 미참가.",
    competencyTag:
      a.area === "공동체 역량 (리더십·봉사)"
        ? {
            category: "community" as const,
            subcategory: "리더십",
            assessment: "미흡" as const,
          }
        : a.area === "인문 교과 연계 부족"
          ? {
              category: "academic" as const,
              subcategory: "융합 사고",
              assessment: "미흡" as const,
            }
          : {
              category: "career" as const,
              subcategory: "진로 탐색 활동",
              assessment: "미흡" as const,
            },
    priority:
      a.area === "공동체 역량 (리더십·봉사)"
        ? ("high" as const)
        : a.area === "인문 교과 연계 부족"
          ? ("high" as const)
          : ("medium" as const),
  })),
};

const weaknessAnalysisPremium: WeaknessAnalysisSection = {
  sectionId: "weaknessAnalysis",
  title: "부족한 부분 분석 및 보완 전략",
  areas: weaknessAnalysisStandard.areas.map((a) => ({
    ...a,
    urgency:
      a.area === "공동체 역량 (리더십·봉사)"
        ? ("high" as const)
        : ("medium" as const),
    effectiveness: "high" as const,
    executionStrategy:
      a.area === "공동체 역량 (리더십·봉사)"
        ? "3학년 시작과 동시에 동아리 부장에 지원하고, 코딩 교육 봉사를 학기 초부터 시작하여 지속적 기록을 확보합니다."
        : a.area === "인문 교과 연계 부족"
          ? "3학년 1학기 국어/사회 수업에서 IT 관련 주제를 선정하여 세특 기록을 미리 준비합니다."
          : "방학 중 알고리즘 대회 준비를 시작하고, 학기 중 교내 대회에 참가하여 실적을 쌓습니다.",
    subjectLinkStrategy:
      a.area === "인문 교과 연계 부족"
        ? "국어(자연어처리) → 정보(NLP 구현) → 영어(기술 논문 읽기)로 교과 간 연결 고리를 형성합니다."
        : undefined,
  })),
};

// ─── 섹션 14: 세특 주제 추천 ───

const topicRecommendationLite: TopicRecommendationSection = {
  sectionId: "topicRecommendation",
  title: "세특 주제 추천",
  topics: [
    {
      topic: "자연어 처리(NLP) 기반 한국어 감성 분석 프로그램 개발",
      relatedSubjects: ["정보", "국어"],
      description:
        "Python의 KoNLPy 라이브러리를 활용하여 한국어 텍스트의 감성(긍정/부정)을 분석하는 프로그램을 개발하고, 국어 교과의 '언어와 매체' 단원과 연계하여 디지털 시대의 언어 분석 방법론을 탐구합니다.",
    },
    {
      topic: "그래프 이론을 활용한 소셜 네트워크 분석",
      relatedSubjects: ["수학", "정보", "사회"],
      description:
        "그래프 이론(노드, 엣지, 중심성)을 학습하고, 실제 소셜 네트워크 데이터를 분석하여 영향력 있는 노드를 식별하는 알고리즘을 구현합니다. 사회 교과의 '정보사회' 단원과 연계 가능합니다.",
    },
    {
      topic: "강화학습을 활용한 간단한 게임 AI 구현",
      relatedSubjects: ["정보", "수학"],
      description:
        "Q-러닝 알고리즘을 활용하여 간단한 미로 탈출 게임 AI를 구현하고, 보상 함수 설계와 학습 과정을 분석합니다. 수학의 행렬 연산과 확률 개념이 활용됩니다.",
    },
  ],
};

const topicRecommendationStandard: TopicRecommendationSection = {
  sectionId: "topicRecommendation",
  title: "세특 주제 추천",
  topics: [
    ...topicRecommendationLite.topics.map((t) => ({
      ...t,
      rationale: t.topic.includes("자연어")
        ? "국어 세특과 정보 세특을 동시에 강화할 수 있는 융합 주제로, 현재 약점인 '인문 교과 연계'를 직접적으로 보완합니다."
        : t.topic.includes("그래프")
          ? "기존 알고리즘 탐구의 연장선에서 그래프 이론으로 확장하여, 수학-정보-사회를 잇는 교과 간 연결성을 확보합니다."
          : "AI와 수학의 연결을 실습적으로 보여줄 수 있어, 서울대 컴퓨터공학과의 '인공지능' 연구 분야와 직접 연결됩니다.",
      existingConnection: t.topic.includes("자연어")
        ? "2학년 정보 세특의 알고리즘 탐구 경험을 '문자열 처리'로 확장하는 자연스러운 심화입니다."
        : t.topic.includes("그래프")
          ? "2학년에 학습한 다익스트라 알고리즘이 그래프 탐색의 일종이므로 자연스러운 확장입니다."
          : "수학Ⅱ에서 탐구한 경사하강법이 강화학습의 최적화에서도 활용되어 연결됩니다.",
    })),
    {
      topic: "암호학의 수학적 원리와 블록체인 기술 탐구",
      relatedSubjects: ["수학", "정보"],
      description:
        "RSA 암호 알고리즘의 수학적 원리(소인수분해, 모듈러 연산)를 학습하고, 이를 기반으로 간단한 암호화/복호화 프로그램을 구현합니다.",
      rationale:
        "수학과 정보보안의 접점을 탐구하여 컴퓨터공학의 폭넓은 관심을 보여줍니다.",
      existingConnection:
        "수학 교과에서 학습한 정수론 개념을 실제 암호 기술에 적용하는 심화입니다.",
    },
    {
      topic: "컴퓨터 비전을 활용한 교내 쓰레기 분류 시스템 설계",
      relatedSubjects: ["정보", "과학", "사회"],
      description:
        "TensorFlow의 이미지 분류 모델을 활용하여 재활용 쓰레기를 자동으로 분류하는 시스템을 설계하고, 환경 문제 해결에 IT 기술을 적용하는 방안을 탐구합니다.",
      rationale:
        "사회 문제 해결에 IT를 적용하는 경험으로 '공동체 의식'과 '기술의 사회적 책임'을 동시에 보여줍니다.",
      existingConnection:
        "코딩 동아리 해커톤에서의 프로젝트 경험을 사회적 가치 창출로 확장합니다.",
    },
  ],
};

const topicRecommendationPremium: TopicRecommendationSection = {
  sectionId: "topicRecommendation",
  title: "세특 주제 추천",
  topics: topicRecommendationStandard.topics.map((t) => ({
    ...t,
    activityDesign: t.topic.includes("자연어")
      ? {
          steps: [
            "1주차: KoNLPy 라이브러리 학습 및 한국어 형태소 분석 실습",
            "2주차: 감성 사전 기반 감성 분석 알고리즘 설계",
            "3주차: 뉴스 기사 데이터 수집 및 감성 분석 프로그램 구현",
            "4주차: 분석 결과 시각화 및 정확도 평가",
            "5주차: 탐구 보고서 작성 및 교과 선생님 피드백",
          ],
          duration: "5주 (주 4시간)",
          expectedResult:
            "정보 + 국어 세특 연계 탐구 보고서 1편 + Python 프로그램 결과물",
        }
      : t.topic.includes("그래프")
        ? {
            steps: [
              "1주차: 그래프 이론 기본 개념 학습 (인접 행렬, 인접 리스트)",
              "2주차: 중심성 지표(degree, betweenness, closeness) 구현",
              "3주차: 실제 네트워크 데이터 수집 및 분석",
              "4주차: 분석 결과 시각화 및 해석, 보고서 작성",
            ],
            duration: "4주 (주 3시간)",
            expectedResult: "수학 + 정보 + 사회 세특 연계 탐구 보고서 1편",
          }
        : {
            steps: [
              "1주차: 관련 이론 학습 및 선행 연구 조사",
              "2주차: 알고리즘/모델 설계 및 구현",
              "3주차: 실험 및 결과 분석",
              "4주차: 보고서 작성 및 발표 준비",
            ],
            duration: "4주 (주 3~4시간)",
            expectedResult: "탐구 보고서 1편 + 교내 발표 실적",
          },
    sampleEvaluation: t.topic.includes("자연어")
      ? "자연어 처리 기술에 관심을 가지고 KoNLPy 라이브러리를 활용하여 한국어 텍스트의 감성을 분석하는 프로그램을 독립적으로 개발함. 형태소 분석 결과를 활용한 감성 사전 매칭 알고리즘을 설계하였으며, 뉴스 기사 300건에 대한 감성 분석 정확도를 검증하여 78%의 정확도를 달성함. 이 과정에서 언어의 구조적 특성과 컴퓨터 처리의 관계를 깊이 있게 이해하게 되었다고 보고함."
      : undefined,
  })),
};

// ─── 섹션 15: 예상 면접 질문 ───

const interviewPrepStandard: InterviewPrepSection = {
  sectionId: "interviewPrep",
  title: "예상 면접 질문",
  questions: [
    {
      question:
        "컴퓨터공학과에 지원한 동기와 고등학교에서 이를 위해 어떤 노력을 했는지 말씀해 주세요.",
      questionType: "진로기반",
      intent: "진로 동기의 진정성과 구체적인 준비 과정을 확인",
    },
    {
      question:
        "세특에 기록된 다익스트라 알고리즘 탐구에서 시간 복잡도를 최적화한 과정을 설명해 주세요.",
      questionType: "세특기반",
      intent: "알고리즘 이해도와 최적화 사고력을 평가",
    },
    {
      question:
        "수학 세특에서 경사하강법을 탐구했는데, 경사하강법의 한계점은 무엇이라고 생각하나요?",
      questionType: "세특기반",
      intent: "단순 학습을 넘어 비판적 사고력이 있는지 확인",
    },
    {
      question:
        "AI 기술의 발전이 사회에 미치는 부정적 영향에 대해 어떻게 생각하나요?",
      questionType: "진로기반",
      intent: "기술에 대한 사회적 책임 의식과 비판적 사고력 평가",
    },
    {
      question:
        "코딩 동아리에서 팀 프로젝트를 수행한 경험과 본인의 역할을 말씀해 주세요.",
      questionType: "인성기반",
      intent: "협업 능력과 팀 내 역할을 확인",
    },
    {
      question:
        "프로그래밍을 하다가 해결하기 어려운 버그를 만났을 때 어떻게 대처하나요?",
      questionType: "세특기반",
      intent: "문제 해결 방법론과 끈기를 평가",
    },
    {
      question:
        "컴퓨터공학과 수학의 관계를 어떻게 생각하며, 수학이 왜 중요한지 설명해 주세요.",
      questionType: "성적기반",
      intent: "전공에 대한 이해 깊이와 수학적 소양 확인",
    },
    {
      question:
        "대학에서 구체적으로 어떤 분야를 공부하고 싶은지 말씀해 주세요.",
      questionType: "진로기반",
      intent: "전공 분야에 대한 구체적인 학업 계획 확인",
    },
    {
      question: "고등학교 생활 중 가장 도전적이었던 경험은 무엇인가요?",
      questionType: "인성기반",
      intent: "도전 정신과 회복 탄력성 평가",
    },
    {
      question:
        "개인정보 보호와 데이터 활용 사이의 균형에 대한 본인의 의견을 말씀해 주세요.",
      questionType: "진로기반",
      intent: "IT 윤리에 대한 인식과 논리적 사고력 평가",
    },
  ],
};

const interviewPrepPremium: InterviewPrepSection = {
  sectionId: "interviewPrep",
  title: "예상 면접 질문 및 심화 대비",
  questions: interviewPrepStandard.questions.map((q) => ({
    ...q,
    answerStrategy: q.question.includes("지원한 동기")
      ? "관심의 시작(계기) → 심화 과정(탐구/활동) → 미래 비전의 3단계로 구성. 진정성이 핵심."
      : q.question.includes("다익스트라")
        ? "원래 구현(O(V²)) → 문제 인식 → 최적화 과정(우선순위 큐) → 결과와 배움의 흐름으로 답변."
        : q.question.includes("경사하강법")
          ? "학습한 내용 요약 → 한계점(local minimum, learning rate) → 대안(Adam, momentum) 순으로 논리적으로 전개."
          : undefined,
    sampleAnswer: q.question.includes("지원한 동기")
      ? "중학교 때 간단한 게임을 만들어 본 것이 계기가 되어 프로그래밍에 관심을 갖게 되었습니다. 고등학교에 진학하여 정보 교과에서 알고리즘의 체계적인 세계를 접하면서 단순 코딩을 넘어 효율적인 문제 해결에 매료되었습니다. 특히 다익스트라 알고리즘을 학습하며 수학적 사고와 프로그래밍이 결합할 때 강력한 도구가 된다는 것을 깨달았고, 대학에서 이론적 기초를 탄탄히 다지고 싶습니다."
      : undefined,
    followUpQuestions: q.question.includes("다익스트라")
      ? [
          {
            question:
              "다익스트라 알고리즘이 적용될 수 없는 경우는 어떤 상황인가요?",
            context:
              "음의 가중치 간선이 있는 그래프에서의 한계를 이해하고 있는지 확인",
          },
          {
            question: "다익스트라 외에 다른 최단 경로 알고리즘을 알고 있나요?",
            context:
              "벨만-포드, 플로이드-워셜 등 관련 알고리즘에 대한 학습 범위 확인",
          },
        ]
      : undefined,
  })),
};

// ─── 섹션 16: 입시 전략 + 대학 추천 ───

const admissionStrategyLite: AdmissionStrategySection = {
  sectionId: "admissionStrategy",
  title: "입시 전략 및 대학 추천",
  recommendedPath:
    "학생부종합전형을 주력으로, 전공 적합성과 탐구 역량을 중심으로 어필하는 전략을 추천합니다.",
  recommendations: [
    {
      university: "서울대학교",
      department: "컴퓨터공학과",
      admissionType: "학생부종합 (일반전형)",
      tier: "상향",
    },
    {
      university: "KAIST",
      department: "전산학부",
      admissionType: "학생부종합",
      tier: "상향",
    },
    {
      university: "고려대학교",
      department: "컴퓨터학과",
      admissionType: "학생부종합 (학업우수형)",
      tier: "안정",
    },
    {
      university: "성균관대학교",
      department: "소프트웨어학과",
      admissionType: "학생부종합 (계열모집)",
      tier: "안정",
    },
    {
      university: "한양대학교",
      department: "컴퓨터소프트웨어학부",
      admissionType: "학생부종합 (일반)",
      tier: "하향",
    },
    {
      university: "서울시립대학교",
      department: "컴퓨터과학부",
      admissionType: "학생부종합",
      tier: "하향",
    },
  ],
};

const admissionStrategyStandard: AdmissionStrategySection = {
  ...admissionStrategyLite,
  recommendations: admissionStrategyLite.recommendations.map((r) => ({
    ...r,
    chance: r.tier === "상향" ? ("medium" as const) : ("high" as const),
    chanceRationale:
      r.university === "서울대학교"
        ? "전공 적합성은 우수하나 공동체 역량 보완 필요. 3학년 보강 시 합격 가능성 상승."
        : r.university === "KAIST"
          ? "수학·정보 성적이 강점이나, 외부 대회 실적 추가 시 경쟁력 상승."
          : r.university === "고려대학교"
            ? "현재 스펙으로 안정적 합격 가능. 학업우수형 전형에 매우 적합."
            : "현재 스펙 기준 합격 가능성이 높음.",
  })),
  typeStrategies: [
    {
      type: "학종",
      analysis:
        "세특 활동의 전공 적합성이 높고, 진로 일관성이 우수하여 학종에서 가장 큰 경쟁력을 발휘할 수 있습니다.",
      suitability: "적합",
      reason:
        "컴퓨터공학 관련 세특·동아리·탐구 활동이 풍부하며, 성적 상승 추세도 긍정적",
    },
    {
      type: "교과",
      analysis:
        "내신 2.1등급은 상위권 대학 교과전형 합격선에 다소 미달하여 메인 전략으로 권장하지 않습니다.",
      suitability: "보통",
      reason:
        "서울대 교과전형 합격선 1.5등급 이내에 미달, 중상위권 대학에서는 가능성 있음",
    },
    {
      type: "정시",
      analysis:
        "모의고사 성적이 양호하여 보조 전략으로 활용 가능하나, 수능 변동성을 고려해야 합니다.",
      suitability: "보통",
      reason:
        "현재 모의고사 기준 상위권이나, 수능 당일 변수가 크므로 보조 전략으로 활용",
    },
  ],
  schoolTypeAnalysis: {
    cautionTypes: ["특목고", "과학고"],
    advantageTypes: ["일반고"],
    rationale:
      "일반고 출신으로 학종에서 '교육과정 내 성취'를 강조할 수 있으며, 일반고에서의 상위권 성취가 긍정적으로 평가됩니다.",
  },
};

const admissionStrategyPremium: AdmissionStrategySection = {
  ...admissionStrategyStandard,
  csatMinimumStrategy:
    "수능 최저 충족을 위해 국어 3등급 → 2등급, 영어 2등급 유지가 필요합니다. 수학과 탐구는 현재 수준 유지 시 충족 가능합니다.",
  applicationSimulation: {
    description: "수시 6장 최적 배분 시뮬레이션",
    details: [
      {
        admissionType: "학종",
        count: 4,
        targetUniversities: ["서울대", "KAIST", "고려대", "성균관대"],
      },
      {
        admissionType: "교과",
        count: 1,
        targetUniversities: ["한양대"],
      },
      {
        admissionType: "정시 대비",
        count: 1,
        targetUniversities: ["서울시립대"],
      },
    ],
  },
  universityGuideMatching: [
    {
      university: "서울대학교",
      emphasisKeywords: [
        "자기주도성",
        "학업 역량",
        "발전가능성",
        "공동체 의식",
      ],
      studentStrengthMatch: ["자기주도성", "학업 역량"],
      studentWeaknessMatch: ["공동체 의식"],
    },
  ],
};

// ─── 섹션 17: 생기부 스토리 구조 분석 ───

const storyAnalysisStandard: StoryAnalysisSection = {
  sectionId: "storyAnalysis",
  title: "생기부 스토리 구조 분석",
  mainStoryline:
    "김민수 학생의 생기부는 '코딩에 대한 호기심 → 알고리즘 탐구 역량 형성 → IT로 사회 문제를 해결하는 엔지니어로의 성장'이라는 3단계 서사 구조를 가지고 있습니다.",
  yearProgressions: [
    {
      year: 1,
      theme: "호기심과 기초 역량 형성",
      description:
        "코딩 동아리 가입, Python 기초 학습, IT 기업 탐방을 통해 컴퓨터공학에 대한 기초적 관심과 역량을 형성한 시기",
    },
    {
      year: 2,
      theme: "탐구 심화와 융합적 사고",
      description:
        "알고리즘 탐구(다익스트라), 수학-AI 융합 탐구(경사하강법), 해커톤 참가 등을 통해 전공 역량을 심화하고 융합적 사고를 보여준 시기",
    },
  ],
  careerConsistencyGrade: "A",
  careerConsistencyComment:
    "1학년부터 2학년까지 컴퓨터공학이라는 진로 방향이 일관되게 유지되며 점진적으로 심화되고 있어 진로 일관성이 우수합니다.",
};

const storyAnalysisPremium: StoryAnalysisSection = {
  ...storyAnalysisStandard,
  crossSubjectLinks: [
    {
      from: "정보",
      to: "수학Ⅱ",
      topic: "알고리즘 최적화 → 경사하강법",
      depth: "심화",
    },
    {
      from: "물리학Ⅰ",
      to: "정보",
      topic: "반도체 원리 → 컴퓨터 하드웨어",
      depth: "확장",
    },
    {
      from: "영어Ⅱ",
      to: "정보",
      topic: "실리콘밸리 문화 → IT 진로 탐색",
      depth: "반복",
    },
  ],
  storyEnhancementSuggestions: [
    "3학년에서 '사회 문제 해결형 프로젝트'를 추가하여 '기술의 사회적 가치'라는 서사 요소를 완성하세요.",
    "국어·사회 교과에서 IT 윤리, 자연어 처리 등을 탐구하여 인문-과학 융합 서사를 강화하세요.",
    "코딩 교육 봉사 활동을 통해 '나눔과 성장'이라는 서사 축을 추가하면 스토리의 깊이가 달라집니다.",
  ],
  interviewStoryGuide:
    "면접에서는 '코딩에 대한 호기심(1학년) → 알고리즘의 아름다움 발견(2학년) → IT로 세상을 바꾸고 싶은 꿈(3학년)'이라는 3단계 성장 서사로 답변을 구성하세요. 각 단계에서 구체적 에피소드를 하나씩 준비하면 됩니다.",
};

// ─── 섹션 18: 실행 로드맵 ───

const actionRoadmapStandard: ActionRoadmapSection = {
  sectionId: "actionRoadmap",
  title: "실행 로드맵",
  completionStrategy:
    "3학년 1학기에 세특 보강(인문 교과 연계, 융합 탐구)과 공동체 활동(동아리 부장, 봉사)을 동시에 추진하여 생기부의 완성도를 높입니다.",
  phases: [
    {
      phase: "1단계: 기반 강화",
      period: "고2 겨울방학 (12월~2월)",
      goals: [
        "국어·한국사 내신 대비 학습 시작",
        "코딩 교육 봉사 기관 섭외",
        "알고리즘 대회 준비 시작",
      ],
      tasks: [
        "국어 비문학 독해 연습 (주 3회, 하루 30분)",
        "한국사 개념 정리 노트 작성",
        "코딩 교육 봉사 기관(지역 아동센터 등) 탐색 및 연락",
        "백준 온라인 저지에서 알고리즘 문제 풀이 (주 5일)",
        "3학년 1학기 세특 주제 사전 조사 및 선정",
      ],
    },
    {
      phase: "2단계: 세특 보강 + 활동 강화",
      period: "고3 1학기 (3월~7월)",
      goals: [
        "국어·사회 세특에서 IT 연계 활동 기록",
        "코딩 동아리 부장 활동",
        "교내 SW 경진대회 참가",
      ],
      tasks: [
        "국어 세특: 자연어 처리 탐구 활동 수행",
        "사회 세특: AI 윤리 에세이 작성",
        "동아리 부장으로서 신입 부원 멘토링 및 연간 활동 기획",
        "코딩 교육 봉사 (월 2회)",
        "교내 SW 경진대회 출전",
        "전 교과 세특 진로 연결 활동 확보",
      ],
    },
    {
      phase: "3단계: 지원 준비",
      period: "고3 여름 (7월~9월)",
      goals: ["자기소개서 작성", "최종 지원 대학 확정", "면접 기초 준비"],
      tasks: [
        "자기소개서 초안 작성 (7월)",
        "선생님 피드백 반영 3회 이상 수정",
        "수시 6개 대학 최종 확정",
        "면접 예상 질문 리스트 작성 시작",
      ],
    },
  ],
};

const actionRoadmapPremium: ActionRoadmapSection = {
  ...actionRoadmapStandard,
  phases: [
    ...actionRoadmapStandard.phases,
    {
      phase: "4단계: 면접 집중",
      period: "고3 가을 (10월~11월)",
      goals: ["대학별 면접 완벽 대비", "생기부 기반 심층 질문 대응력 확보"],
      tasks: [
        "서울대 면접 기출 분석 및 모의 면접 (주 2회)",
        "생기부 전 항목 예상 질문 50개 답변 준비",
        "IT 시사 이슈 주간 정리",
        "대학별 면접 특성 분석 및 맞춤 답변 전략 수립",
      ],
    },
  ],
  prewriteProposals: [
    "겨울방학 중 NLP 기초 학습 및 간단한 챗봇 프로젝트 수행",
    "알고리즘 문제 100제 풀이 기록 정리",
    "코딩 교육 봉사 커리큘럼 사전 설계",
  ],
  evaluationWritingGuide: {
    structure: [
      "1단계: 활동 동기/문제 인식 (왜 이 주제를 선택했는지)",
      "2단계: 탐구 과정/방법론 (어떻게 수행했는지, 구체적 방법)",
      "3단계: 결과 및 배움 (무엇을 알게 되었는지, 성장 포인트)",
      "4단계: 확장/연결 (다른 교과·활동과의 연결, 향후 계획)",
    ],
    goodExample:
      "다익스트라 알고리즘의 시간 복잡도가 O(V²)로 대규모 그래프에서 비효율적임을 인식하고, 우선순위 큐(힙)를 활용한 최적화 방법을 자기주도적으로 학습하여 O((V+E)logV)로 개선하는 과정을 탐구함. 이를 실제 지도 데이터에 적용하여 성능 차이를 비교 분석함.",
    badExample:
      "다익스트라 알고리즘을 배우고 프로그램을 만들어 발표함. 모둠 활동에 적극적으로 참여함.",
  },
  interviewTimeline:
    "10월 1주: 생기부 전체 검토 및 예상 질문 작성 | 10월 2~3주: 모의 면접 연습 | 10월 4주~11월: 대학별 맞춤 면접 대비",
};

// ============================================================
// 부록
// ============================================================

// ─── 섹션 19: 추천 도서 ───

const bookRecommendationStandard: BookRecommendationSection = {
  sectionId: "bookRecommendation",
  title: "추천 도서",
  books: [
    {
      title: "알고리즘, 인생을 계산하다",
      author: "브라이언 크리스천, 톰 그리피스",
      reason:
        "알고리즘적 사고를 일상생활에 적용하는 방법을 다루어, 컴퓨터과학의 실용적 가치를 이해하는 데 도움",
      connectionToRecord:
        "다익스트라 알고리즘 탐구 경험을 더 넓은 맥락에서 이해할 수 있으며, 면접에서 활용 가능",
      relatedSubject: "정보",
    },
    {
      title: "이것이 코딩 테스트다",
      author: "나동빈",
      reason:
        "알고리즘 문제 유형별 풀이 전략을 체계적으로 학습할 수 있어 정보올림피아드 대비에 직접적 도움",
      connectionToRecord:
        "코딩 동아리 활동과 연계하여 알고리즘 학습의 체계성을 보여줄 수 있음",
      relatedSubject: "정보",
    },
    {
      title: "수학의 언어로 세상을 본다면",
      author: "오구리 히로시",
      reason:
        "수학적 사고의 본질을 이해하고, 수학이 과학과 기술에 어떻게 활용되는지를 다루는 책",
      connectionToRecord:
        "수학-정보 융합 탐구의 배경 지식을 넓히고, 수학적 사고의 가치를 면접에서 설명할 수 있음",
      relatedSubject: "수학",
    },
    {
      title: "정의란 무엇인가",
      author: "마이클 샌델",
      reason:
        "AI 윤리, 기술과 사회의 관계를 고민하는 데 필요한 철학적 사고의 기초를 다져줌",
      connectionToRecord:
        "인문학적 소양을 보여주는 독서 기록으로, 세특에서 IT 윤리 탐구와 연결 가능",
      relatedSubject: "사회",
    },
  ],
};

const bookRecommendationPremium: BookRecommendationSection = {
  ...bookRecommendationStandard,
  books: [
    ...bookRecommendationStandard.books,
    {
      title: "인공지능: 현대적 접근방식",
      author: "스튜어트 러셀, 피터 노빅",
      reason:
        "AI의 이론적 기초부터 최신 기술까지 포괄적으로 다루는 대학 교재 수준의 책. 대학 선행 학습에 도움",
      connectionToRecord:
        "경사하강법 탐구를 AI 전체 분야로 확장하는 데 기여하며, 면접에서 전공 깊이를 보여줄 수 있음",
      relatedSubject: "정보",
    },
    {
      title: "클린 코드",
      author: "로버트 C. 마틴",
      reason:
        "좋은 코드를 작성하는 원칙과 실천 방법을 배울 수 있어, 프로그래밍 역량을 한 단계 높여줌",
      connectionToRecord:
        "코딩 동아리에서의 프로젝트 품질을 높이고, 소프트웨어 공학에 대한 이해를 보여줄 수 있음",
      relatedSubject: "정보",
    },
  ],
};

// ─── 섹션 20: AI 전공 추천 ───

const majorExploration: MajorExplorationSection = {
  sectionId: "majorExploration",
  title: "AI 전공 추천",
  currentTargetAssessment:
    "서울대 컴퓨터공학과는 김민수 학생의 알고리즘 탐구 역량과 수학적 사고력에 매우 적합한 선택입니다. 다만 입학 경쟁이 치열하므로 공동체 역량 보강이 필수적입니다.",
  suggestions: [
    {
      major: "컴퓨터공학",
      university: "서울대학교",
      fitScore: 88,
      rationale:
        "알고리즘 탐구, 코딩 프로젝트, 수학 융합 활동이 컴퓨터공학 전공과 직접적으로 연결됨",
      strengthMatch: ["알고리즘 역량", "수학적 사고력", "코딩 능력"],
      gapAnalysis: "공동체 역량(리더십, 봉사)이 부족하여 보강 필요",
    },
    {
      major: "인공지능학과",
      university: "성균관대학교",
      fitScore: 85,
      rationale:
        "경사하강법 탐구, 머신러닝에 대한 관심이 AI 전공과 높은 적합도를 보임",
      strengthMatch: ["수학-AI 융합 사고", "프로그래밍 역량"],
      gapAnalysis:
        "AI 관련 심화 활동(논문 읽기, 프로젝트)이 추가되면 더욱 강력해짐",
    },
    {
      major: "데이터사이언스학과",
      fitScore: 80,
      rationale:
        "통계적 사고와 프로그래밍 역량을 결합하는 분야로, 수학과 정보 교과의 강점을 잘 활용할 수 있음",
      strengthMatch: ["수학 성적 우수", "데이터 분석 경험"],
      gapAnalysis:
        "통계학 관련 심화 학습과 실제 데이터 분석 프로젝트 경험이 필요",
    },
  ],
};

// ─── 섹션 21: 워드 클라우드 ───

const wordCloud: WordCloudSection = {
  sectionId: "wordCloud",
  title: "키워드 분석",
  words: [
    { text: "알고리즘", frequency: 15, category: "academic" },
    { text: "프로그래밍", frequency: 14, category: "career" },
    { text: "Python", frequency: 12, category: "career" },
    { text: "탐구", frequency: 11, category: "academic" },
    { text: "문제해결", frequency: 10, category: "academic" },
    { text: "수학", frequency: 9, category: "academic" },
    { text: "다익스트라", frequency: 8, category: "academic" },
    { text: "코딩", frequency: 8, category: "career" },
    { text: "경사하강법", frequency: 7, category: "academic" },
    { text: "인공지능", frequency: 7, category: "career" },
    { text: "데이터", frequency: 6, category: "academic" },
    { text: "시간복잡도", frequency: 6, category: "academic" },
    { text: "동아리", frequency: 5, category: "community" },
    { text: "해커톤", frequency: 5, category: "community" },
    { text: "성실성", frequency: 5, category: "growth" },
    { text: "자기주도", frequency: 5, category: "growth" },
    { text: "융합", frequency: 4, category: "academic" },
    { text: "반도체", frequency: 4, category: "academic" },
    { text: "실험", frequency: 4, category: "academic" },
    { text: "발표", frequency: 4, category: "community" },
    { text: "팀프로젝트", frequency: 3, category: "community" },
    { text: "끈기", frequency: 3, category: "growth" },
    { text: "논리", frequency: 3, category: "academic" },
    { text: "최적화", frequency: 3, category: "academic" },
    { text: "소프트웨어", frequency: 3, category: "career" },
    { text: "웹개발", frequency: 2, category: "career" },
    { text: "머신러닝", frequency: 2, category: "career" },
    { text: "그래프이론", frequency: 2, category: "academic" },
    { text: "성장", frequency: 2, category: "growth" },
    { text: "책임감", frequency: 2, category: "growth" },
  ],
};

// ============================================================
// 플랜별 리포트 조합
// ============================================================

const liteMeta: ReportMeta = {
  reportId: "rpt_lite_001",
  plan: "lite",
  studentInfo: BASE_STUDENT_INFO,
  createdAt: "2026-03-03T09:00:00Z",
  version: 1,
};

const standardMeta: ReportMeta = {
  reportId: "rpt_standard_001",
  plan: "standard",
  studentInfo: BASE_STUDENT_INFO,
  createdAt: "2026-03-03T09:00:00Z",
  version: 1,
};

const premiumMeta: ReportMeta = {
  reportId: "rpt_premium_001",
  plan: "premium",
  studentInfo: BASE_STUDENT_INFO,
  createdAt: "2026-03-03T09:00:00Z",
  version: 1,
};

/** Lite 플랜 mock 리포트 (14 섹션) */
export const LITE_MOCK_REPORT: ReportContent = {
  meta: liteMeta,
  sections: [
    // Part 1: 진단
    studentProfile,
    competencyScoreLite,
    admissionPredictionLite,
    diagnosticLite,
    // Part 2: 분석
    competencyEvaluationLite,
    academicAnalysisLite,
    courseAlignment,
    attendanceAnalysis,
    activityAnalysisLite,
    subjectAnalysisLite,
    // Part 3: 전략
    weaknessAnalysisLite,
    topicRecommendationLite,
    admissionStrategyLite,
    // 부록
    wordCloud,
  ],
};

/** Standard 플랜 mock 리포트 (21 섹션) */
export const STANDARD_MOCK_REPORT: ReportContent = {
  meta: standardMeta,
  sections: [
    // Part 1: 진단
    studentProfile,
    competencyScoreStandard,
    admissionPredictionStandard,
    diagnosticStandard,
    // Part 2: 분석
    competencyEvaluationLite,
    academicAnalysisStandard,
    courseAlignment,
    attendanceAnalysis,
    activityAnalysisStandard,
    subjectAnalysisStandard,
    behaviorAnalysis,
    overallAssessment,
    // Part 3: 전략
    weaknessAnalysisStandard,
    topicRecommendationStandard,
    interviewPrepStandard,
    admissionStrategyStandard,
    storyAnalysisStandard,
    actionRoadmapStandard,
    // 부록
    bookRecommendationStandard,
    majorExploration,
    wordCloud,
  ],
};

/** Premium 플랜 mock 리포트 (21 섹션 + 확장 필드) */
export const PREMIUM_MOCK_REPORT: ReportContent = {
  meta: premiumMeta,
  sections: [
    // Part 1: 진단
    studentProfile,
    competencyScoreStandard,
    admissionPredictionStandard,
    diagnosticPremium,
    // Part 2: 분석
    competencyEvaluationPremium,
    academicAnalysisPremium,
    courseAlignment,
    attendanceAnalysis,
    activityAnalysisStandard,
    subjectAnalysisPremium,
    behaviorAnalysis,
    overallAssessment,
    // Part 3: 전략
    weaknessAnalysisPremium,
    topicRecommendationPremium,
    interviewPrepPremium,
    admissionStrategyPremium,
    storyAnalysisPremium,
    actionRoadmapPremium,
    // 부록
    bookRecommendationPremium,
    majorExploration,
    wordCloud,
  ],
};
