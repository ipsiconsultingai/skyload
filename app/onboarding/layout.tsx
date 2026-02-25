import type { ReactNode } from "react";

import { OnboardingHeader } from "./_components/OnboardingHeader";

export const metadata = {
  title: "온보딩 | SKYROAD",
};

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <OnboardingHeader />
      <main>{children}</main>
    </>
  );
}
