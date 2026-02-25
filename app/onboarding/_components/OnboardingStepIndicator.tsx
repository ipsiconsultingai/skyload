"use client";

import { Check, User, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import styles from "../page.module.css";

interface StepConfig {
  step: number;
  label: string;
  icon: LucideIcon;
}

const ONBOARDING_STEPS: StepConfig[] = [
  { step: 1, label: "입시 정보", icon: User },
  { step: 2, label: "목표 대학", icon: GraduationCap },
];

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div
      className={styles.stepIndicator}
      role="navigation"
      aria-label="온보딩 진행 단계"
    >
      {ONBOARDING_STEPS.map(({ step, label, icon: Icon }, idx) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={step} className={styles.stepItem}>
            {idx > 0 && (
              <div
                className={`${styles.stepLine} ${isCompleted ? styles.stepLineCompleted : ""}`}
                aria-hidden="true"
              />
            )}
            <div
              className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ""} ${isCompleted ? styles.stepCircleCompleted : ""}`}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${label} ${isCompleted ? "(완료)" : isActive ? "(진행 중)" : ""}`}
            >
              {isCompleted ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Icon size={16} aria-hidden="true" />
              )}
            </div>
            <span
              className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ""}`}
              aria-hidden="true"
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
