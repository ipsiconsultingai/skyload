import { z } from "zod/v4";

const envSchema = z.object({
  // 서버 환경변수
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // 클라이언트 환경변수 (NEXT_PUBLIC_ 접두사)
  // NEXT_PUBLIC_API_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ 환경변수 검증 실패:");
  console.error(z.flattenError(parsed.error).fieldErrors);
  throw new Error("환경변수가 올바르지 않습니다.");
}

export const env = parsed.data;
