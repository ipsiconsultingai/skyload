import type { ReportContent } from "@/libs/report/types";

import { LiteReport } from "./LiteReport";
import { PremiumReport } from "./PremiumReport";
import { StandardReport } from "./StandardReport";

interface ReportRendererProps {
  data: ReportContent;
}

export const ReportRenderer = ({ data }: ReportRendererProps) => {
  switch (data.meta.plan) {
    case "lite":
      return <LiteReport data={data} />;
    case "standard":
      return <StandardReport data={data} />;
    case "premium":
      return <PremiumReport data={data} />;
    default:
      return null;
  }
};
