// src/components/campaigns/CreateCampaignSteps.tsx

"use client";

import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface CreateCampaignStepsProps {
  currentStep: 1 | 2 | 3;
}

const STEPS: Step[] = [
  { number: 1, label: "Property & Details" },
  { number: 2, label: "Upload Leads" },
  { number: 3, label: "Review & Launch" },
];

export default function CreateCampaignSteps({
  currentStep,
}: CreateCampaignStepsProps) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`
                  flex items-center justify-center
                  w-7 h-7 rounded-full
                  text-xs font-bold
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-brand-500 text-white"
                      : isActive
                      ? "bg-brand-500 text-white ring-4 ring-brand-500/20"
                      : "bg-surface-subtle text-text-muted border border-surface-border"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  text-xs font-medium hidden sm:block
                  ${
                    isActive
                      ? "text-text-primary"
                      : isCompleted
                      ? "text-brand-600"
                      : "text-text-muted"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={`
                  h-px w-8 sm:w-12 mx-2
                  transition-colors duration-300
                  ${isCompleted ? "bg-brand-400" : "bg-surface-border"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}