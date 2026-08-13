'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShareLinkQrModal from '@/components/school-admin/common/ShareLinkQrModal';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';
import type { SchoolAdminSurvey } from '@/lib/schoolAdminData';
import { barWidthClass } from '@/utils/barWidth';

function formatDateRange(dateStr: string): string {
  const parts = dateStr.split(' ');
  if (parts.length >= 3) return `${parts[0]} ${parts[1]}`;
  return dateStr;
}

export default function LiveSurveyCard({ survey, disabled }: { survey: SchoolAdminSurvey | null; disabled?: boolean }) {
  const [showShareModal, setShowShareModal] = useState(false);

  if (!survey) {
    return (
      <EmptyStateToggle
        isEmpty={true}
        emptyIcon="ri-clipboard-line"
        emptyTitle="No live survey"
        emptyDescription="Create one to start collecting feedback."
      >
        <div
          className="rounded-2xl p-5 sm:p-8 text-center h-full flex flex-col items-center justify-center bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_8px_24px_0px_rgba(0,0,0,0.06)]"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-sage-50">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-clipboard-line text-[18px] text-sage"></i>
            </span>
          </div>
          <p className="text-[15px] font-semibold mb-1 text-ink">
            No live survey
          </p>
          <p className="text-[13px] mb-5 text-subtle">
            Create one to start collecting feedback.
          </p>
          <Link
            href={disabled ? '#' : '/school/surveys/create'}
            className={`inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'} bg-sage text-white`}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={(e) => { if (disabled) e.preventDefault(); }}
            title={disabled ? 'Creating surveys is not available in read-only mode' : undefined}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line"></i>
            </span>
            Create survey
          </Link>
        </div>
      </EmptyStateToggle>
    );
  }

  const responseRate = Math.round((survey.responseCount / survey.targetCount) * 100);
  const openedShort = formatDateRange(survey.openedDate);
  const closesShort = formatDateRange(survey.closesDate);
  const isUrgent = survey.daysRemaining <= 3;

  const studentLink = `https://pulse.cafe/${survey.id}-a3m9`;

  return (
    <EmptyStateToggle
      isEmpty={false}
      emptyIcon="ri-clipboard-line"
      emptyTitle="No live survey"
      emptyDescription="Create one to start collecting feedback."
    >
      <div
        className="rounded-2xl p-4 sm:p-6 h-full flex flex-col bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_8px_24px_0px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-leaf-50">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-pulse-line text-[18px] text-sage"></i>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold truncate text-[#2B2B2B]">
                {survey.period}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold flex-shrink-0 bg-leaf-50 text-sage">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-sage"></span>
                Live
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
              <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-iris-50 text-iris">
                {survey.gradeBand}
              </span>
              <span className="text-[12px] text-subtle">
                {openedShort} - {closesShort}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[12px] font-medium uppercase tracking-wider mb-2 text-subtle">
            Responses
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[26px] sm:text-[32px] font-semibold leading-none text-ink">
              {survey.responseCount}
            </span>
            <span className="text-[16px] text-subtle">
              / {survey.targetCount}
            </span>
            <span className="text-[14px] font-semibold ml-1 text-sage">
              {responseRate}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-sage-100">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-sage ${barWidthClass(responseRate)}`}
            />
          </div>
        </div>

        <div className={`flex items-center gap-2 text-[13px] mb-1 ${isUrgent ? 'text-gold' : 'text-muted'}`}>
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <i className={`${isUrgent ? 'ri-error-warning-line' : 'ri-time-line'} text-[14px]`}></i>
          </span>
          <span className="font-medium">
            {survey.daysRemaining} {survey.daysRemaining === 1 ? 'day' : 'days'} left
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-auto pt-5">
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full h-10 px-4 sm:px-5 text-[13px] sm:text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 text-ink"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-share-line"></i>
            </span>
            Share
          </button>
          <Link
            href={`/school/surveys/${survey.id}`}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full h-10 px-4 sm:px-5 text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
          >
            View survey
          </Link>
        </div>

        <ShareLinkQrModal
          open={showShareModal}
          surveyUrl={studentLink}
          accessCode={survey.hasAccessCode && survey.accessCode ? survey.accessCode : null}
          status="open"
          isReadOnly={disabled}
          onClose={() => setShowShareModal(false)}
        />
      </div>
    </EmptyStateToggle>
  );
}