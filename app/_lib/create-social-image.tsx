import { ImageResponse } from "next/og";

interface SocialImageSize {
  width: number;
  height: number;
}

export const createSocialImage = (size: SocialImageSize) => {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          SKYROAD
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            opacity: 0.9,
            marginBottom: 48,
          }}
        >
          AI + 전문가 이중 검증
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            opacity: 0.75,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          입시 전문가 수준의 생기부 정밀 분석 리포트를 48시간 안에 받아보세요
        </div>
      </div>
    ),
    { ...size }
  );
};
