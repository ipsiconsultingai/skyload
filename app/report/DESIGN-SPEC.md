# DESIGN-SPEC: 생기부 분석 리포트 비주얼 디자인 시스템

> **버전**: v1.0
> **작성일**: 2026-02-28
> **대상**: `app/report/` 전체 리포트 디자인 시스템
> **기반**: 경쟁사(바이브온) 분석 + 현재 디자인 토큰 + PRD 요구사항

---

## 1. 디자인 철학 & 원칙

### 1.1 핵심 방향: "전문 입시 컨설팅 보고서"

현재 리포트가 "AI가 뱉어낸 텍스트 나열" 느낌이라는 피드백을 해결하기 위해, **전문 컨설팅 펌에서 발행하는 보고서** 수준의 시각적 완성도를 목표로 한다.

### 1.2 디자인 원칙

| 원칙                   | 설명                                                   | 적용 방법                                                |
| ---------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| **정보 위계의 명확성** | 모든 콘텐츠에 시각적 우선순위가 있어야 함              | 타이포그래피 스케일, 여백, 색상 무게감으로 위계 구분     |
| **데이터 시각화 우선** | 텍스트만으로 전달하지 않음                             | 프로그래스 바, 점수 원, 비교 차트 등 시각 요소 적극 활용 |
| **컨텐츠 밀도 조절**   | 한 페이지에 너무 많은 정보를 넣지 않음                 | A4 기준 적절한 여백, 카드 간 간격 확보                   |
| **브랜드 일관성**      | 인디고(#4F46E5) 기반 색상 체계를 모든 요소에 일관 적용 | 플랜별 변주는 있되, 기본 톤 유지                         |
| **인쇄 최적화**        | 웹과 인쇄 모두에서 동일한 품질                         | A4 세이프 영역, CMYK 고려, 배경색 최소화                 |

### 1.3 경쟁사 대비 차별화 포인트

바이브온은 보라색 원형 패턴의 화려한 비주얼에 치중하지만, 우리는 **정보의 구조적 명확성과 데이터 기반 설득력**으로 차별화한다.

- 바이브온: 그래픽 중심, 장식적 요소 많음
- 스카이로드: 데이터 시각화 중심, 깔끔한 구조적 레이아웃, 전문 리서치 보고서 톤

---

## 2. 컬러 시스템

### 2.1 CSS 변수 정의 (report.module.css 루트)

```css
.report {
  /* ── 브랜드 Primary ── */
  --report-primary-50: #eef2ff;
  --report-primary-100: #e0e7ff;
  --report-primary-200: #c7d2fe;
  --report-primary-300: #a5b4fc;
  --report-primary-400: #818cf8;
  --report-primary-500: #6366f1;
  --report-primary-600: #4f46e5; /* 메인 브랜드 */
  --report-primary-700: #4338ca;
  --report-primary-800: #3730a3;
  --report-primary-900: #312e81;

  /* ── 플랜 Accent (기본: Lite = Indigo) ── */
  --report-accent: #4f46e5;
  --report-accent-light: #eef2ff;
  --report-accent-muted: #e0e7ff;
  --report-accent-border: #c7d2fe;
  --report-accent-dark: #3730a3;
  --report-accent-fg: #ffffff;

  /* ── Semantic: 강점/약점/추세 ── */
  --report-strength: #059669; /* Emerald-600 (경쟁사와 차별화, 기존 blue 대신) */
  --report-strength-light: #ecfdf5;
  --report-strength-border: #a7f3d0;

  --report-weakness: #dc2626; /* Red-600 유지 */
  --report-weakness-light: #fef2f2;
  --report-weakness-border: #fecaca;

  --report-caution: #d97706; /* Amber-600 (주의 단계 신규 추가) */
  --report-caution-light: #fffbeb;
  --report-caution-border: #fde68a;

  --report-neutral: #64748b; /* Slate-500 */
  --report-neutral-light: #f8fafc;
  --report-neutral-border: #e2e8f0;

  /* ── 추세 (성적 등급 변화) ── */
  --report-trend-up: #059669;
  --report-trend-up-light: #ecfdf5;
  --report-trend-up-border: #a7f3d0;

  --report-trend-stable: #3b82f6;
  --report-trend-stable-light: #eff6ff;
  --report-trend-stable-border: #bfdbfe;

  --report-trend-down: #dc2626;
  --report-trend-down-light: #fef2f2;
  --report-trend-down-border: #fecaca;

  /* ── 등급별 색상 (내신/평가) ── */
  --grade-excellent: #059669; /* 1등급 */
  --grade-good: #3b82f6; /* 2등급 */
  --grade-average: #d97706; /* 3등급 */
  --grade-weak: #dc2626; /* 4등급 이하 */

  /* ── 전략 배지 색상 ── */
  --strategy-reach: #7c3aed; /* 상향 - 보라 */
  --strategy-reach-light: #f5f3ff;
  --strategy-match: #3b82f6; /* 안정 - 파랑 */
  --strategy-match-light: #eff6ff;
  --strategy-safety: #059669; /* 하향 - 초록 */
  --strategy-safety-light: #ecfdf5;

  /* ── 합격 가능성 배지 ── */
  --chance-high: #059669;
  --chance-high-light: #ecfdf5;
  --chance-medium: #d97706;
  --chance-medium-light: #fffbeb;
  --chance-low: #dc2626;
  --chance-low-light: #fef2f2;

  /* ── 기본 UI 색상 ── */
  --report-bg: #ffffff;
  --report-bg-secondary: #f8fafc;
  --report-fg: #0f172a; /* Slate-900 */
  --report-fg-secondary: #475569; /* Slate-600 */
  --report-fg-tertiary: #94a3b8; /* Slate-400 */
  --report-border: #e2e8f0; /* Slate-200 */
  --report-border-strong: #cbd5e1; /* Slate-300 */
}
```

### 2.2 플랜별 Accent 오버라이드

```css
/* Lite: 기본 Indigo (오버라이드 없음) */

.planStandard {
  --report-accent: #2563eb; /* Blue-600 */
  --report-accent-light: #eff6ff;
  --report-accent-muted: #dbeafe;
  --report-accent-border: #bfdbfe;
  --report-accent-dark: #1e40af;
}

.planPremium {
  --report-accent: #7c3aed; /* Violet-600 */
  --report-accent-light: #f5f3ff;
  --report-accent-muted: #ede9fe;
  --report-accent-border: #ddd6fe;
  --report-accent-dark: #5b21b6;
}
```

### 2.3 색상 사용 규칙

- **브랜드 Primary(Indigo)**: 서비스 로고, 커버 페이지, 페이지 헤더/푸터
- **플랜 Accent**: 섹션 번호, 링크, 강조 텍스트, 프로그래스 바, 태그
- **Semantic Colors**: 강점/약점/추세 등 데이터 성격을 직관적으로 전달
- **배경색 사용 최소화**: 카드와 콜아웃에만 연한 배경 사용, 인쇄 시 잉크 절약

---

## 3. 타이포그래피 위계

### 3.1 폰트 스택

```css
--report-font:
  "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
  system-ui, "Noto Sans KR", sans-serif;
```

### 3.2 타이포그래피 스케일

| 토큰                   | 용도              | 크기               | 웨이트 | 행간 | 자간     |
| ---------------------- | ----------------- | ------------------ | ------ | ---- | -------- |
| `--report-fs-display`  | 커버 제목         | `2.25rem` (36px)   | 800    | 1.2  | -0.03em  |
| `--report-fs-h1`       | Part 구분 제목    | `1.75rem` (28px)   | 800    | 1.3  | -0.02em  |
| `--report-fs-h2`       | 섹션 제목         | `1.375rem` (22px)  | 700    | 1.35 | -0.015em |
| `--report-fs-h3`       | 카드/서브 제목    | `1.125rem` (18px)  | 600    | 1.4  | 0        |
| `--report-fs-subtitle` | 소제목, 강조 본문 | `1rem` (16px)      | 500    | 1.5  | 0        |
| `--report-fs-body`     | 본문 텍스트       | `0.9375rem` (15px) | 400    | 1.75 | 0        |
| `--report-fs-small`    | 보조 텍스트       | `0.8125rem` (13px) | 400    | 1.6  | 0        |
| `--report-fs-caption`  | 캡션, 라벨        | `0.75rem` (12px)   | 500    | 1.5  | 0.01em   |
| `--report-fs-overline` | 오버라인 라벨     | `0.6875rem` (11px) | 600    | 1.4  | 0.08em   |

### 3.3 변경 사항 (현재 대비)

- **신규 추가**: `--report-fs-display` (커버 전용 대형 타이포)
- **본문 행간**: 1.7 -> **1.75** (인쇄 시 가독성 향상)
- **caption 웨이트**: 400 -> **500** (라벨 용도 강화)

---

## 4. 공통 컴포넌트 디자인

### 4.1 카드 시스템

#### 기본 카드 (`.card`)

```css
.card {
  background: var(--report-bg);
  border: 1px solid var(--report-border);
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 16px;
}
```

#### 카드 변형

| 변형             | 왼쪽 보더     | 배경색         | 보더 색         | 용도                   |
| ---------------- | ------------- | -------------- | --------------- | ---------------------- |
| `.cardAccent`    | 3px, accent   | 흰색           | 기본            | 일반 강조 카드         |
| `.cardStrength`  | 3px, strength | strength-light | strength-border | 강점 항목              |
| `.cardWeakness`  | 3px, weakness | weakness-light | weakness-border | 약점 항목              |
| `.cardHighlight` | 없음          | accent-light   | accent-border   | 하이라이트 정보 (신규) |
| `.cardNeutral`   | 없음          | neutral-light  | neutral-border  | 중립 정보              |

#### 신규: 하이라이트 카드 (`.cardHighlight`)

경쟁사의 "AI 코멘터리 박스"에 해당. 현재 `.callout`과 유사하나 더 시각적으로 강조.

```css
.cardHighlight {
  background: var(--report-accent-light);
  border: 1px solid var(--report-accent-border);
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 16px;
  position: relative;
}

.cardHighlight::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--report-accent);
  border-radius: 10px 10px 0 0;
}
```

### 4.2 뱃지/태그 시스템

#### 등급 뱃지

4단계 평가(excellent/good/average/weak)를 시각화.

```css
.ratingBadge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.75rem; /* 12px */
  font-weight: 600;
  line-height: 1;
}

.ratingExcellent {
  background: var(--report-strength-light);
  color: var(--report-strength);
  border: 1px solid var(--report-strength-border);
}

.ratingGood {
  background: var(--report-accent-light);
  color: var(--report-accent);
  border: 1px solid var(--report-accent-border);
}

.ratingAverage {
  background: var(--report-caution-light);
  color: var(--report-caution);
  border: 1px solid var(--report-caution-border);
}

.ratingWeak {
  background: var(--report-weakness-light);
  color: var(--report-weakness);
  border: 1px solid var(--report-weakness-border);
}
```

#### 전략 뱃지 (상향/안정/하향)

경쟁사의 "도전형/적정형/안정형" 뱃지에 대응. 색상을 직관적으로 구분.

```css
.strategyBadge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.strategyReach {
  background: var(--strategy-reach-light);
  color: var(--strategy-reach);
}

.strategyMatch {
  background: var(--strategy-match-light);
  color: var(--strategy-match);
}

.strategySafety {
  background: var(--strategy-safety-light);
  color: var(--strategy-safety);
}
```

#### 합격 가능성 배지

```css
.chanceBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
}

.chanceHigh {
  background: var(--chance-high-light);
  color: var(--chance-high);
}

.chanceMedium {
  background: var(--chance-medium-light);
  color: var(--chance-medium);
}

.chanceLow {
  background: var(--chance-low-light);
  color: var(--chance-low);
}
```

#### 카테고리 태그

교과/창체 구분, 과목명 표시 등에 사용.

```css
.categoryTag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.categorySubject {
  background: var(--report-primary-50);
  color: var(--report-primary-700);
}

.categoryActivity {
  background: #fef3c7; /* Amber-100 */
  color: #92400e; /* Amber-800 */
}
```

### 4.3 AI 코멘터리 박스

경쟁사의 AI 아이콘 + 배경 박스에 대응. 우리는 더 절제된 디자인으로 전문성을 강조.

```css
.aiCommentary {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 10px;
  background: var(--report-accent-light);
  border: 1px solid var(--report-accent-border);
  margin: 16px 0;
}

.aiCommentaryIcon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--report-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
}

.aiCommentaryContent {
  flex: 1;
}

.aiCommentaryLabel {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--report-accent);
  margin-bottom: 6px;
}

.aiCommentaryText {
  font-size: 0.9375rem;
  color: var(--report-fg);
  line-height: 1.75;
}
```

**아이콘**: `AI` 텍스트를 둥근 사각형 안에 넣는 심플한 방식 사용. SVG 아이콘 대신 CSS만으로 구현하여 인쇄 호환성 보장.

### 4.4 프로그래스 바 / 스코어 비교

#### 기본 프로그래스 바 (변경 없음, 유지)

기존 CSS 유지. 높이 8px, 라운드 4px.

#### 신규: 비교형 프로그래스 바

경쟁사의 "3단 프로그래스 바"에 대응. 내 점수 vs 합격 구간 vs 전체 평균을 한 바에 시각화.

```css
.comparisonBar {
  position: relative;
  width: 100%;
  height: 24px;
  border-radius: 6px;
  background: var(--report-neutral-light);
  border: 1px solid var(--report-border);
  overflow: visible;
}

.comparisonRange {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--report-accent-light);
  border-left: 2px dashed var(--report-accent-border);
  border-right: 2px dashed var(--report-accent-border);
}

.comparisonMarker {
  position: absolute;
  top: -4px;
  width: 12px;
  height: 32px;
  border-radius: 3px;
  background: var(--report-accent);
  transform: translateX(-50%);
}

.comparisonLabel {
  position: absolute;
  bottom: -20px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--report-fg-secondary);
  transform: translateX(-50%);
  white-space: nowrap;
}
```

#### 점수 원 (Score Circle) -- 개선

기존 scoreCircle의 크기와 보더를 조정하여 더 세련되게.

```css
.scoreCircle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid var(--report-accent);
  background: var(--report-accent-light);
}

.scoreCircleValue {
  font-size: 1.375rem; /* 22px */
  font-weight: 800;
  color: var(--report-accent);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.scoreCircleLabel {
  font-size: 0.625rem; /* 10px */
  color: var(--report-fg-tertiary);
  font-weight: 500;
  margin-top: 2px;
}
```

### 4.5 테이블

#### 기본 테이블 (개선)

경쟁사의 교차 배경색(zebra striping) 패턴 도입.

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem; /* 13px */
  margin: 16px 0;
}

