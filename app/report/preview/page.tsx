"use client";

import { useState } from "react";

import {
  LITE_MOCK_REPORT,
  PREMIUM_MOCK_REPORT,
  STANDARD_MOCK_REPORT,
} from "@/libs/report/mock-data";
import type { ReportPlan } from "@/libs/report/types";

import { ReportRenderer } from "../_templates";

const TABS: { label: string; plan: ReportPlan }[] = [
  { label: "Lite", plan: "lite" },
  { label: "Standard", plan: "standard" },
  { label: "Premium", plan: "premium" },
];

const REPORT_MAP = {
  lite: LITE_MOCK_REPORT,
  standard: STANDARD_MOCK_REPORT,
  premium: PREMIUM_MOCK_REPORT,
} as const;

const PreviewPage = () => {
  const [activePlan, setActivePlan] = useState<ReportPlan>("premium");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fef3c7",
          borderBottom: "1px solid #fde68a",
          padding: "10px 20px",
          textAlign: "center",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#92400e",
        }}
        className="noPrint"
      >
        이것은 샘플 리포트입니다. 실제 리포트는 생기부 분석 후 생성됩니다.
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "16px 20px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        }}
        className="noPrint"
      >
        {TABS.map((tab) => (
          <button
            key={tab.plan}
            onClick={() => setActivePlan(tab.plan)}
            style={{
              padding: "8px 20px",
              borderRadius: 50,
              border:
                activePlan === tab.plan
                  ? "2px solid #7c3aed"
                  : "1px solid #e2e8f0",
              background: activePlan === tab.plan ? "#f5f3ff" : "#ffffff",
              color: activePlan === tab.plan ? "#7c3aed" : "#64748b",
              fontWeight: activePlan === tab.plan ? 700 : 500,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}

        <button
          onClick={handlePrint}
          style={{
            marginLeft: 16,
            padding: "8px 20px",
            borderRadius: 50,
            border: "1px solid #e2e8f0",
            background: "#1e293b",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          인쇄
        </button>
      </div>

      <ReportRenderer data={REPORT_MAP[activePlan]} />
    </div>
  );
};

export default PreviewPage;
