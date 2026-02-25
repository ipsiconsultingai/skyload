import type { Metadata, Viewport } from "next";

import { AuthProvider } from "@/libs/store/auth-provider";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://skyroad.co.kr"),
  title: {
    default: "SKYROAD - AI 기반 생활기록부 분석 서비스",
    template: "%s | SKYROAD",
  },
  description:
    "입시 전문가 수준의 생기부 정밀 분석 리포트를 48시간 안에 받아보세요. AI 분석 + 전문가 검수로 합리적인 가격의 입시 컨설팅을 제공합니다.",
  keywords: [
    "생기부 분석",
    "AI 생활기록부",
    "입시 컨설팅",
    "생활기록부 분석",
    "대입 컨설팅",
    "학생부 분석",
    "AI 입시",
    "생기부 컨설팅",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SKYROAD - AI 기반 생활기록부 분석 서비스",
    description:
      "입시 전문가 수준의 생기부 정밀 분석 리포트를 48시간 안에 받아보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "SKYROAD",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKYROAD - AI 기반 생활기록부 분석 서비스",
    description:
      "입시 전문가 수준의 생기부 정밀 분석 리포트를 48시간 안에 받아보세요.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "SKYROAD",
      url: "https://skyroad.co.kr",
      description:
        "AI + 전문가 이중 검증 생활기록부 분석 서비스를 제공합니다.",
    },
    {
      "@type": "Service",
      name: "SKYROAD 생기부 분석",
      provider: {
        "@type": "Organization",
        name: "SKYROAD",
      },
      description:
        "입시 전문가 수준의 생기부 정밀 분석 리포트를 48시간 안에 받아보세요. AI 분석 + 전문가 검수로 합리적인 가격의 입시 컨설팅을 제공합니다.",
      areaServed: "KR",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