.table th {
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--report-fg-secondary);
  text-align: left;
  border-bottom: 2px solid var(--report-accent);
  background: var(--report-accent-light);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.table td {
  padding: 12px 16px;
  color: var(--report-fg);
  border-bottom: 1px solid var(--report-border);
  vertical-align: top;
}

/* 교차 배경 (zebra) */
.table tbody tr:nth-child(even) {
  background: var(--report-neutral-light);
}

.table tbody tr:last-child td {
  border-bottom: none;
}
```

### 4.6 콜아웃 박스

기존 `.callout` 유지하되, AI 코멘터리와 구분되는 "정보 강조" 용도의 콜아웃.

```css
.callout {
  display: flex;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 10px;
  background: var(--report-accent-light);
  border: 1px solid var(--report-accent-border);
}

.calloutStrength {
  composes: callout;
  background: var(--report-strength-light);
  border-color: var(--report-strength-border);
}

.calloutWeakness {
  composes: callout;
  background: var(--report-weakness-light);
  border-color: var(--report-weakness-border);
}

.calloutCaution {
  composes: callout;
  background: var(--report-caution-light);
  border-color: var(--report-caution-border);
}
```

### 4.7 인용 박스 (신규)

경쟁사의 "따옴표 + 카테고리 라벨 + 인용 텍스트" 패턴에 대응.
세특 문장 분석(Premium)에서 활용.

```css
.quoteBox {
  position: relative;
  padding: 16px 20px 16px 48px;
  border-radius: 8px;
  background: var(--report-neutral-light);
  border: 1px solid var(--report-border);
  margin-bottom: 12px;
}

