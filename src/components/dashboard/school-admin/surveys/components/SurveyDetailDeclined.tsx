'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ToastContext';
import type { SurveyReopenDeclinedData } from '@/lib/schoolAdminData';
import RequestReopenModal from '@/components/school-admin/surveys/components/RequestReopenModal';
import SurveyStateSwitcher from '@/components/school-admin/surveys/components/SurveyStateSwitcher';

interface SurveyDetailDeclinedProps {
  survey: SurveyReopenDeclinedData;
  isReadOnly: boolean;
}

export default function SurveyDetailDeclined({ survey, isReadOnly }: SurveyDetailDeclinedProps) {
  const { toast } = useToast();
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenResubmitted, setReopenResubmitted] = useState(false);

  const responseRate = survey.targetCount > 0 ? Math.round((survey.responseCount / survey.targetCount) * 100) : 0;

  const handleReopenResubmit = useCallback((proposedCloseDate: string, proposedCloseTime: string, reason: string) => {
    setShowReopenModal(false);
    setReopenResubmitted(true);
    toast('neutral', 'Reopen requested. Your district / SFWG will review it.');
  }, [toast]);

  return (
    <div>
      <div className="mb-5 sm:mb-6">
        <nav className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[13px] mb-1" aria-label="Breadcrumb">
          <Link href="/school/surveys" className="transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris">Surveys</Link>
          <span className="text-faint-400">/</span>
          <span className="text-muted">{survey.gradeBand} &middot; {survey.period}</span>
        </nav>
        <div className="flex items-center flex-wrap gap-3 mt-2">
          <h1 className="text-[19px] sm:text-[24px] font-semibold leading-tight text-ink">Survey details</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full pl-2 pr-3 py-1 text-[12px] font-semibold bg-leaf-50 text-sage">
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-sage"></span>
            Published
          </span>
          <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold bg-iris-50 text-iris">
            {survey.gradeBand}
          </span>
          <span className="text-[14px] text-muted">
            {survey.gradeBand} &middot; {survey.period}
          </span>
        </div>
        <p className="text-[14px] mt-2 text-muted">
          Closed {survey.closesDate} at {survey.closesTime.slice(0, 5)}
        </p>
      </div>

      {isReadOnly && (
        <div className="rounded-xl px-4 py-3 mb-6 flex items-start gap-3 bg-[#fff7e0] border border-gold-200">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-information-line"></i>
          </span>
          <div>
            <p className="text-[13px] font-semibold mb-0.5 text-gold-800">Read-only mode</p>
            <p className="text-[13px] text-gold-800">
              Your access is currently read-only. Survey controls are disabled.{' '}
              <Link href="/school/subscription" className="font-semibold underline">View Subscription</Link>
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <SurveyStateSwitcher surveyId={survey.id} currentState="declined" />
      </div>

      {survey.responseCount < 10 && (
        <div className="rounded-xl px-4 py-4 mb-8 flex items-start gap-3 bg-gold-100 border border-gold-200">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-alert-line"></i>
          </span>
          <div>
            <p className="text-[13px] font-semibold mb-0.5 text-gold-800">Small sample</p>
            <p className="text-[13px] text-gold-800">
              Detailed breakdowns are limited to protect anonymity ({survey.responseCount} responses, below 10).
            </p>
          </div>
        </div>
      )}

      {survey.responseCount >= 10 && survey.responseCount < 30 && (
        <div className="rounded-xl px-4 py-4 mb-8 flex items-start gap-3 bg-gold-100 border border-gold-200">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-alert-line"></i>
          </span>
          <div>
            <p className="text-[13px] font-semibold mb-0.5 text-gold-800">Small sample</p>
            <p className="text-[13px] text-gold-800">
              Results are directional only ({survey.responseCount} responses, below 30).
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 bg-canvas border border-line">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full bg-white border border-line">
            <i className="ri-check-double-line text-lg text-sage"></i>
          </span>
          <div>
            <p className="text-[15px] font-semibold mb-1 text-ink">Survey complete</p>
            <p className="text-[14px] text-muted">
              {survey.responseCount} of {survey.targetCount} students responded ({responseRate}%).
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 bg-canvas border border-line">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]">Survey controls</p>
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-line">
            <i className="ri-settings-3-line text-sm text-muted"></i>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 mb-5">
          <Link
            href={`/school/reports/${survey.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white shadow-sage"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-file-chart-line"></i>
            </span>
            View report
          </Link>
          {!reopenResubmitted && (
            <button
              onClick={() => setShowReopenModal(true)}
              disabled={isReadOnly}
              className="inline-flex items-center justify-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed bg-iris-100 text-iris"
              title={isReadOnly ? 'Not available in read-only mode' : undefined}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-refresh-line"></i>
              </span>
              Request reopen again
            </button>
          )}
          {reopenResubmitted && (
            <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 bg-iris-100 border border-iris-200">
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-iris">
                <i className="ri-information-line"></i>
              </span>
              <p className="text-[13px] text-iris-900">
                Reopen requested &mdash; awaiting district / SFWG approval. If approved, a new collection window will open and a new report version will be created.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl p-4 sm:p-5 bg-brick-50 border border-brick-100">
          <div className="flex items-start gap-3 mb-4">
            <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-brick-50">
              <i className="ri-close-circle-line text-xl text-brick"></i>
            </span>
            <div>
              <p className="text-[15px] font-semibold mb-0.5 text-ink">
                Reopen request declined
              </p>
              <p className="text-[13px] text-muted">
                Declined by {survey.decidedBy} &middot; {survey.decidedDate}
              </p>
            </div>
          </div>

          <div className="rounded-[10px] p-4 mb-4 bg-white border border-brick-100">
            <p className="text-[12px] font-semibold uppercase tracking-wider mb-2 text-[#a3201d]">
              Reason for the decision
            </p>
            <p className="text-[14px] leading-relaxed text-ink">
              {survey.decisionReason}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider mb-2 text-subtle">
              What this means
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-[13px] text-muted">
                <span className="flex-shrink-0 mt-0.5">&mdash;</span>
                The survey stays closed.
              </li>
              <li className="flex items-start gap-2 text-[13px] text-muted">
                <span className="flex-shrink-0 mt-0.5">&mdash;</span>
                Your current report ({survey.reportLabel} &middot; v{survey.reportVersion}) remains published and unchanged.
              </li>
            </ul>
          </div>

          <div className="rounded-[10px] p-4 bg-canvas border border-line">
            <p className="text-[12px] font-semibold uppercase tracking-wider mb-2 text-subtle">
              Your original request
            </p>
            <p className="text-[14px] mb-1.5 text-muted">
              Proposed new close: {survey.proposedCloseDate} at {survey.proposedCloseTime}
            </p>
            <p className="text-[14px] leading-relaxed text-muted">
              Your reason: {survey.requestReason}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-[13px] mb-3 text-muted">
            This is the single official report for this survey run.
          </p>
          <Link
            href={`/school/reports/${survey.id}/version-history`}
            className="text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
          >
            View version history
            <span className="w-3.5 h-3.5 inline-flex items-center justify-center ml-1">
              <i className="ri-arrow-right-s-line"></i>
            </span>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-iris-50">
            <i className="ri-information-line text-sm text-iris"></i>
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]">Details & settings</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="rounded-xl px-4 py-3 bg-canvas border border-surface-200">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1 text-subtle">
              <span className="w-3 h-3 flex items-center justify-center">
                <i className="ri-test-tube-line text-xs"></i>
              </span>
              Instrument version
            </span>
            <p className="text-[14px] font-medium text-ink">{survey.instrumentVersion}</p>
          </div>
          <div className="rounded-xl px-4 py-3 bg-canvas border border-surface-200">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1 text-subtle">
              <span className="w-3 h-3 flex items-center justify-center">
                <i className="ri-user-line text-xs"></i>
              </span>
              Enrolment target
            </span>
            <p className="text-[14px] font-medium text-ink">{survey.targetCount} students</p>
          </div>
          <div className="rounded-xl px-4 py-3 bg-canvas border border-surface-200">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1 text-subtle">
              <span className="w-3 h-3 flex items-center justify-center">
                <i className="ri-notification-3-line text-xs"></i>
              </span>
              Reminders
            </span>
            <p className="text-[14px] font-medium text-ink">
              {survey.remindersEnabled ? 'On' : 'Off'} &middot; sent to you, not students
            </p>
          </div>
          <div className="rounded-xl px-4 py-3 bg-canvas border border-surface-200">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1 text-subtle">
              <span className="w-3 h-3 flex items-center justify-center">
                <i className="ri-key-line text-xs"></i>
              </span>
              Access code
            </span>
            <p className="text-[14px] font-medium text-ink">
              {survey.hasAccessCode ? survey.accessCode : 'None set'}
            </p>
          </div>
          <div className="rounded-xl px-4 py-3 bg-canvas border border-surface-200">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1 text-subtle">
              <span className="w-3 h-3 flex items-center justify-center">
                <i className="ri-shield-check-line text-xs"></i>
              </span>
              Anonymity
            </span>
            <p className="text-[14px] font-medium text-ink">
              Anonymous &middot; no logins, no names collected
            </p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t flex flex-wrap items-center gap-4 border-line">
          <Link
            href="/school/surveys"
            className="text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
          >
            Back to all surveys
          </Link>
        </div>
      </div>

      <RequestReopenModal
        open={showReopenModal}
        onConfirm={handleReopenResubmit}
        onCancel={() => setShowReopenModal(false)}
      />
    </div>
  );
}