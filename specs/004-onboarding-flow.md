# 온보딩 플로우

> 한 줄 요약: 신규 유저가 회원가입 후 5단계 온보딩 위자드를 통해 입시 정보 입력, 생기부 등록, 목표 대학 설정, 결제, 리포트 확인까지 완료하는 플로우

## 개요

### 배경

- 현재 회원가입 후 유저가 무엇을 해야 하는지 안내가 없어 이탈률이 높음
- 생기부 AI 분석 서비스 이용을 위해 입시 정보, 생기부 데이터, 목표 대학이 모두 필요
- 각 기능이 `/profile/settings`, `/record/submit` 등 별도 페이지에 흩어져 있어 신규 유저의 진입 장벽이 높음
- 온보딩 위자드로 핵심 데이터를 순차적으로 수집하여 첫 분석까지의 경로를 최소화해야 함

### 목표

- 신규 유저가 회원가입 후 5단계 온보딩을 통해 첫 리포트 확인까지 도달
- 온보딩 중간 이탈 시 복귀할 수 있도록 진행 상태 서버 저장
- 기존 `/profile/settings`와 `/record/submit`의 UI/로직을 재활용하여 개발 비용 최소화

## 사용자 시나리오

### 시나리오 1: 정상 온보딩 완료

```
1. 유저가 소셜 로그인으로 회원가입
2. 시스템이 /onboarding으로 리다이렉트
3. Step 1: 이름, 전화번호, 고등학교, 학년, 입시년도 입력 → "다음" 클릭
4. Step 2: PDF/이미지/텍스트 중 입력 방식 선택 후 생기부 등록 → "다음" 클릭
5. Step 3: 1지망 대학 설정 (필수), 2~3지망 선택적 추가 → "다음" 클릭
6. Step 4: 결제 플랜 선택 및 결제 진행 → 결제 완료
7. Step 5: AI 분석 진행 상태 확인 및 리포트 열람
8. 온보딩 완료 → 이후 /onboarding 접근 시 메인 대시보드로 리다이렉트
```

### 시나리오 2: 온보딩 중간 이탈 후 복귀

```
1. 유저가 Step 2까지 완료 후 브라우저를 닫음
2. 다시 로그인 시 시스템이 profiles.onboarding_step 값(3)을 확인
3. /onboarding으로 리다이렉트 → Step 3부터 이어서 진행
```

### 시나리오 3: 이미 온보딩 완료한 유저의 재접근

```
1. 온보딩 완료 유저가 /onboarding URL을 직접 입력
2. 미들웨어가 profiles.onboarding_completed = true 확인
3. / (메인 페이지)로 리다이렉트
```

### 시나리오 4: Step 1에서 뒤로가기

```
1. 유저가 Step 1에서 브라우저 뒤로가기 또는 "이전" 클릭
2. Step 1이 첫 단계이므로 뒤로가기 불가 (버튼 숨김)
3. 브라우저 뒤로가기 시 beforeunload 경고 없이 이전 페이지로 이동
   (입력 데이터는 서버에 저장되지 않은 상태)
```

## 요구사항

### 기능 요구사항

우선순위: 🔴 필수 | 🟡 권장 | 🟢 선택

**공통**

- [ ] 🔴 `/onboarding` 라우트 및 온보딩 위자드 페이지
- [ ] 🔴 StepIndicator 컴포넌트로 5단계 진행 상태 표시
- [ ] 🔴 각 Step 간 "이전"/"다음" 네비게이션
- [ ] 🔴 profiles 테이블에 `onboarding_step`, `onboarding_completed` 컬럼 추가
- [ ] 🔴 Step 완료 시 서버에 `onboarding_step` 업데이트 (이탈 후 복귀 지원)
- [ ] 🔴 미들웨어: 온보딩 미완료 유저를 `/onboarding`으로 리다이렉트
- [ ] 🔴 미들웨어: 온보딩 완료 유저의 `/onboarding` 접근 시 `/`로 리다이렉트
- [ ] 🟡 Step 전환 시 화면 전환 애니메이션 (slide 또는 fade)
- [ ] 🟢 온보딩 "나중에 하기" (스킵) 기능 (Step 4, 5만 해당)