.quoteBox::before {
  content: "\201C"; /* 왼쪽 큰따옴표 */
  position: absolute;
  top: 8px;
  left: 16px;
  font-size: 2rem;
  font-weight: 800;
  color: var(--report-accent);
  line-height: 1;
  font-family: Georgia, serif;
}

.quoteText {
  font-size: 0.9375rem;
  color: var(--report-fg);
  line-height: 1.7;
  font-style: italic;
}

.quoteEvaluation {
  font-size: 0.8125rem;
  color: var(--report-fg-secondary);
  line-height: 1.6;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--report-border);
}

/* 하이라이트된 문장 */
.quoteBoxHighlight {
  composes: quoteBox;
  background: var(--report-strength-light);
  border-color: var(--report-strength-border);
}

.quoteBoxHighlight::before {
  color: var(--report-strength);
}

/* 개선 필요 문장 */
.quoteBoxImprove {
  composes: quoteBox;
  background: var(--report-caution-light);
  border-color: var(--report-caution-border);
}

.quoteBoxImprove::before {
  color: var(--report-caution);
}
```

---

## 5. 베이스 레이아웃 컴포넌트

### 5.1 커버 페이지

#### 현재 문제점

- 중앙 정렬 텍스트만 나열된 심심한 구성
- 학생 정보가 작은 텍스트로 하단에 위치하여 존재감 없음
- 플랜 차별화가 색상 변경 수준에 그침

#### 개선 방향

상단: 브랜드 + 플랜 뱃지
중단: 타이틀 + 한줄 총평
하단: 학생 정보 카드 (경쟁사 참고)

```css
.coverPage {
  composes: page;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40mm 32mm;
  position: relative;
  overflow: hidden;
}

