'use client';

import Link from 'next/link';
import SurveyDetailDeclined from '@/components/school-admin/surveys/components/SurveyDetailDeclined';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { surveyReopenDeclinedData } from '@/lib/schoolAdminData';

export default function SurveyDetailDeclinedClient({ surveyId }: { surveyId: string }) {
  const { isReadOnly } = useReadOnlyMode();
  const survey = surveyReopenDeclinedData[surveyId] || null;

  if (!survey) {
    return (
      <div>
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-[13px] mb-1" aria-label="Breadcrumb">
            <Link href="/school/surveys" className="transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris">Surveys</Link>
            <span className="text-faint-400">/</span>
            <span className="text-muted">Survey details</span>
          </nav>
          <h1 className="text-[19px] sm:text-[24px] font-semibold leading-tight text-ink">Survey details</h1>
        </div>
        <div className="rounded-2xl p-12 text-center bg-white border border-line shadow-card">
          <p className="text-[15px] text-subtle">Survey not found.</p>
          <Link href="/school/surveys" className="inline-block mt-4 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white shadow-[0_4px_14px_rgba(88,109,77,0.25)]">
            Back to surveys
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SurveyDetailDeclined
      survey={survey}
      isReadOnly={isReadOnly}
    />
  );
}