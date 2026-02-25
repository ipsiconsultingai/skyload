import { Check } from "lucide-react";

import type { InputMethod, WizardStep } from "./types";

import styles from "../page.module.css";

interface StepConfig {
  step: number;
  label: string;
}

const AI_PARSE_STEPS: StepConfig[] = [
  { step: 1, label: "입력 방식" },
  { step: 2, label: "파일 업로드" },
  { step: 3, label: "데이터 확인" },
  { step: 4, label: "검토 및 확인" },
];

const TEXT_STEPS: StepConfig[] = [
  { step: 1, label: "입력 방식" },
  { step: 2, label: "데이터 입력" },
  { step: 3, label: "검토 및 확인" },
];

const EDIT_STEPS: StepConfig[] = [
  { step: 2, label: "데이터 입력" },
  { step: 3, label: "검토 및 확인" },
];

interface StepIndicatorProps {
  currentStep: WizardStep;
  method?: InputMethod | null;
  mode?: "create" | "edit";
}

export const StepIndicator = ({
  currentStep,
  method,
  mode = "create",
}: StepIndicatorProps) => {
  const steps =
    mode === "edit"
      ? EDIT_STEPS
      : method === "text"
        ? TEXT_STEPS
        : AI_PARSE_STEPS;

  return (
    <div
      className={styles.stepIndicator}
      role="navigation"
      aria-label="진행 단계"
    >
      {steps.map(({ step, label }, idx) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={step} className={styles.stepItem}>
            {idx > 0 && (
              <div
                className={`${styles.stepLine} ${isCompleted ? styles.stepLineCompleted : ""}`}
              />
            )}
            <div
              className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ""} ${isCompleted ? styles.stepCircleCompleted : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? <Check size={14} /> : idx + 1}
            </div>
            <span
              className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ""}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