/* 배경 장식: 우상단 반원 패턴 */
.coverDecoration {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: var(--report-accent-light);
  opacity: 0.5;
  z-index: 0;
}

.coverDecorationSmall {
  position: absolute;
  bottom: 60px;
  left: -40px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: var(--report-accent-light);
  opacity: 0.3;
  z-index: 0;
}

/* 상단 영역 */
.coverTop {
  position: relative;
  z-index: 1;
}

.coverBrand {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--report-accent);
  margin-bottom: 32px;
}

.coverPlanBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 50px;
  background: var(--report-accent);
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 24px;
}

.coverTitle {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--report-fg);
  line-height: 1.25;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.coverDivider {
  width: 48px;
  height: 3px;
  border-radius: 2px;
  background: var(--report-accent);
  margin: 16px 0;
}

.coverSubtitle {
  font-size: 1rem;
  font-weight: 400;
  color: var(--report-fg-secondary);
  line-height: 1.6;
  max-width: 400px;
}

/* 하단: 학생 정보 카드 */
.coverStudentCard {
  position: relative;
  z-index: 1;
  background: var(--report-bg);
  border: 1px solid var(--report-border);
  border-radius: 12px;
  padding: 24px 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 32px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.04);
}

.coverStudentField {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.coverStudentLabel {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--report-fg-tertiary);
}

.coverStudentValue {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--report-fg);
}
```

**변경 포인트**:

- 좌측 정렬로 변경 (중앙 정렬 -> 좌측 정렬, 전문 보고서 톤)
- 배경에 반원형 장식 요소 추가 (경쟁사의 원형 패턴 대응, 더 절제된 버전)
- 학생 정보를 카드 형태로 하단에 배치 (경쟁사의 학생 정보 카드 참고)
- 플랜 뱃지를 채운 버전(filled)으로 변경하여 존재감 강화

### 5.2 목차 (Part별 구분)

#### 현재 문제점

- 단순 리스트 나열, 섹션 간 그룹핑 없음
- 경쟁사처럼 Part 구분이 없어 구조가 평면적

#### 개선 방향

Part별로 섹션을 그룹핑하여 리포트의 구조적 깊이를 보여줌.

```css
/* 목차 Part 그룹 */
.tocPart {
  margin-bottom: 24px;
}

.tocPartHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--report-accent);
}

.tocPartNumber {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--report-accent);
}

.tocPartTitle {
  font-size: 1rem;
  font-weight: 700;
  color: var(--report-fg);
}

/* 목차 항목 (개선) */
.tocItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0 10px 24px;
  border-bottom: 1px solid var(--report-border);
  font-size: 0.9375rem;
}

.tocItem:last-child {
  border-bottom: none;
}

.tocNumber {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--report-accent-light);
  color: var(--report-accent);
  font-size: 0.75rem;
  font-weight: 700;
}

.tocTitle {
  flex: 1;
  font-weight: 500;
  color: var(--report-fg);
}

.tocDots {
  flex: 1;
  border-bottom: 1px dotted var(--report-border-strong);
  margin: 0 8px;
  min-width: 24px;
}

.tocPage {
  flex-shrink: 0;
  font-weight: 600;
  color: var(--report-fg-tertiary);
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
}
```

**Part 구분 매핑** (types.ts의 SECTION_ORDER 기반):

| Part                | 섹션 (Lite)                                          | 섹션 (Premium 추가)    |
| ------------------- | ---------------------------------------------------- | ---------------------- |
| Part 1: 종합 진단   | overview, summary                                    | storyAnalysis          |
| Part 2: 세부 분석   | subjectAnalysis, weakness, researchTopics, interview | supplement, careerPath |
| Part 3: 성적 & 전략 | academic, universityStrategy                         | roadmap                |

### 5.3 Part 구분 페이지 (신규)

경쟁사의 "Part 1 / Part 2 / Part 3" 중간 페이지에 대응.

```css
.partPage {
  composes: page;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 60mm 40mm;
}

.partNumber {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--report-accent);
  margin-bottom: 16px;
}

.partTitle {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--report-fg);
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.partDescription {
  font-size: 1rem;
  color: var(--report-fg-secondary);
  line-height: 1.6;
  max-width: 380px;
  margin-bottom: 32px;
}

.partSections {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.partSectionItem {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: var(--report-fg-secondary);
}

.partSectionBullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--report-accent);
  flex-shrink: 0;
}
```

### 5.4 페이지 헤더/푸터

#### 현재 문제점

- 헤더가 얇은 보더만 있어 존재감 약함
- 푸터의 "Confidential" 텍스트가 서비스 특성에 안 맞음

#### 개선

```css
.pageHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--report-border);
}

.pageHeaderBrand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--report-accent);
  text-transform: uppercase;
}

/* 브랜드 앞에 작은 사각형 마크 */
.pageHeaderBrand::before {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--report-accent);
}

.pageHeaderSection {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--report-fg-tertiary);
}

.pageFooter {
  position: absolute;
  bottom: 16mm;
  left: 24mm;
  right: 24mm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--report-border);
}

