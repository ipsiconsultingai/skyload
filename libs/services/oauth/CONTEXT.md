# OAuth 서비스 컨텍스트

이 문서는 AI가 OAuth 모듈의 설계 의도와 사용 방법을 빠르게 파악할 수 있도록 작성되었습니다.

## 이 모듈이 하는 일

Google과 Kakao의 OAuth 2.0 인증을 통해 사용자 정보를 조회하는 공용 서비스를 제공합니다.

## 파일 구조와 역할

- `types.ts`: 타입 정의, Zod 스키마 (Provider 설정, 토큰, 사용자 정보)
- `errors.ts`: OAuthError 클래스 (에러 코드, HTTP 상태, 원본 에러 포함)
- `providers.ts`: Provider별 OAuth 엔드포인트 및 스코프 설정
- `core.ts`: OAuth 클라이언트 팩토리 및 핵심 로직 (URL 생성, 토큰 교환, 사용자 정보 조회)
- `index.ts`: Public exports

## 핵심 설계 결정

1. **팩토리 패턴 사용**: `createOAuthClient(provider, credentials)`로 Provider별 클라이언트 인스턴스 생성. Provider 추가 시 설정만 추가하면 됨.

2. **정규화된 UserInfo**: Provider마다 다른 응답 형태를 `{ id, email, name, profileImage }` 통일된 형태로 변환. 호출자가 Provider 차이를 신경 쓸 필요 없음.

3. **Zod 런타임 검증**: 외부 API 응답을 스키마로 검증하여 타입 안전성 확보. 응답 형식이 달라지면 `INVALID_RESPONSE` 에러로 명확하게 실패.

4. **상세 에러 정보**: `OAuthError`에 에러 코드, HTTP 상태, 요청 URL, 원본 에러를 모두 포함하여 디버깅 용이.

5. **토큰 갱신 미포함**: 이 서비스는 로그인 정보 조회만 담당. 토큰 저장/갱신은 외부에서 처리.

## 사용 패턴

```typescript
import { createOAuthClient } from "@/libs/services/oauth";

// 클라이언트 생성
const client = createOAuthClient("google", {
  clientId: process.env.OAUTH_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
});

// 1. 로그인 페이지로 리다이렉트할 URL 생성
const authUrl = client.getAuthorizationUrl({
  redirectUri: "https://example.com/callback",
  state: "csrf-token", // CSRF 방지용 (권장)
});

// 2. Callback에서 code를 토큰으로 교환
const tokens = await client.exchangeCodeForToken({
  code: searchParams.get("code")!,
  redirectUri: "https://example.com/callback",
});

// 3. 사용자 정보 조회
const user = await client.getUserInfo(tokens.access_token);
// => { id: "123", email: "user@gmail.com", name: "홍길동", profileImage: "..." }
```

## 에러 처리

```typescript
import { OAuthError } from "@/libs/services/oauth";

try {
  const user = await client.getUserInfo(accessToken);
} catch (error) {
  if (error instanceof OAuthError) {
    console.error(error.code); // "USER_INFO_FAILED"
    console.error(error.provider); // "google"
    console.error(error.httpStatus); // 401
    console.error(error.toJSON()); // 직렬화된 에러 정보
  }
}
```

## 확장 시 고려사항

### 새 Provider 추가

1. `types.ts`: `OAuthProvider` 타입에 추가, 해당 Provider의 UserInfo 스키마 정의
2. `providers.ts`: `create[Provider]Config` 함수 추가, `providerConfigCreators` 맵에 등록
3. `core.ts`: `normalize[Provider]UserInfo` 함수 추가, `userInfoNormalizers` 맵에 등록
4. `env.ts`: 환경변수 스키마에 `OAUTH_[PROVIDER]_CLIENT_ID/SECRET` 추가

### 주의사항

- 토큰 교환 시 `application/x-www-form-urlencoded` 형식 사용 (OAuth 2.0 표준)
- Kakao는 scope 구분자가 콤마(`,`), Google은 공백(` `)
- Kakao의 id는 숫자이므로 정규화 시 문자열로 변환
