import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "SKYROAD - AI + 전문가 이중 검증 생기부 분석 서비스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const buffer = await readFile(
    join(process.cwd(), "public/images/open-graph.png")
  );
  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