.pageFooterText {
  font-size: 0.625rem; /* 10px */
  color: var(--report-fg-tertiary);
  letter-spacing: 0.02em;
}

.pageNumber {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--report-fg-tertiary);
  font-variant-numeric: tabular-nums;
}
```

**변경**: 푸터 텍스트를 "Confidential" -> 저작권/학생명 형태로 변경 권장. 예: `(c) 2026 인생스포 | 김서연`

### 5.5 섹션 헤더

#### 현재 문제점

- 넘버 뱃지가 작고 구분감이 약함
- 섹션 설명이 없어 해당 섹션이 무엇을 분석하는지 맥락 부족

#### 개선

```css
.sectionHeader {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--report-accent);
}

.sectionNumber {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--report-accent);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}

.sectionTitleGroup {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sectionTitle {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--report-fg);
  line-height: 1.3;
}

.sectionSubtitle {
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--report-fg-secondary);
  line-height: 1.5;
}
```

**변경**:

- 넘버 뱃지 크기 28px -> 36px
- 제목 아래에 서브타이틀 추가 가능 (선택적)
- `sectionTitleGroup`으로 제목+서브타이틀 묶기

---

## 6. 섹션별 디자인 개선안

### 6.1 Overview (한줄 총평 + 핵심 키워드)

#### 현재 문제점

- 한줄 총평이 `.verdict` 박스 안에 있어 평범한 카드 느낌
- 키워드가 태그 나열 + 카드 그리드로 중복 표시 (비효율적 레이아웃)
- 키워드 카드가 2x2 그리드인데 3개이므로 불균형

#### 개선 방향

- 한줄 총평을 **대형 인용 스타일**로 강조 (보고서 첫 인상)
- 키워드 3개를 **3컬럼 아이콘 카드**로 정리 (태그 중복 제거)

**레이아웃 구조**:

```
┌──────────────────────────────────────────────┐
│  ✦ 한줄 총평                                  │
│  "생명과학 분야에 대한 깊은 탐구 역량과..."     │
│  (큰 인용 스타일, accent 좌측 보더)            │
└──────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Keyword1 │ │ Keyword2 │ │ Keyword3 │
│ label    │ │ label    │ │ label    │
│ desc...  │ │ desc...  │ │ desc...  │
└──────────┘ └──────────┘ └──────────┘
```

**CSS 핵심 변경**:

- `.verdict` -> 대형 인용 박스 (좌측 4px accent 보더 + 배경)
- `.cardGrid` 3개 키워드 -> `.cardGridThree` 사용

### 6.2 Summary (전체 요약 분석)

#### 현재 문제점

- 강점/약점이 동일한 레이아웃으로 나열되어 시각적 대비가 약함
- 종합 코멘트가 콜아웃으로만 표시되어 특별함 없음

#### 개선 방향

- 강점/약점을 **좌우 2컬럼**으로 대비 (시각적 비교 효과)
- 각 항목에 **아이콘 + 넘버링** 추가
- 종합 코멘트를 AI 코멘터리 박스로 격상

**레이아웃 구조**:

```
┌─────── 강점 ─────────┐ ┌─────── 약점 ──────────┐
│ ● 생명과학 탐구 심화   │ │ ● 수학 교과 연계 부족  │
│   상세 설명...         │ │   상세 설명...         │
│ ● 과학 동아리 리더십   │ │ ● 봉사활동 연계 미흡   │
│   상세 설명...         │ │   상세 설명...         │
│ ● 자기주도 학습 태도   │ │                       │
│   상세 설명...         │ │                       │
└───────────────────────┘ └───────────────────────┘

┌─── AI 종합 코멘트 ─────────────────────────────┐
│ [AI] 전체적으로 생명과학 분야에 대한...          │
└────────────────────────────────────────────────┘
```

### 6.3 SubjectAnalysis (세특 분석)

#### 현재 문제점

- 모든 과목이 동일한 카드 형태로 반복 -> 단조로움
- 평가(rating)가 작은 태그로만 표시되어 한눈에 파악 어려움
- Premium의 문장 분석이 하이라이트 컴포넌트로만 나열됨

#### 개선 방향

- 상단에 **과목 전체 요약 테이블** 추가 (과목명 + 카테고리 + 등급 한눈에)
- 각 과목 카드에 **등급 프로그래스 바** 추가
- Premium 문장 분석은 **인용 박스(`quoteBox`)** 사용
- 중요도(`importancePercent`)를 프로그래스 바가 아닌 **원형 퍼센트**로 표시

**레이아웃 구조**:

```
┌─ 세특 분석 요약 (테이블) ──────────────────────┐
│ 과목        │ 분류 │ 평가  │ 중요도(Premium)    │
│─────────────│──────│───────│───────────────────│
│ 생명과학Ⅱ  │ 교과 │ ●우수 │ ██████████ 35%    │
│ 화학Ⅱ      │ 교과 │ ●양호 │ ██████    20%     │
│ ...         │      │       │                   │
└────────────────────────────────────────────────┘

┌─ 생명과학Ⅱ (상세) ────────────────────────────┐
│ [교과] [●우수]                         [35%]   │
│ 요약 텍스트...                                 │
│                                               │
│ 주요 활동:                                     │
│ · CRISPR-Cas9 메커니즘 탐구 보고서 작성         │
│ · ...                                         │
│                                               │
│ ┌─ AI 평가 (Standard+) ──────────────────┐    │
│ │ [AI] 세특 서술 전반에서...              │    │
│ └────────────────────────────────────────┘    │
│                                               │
│ ┌─ 문장 분석 (Premium) ─────────────────────┐ │
│ │ " 유전자 발현 조절에 관심을...  [핵심]     │ │
│ │   -> 자기주도적 학습 태도가 잘 드러남      │ │
│ └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

