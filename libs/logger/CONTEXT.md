# Logger 모듈 컨텍스트

이 문서는 AI가 logger 모듈의 설계 의도와 사용 방법을 빠르게 파악할 수 있도록 작성되었습니다.

## 이 모듈이 하는 일

콘솔에 구조화된 로그를 출력합니다. 서버와 클라이언트 환경 모두 지원합니다.

## 파일 구조와 역할

- `types.ts`: 로그 레벨, 컨텍스트, 엔트리 타입 정의
- `core.ts`: 로거 생성 팩토리와 포맷팅 로직
- `server.ts`: 서버 환경용 로거와 API 로깅 헬퍼
- `client.ts`: 클라이언트 환경용 로거와 UI 로깅 헬퍼 ("use client" 필수)
- `index.ts`: 서버용 export (클라이언트는 client.ts에서 직접 import)

## 로그 레벨

debug < info < warn < error 순서로 우선순위가 높아집니다.
production 환경에서는 debug 로그가 출력되지 않습니다.

## 핵심 설계 결정

1. **민감 정보 자동 마스킹**: password, token, secret, authorization, key가 포함된 키는 자동으로 [REDACTED]로 치환됩니다.

2. **서버/클라이언트 분리**: Next.js의 서버 컴포넌트와 클라이언트 컴포넌트를 위해 분리되어 있습니다. 클라이언트 로거는 "use client" 지시문이 필요하므로 별도 파일입니다.

3. **컬러 출력**: 서버 환경에서만 ANSI 컬러 코드를 사용합니다. 브라우저 콘솔에서는 일반 텍스트로 출력됩니다.

4. **컨텍스트 시스템**: source, userId, requestId 등 메타데이터를 로그에 첨부할 수 있습니다. createLogger에 기본 컨텍스트를 전달하면 해당 로거의 모든 로그에 적용됩니다.

## 사용 패턴

```typescript
// 서버에서
import { serverLogger, logApiRequest } from "@/libs/logger";
serverLogger.info("메시지", { userId: "123" });
logApiRequest("GET", "/api/users");

// 클라이언트에서
import { clientLogger, logUserAction } from "@/libs/logger/client";
clientLogger.debug("렌더링 완료");
logUserAction("버튼 클릭");
```

## 확장 시 고려사항

외부 로깅 서비스(Sentry, DataDog 등) 연동이 필요하면 core.ts의 log 함수 내부에서 외부 서비스로 전송하는 로직을 추가하면 됩니다. 현재는 콘솔 출력만 지원합니다.
