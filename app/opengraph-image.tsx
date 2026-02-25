import { createSocialImage } from "./_lib/create-social-image";

export const runtime = "edge";

export const alt = "SKYROAD - AI + 전문가 이중 검증 생기부 분석 서비스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return createSocialImage(size);
}