**Step 1: 입시 정보 입력**

- [ ] 🔴 이름 입력 (필수, 텍스트)
- [ ] 🔴 전화번호 입력 (필수, 010-XXXX-XXXX 형식 검증)
- [ ] 🔴 고등학교 검색 및 선택 (기존 `/api/schools` API 활용, 모달)
- [ ] 🔴 학교 유형 자동 설정 (검색 결과에서 가져옴, 수동 변경 가능)
- [ ] 🔴 학년 선택 (고1/고2/고3/졸업생, 필수)
- [ ] 🔴 입학년도 선택 (필수)
- [ ] 🔴 입력 완료 시 profiles 테이블에 저장
- [ ] 🟡 전화번호 자동 하이픈 삽입

**Step 2: 생기부 등록**

- [ ] 🔴 입력 방식 선택 (PDF / 이미지 / 텍스트 직접 입력)
- [ ] 🔴 기존 RecordSubmitWizard의 Step 1~3 로직 재활용
- [ ] 🔴 PDF 업로드 → AI 파싱 → 데이터 확인/수정 → 완료
- [ ] 🔴 이미지 업로드 → AI 파싱 → 데이터 확인/수정 → 완료
- [ ] 🔴 텍스트 직접 입력 → 데이터 확인 → 완료
- [ ] 🔴 생기부 데이터 records 테이블에 저장
- [ ] 🟡 임시저장 (draft) 기능 (기존 record_drafts 활용)
- [ ] 🟡 AI 파싱 실패 시 텍스트 입력으로 폴백 안내

**Step 3: 목표 대학 설정**

- [ ] 🔴 1지망 대학 설정 (필수)
- [ ] 🟡 2지망 대학 설정 (선택)
- [ ] 🟢 3지망 대학 설정 (선택)
- [ ] 🔴 각 지망별 입력 필드: 대학명, 전형(입학전형), 모집단위(학과), 소계열
- [ ] 🔴 대학 검색 API 연동 (NEIS 또는 별도 대학 데이터)
- [ ] 🔴 전형 유형 선택 (학생부종합, 학생부교과, 논술 등)
- [ ] 🔴 저장 시 target_universities 테이블에 upsert
- [ ] 🟡 대학 검색 자동완성 (debounce 300ms)
- [ ] 🟡 지망 추가/삭제 UI (1지망은 삭제 불가)

**Step 4: 결제 (Placeholder)**

- [ ] 🔴 결제 플랜 표시 (plans 테이블 데이터 활용)
- [ ] 🔴 "결제하기" 버튼 (실제 결제 연동은 후속 개발)
- [ ] 🟡 Placeholder UI: "결제 기능은 준비 중입니다" 안내
- [ ] 🟢 무료 체험 옵션 (플랜 없이 다음 단계로 이동 가능)

**Step 5: 리포트 확인 (Placeholder)**

- [ ] 🔴 분석 진행 상태 표시 (대기/분석중/완료)
- [ ] 🔴 "온보딩 완료" 버튼 → `onboarding_completed = true` 설정
- [ ] 🟡 Placeholder UI: 리포트 미리보기 목업
- [ ] 🟢 리포트 준비 완료 시 알림 (이메일 또는 푸시)

### 비기능 요구사항

- **성능**: Step 전환 시 로딩 200ms 이내 (클라이언트 상태 전환 기준)
- **보안**: 모든 API 호출은 인증 필요 (Supabase RLS), 타인의 프로필 접근 차단
- **접근성**: 키보드 네비게이션 지원 (Tab/Enter로 Step 이동), aria-label 제공
- **반응형**: 모바일 우선 (최소 360px), 데스크톱까지 대응

## 구현 가이드

### 구현 위치

