# 구매 플로우 설정 가이드

구매 플로우(가격표 → 체크아웃 → 결제 → 리포트 생성)를 활성화하기 위한 설정 가이드입니다.

---

## 1. 환경변수 설정

`.env.local`에 아래 두 개의 환경변수를 추가해야 합니다.

```bash
# TossPayments
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxxxxx
```

### TossPayments 키 발급 방법

1. [TossPayments 개발자센터](https://developers.tosspayments.com/)에 가입/로그인
2. **내 개발정보** → **API 키** 확인
3. **테스트** 키와 **라이브** 키가 각각 있음

| 구분          | 환경변수                      | 접두사                  | 용도                     |
| ------------- | ----------------------------- | ----------------------- | ------------------------ |
| 클라이언트 키 | `NEXT_PUBLIC_TOSS_CLIENT_KEY` | `test_ck_` / `live_ck_` | 브라우저에서 결제창 호출 |
| 시크릿 키     | `TOSS_SECRET_KEY`             | `test_sk_` / `live_sk_` | 서버에서 결제 승인       |

> **테스트 모드**: `test_` 접두사 키를 사용하면 실제 결제 없이 플로우를 테스트할 수 있습니다. 테스트 카드번호는 TossPayments 문서를 참고하세요.

### 현재 `.env.local` 상태

| 환경변수                        | 상태                   |
| ------------------------------- | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | 설정됨                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 설정됨                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | 설정됨                 |
| `GEMINI_API_KEY`                | 설정됨                 |
| `TOSS_SECRET_KEY`               | **미설정 (추가 필요)** |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY`   | **미설정 (추가 필요)** |

---

## 2. Supabase Edge Function 배포

AI 리포트 생성 파이프라인은 Supabase Edge Function에서 실행됩니다.
Vercel Hobby 플랜의 60초 제한을 우회하기 위한 구조입니다.

### 2-1. Supabase CLI 로그인

```bash
npx supabase login
```

브라우저가 열리면 Supabase 계정으로 로그인합니다.

### 2-2. 프로젝트 연결

Supabase 대시보드 → **Settings** → **General** → **Reference ID** 확인 후:

```bash
npx supabase link --project-ref <YOUR_PROJECT_REF>
```

### 2-3. 파이프라인 번들 빌드

파이프라인 코드(libs/report/)를 Edge Function용 단일 JS 파일로 번들링합니다:

```bash
bash scripts/build-edge-fn.sh
```

> 파이프라인 코드를 수정한 경우 반드시 다시 빌드해야 합니다.

### 2-4. Edge Function 배포

```bash
npx supabase functions deploy generate-report --no-verify-jwt
```

`--no-verify-jwt`는 JWT 검증을 비활성화합니다. 이 함수는 `service_role` 키로 인증하므로 JWT가 불필요합니다.

### 2-5. Edge Function 환경변수 (시크릿) 설정

Supabase 대시보드에서 설정합니다:

**대시보드** → **Edge Functions** → **generate-report** → **Secrets**

| 시크릿 이름                 | 설명                  | 자동 설정 여부     |
| --------------------------- | --------------------- | ------------------ |
| `SUPABASE_URL`              | Supabase 프로젝트 URL | 자동 (설정 불필요) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role 키       | 자동 (설정 불필요) |
| `GEMINI_API_KEY`            | Google Gemini API 키  | **수동 설정 필요** |

`GEMINI_API_KEY`만 수동으로 추가하면 됩니다:

```bash
npx supabase secrets set GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
```

또는 대시보드에서 직접 추가합니다.

---

## 3. Vercel 환경변수 설정

프로덕션 배포를 위해 Vercel에도 환경변수를 설정해야 합니다.

**Vercel 대시보드** → **Settings** → **Environment Variables**

| 환경변수                        | 환경                | 비고                  |
| ------------------------------- | ------------------- | --------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | All                 | 이미 설정되어 있을 것 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All                 | 이미 설정되어 있을 것 |
| `SUPABASE_SERVICE_ROLE_KEY`     | Production, Preview | 이미 설정되어 있을 것 |
| `GEMINI_API_KEY`                | Production, Preview | 이미 설정되어 있을 것 |
| `TOSS_SECRET_KEY`               | Production, Preview | **추가 필요**         |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY`   | All                 | **추가 필요**         |

> **라이브 배포 시**: `test_` 접두사 키를 `live_` 접두사 키로 교체하세요.

---

## 4. DB 상태 확인

구매 플로우에 필요한 테이블은 이미 생성되어 있습니다:

| 테이블     | 상태                                  | RLS  |
| ---------- | ------------------------------------- | ---- |
| `plans`    | 생성됨 (3행: lite, standard, premium) | 활성 |
| `orders`   | 생성됨 (0행)                          | 활성 |
| `payments` | 생성됨 (0행)                          | 활성 |
| `reports`  | 생성됨 (0행)                          | 활성 |

추가 마이그레이션이나 테이블 생성은 필요하지 않습니다.

---

## 5. 전체 플로우 테스트

### 테스트 순서

1. **개발 서버 실행**: `pnpm dev`
2. **회원가입 → 온보딩 → 생기부 등록** 완료
3. **가격표 페이지** (`/pricing`) 에서 플랜 선택
4. **체크아웃 페이지** (`/checkout?plan=standard`) 로 이동 확인
5. **결제하기** 클릭 → TossPayments 결제창 표시
6. **테스트 결제** 진행 (테스트 카드 사용)
7. **결제 성공** → `/checkout/success` → 결제 확인 → 리포트 생성 트리거
8. **리포트 생성 중** 페이지 (`/report/[id]/generating`) 로 이동
9. **컨설팅 내역** (`/profile/consulting`) 에서 주문 상태 확인

### TossPayments 테스트 결제

테스트 모드에서는 아무 카드 정보나 입력해도 결제가 승인됩니다.

- 카드번호: `4330000000000` 등 아무 번호
- 유효기간, CVC: 아무 값

### 실패 시나리오 확인

| 시나리오                      | 예상 동작                           |
| ----------------------------- | ----------------------------------- |
| 미로그인 상태로 플랜 클릭     | 로그인 모달 표시                    |
| 생기부 미등록 상태로 체크아웃 | `/record`로 리다이렉트              |
| 결제 취소 (결제창에서 닫기)   | 체크아웃 페이지로 복귀              |
| 결제 실패                     | `/checkout/fail`에 에러 메시지 표시 |

---

## 6. 체크리스트

- [ ] `.env.local`에 `TOSS_SECRET_KEY` 추가
- [ ] `.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 추가
- [x] `npx supabase login` 실행 ✔
- [x] `npx supabase link --project-ref nazepcfvvoryqlfxzvvv` 실행 ✔
- [x] `bash scripts/build-edge-fn.sh` 실행 ✔
- [x] `npx supabase functions deploy generate-report --no-verify-jwt` 실행 ✔
- [x] `npx supabase secrets set GEMINI_API_KEY=<KEY>` 실행 ✔
- [ ] 개발 환경에서 전체 플로우 테스트
- [ ] Vercel에 `TOSS_SECRET_KEY` 환경변수 추가
- [ ] Vercel에 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경변수 추가
- [ ] 프로덕션 배포 시 라이브 키로 교체
