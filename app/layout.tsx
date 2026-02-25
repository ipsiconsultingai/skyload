import type { Metadata } from "next";

import { AuthProvider } from "@/libs/store/auth-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "SKYROAD - AI 기반 생활기록부 분석 서비스",
  description:
    "입시 전문가 수준의 생기부 정밀 분석 리포트를 48시간 안에 받아보세요. AI 분석 + 전문가 검수로 합리적인 가격의 입시 컨설팅을 제공합니다.",
  openGraph: {
    title: "SKYROAD - AI 기반 생활기록부 분석 서비스",
    description:
      "입시 전문가 수준의 생기부 정밀 분석 리포트를 48시간 안에 받아보세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