```
app/onboarding/
├── page.tsx                    # 서버 컴포넌트 (인증 확인, 초기 데이터 fetch)
├── page.module.css             # 온보딩 전용 스타일
└── _components/
    ├── OnboardingWizard.tsx     # 메인 위자드 (클라이언트 컴포넌트)
    ├── StepIndicator.tsx        # 5단계 진행 표시 (기존 컴포넌트 확장)
    ├── ProfileStep.tsx          # Step 1: 입시 정보
    ├── RecordStep.tsx           # Step 2: 생기부 등록
    ├── UniversityStep.tsx       # Step 3: 목표 대학
    ├── PaymentStep.tsx          # Step 4: 결제 (Placeholder)
    ├── ReportStep.tsx           # Step 5: 리포트 (Placeholder)
    └── types.ts                 # 온보딩 전용 타입
```

### 기존 코드 활용

| 모듈 | 용도 | 참고 |
| --- | --- | --- |
| `app/profile/settings/_components/ProfileSettingsForm.tsx` | Step 1 입시 정보 입력 UI/로직 | 학교 검색 모달, 필드 구조 재활용 |
| `app/record/submit/_components/RecordSubmitWizard.tsx` | Step 2 생기부 등록 로직 | MethodSelect, PdfUpload, ImageUpload, TextInput, Review 재활용 |
| `app/record/submit/_components/StepIndicator.tsx` | Step 진행 표시 UI 패턴 | 5단계로 확장 |
| `app/record/submit/_components/types.ts` | SchoolRecord 등 데이터 타입 | 그대로 import |
| `app/api/schools/route.ts` | 고등학교 검색 API | Step 1에서 활용 |
| `libs/store/auth-provider.tsx` | 인증 상태 관리 | 온보딩 상태 확인에 활용 |
| `middleware.ts` | 라우트 보호 | 온보딩 리다이렉트 로직 추가 |

## 상세 스펙

### 타입 정의

```typescript
// app/onboarding/_components/types.ts

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export interface OnboardingState {
  step: OnboardingStep;
  profileCompleted: boolean;
  recordCompleted: boolean;
  universityCompleted: boolean;
  paymentCompleted: boolean;
}

/** Step 1: 입시 정보 */
export interface ProfileStepData {
  name: string;
  phone: string;
  highSchoolName: string;
  highSchoolType: string;
  grade: string;
  admissionYear: number | null;
}

/** Step 3: 목표 대학 (1~3지망) */
export type UniversityPriority = 1 | 2 | 3;

export interface TargetUniversity {
  id?: string;              // 기존 데이터 수정 시 사용
  priority: UniversityPriority;
  universityName: string;   // 대학명
  admissionType: string;    // 전형 (학생부종합, 학생부교과, 논술 등)
  department: string;       // 모집단위 (학과)
  subField: string;         // 소계열 (선택)
}

export interface UniversityStepData {
  universities: TargetUniversity[];
}

/** 전형 유형 */
export const ADMISSION_TYPES = [
  "학생부종합",
  "학생부교과",
  "논술",
  "실기/실적",
  "기타",
] as const;

export type AdmissionType = (typeof ADMISSION_TYPES)[number];
```

### DB 스키마 변경

#### profiles 테이블 컬럼 추가

```sql
ALTER TABLE profiles
  ADD COLUMN onboarding_step integer NOT NULL DEFAULT 1
    CHECK (onboarding_step >= 1 AND onboarding_step <= 5),
  ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;
```

#### target_universities 테이블 변경

기존 `target_universities` 테이블에 `priority` 컬럼 추가:

```sql
ALTER TABLE target_universities
  ADD COLUMN priority integer NOT NULL DEFAULT 1
    CHECK (priority >= 1 AND priority <= 3);

-- 유저당 같은 priority는 하나만 존재
CREATE UNIQUE INDEX idx_target_universities_user_priority
  ON target_universities (user_id, priority);
```

### API 설계

| 엔드포인트 | 메서드 | 설명 | 인증 | 요청 | 응답 |
| --- | --- | --- | --- | --- | --- |
| `/api/onboarding/profile` | PUT | Step 1 입시 정보 저장 | 필요 | `ProfileStepData` | `{ success: true }` |
| `/api/onboarding/step` | PUT | 온보딩 단계 업데이트 | 필요 | `{ step: number }` | `{ success: true }` |
| `/api/onboarding/complete` | POST | 온보딩 완료 처리 | 필요 | - | `{ success: true }` |
| `/api/universities` | GET | 대학 검색 | 필요 | `?q=서울대` | `University[]` |
| `/api/onboarding/universities` | PUT | 목표 대학 저장 | 필요 | `{ universities: TargetUniversity[] }` | `{ success: true }` |

