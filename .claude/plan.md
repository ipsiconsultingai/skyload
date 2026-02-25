# Task #3 리팩토링 계획: 온보딩 위자드 페이지 (spec 기반)

## 개요

`specs/004-onboarding-flow.md` 명세서를 기반으로 기존 온보딩 위자드를 리팩토링합니다.
DB 스키마(Task #2)와 미들웨어/헤더(Task #4)는 이미 완료되었으므로, 위자드 UI/API만 변경합니다.

---

## 변경 사항 요약

### 1. 새 파일 생성

| 파일 | 설명 |
|------|------|
| `app/onboarding/_components/types.ts` | OnboardingStep, OnboardingState, ProfileStepData, TargetUniversity, ADMISSION_TYPES 등 타입 정의 |
| `app/onboarding/_components/UniversityStep.tsx` | Step 3: 목표 대학 설정 (기존 TargetUniversityStep 대체) |
| `app/onboarding/_components/ReportStep.tsx` | Step 5: 리포트 확인 (기존 CompletionStep 대체) |
| `app/api/onboarding/profile/route.ts` | PUT - Step 1 프로필 저장 |
| `app/api/onboarding/step/route.ts` | PUT - 온보딩 단계 업데이트 |
| `app/api/onboarding/complete/route.ts` | POST - 온보딩 완료 처리 |
| `app/api/onboarding/universities/route.ts` | PUT - 목표 대학 저장 (upsert) |
| `app/api/universities/route.ts` | GET - 대학 검색 API |

### 2. 기존 파일 수정

| 파일 | 변경 내용 |
|------|-----------|
| `app/onboarding/_components/OnboardingWizard.tsx` | types.ts import, API route 호출로 전환, 콜백 기반 Step 전환 |
| `app/onboarding/_components/ProfileStep.tsx` | ProfileStepData 타입을 types.ts에서 import, onComplete 콜백 패턴으로 변경 |
| `app/onboarding/_components/RecordStep.tsx` | RecordSubmitWizard를 직접 래핑(onSubmitSuccess 콜백), 이미 등록된 경우 "다음"/"새로 등록" 선택지 |
| `app/onboarding/_components/OnboardingStepIndicator.tsx` | StepIndicator로 이름 변경, 5단계 레이블/아이콘 spec에 맞춤 |
| `app/onboarding/_components/PaymentStep.tsx` | onComplete/onBack 콜백 패턴으로 변경 |
| `app/onboarding/page.tsx` | types.ts에서 타입 import |
| `app/onboarding/page.module.css` | UniversityStep 접기/펼치기, ReportStep 스타일 추가 |
| `app/record/submit/_components/RecordSubmitWizard.tsx` | `onSubmitSuccess?: () => void` prop 추가 |

### 3. 삭제할 파일

| 파일 | 이유 |
|------|------|
| `app/onboarding/_components/TargetUniversityStep.tsx` | UniversityStep.tsx로 대체 |
| `app/onboarding/_components/CompletionStep.tsx` | ReportStep.tsx로 대체 |

---

## 구현 단계

### Phase A: 타입 정의 + API 라우트 (기반 작업)

1. **types.ts 생성**: spec의 타입 정의 그대로 생성
   - OnboardingStep, OnboardingState, ProfileStepData, UniversityPriority, TargetUniversity, UniversityStepData, ADMISSION_TYPES, AdmissionType

2. **API 라우트 5개 생성**:
   - `PUT /api/onboarding/profile` - 프로필 저장 (Supabase auth 검증 + profiles update)
   - `PUT /api/onboarding/step` - onboarding_step 업데이트
   - `POST /api/onboarding/complete` - onboarding_completed = true 설정
   - `PUT /api/onboarding/universities` - target_universities upsert (delete + insert)
   - `GET /api/universities?q=` - 대학 검색 (placeholder: 직접 입력 안내 반환)

### Phase B: RecordSubmitWizard 수정

3. **RecordSubmitWizard.tsx에 `onSubmitSuccess` prop 추가**:
   - 기존 `router.push("/record")` 대신 `onSubmitSuccess` 콜백 호출 (존재할 경우)
   - 기존 동작은 하위 호환 유지 (onSubmitSuccess가 없으면 기존대로 router.push)

### Phase C: 온보딩 Step 컴포넌트 리팩토링

4. **ProfileStep.tsx 수정**:
   - ProfileData → ProfileStepData 타입을 types.ts에서 import
   - Props를 `{ initialData, onComplete }` 패턴으로 변경 (내부에서 state 관리)
   - "다음" 클릭 시 자체 유효성 검증 + `PUT /api/onboarding/profile` 호출 + onComplete 콜백

5. **RecordStep.tsx 재작성**:
   - RecordSubmitWizard를 직접 임베드 (`mode="create"`, `onSubmitSuccess` 콜백)
   - hasRecord인 경우: "이미 등록된 생기부가 있습니다" + "다음"/"새로 등록" 선택지
   - onComplete/onBack 콜백

6. **UniversityStep.tsx 생성** (TargetUniversityStep 대체):
   - types.ts의 TargetUniversity, ADMISSION_TYPES 사용
   - 전형 필드: select 드롭다운 (ADMISSION_TYPES)
   - 카드 접기/펼치기 기능
   - 1지망 필수, 2-3지망 선택 (추가/삭제)
   - "다음" 클릭 시 `PUT /api/onboarding/universities` 호출 + onComplete 콜백

7. **PaymentStep.tsx 수정**:
   - onComplete/onBack 콜백 패턴
   - "결제하기" → "현재 준비 중입니다" 토스트
   - "다음" 버튼으로 Step 5 이동 가능

8. **ReportStep.tsx 생성** (CompletionStep 대체):
   - "분석을 준비하고 있습니다" 안내 메시지
   - 목표 대학 요약 카드
   - "온보딩 완료" 버튼 → `POST /api/onboarding/complete` 호출 → `/` 리다이렉트

### Phase D: OnboardingWizard + StepIndicator 리팩토링

9. **OnboardingStepIndicator.tsx → StepIndicator.tsx 리네임**:
   - spec 레이블/아이콘: User, FileText, GraduationCap, CreditCard, BarChart

10. **OnboardingWizard.tsx 리팩토링**:
    - types.ts import
    - 직접 Supabase 호출 제거 → API route 호출로 전환
    - 각 Step에 onComplete/onBack 콜백 전달
    - Step 전환 시 `PUT /api/onboarding/step` 호출

11. **page.tsx 수정**: types.ts에서 타입 import

### Phase E: 스타일 + 정리

12. **page.module.css 업데이트**: 접기/펼치기 카드, ReportStep 스타일 추가
13. **TargetUniversityStep.tsx, CompletionStep.tsx 삭제**
14. **빌드 검증**: `pnpm build` 통과 확인

---

## 주요 설계 결정

1. **네비게이션 패턴**: OnboardingWizard가 공통 nav를 관리. 각 Step의 onComplete 콜백이 데이터를 전달하면 Wizard가 API 호출 후 step을 전환. 단, Step 2(RecordStep)는 RecordSubmitWizard 내부 nav을 그대로 사용하고, 최종 제출 시 onSubmitSuccess로 전환.

2. **RecordStep**: RecordSubmitWizard를 직접 임베드. RecordSubmitWizard 내부의 step indicator와 nav은 그대로 사용. 온보딩의 "이전"/"다음" 버튼은 RecordSubmitWizard 바깥에 표시되되 Step 2일 때는 "다음"은 숨기고 "이전"만 표시 (hasRecord인 경우에만 "다음" 표시).

3. **대학 검색 API**: 외부 대학 DB가 없으므로, 직접 입력 방식을 기본으로 하되 `/api/universities` 엔드포인트를 미래 확장용으로 생성 (현재는 빈 결과 + 직접 입력 안내).

4. **에러 처리**: API 에러는 토스트, 유효성 검증 에러는 인라인 메시지.
