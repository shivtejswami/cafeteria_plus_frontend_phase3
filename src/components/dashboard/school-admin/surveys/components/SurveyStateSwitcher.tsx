'use client';

import Link from 'next/link';
import { surveyReopenDeclinedData } from '@/lib/schoolAdminData';

interface SurveyStateSwitcherProps {
  surveyId: string;
  currentState: 'awaiting-approval' | 'declined';
}

export default function SurveyStateSwitcher({ surveyId, currentState }: SurveyStateSwitcherProps) {
  if (currentState === 'awaiting-approval') {
    const hasDeclined = !!surveyReopenDeclinedData[surveyId];
    if (!hasDeclined) return null;

    return (
      <div className="rounded-xl px-4 py-3 flex items-center gap-3 bg-[#faf8fc] border border-dashed border-[#c0a8e0]">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-iris">
          <i className="ri-eye-line"></i>
        </span>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <span className="text-[12px] font-medium text-muted">Preview:</span>
          <Link
            href={`/school/surveys/declined/${surveyId}`}
            className="inline-flex items-center gap-1.5 rounded-full h-8 px-4 text-[12px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-1 bg-brick-50 text-[#a3201d] border border-brick-100"
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-close-circle-line"></i>
            </span>
            View declined screen
            <span className="w-3 h-3 flex items-center justify-center ml-0.5">
              <i className="ri-arrow-right-s-line text-[10px]"></i>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3 bg-[#faf8fc] border border-dashed border-[#c0a8e0]">
      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-iris">
        <i className="ri-eye-line"></i>
      </span>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
        <span className="text-[12px] font-medium text-muted">Preview:</span>
        <Link
          href={`/school/surveys/${surveyId}`}
          className="inline-flex items-center gap-1.5 rounded-full h-8 px-4 text-[12px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-iris-100 text-iris border border-iris-200"
        >
          <span className="w-3.5 h-3.5 flex items-center justify-center">
            <i className="ri-information-line"></i>
          </span>
          View awaiting approval
          <span className="w-3 h-3 flex items-center justify-center ml-0.5">
            <i className="ri-arrow-right-s-line text-[10px]"></i>
          </span>
        </Link>
      </div>
    </div>
  );
}