변경된 파일에 대한 테스트 코드를 생성하거나 업데이트합니다.

## 실행 방법

1. `git diff --name-only HEAD` 또는 `git status`로 변경된 파일 목록 확인
2. 테스트 대상 파일 필터링 (아래 규칙 참조)
3. 각 파일에 대해:
   - 기존 테스트가 있으면: 변경사항 기반으로 테스트 업데이트
   - 기존 테스트가 없으면: 새 테스트 파일 생성
4. 테스트 실행하여 통과 확인

## 테스트 대상 규칙

### 테스트 대상

- `libs/**/*.ts` - 공통 라이브러리
- `hooks/**/*.ts` - 커스텀 훅
- `utils/**/*.ts` - 유틸리티 함수
- `services/**/*.ts` - 서비스 레이어

### 테스트 제외

- `app/**/*` - Next.js 앱 라우터 (E2E 테스트 대상)
- `components/**/*` - React 컴포넌트 (별도 컴포넌트 테스트)
- `**/*.d.ts` - 타입 정의 파일
- `**/index.ts` - re-export만 하는 파일
- `**/__tests__/**` - 테스트 파일 자체
- `*.config.*` - 설정 파일

## 테스트 파일 위치 및 네이밍

테스트 파일은 **동일 경로의 `__tests__` 폴더**에 생성합니다.

### 파일명 규칙 (혼합 방식)

| 모듈 크기 | 파일 수  | 네이밍 방식        | 예시                                  |
| --------- | -------- | ------------------ | ------------------------------------- |
| 작음      | 1-3개    | `{모듈명}.test.ts` | `libs/fetch/__tests__/fetch.test.ts`  |
| 큼        | 4개 이상 | `{파일명}.test.ts` | `libs/auth/__tests__/session.test.ts` |

### 예시

```
libs/fetch/
├── core.ts
├── types.ts
├── index.ts
└── __tests__/
    └── fetch.test.ts  # 모듈이 작으므로 하나로 통합

libs/auth/
├── session.ts
├── token.ts
├── middleware.ts
├── providers.ts
├── types.ts
├── index.ts
└── __tests__/
    ├── session.test.ts   # 파일별로 분리
    ├── token.test.ts
    └── middleware.test.ts
```

## 테스트 작성 규칙

### 필수 원칙

1. **한글 테스트명**: `it("사용자를 생성한다", ...)`
2. **describe 구조화**: 기능/시나리오별로 그룹화
3. **AAA 패턴**: Arrange → Act → Assert
4. **독립적 테스트**: 테스트 간 의존성 없음
5. **모킹 최소화**: 외부 의존성만 모킹

### 테스트 구조 템플릿

```typescript
describe("모듈명", () => {
  // 공통 설정
  beforeEach(() => {
    // 각 테스트 전 초기화
  });

  afterEach(() => {
    // 정리 작업
  });

  describe("함수명/기능명", () => {
    it("정상 케이스를 처리한다", () => {
      // Arrange
      const input = ...;

      // Act
      const result = fn(input);

      // Assert
      expect(result).toBe(...);
    });

    it("엣지 케이스를 처리한다", () => {
      // ...
    });

    it("에러 케이스를 처리한다", () => {
      // ...
    });
  });
});
```

### 테스트 케이스 우선순위

1. **Happy Path**: 정상적인 입력과 기대 결과
2. **Edge Cases**: 경계값, 빈 값, null/undefined
3. **Error Cases**: 예외 상황, 에러 핸들링
4. **Integration**: 모듈 간 상호작용 (필요시)

### 모킹 규칙

```typescript
// ✅ Good: 외부 의존성만 모킹
const mockFetch = jest.fn();
global.fetch = mockFetch;

// ✅ Good: 모듈 리로드로 깨끗한 상태 유지
beforeEach(() => {
  jest.resetModules();
});

// ❌ Bad: 내부 구현 모킹
jest.mock("./internal-helper");
```

### 환경변수 테스트

```typescript
const setEnv = (key: string, value: string) => {
  Object.defineProperty(process.env, key, {
    value,
    writable: true,
    configurable: true,
  });
};

beforeEach(() => {
  jest.resetModules();
});

it("production 환경에서 동작한다", async () => {
  setEnv("NODE_ENV", "production");
  const { myFunction } = await import("../module");
  // ...
});
```

## 업데이트 시 규칙

기존 테스트가 있는 경우:

1. 기존 테스트 구조 유지
2. 변경된 기능에 대한 테스트만 수정/추가
3. 삭제된 기능의 테스트 제거
4. 새 기능에 대한 테스트 추가
5. 기존 테스트가 여전히 통과하는지 확인

## 실행 및 검증

테스트 작성 후 반드시 실행:

```bash
# 전체 테스트
pnpm test

# 특정 파일만
pnpm test -- libs/fetch

# 워치 모드
pnpm test:watch
```

## 출력

작업 완료 후 다음을 출력:

```
## 테스트 작성 완료

### 생성된 테스트
- `libs/fetch/__tests__/fetch.test.ts` (신규)
- `libs/logger/__tests__/logger.test.ts` (업데이트)

### 테스트 결과
✓ 40 tests passed
✗ 0 tests failed

### 주요 테스트 케이스
- getFetch: 5개 (GET 요청, 쿼리 파라미터, 에러 처리 등)
- postFetch: 3개 (POST 요청, body 처리 등)
```
