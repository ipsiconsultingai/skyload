import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_API_URL: z.url().optional(),

  // OAuth - Google
  OAUTH_GOOGLE_CLIENT_ID: z.string().optional(),
  OAUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),

  // OAuth - Kakao
  OAUTH_KAKAO_CLIENT_ID: z.string().optional(),
  OAUTH_KAKAO_CLIENT_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ 환경변수 검증 실패:");
  console.error(z.flattenError(parsed.error).fieldErrors);
  throw new Error("환경변수가 올바르지 않습니다.");
}

export const env = parsed.data;
