'use client';

import Link from 'next/link';
import type { SchoolAdminSurvey } from '@/lib/schoolAdminData';

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  analysing: { label: 'Analysing', bg: 'bg-surface-100', color: 'text-muted' },
  'under-review': { label: 'Report under review', bg: 'bg-gold-100', color: 'text-gold' },
  closed: { label: 'Closed', bg: 'bg-surface-100', color: 'text-muted' },
};

export default function ClosedSurveyCard({ survey }: { survey: SchoolAdminSurvey }) {
  const config = statusConfig[survey.status] || statusConfig.closed;

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <span className={`inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${config.bg} ${config.color}`}>
          {config.label}
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

      <p className="text-[14px] mb-2 text-muted">
        {survey.responseCount} of {survey.targetCount} responses collected
      </p>

      <p className="text-[13px] mb-5 text-subtle">
        {survey.status === 'analysing' && 'Your report is being generated — we\'ll let you know when it\'s ready.'}
        {survey.status === 'under-review' && 'Your report is being reviewed. It will be published shortly.'}
        {survey.status === 'closed' && 'This survey has ended. Results were published with the report.'}
      </p>

      <div className="flex items-center gap-3">
        <Link
          href={`/school/surveys/${survey.id}`}
          className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 text-ink"
        >
          View survey details
        </Link>
      </div>
    </div>
  );
}