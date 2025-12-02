# CLAUDE.md

이 문서는 AI 어시스턴트가 이 프로젝트에서 작업할 때 따라야 할 코드 컨벤션과 규칙을 정의합니다.

## 프로젝트 개요

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript (strict mode)
- **런타임**: React 19
- **패키지 매니저**: pnpm
- **테스트**: Jest
- **린터/포맷터**: ESLint + Prettier

## 주요 명령어

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 실행
pnpm test         # 테스트 실행
pnpm test:watch   # 테스트 watch 모드
```

## 코드 스타일

### 포맷팅 (Prettier)

- 세미콜론: 사용 (`semi: true`)
- 따옴표: 쌍따옴표 (`singleQuote: false`)
- 들여쓰기: 스페이스 2칸 (`tabWidth: 2`)
- 줄 길이: 80자 (`printWidth: 80`)
- 후행 쉼표: ES5 호환 (`trailingComma: "es5"`)
- 화살표 함수 괄호: 항상 사용 (`arrowParens: "always"`)

### 네이밍 규칙

| 대상                     | 규칙                      | 예시                                       |
| ------------------------ | ------------------------- | ------------------------------------------ |
| 변수                     | camelCase, 명사           | `userName`, `userList`, `isLoading`        |
| 함수                     | camelCase, 동사           | `fetchData`, `createUser`, `validateInput` |
| 이벤트 핸들러            | on + 동사                 | `onChange`, `onSubmit`, `onClick`          |
| 상수                     | UPPER_SNAKE_CASE          | `MAX_RETRY_COUNT`, `API_BASE_URL`          |
| 타입, 인터페이스, 클래스 | PascalCase                | `UserProfile`, `OAuthClient`               |
| React 컴포넌트           | PascalCase                | `UserCard`, `LoginButton`                  |
| 파일명 (일반)            | kebab-case 또는 camelCase | `oauth-client.ts`, `types.ts`              |
| 파일명 (React 컴포넌트)  | PascalCase                | `UserCard.tsx`                             |
| 디렉토리                 | kebab-case                | `auth-provider`, `user-profile`            |

**변수와 함수 네이밍 원칙:**

- 변수는 명사로 작성: 데이터가 무엇인지 표현 (`user`, `errorMessage`, `selectedItems`)
- 함수는 동사로 시작: 어떤 동작을 하는지 표현 (`getUser`, `setName`, `handleError`)
- 이벤트 핸들러는 `on`으로 시작: 사용자 행동에 반응 (`onChange`, `onSubmit`, `onSelect`)

```typescript
// Good
const userName = "John"; // 명사 - 데이터
const fetchUser = () => {}; // 동사 - 동작
const onChange = (e) => {}; // on + 동사 - 이벤트 핸들러

// Bad
const getName = "John"; // 동사를 변수에 사용
const user = () => {}; // 명사를 함수에 사용
const changeHandler = (e) => {}; // on 접두사 미사용
```

### TypeScript 규칙

- `any` 타입 사용 금지 - `unknown`을 사용하고 타입 가드로 좁히기
- 명시적 반환 타입 권장 (복잡한 함수의 경우)
- `interface` vs `type`: 객체 형태는 `interface`, 유니온/인터섹션은 `type` 사용
- Non-null assertion (`!`) 사용 최소화
- 타입 추론이 명확한 경우 타입 어노테이션 생략 가능

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
}

type OAuthProvider = "google" | "kakao";

// Bad
const user: any = fetchUser();
```

### 함수 작성 규칙

- 화살표 함수 선호 (`prefer-arrow-callback`)
- 함수는 한 가지 일만 수행 (단일 책임 원칙)
- 순수 함수 선호 - 사이드 이펙트 최소화
- 조기 반환(early return) 패턴 사용

```typescript
// Good - 조기 반환
const processUser = (user: User | null): string => {
  if (!user) {
    return "Unknown";
  }
  return user.name;
};

// Bad - 중첩된 조건문
const processUser = (user: User | null): string => {
  if (user) {
    return user.name;
  } else {
    return "Unknown";
  }
};
```

### 변수 선언

- `const` 우선 사용 (`prefer-const`)
- `var` 사용 금지 (`no-var`)
- 구조 분해 할당 사용 (`prefer-destructuring`)
- 템플릿 리터럴 사용 (`prefer-template`)

```typescript
// Good
const { id, name } = user;
const message = `Hello, ${name}!`;

// Bad
var id = user.id;
const message = "Hello, " + name + "!";
```

### Import 규칙

- 경로 별칭 사용: `@/*` (프로젝트 루트 기준)
- import 순서:
  1. 외부 패키지 (react, next, etc.)
  2. 내부 모듈 (@/libs, @/components)
  3. 상대 경로 (./types, ../utils)
- 타입 import는 `type` 키워드 사용

```typescript
// Good
import { z } from "zod/v4";

import { OAuthError } from "./errors";
import {
  type OAuthClient,
  type OAuthProvider,
  OAuthTokenResponseSchema,
} from "./types";
```

### 에러 처리

- 커스텀 에러 클래스 사용 권장
- 에러 메시지는 한국어로 작성 (사용자에게 노출되는 경우)
- 에러에 컨텍스트 정보 포함

```typescript
throw new OAuthError("토큰 교환에 실패했습니다.", {
  code: "TOKEN_EXCHANGE_FAILED",
  provider,
  httpStatus: response.status,
});
```

### React/Next.js 규칙

- 서버 컴포넌트 기본 사용 (App Router)
- 클라이언트 컴포넌트는 `"use client"` 지시문 명시
- 컴포넌트는 단일 책임 원칙 준수
- Props 인터페이스는 컴포넌트와 같은 파일에 정의

```typescript
// Good
interface UserCardProps {
  user: User;
  onSelect?: (id: string) => void;
}

export const UserCard = ({ user, onSelect }: UserCardProps) => {
  // ...
};
```

### 테스트 규칙

- 테스트 파일: `__tests__` 디렉토리에 `*.test.ts` 형식
- describe/it 블록으로 구조화
- 테스트 설명은 한국어로 작성
- AAA 패턴 (Arrange-Act-Assert) 사용

```typescript
describe("createOAuthClient", () => {
  it("유효한 설정으로 클라이언트를 생성한다", () => {
    // Arrange
    const credentials = { clientId: "id", clientSecret: "secret" };

    // Act
    const client = createOAuthClient("google", credentials);

    // Assert
    expect(client).toBeDefined();
  });
});
```

## 디렉토리 구조

```
/
├── app/                    # Next.js App Router 페이지
├── libs/                   # 재사용 가능한 라이브러리
│   ├── fetch/             # HTTP 클라이언트
│   ├── logger/            # 로깅 유틸리티
│   └── services/          # 외부 서비스 연동
│       └── oauth/         # OAuth 클라이언트
├── public/                # 정적 파일
└── env.ts                 # 환경 변수 스키마
```

## 환경 변수

- 환경 변수는 `env.ts`에서 Zod로 검증
- `.env.example`에 필수 환경 변수 문서화
- 민감한 정보는 절대 커밋하지 않음