#### 요청/응답 예시

**PUT /api/onboarding/profile**

```json
// Request
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "highSchoolName": "서울고등학교",
  "highSchoolType": "일반고",
  "grade": "high3",
  "admissionYear": 2024
}

// Response (성공)
{ "success": true }

// Response (에러)
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "이름은 필수 입력 항목입니다."
  }
}
```

**PUT /api/onboarding/universities**

```json
// Request
{
  "universities": [
    {
      "priority": 1,
      "universityName": "서울대학교",
      "admissionType": "학생부종합",
      "department": "컴퓨터공학부",
      "subField": "공학"
    },
    {
      "priority": 2,
      "universityName": "연세대학교",
      "admissionType": "학생부종합",
      "department": "컴퓨터과학과",
      "subField": "공학"
    }
  ]
}

// Response (성공)
{ "success": true }
```

### 컴포넌트 설계

#### OnboardingWizard (메인 위자드)

```
OnboardingWizard.tsx
├── StepIndicator          (5단계 표시)
├── ProfileStep            (Step 1)
├── RecordStep             (Step 2, RecordSubmitWizard 래핑)
├── UniversityStep         (Step 3)
├── PaymentStep            (Step 4, Placeholder)
└── ReportStep             (Step 5, Placeholder)
```

#### Props 인터페이스

```typescript
interface OnboardingWizardProps {
  initialStep: OnboardingStep;
  initialProfile: ProfileStepData;
  initialUniversities: TargetUniversity[];
  hasRecord: boolean;           // 이미 생기부 등록 여부
}

interface ProfileStepProps {
  initialData: ProfileStepData;
  onComplete: (data: ProfileStepData) => void;
}

interface RecordStepProps {
  hasRecord: boolean;
  onComplete: () => void;
  onBack: () => void;
}

interface UniversityStepProps {
  initialData: TargetUniversity[];
  onComplete: (data: TargetUniversity[]) => void;
  onBack: () => void;
}

interface PaymentStepProps {
  onComplete: () => void;
  onBack: () => void;
}

interface ReportStepProps {
  onComplete: () => void;
  onBack: () => void;
}
```

#### 상태 관리

- **서버/클라이언트**: 혼합 (page.tsx는 서버, Wizard는 클라이언트)
- **로컬 상태**: `useState`로 현재 Step, 각 Step의 폼 데이터 관리
- **서버 상태**: 각 Step 완료 시 즉시 서버에 저장 (`profiles.onboarding_step` 업데이트)
- **전역 상태**: 불필요 (Wizard 내부에서만 관리)

### UI/UX

#### 화면 구성

