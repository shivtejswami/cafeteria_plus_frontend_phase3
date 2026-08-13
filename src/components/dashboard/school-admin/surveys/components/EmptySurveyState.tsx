'use client';

import Link from 'next/link';

export default function EmptySurveyState() {
  return (
    <div className="rounded-2xl p-6 sm:p-10 text-center bg-white border border-dashed border-[#d4cfc7] shadow-hairline">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-sage-100">
        <span className="w-8 h-8 flex items-center justify-center">
          <i className="ri-clipboard-line text-[21px] sm:text-[26px] text-sage"></i>
        </span>
      </div>
      <h3 className="text-[16px] sm:text-[18px] font-semibold mb-2 text-ink">
        No surveys yet
      </h3>
      <p className="text-[14px] mb-6 text-muted">
        Create your first survey to start gathering student feedback.
      </p>
      <Link
        href="/school/surveys/create"
        className="inline-flex items-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white shadow-[0_4px_14px_rgba(88,109,77,0.25)]"
      >
        <span className="w-4 h-4 flex items-center justify-center">
          <i className="ri-add-line"></i>
        </span>
        Create survey
      </Link>
    </div>
  );
}