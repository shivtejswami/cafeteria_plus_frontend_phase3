'use client';

import Link from 'next/link';
import type { SchoolAdminSurvey } from '@/lib/schoolAdminData';

export default function ScheduledSurveyCard({ survey }: { survey: SchoolAdminSurvey }) {
  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold bg-iris-50 text-iris">
          Scheduled
        </span>
        <span className="inline-block rounded-full px-3 py-1 text-[12px] font-medium bg-surface-100 text-muted">
          {survey.gradeBand}
        </span>
        <span className="inline-block rounded-full px-3 py-1 text-[12px] font-medium bg-surface-100 text-muted">
          {survey.period}
        </span>
      </div>

      <h3 className="text-[16px] font-semibold mb-3 text-ink">
        {survey.period}
      </h3>

      <p className="text-[14px] mb-5 text-muted">
        Opens {survey.openedDate} &middot; Target: {survey.targetCount} students
      </p>

      <div className="flex items-center gap-3">
        <Link
          href={`/school/surveys/${survey.id}`}
          className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white shadow-sage"
        >
          Open now
        </Link>
        <Link
          href={`/school/surveys/${survey.id}`}
          className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 text-ink"
        >
          View survey
        </Link>
      </div>
    </div>
  );
}