```
┌──────────────────────────────────────────┐
│  Header (로고만 표시, 네비게이션 숨김)      │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Step Indicator                    │  │
│  │  ① ─── ② ─── ③ ─── ④ ─── ⑤     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │  Step Content Area                 │  │
│  │  (각 Step별 폼/컨텐츠)              │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  [이전]              [다음/완료]    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

#### Step Indicator 레이블

| Step | 레이블 | 아이콘 |
| --- | --- | --- |
| 1 | 입시 정보 | `User` |
| 2 | 생기부 등록 | `FileText` |
| 3 | 목표 대학 | `GraduationCap` |
| 4 | 결제 | `CreditCard` |
| 5 | 리포트 | `BarChart` |

#### 인터랙션

- **로딩**: Step 전환 시 버튼 disabled + 스피너, AI 파싱 시 오버레이 로딩
- **에러**: 유효성 검증 에러는 인라인 메시지, API 에러는 토스트
- **성공**: Step 완료 시 자동으로 다음 Step으로 전환 (토스트 없음)

## Step별 상세 동작

### Step 1: 입시 정보 입력

**필드 구성**

| 필드 | 타입 | 필수 | 유효성 검증 | DB 컬럼 |
| --- | --- | --- | --- | --- |
| 이름 | text | 필수 | 1~20자, 공백 불가 | `profiles.name` |
| 전화번호 | tel | 필수 | `010-XXXX-XXXX` 패턴 | `profiles.phone` |
| 고등학교 | 검색 선택 | 필수 | 검색 API 결과 또는 직접 입력 | `profiles.high_school_name` |
| 학교 유형 | select | 필수 | SCHOOL_TYPES 중 선택 | `profiles.high_school_type` |
| 학년 | select | 필수 | high1/high2/high3/graduate | `profiles.grade` |
| 입학년도 | select | 필수 | 2015~현재년도 | `profiles.admission_year` |

**동작**

1. 서버에서 기존 profiles 데이터를 초기값으로 전달
2. 유저가 모든 필수 필드를 채우면 "다음" 버튼 활성화
3. "다음" 클릭 시:
   - 클라이언트 유효성 검증
   - `PUT /api/onboarding/profile` 호출
   - 성공 시 `onboarding_step = 2`로 업데이트
   - Step 2로 전환

### Step 2: 생기부 등록

**동작**

1. 기존 `RecordSubmitWizard` 컴포넌트를 래핑하여 사용
2. RecordSubmitWizard의 내부 Step (방식 선택 → 업로드/입력 → 확인 → 제출)을 그대로 활용
3. 생기부 제출 완료 콜백 시:
   - `onboarding_step = 3`으로 업데이트
   - 온보딩 Step 3으로 전환
4. 이미 생기부가 등록되어 있는 경우 (이탈 후 복귀):
   - "이미 등록된 생기부가 있습니다. 다음 단계로 진행하시겠습니까?" 안내
   - "다음" 또는 "새로 등록" 선택지 제공

**RecordSubmitWizard 연동 방식**

- `mode="create"` 고정
- 제출 완료 시 라우터 이동(`/record`)을 하지 않고 콜백으로 온보딩 다음 Step으로 전환
- RecordSubmitWizard에 `onSubmitSuccess?: () => void` prop 추가 필요

### Step 3: 목표 대학 설정

**필드 구성 (지망별)**

| 필드 | 타입 | 필수 | 유효성 검증 |
| --- | --- | --- | --- |
| 대학명 | 검색 선택 | 필수 | 대학 검색 API 결과 또는 직접 입력 |
| 전형 | select | 필수 | ADMISSION_TYPES 중 선택 |
| 모집단위 | text | 필수 | 1~50자 |
| 소계열 | text | 선택 | 0~50자 |

**동작**

1. 1지망 카드가 기본 표시 (삭제 불가)
2. "지망 추가" 버튼으로 2지망, 3지망 카드 추가 (최대 3개)
3. 2~3지망은 삭제 가능
4. 각 카드는 접기/펼치기 가능 (입력 완료 시 접힌 상태로 요약 표시)
5. 1지망 필수 필드가 모두 채워지면 "다음" 버튼 활성화
6. "다음" 클릭 시:
   - 클라이언트 유효성 검증
   - `PUT /api/onboarding/universities` 호출 (upsert)
   - 성공 시 `onboarding_step = 4`로 업데이트
   - Step 4로 전환

**대학 검색 UI**

- 고등학교 검색과 동일한 모달 패턴 사용
- 검색 API: `GET /api/universities?q=서울대`
- 검색 결과 없을 시 직접 입력 옵션 제공
- debounce 300ms 적용

### Step 4: 결제 (Placeholder)

**현재 단계에서의 구현**

1. plans 테이블에서 활성 플랜 목록 표시
2. 각 플랜의 이름, 설명, 가격 카드 형태로 나열
3. "결제하기" 버튼은 "현재 준비 중입니다" 토스트 표시
4. **임시**: "다음" 버튼으로 Step 5 이동 가능 (결제 없이)
5. 후속 개발에서 Toss Payments 연동 예정

### Step 5: 리포트 확인 (Placeholder)

**현재 단계에서의 구현**

1. "분석을 준비하고 있습니다" 안내 메시지 표시
2. 목표 대학 요약 정보 카드
3. "온보딩 완료" 버튼:
   - `POST /api/onboarding/complete` 호출
   - `onboarding_completed = true`, `onboarding_step = 5` 설정
   - `/` (메인 대시보드)로 리다이렉트

## 미들웨어 로직

### 온보딩 리다이렉트 규칙

```typescript
// middleware.ts 에 추가할 로직 (의사코드)