### 6.4 Weakness (부족한 부분 분석)

#### 현재 문제점

- 약점 콜아웃과 보완 활동 리스트가 단순 나열
- 각 영역의 심각도가 시각적으로 드러나지 않음

#### 개선 방향

- 각 약점 영역에 **우선순위 뱃지** 추가 (높음/보통/낮음)
- 보완 활동을 **체크리스트 스타일**로 변경 (실행 가능한 액션 느낌)
- 약점 영역을 **아코디언 카드** 형태로 구조화

**레이아웃 구조**:

```
┌─ 수학-과학 융합 활동 ──────── [우선순위: 높음] ─┐
│ 설명: 생명과학 데이터를 수학적으로 분석하거나... │
│                                                │
│ 추천 보완 활동:                                 │
│ □ 통계 소프트웨어를 활용한 데이터 분석...        │
│ □ 로지스틱 성장 모델을 활용한...                │
│ □ 수학·과학 융합 교내 대회 참가                 │
└────────────────────────────────────────────────┘
```

### 6.5 ResearchTopics (탐구 주제 추천)

#### 현재 문제점

- 카드 안에 내용이 밀집되어 가독성 떨어짐
- 관련 과목 태그와 기대 효과가 동일한 시각적 무게로 혼재

#### 개선 방향

- **탐구 주제 카드를 넘버링** (01, 02, 03)
- 상단에 주제명 + 과목 태그, 본문에 설명
- 기대 효과를 **별도 강조 박스**로 분리
- Premium의 활동 설계를 **타임라인 형태**로 시각화

**레이아웃 구조 (Premium)**:

```
┌─ 01 ───────────────────────────────────────────┐
│ CRISPR-Cas9 off-target 효과 최소화...          │
│ [생명과학Ⅱ]                                    │
│                                                │
│ 설명 텍스트...                                 │
│                                                │
│ ┌─ 기대 효과 ──────────────────────────────┐  │
│ │ 유전자 편집 기술에 대한 심층 이해와...     │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ 활동 설계 (5주)                                │
│ ──●── 1주차: 논문 5편 선정 및 읽기             │
│ ──●── 2주차: gRNA 설계 전략별 비교표 작성       │
│ ──●── 3주차: 가상 실험 설계서 작성              │
│ ──●── 4주차: 보고서 작성 및 피드백              │
│ ──●── 5주차: 수정 후 발표대회 출품              │
└────────────────────────────────────────────────┘
```

### 6.6 Interview (예상 면접 질문)

#### 현재 문제점

- 질문 카드가 모두 동일한 크기/스타일로 단조로움
- 질문의 의도(intent)가 작은 텍스트로 묻혀 있음
- Premium의 모범 답변이 추가될 때 카드가 너무 길어짐

#### 개선 방향

- 질문을 **넘버링된 카드**로 유지하되, 의도를 **태그 형태**로 상단에 배치
- Premium 모범 답변을 **접기/펼치기 영역** 또는 **구분된 하위 카드**로 분리
- 답변 전략은 **AI 코멘터리 박스**로 표시

**레이아웃 구조 (Premium)**:

```
┌─ Q1 ──────────────────────────────────────────┐
│ 생명과학부에 지원한 동기와...                   │
│ [진로 동기] [진정성 확인]                       │
│                                                │
│ ┌─ 모범 답변 가이드 ──────────────────────┐    │
│ │ 저는 중학교 때 '이기적 유전자'를 읽고... │    │
│ └────────────────────────────────────────┘    │
│                                                │
│ ┌─ 답변 전략 ────────────────────────────┐    │
│ │ [AI] 동기의 시작점 -> 심화 계기 ->      │    │
│ │     구체적 행동의 3단계 구조로 답변      │    │
│ └────────────────────────────────────────┘    │
└────────────────────────────────────────────────┘
```

### 6.7 Academic (내신 및 모의고사 분석)

#### 현재 문제점

- 미니 스탯 3개가 너무 작고 임팩트 없음
- 내신/모의고사 테이블이 기본 테이블로 동일하게 표시
- 등급 변화 분석(Standard+)이 일반 카드에 묻힘

#### 개선 방향

- 미니 스탯을 **대형 스탯 카드**(더 큰 숫자, accent 배경)로 변경
- 내신 테이블에 **등급별 좌측 컬러 인디케이터** 적용
- 바 차트 유지, **범례** 추가
- 등급 변화 분석을 **독립 카드**로 승격 (추세 아이콘 + 예측 텍스트)

**레이아웃 구조**:

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│   1.8    │ │    6     │ │    5     │
│ 평균등급  │ │ 분석교과  │ │ 모의고사  │
│          │ │  수      │ │  과목 수  │
└──────────┘ └──────────┘ └──────────┘

[바 차트: 교과별 등급]

┌─ 내신 성적표 ──────────────────────────────────┐
│ ▌교과      │ 등급 │ 석차   │                   │
│─┃──────────│──────│────────│                   │
│ ┃생명과학Ⅱ │ 1등급│ 4/120  │ ██████████████ 1  │
│ ┃화학Ⅱ    │ 2등급│ 12/118 │ ████████████   2  │
│ ...                                           │
└────────────────────────────────────────────────┘

