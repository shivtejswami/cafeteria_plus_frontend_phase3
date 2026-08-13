'use client';

import { useMemo } from 'react';
import { barWidthClass } from '@/utils/barWidth';

interface SurveyProgressProps {
  currentStep: number;
  totalSteps: number;
  sectionLabel: string;
  stepInSection: number;
  totalInSection: number;
  isK5: boolean;
  isLastSection: boolean;
}

export default function SurveyProgress({
  currentStep,
  totalSteps,
  sectionLabel,
  stepInSection,
  totalInSection,
  isK5,
  isLastSection,
}: SurveyProgressProps) {
  const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  const remainingInSection = totalInSection - stepInSection;

  const encouragement = useMemo(() => {
    if (!isK5) return null;
    if (isLastSection) return 'Almost done!';
    if (remainingInSection <= 1 && totalInSection > 1) return 'Last one in this part!';
    if (stepInSection === 1 && remainingInSection > 2) return 'Keep going!';
    return "You're doing great!";
  }, [isK5, isLastSection, stepInSection, remainingInSection, totalInSection]);

  const remainingLabel = useMemo(() => {
    if (!isK5) return null;
    if (remainingInSection <= 0) return null;
    return `${remainingInSection} more in this part`;
  }, [isK5, remainingInSection]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[13px] font-medium text-[#9A9A9A]"
        >
          {sectionLabel}
        </span>

        {isK5 && remainingLabel && (
          <span
            className="text-[13px] font-semibold text-sage"
          >
            {remainingLabel}
          </span>
        )}

        {!isK5 && (
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-subtle">
              {stepInSection} of {totalInSection}
            </span>
            <span className="text-[13px] font-semibold text-sage">
              Question {currentStep} of {totalSteps}
            </span>
          </div>
        )}
      </div>

      <div
        className="w-full h-2 rounded-full overflow-hidden bg-line"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out bg-[linear-gradient(90deg,_#7a9a65,_#586d4d)] ${barWidthClass(progressPercent)}`}
        />
      </div>

      {isK5 && encouragement && (
        <p
          className="text-[14px] font-medium mt-1.5 text-muted"
          role="status"
          aria-live="polite"
        >
          {encouragement}
        </p>
      )}

      {!isK5 && (
        <div className="flex justify-end mt-1">
          <span className="text-[11px] font-medium text-[#c4c4c4]">
            {progressPercent}%
          </span>
        </div>
      )}
    </div>
  );
}