// 1. 인증되지 않은 유저 → 기존 로직 유지
// 2. 인증된 유저:
//    a. onboarding_completed === false:
//       - /onboarding 접근 → 허용
//       - /api/* 접근 → 허용
//       - /auth/* 접근 → 허용
//       - 그 외 → /onboarding으로 리다이렉트
//    b. onboarding_completed === true:
//       - /onboarding 접근 → /로 리다이렉트
//       - 그 외 → 허용
```

### 예외 경로 (온보딩 리다이렉트 제외)

- `/api/*` (API 엔드포인트)
- `/auth/*` (인증 콜백)
- `/onboarding` (온보딩 자체)
- `/_next/*` (Next.js 내부)
- 정적 파일 (이미지, 폰트 등)

## 에러 처리

### 예상 에러 케이스

| 에러 상황 | 에러 코드 | 사용자 메시지 | 처리 방법 |
| --- | --- | --- | --- |
| Step 1 유효성 검증 실패 | `VALIDATION_ERROR` | 필드별 인라인 에러 메시지 | 해당 필드 하이라이트 |
| 고등학교 검색 API 실패 | `SCHOOL_SEARCH_FAILED` | "학교 검색에 실패했습니다." | 직접 입력 안내 |
| 생기부 AI 파싱 실패 | `PARSE_FAILED` | "AI 파싱에 실패했습니다. 다시 시도해주세요." | 재시도 버튼 + 텍스트 입력 폴백 |
| 대학 검색 API 실패 | `UNIVERSITY_SEARCH_FAILED` | "대학 검색에 실패했습니다." | 직접 입력 안내 |
| 서버 저장 실패 | `SAVE_FAILED` | "저장에 실패했습니다. 다시 시도해주세요." | 토스트 + 재시도 |
| 인증 만료 | `UNAUTHORIZED` | "다시 로그인해주세요." | 로그인 페이지 이동 |
| 네트워크 오류 | `NETWORK_ERROR` | "네트워크 연결을 확인해주세요." | 토스트 + 재시도 |

### 에러 복구 전략

- **자동 재시도**: 서버 저장 실패 시 1회 자동 재시도 (2초 딜레이)
- **폴백**: AI 파싱 실패 시 텍스트 직접 입력으로 안내
- **사용자 액션**: 재시도 버튼 또는 "다시 시도" 토스트

## 엣지 케이스

### 온보딩 중간 이탈 후 복귀

- `profiles.onboarding_step` 값으로 마지막 완료 Step 판단
- Step 1: 프로필 데이터가 이미 저장되어 있으면 폼에 pre-fill
- Step 2: `records` 테이블에 데이터가 있으면 "이미 등록됨" 안내
- Step 3: `target_universities`에 데이터가 있으면 기존 데이터 pre-fill

### 브라우저 뒤로가기/새로고침

- 뒤로가기: Step 전환은 URL 변경 없이 클라이언트 상태로 관리 → 브라우저 뒤로가기 시 온보딩 페이지를 벗어남
- 새로고침: page.tsx 서버 컴포넌트에서 `onboarding_step`을 읽어 해당 Step부터 시작

### 이미 온보딩 완료한 유저

- 미들웨어에서 `/onboarding` 접근을 `/`로 리다이렉트
- 프로필 수정은 기존 `/profile/settings`에서 가능
- 생기부 재등록은 기존 `/record/submit`에서 가능
- 목표 대학 변경은 별도 페이지 필요 (후속 개발)

### 동시 탭에서 온보딩 진행

- 서버에 마지막으로 저장된 `onboarding_step`이 기준
- 다른 탭에서 이미 진행한 경우, 새로고침 시 서버 상태에 맞춰짐
- 충돌 방지를 위한 별도 처리는 하지 않음 (마지막 저장 우선)

## Step 간 데이터 의존성

```
Step 1 (입시 정보) ──→ Step 2 (생기부)
  │                       │
  │ profiles 테이블에      │ records 테이블에
  │ 이름/학교/학년 저장     │ 생기부 데이터 저장
  │                       │
  └───────────────────────┼──→ Step 3 (목표 대학)
                          │       │
                          │       │ target_universities에
                          │       │ 1~3지망 저장
                          │       │
                          │       └──→ Step 4 (결제)
                          │               │
                          │               │ orders 테이블에
                          │               │ 주문 생성 (후속)
                          │               │
                          │               └──→ Step 5 (리포트)
                          │                       │
                          │                       │ onboarding_completed
                          │                       │ = true 설정
```

**의존성 규칙:**

- Step 2는 Step 1 완료 없이 진행 불가 (profiles에 최소 정보 필요)
- Step 3은 Step 2 완료 없이 진행 불가 (생기부 데이터가 리포트 생성의 필수 입력)
- Step 4는 Step 3 완료 없이 진행 불가 (목표 대학이 결제 단위)
- Step 5는 Step 4 완료 없이 진행 불가

**뒤로가기 규칙:**

- 이전 Step으로 돌아갈 수 있음
- 이전 Step의 데이터 수정 가능
- 수정 후 다시 다음 Step으로 진행 시 기존 데이터 유지

## 성공 기준

### 완료 조건

- [ ] 모든 기능 요구사항(🔴) 구현
- [ ] 타입 체크 통과 (`pnpm build`)
- [ ] 린트 통과 (`pnpm lint`)
- [ ] 에러 케이스 처리 완료
- [ ] 미들웨어 온보딩 리다이렉트 동작 확인
- [ ] 모바일(360px) / 태블릿(768px) / 데스크톱(1024px) 반응형 확인

### 검증 방법

```bash
# 1. 타입 체크
pnpm build

# 2. 린트
pnpm lint

# 3. 수동 테스트
# - 시나리오 1: 신규 유저 온보딩 전체 플로우
# - 시나리오 2: 중간 이탈 후 복귀
# - 시나리오 3: 완료 유저 /onboarding 재접근
# - 시나리오 4: Step 1 뒤로가기
```

## 구현 단계

### Phase 1: 코어 (현재)

- [ ] DB 스키마 변경 (profiles 컬럼 추가, target_universities priority 추가)
- [ ] `/onboarding` 라우트 및 OnboardingWizard 구현
- [ ] Step 1: 입시 정보 (ProfileStep)
- [ ] Step 2: 생기부 등록 (RecordStep, 기존 위자드 래핑)
- [ ] Step 3: 목표 대학 설정 (UniversityStep)
- [ ] Step 4/5: Placeholder UI
- [ ] 미들웨어 온보딩 리다이렉트

### Phase 2: 결제 연동

- [ ] Toss Payments 연동
- [ ] Step 4 실제 결제 플로우 구현
- [ ] 주문/결제 상태 관리

### Phase 3: 리포트

- [ ] AI 분석 파이프라인 연동
- [ ] Step 5 실제 리포트 표시
- [ ] 리포트 준비 완료 알림

## 제약사항

- Step 4(결제), Step 5(리포트)는 현재 Placeholder만 구현. 실제 로직은 후속 Phase에서 개발
- 대학 검색 API는 외부 데이터 소스에 의존 (NEIS 대학 API 또는 자체 DB 구축 필요)
- 생기부 AI 파싱은 기존 Gemini API 기반으로, 파싱 실패율에 따라 UX 조정 필요
- 모바일 웹만 지원 (네이티브 앱 미지원)

## 참고자료

- 기존 프로필 설정: `app/profile/settings/_components/ProfileSettingsForm.tsx`
- 기존 생기부 등록: `app/record/submit/_components/RecordSubmitWizard.tsx`
- 기존 스텝 인디케이터: `app/record/submit/_components/StepIndicator.tsx`
- 데이터 타입: `app/record/submit/_components/types.ts`
- 학교 검색 API: `app/api/schools/route.ts`
- DB 스키마: Supabase `profiles`, `target_universities`, `records` 테이블