┌─ 등급 변화 분석 (Standard+) ───────────────────┐
│ 추세: ↑ 상승                                    │
│ 1학년 대비 2학년 전공 교과 성적이...             │
│                                                │
│ 실행 항목:                                      │
│ · 물리학 주 2회 추가 학습...                     │
│ · ...                                          │
└────────────────────────────────────────────────┘
```

### 6.8 UniversityStrategy (대학 지원 전략)

#### 현재 문제점

- 단순 테이블로 대학 목록만 나열
- 전략(상향/안정/하향)이 텍스트로만 표시
- 합격 가능성 코멘트가 작은 카드로 묻힘

#### 개선 방향

- 대학 지원을 **전략별 그룹핑** (상향 / 안정 / 하향 섹션 분리)
- 각 대학을 **카드 형태**로 표시 (대학명 + 학과 + 전형 + 합격 가능성 뱃지)
- 종합 전략 분석을 AI 코멘터리로 표시

**레이아웃 구조**:

```
┌─ 상향 지원 ────────────────────────────────────┐
│ ┌─ 서울대학교 생명과학부 ──── [합격가능: 보통] ─┐│
│ │ 학생부종합 (일반전형)                        ││
│ │ 전공 교과 성적과 세특 활동은 우수하나...      ││
│ └─────────────────────────────────────────────┘│
└────────────────────────────────────────────────┘

┌─ 안정 지원 ────────────────────────────────────┐
│ ┌─ 연세대학교 ─────────────── [합격가능: 높음] ─┐
│ ...                                            │
│ ┌─ 고려대학교 ─────────────── [합격가능: 높음] ─┐
│ ...                                            │
└────────────────────────────────────────────────┘

┌─ 하향 지원 ────────────────────────────────────┐
│ ...                                            │
└────────────────────────────────────────────────┘

┌─ AI 종합 전략 분석 ────────────────────────────┐
│ [AI] 현재 김서연 학생의 생기부는...             │
└────────────────────────────────────────────────┘
```

### 6.9 StoryAnalysis (생기부 스토리 구조 분석, Premium)

#### 현재 문제점

- 메인 서사가 verdict 박스 안에 있어 다른 섹션과 차별화 안 됨
- 스토리 요소가 일반 카드로 나열

#### 개선 방향

- 메인 서사를 **큰 인용 박스**로 강조
- 스토리 요소를 **플로우 다이어그램 스타일**로 시각화 (연결선으로 이어지는 느낌)
- 일관성 점수(coherenceScore)를 **프로그래스 바** 형태로 표시 (원형 대신)

**레이아웃 구조**:

```
┌─ 메인 서사 ────────────────────────────────────┐
│ " 호기심 -> 체계적 탐구 -> 윤리적 과학자 "     │
│   (큰 인용 스타일)                              │
└────────────────────────────────────────────────┘

┌─ 테마 1 ─────────────────────── 일관성 9/10 ──┐
│ 호기심에서 탐구로                               │
│ 설명...                                        │
│ [생명과학Ⅰ] [생명과학Ⅱ] [과학탐구실험]         │
├────────────── ↓ ───────────────────────────────┤
│ 테마 2                          일관성 8/10     │
│ 개인 역량에서 리더십으로                         │
│ ...                                            │
├────────────── ↓ ───────────────────────────────┤
│ 테마 3                          일관성 7/10     │
│ 기술과 윤리의 균형                              │
│ ...                                            │
└────────────────────────────────────────────────┘
```

### 6.10 Supplement (컨설팅급 보완 전략, Premium)

#### 현재 문제점

- 현재/목표 상태가 2컬럼으로 나란히 있으나 시각적 대비가 약함
- 우선순위가 태그로만 표시

#### 개선 방향

- 현재 -> 목표 를 **화살표 표기**로 변환 진행감 표현
- 우선순위별 **보더 색상 차별화** (high=accent, medium=caution, low=neutral)
- 실행 계획을 **넘버링된 체크리스트**로 표시

**레이아웃 구조**:

```
┌─ 수학-과학 융합 활동 ──── [우선순위: 높음] ────┐
│                                                │
│ ┌── 현재 ──┐       ┌── 목표 ──┐               │
│ │ 개체군    │  -->  │ 통계분석  │               │
│ │ 모델 1건  │       │ 활동 2건+ │               │
│ └──────────┘       └──────────┘               │
│                                                │
│ 실행 계획:                                      │
│ 1. 3학년 1학기: 확률과 통계 수업에서...          │
│ 2. 3학년 1학기: 수학 동아리로 Python...          │
│ 3. 교내 수학·과학 융합 발표대회 참가             │
└────────────────────────────────────────────────┘
```

### 6.11 CareerPath (진로 및 선택과목 연계, Premium)

#### 현재 문제점

- 목표 진로가 verdict 박스로 표시 -> 다른 섹션과 동일한 느낌
- 추천 선택과목이 일반 카드 나열

#### 개선 방향

- 목표 진로를 **히어로 카드** (큰 텍스트 + accent 배경)
- 진로 분석을 AI 코멘터리 박스로 표시
- 추천 선택과목을 **3컬럼 카드 그리드**로 정리, 각 카드에 연관성 태그

**레이아웃 구조**:

```
┌─ 목표 진로 ──────────────────────────────────┐
│ 생명과학 연구원 / 유전공학자                   │
│ (accent 배경, 큰 텍스트)                      │
└───────────────────────────────────────────────┘

┌─ AI 진로 분석 ─────────────────────────────────┐
│ [AI] 김서연 학생이 목표로 하는...              │
└────────────────────────────────────────────────┘

┌───────────┐ ┌────────────┐ ┌───────────┐
│ 확률과통계 │ │ 미적분      │ │ 물리학Ⅱ  │
│ 이유...    │ │ 이유...     │ │ 이유...   │
│ [연관성:   │ │ [연관성:    │ │ [연관성:  │
│  높음]     │ │  높음]      │ │  보통]    │
└───────────┘ └────────────┘ └───────────┘
```

### 6.12 Roadmap (구체적 실행 로드맵, Premium)

#### 현재 문제점

- 4단계 로드맵이 동일한 `.cardAccent`로 나열 -> 진행감 없음
- 최종 목표가 verdict 박스로 표시 -> 클라이맥스 부족

#### 개선 방향

- **타임라인 비주얼** 도입 (좌측 연결선 + 단계별 원형 넘버)
- 각 단계를 **기간 태그 + 목표 + 과제**로 구조화
- 최종 목표를 **대형 accent 배경 카드**로 마무리

**레이아웃 구조**:

```
│
●── 1단계: 기반 강화 ─── [12월~2월] ────────────
│   목표:
│   · 물리학Ⅰ 복습 및 물리학Ⅱ 선행 학습
│   실행 과제:
│   · 물리학Ⅰ 기출 문제 300제 풀이
│   · R 프로그래밍 기초 온라인 강의 수강
│
●── 2단계: 세특 보강 ─── [3월~7월] ─────────────
│   ...
│
●── 3단계: 지원 준비 ─── [7월~9월] ─────────────
│   ...
│
●── 4단계: 면접 집중 ─── [10월~11월] ────────────
│   ...
│
┌──────────────────────────────────────────────┐
│ ★ 최종 목표                                   │
│ 서울대학교 생명과학부 학생부종합전형 합격...    │
│ (accent 그라데이션 배경)                       │
└──────────────────────────────────────────────┘
```

**타임라인 CSS**:

```css
.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 0;
  left: 15px;
  width: 2px;
  height: 100%;
  background: var(--report-accent-border);
}

.timelineItem {
  position: relative;
  padding-bottom: 32px;
}

.timelineItem:last-child {
  padding-bottom: 0;
}

.timelineDot {
  position: absolute;
  left: -32px;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--report-accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  z-index: 1;
}

.timelineContent {
  background: var(--report-bg);
  border: 1px solid var(--report-border);
  border-radius: 10px;
  padding: 20px 24px;
}

.timelinePeriod {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: 4px;
  background: var(--report-accent-light);
  color: var(--report-accent);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 12px;
}
```

---

## 7. 인쇄 최적화

### 7.1 페이지 설정

```css
@media print {
  @page {
    size: A4 portrait;
    margin: 15mm 18mm; /* 좌우 여백 12mm -> 18mm (본문 영역 충분히 확보) */
  }
}
```

### 7.2 인쇄 시 색상 처리

- 배경색은 **최소한으로** 사용 (잉크 절약)
- 인쇄 시 `-webkit-print-color-adjust: exact` 설정으로 배경색 강제 출력
- 프로그래스 바, 뱃지 배경은 인쇄 필수 -> `print-color-adjust: exact`
- 워터마크 opacity를 인쇄 시 `0.03`으로 조정 (현재 설정 유지)

```css
@media print {
  .ratingBadge,
  .strategyBadge,
  .chanceBadge,
  .categoryTag,
  .progressFill,
  .sectionNumber,
  .timelineDot,
  .coverPlanBadge,
  .coverStudentCard,
  .cardHighlight,
  .aiCommentary {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### 7.3 페이지 나눔 규칙

```css
@media print {
  /* 커버: 항상 독립 페이지 */
  .coverPage {
    page-break-after: always;
  }

  /* 목차: 독립 페이지 */
  .tocPage {
    page-break-after: always;
  }

  /* Part 구분 페이지: 독립 페이지 */
  .partPage {
    page-break-before: always;
    page-break-after: always;
  }

  /* 섹션: 가능한 한 잘리지 않게 */
  .section {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* 카드, 테이블 행: 중간에 잘리지 않게 */
  .card,
  .cardAccent,
  .cardStrength,
  .cardWeakness,
  .cardHighlight,
  .aiCommentary,
  .quoteBox,
  .interviewCard,
  .timelineItem {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .table tr {
    page-break-inside: avoid;
  }

  /* 차트: 잘리지 않게 */
  .chartContainer,
  .radarChart,
  .barChart {
    page-break-inside: avoid;
  }
}
```

### 7.4 인쇄 시 숨김 요소

```css
@media print {
  .noPrint {
    display: none !important;
  }

  /* 웹 전용 그림자 제거 */
  .card,
  .coverStudentCard {
    box-shadow: none;
  }

  /* 호버 효과 제거 */
  .table tbody tr:hover {
    background: transparent;
  }
}
```

### 7.5 A4 세이프 영역

- 인쇄 가능 영역: 210mm x 297mm
- 좌우 여백: 18mm
- 상하 여백: 15mm
- **실제 컨텐츠 영역: 174mm x 267mm**
- 최대 텍스트 폭: 174mm (~660px at 96dpi)

---

## 8. 구현 우선순위

| 순서 | 항목                             | 영향 범위                                   |
| ---- | -------------------------------- | ------------------------------------------- |
| 1    | CSS 변수 업데이트 (컬러, 타이포) | 전체                                        |
| 2    | 커버 페이지 재설계               | ReportCover.tsx                             |
| 3    | 섹션 헤더 + 페이지 헤더/푸터     | SectionHeader.tsx, ReportPage.tsx           |
| 4    | 목차 + Part 구분 페이지          | ReportTableOfContents.tsx (+ 신규 PartPage) |
| 5    | 카드/태그/뱃지 시스템            | report.module.css                           |
| 6    | AI 코멘터리 + 인용 박스 (신규)   | 신규 컴포넌트                               |
| 7    | 각 섹션 렌더러 개선 (12개)       | 각 \*Renderer.tsx                           |
| 8    | 타임라인 컴포넌트 (Roadmap용)    | 신규 CSS + RoadmapRenderer.tsx              |
| 9    | 인쇄 스타일 최적화               | @media print 블록                           |

---

## 9. 변경하지 않는 것

- **types.ts**: 타입 시스템은 변경하지 않음
- **mock-data.ts**: 목 데이터 구조 변경 없음
- **ReportRenderer.tsx**: 플랜별 라우팅 로직 유지
- **SectionRenderer.tsx**: 섹션 ID 기반 분기 구조 유지
- **폰트 스택**: Pretendard Variable 유지
- **CSS Modules 방식**: Tailwind 미사용, CSS Modules 유지
