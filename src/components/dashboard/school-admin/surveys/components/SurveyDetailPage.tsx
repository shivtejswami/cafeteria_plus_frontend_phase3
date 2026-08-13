'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { SurveyDetailData } from '@/lib/schoolAdminData';
import { surveyDeletionRejections, surveyReopenRejections, surveysListData, type ReopenPolicy } from '@/lib/schoolAdminData';
import ShareLinkQrModal from '@/components/school-admin/common/ShareLinkQrModal';
import {
  CloseEarlyModal,
  PauseModal,
  ResumeModal,
  CancelSurveyModal,
  DeleteDraftModal,
  DeleteDeletionRequestModal,
  DeleteReopenRequestModal,
} from '@/components/school-admin/surveys/components/ConfirmDialogs';
import ExtendClosingDateModal from '@/components/school-admin/surveys/components/ExtendClosingDateModal';
import RequestDeletionModal from '@/components/school-admin/surveys/components/RequestDeletionModal';
import RequestReopenModal from '@/components/school-admin/surveys/components/RequestReopenModal';
import { useToast } from '@/components/ToastContext';

import DeletionActionsCard from './survey-detail/DeletionActionsCard';
import ReopenActionsCard from './survey-detail/ReopenActionsCard';
import DetailsAndSettings from './survey-detail/DetailsAndSettings';
import GradeBreakdownCard from './survey-detail/GradeBreakdownCard';
import ParticipationTrendCard from './survey-detail/ParticipationTrendCard';
import StatusSummaryCard from './survey-detail/StatusSummaryCard';
import SurveyControlsCard from './survey-detail/SurveyControlsCard';
import SurveyOverviewBanner from './survey-detail/SurveyOverviewBanner';
import {
  AnalysingNotice,
  CancelledNotice,
  DraftNotice,
  LiveNotices,
  PausedNotice,
  ScheduledNotice,
  SmallSampleNotice,
  SurveyCompleteNotice,
} from './survey-detail/SurveyNotices';
import { formatIsoDate, type DeletionState, type Phase, type ReopenState } from './survey-detail/types';

interface SurveyDetailPageProps {
  surveyId: string;
  survey: SurveyDetailData | null;
  isReadOnly: boolean;
  /** District policy — 'direct' skips the approval step and reopens the survey straight away. */
  reopenPolicy?: ReopenPolicy;
}

export default function SurveyDetailPage({ surveyId, survey, isReadOnly, reopenPolicy = 'requested' }: SurveyDetailPageProps) {
  const canReopenDirectly = reopenPolicy === 'direct';
  const { toast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showWithdrawDeletionModal, setShowWithdrawDeletionModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showWithdrawReopenModal, setShowWithdrawReopenModal] = useState(false);
  const rejection = surveyDeletionRejections[survey?.id ?? surveyId];
  const reopenRejection = surveyReopenRejections[survey?.id ?? surveyId];
  const [deletionState, setDeletionState] = useState<DeletionState>(rejection ? 'rejected' : 'none');
  /** Always starts clean — the decline only appears once the school has actually asked. */
  const [reopenState, setReopenState] = useState<ReopenState>('none');
  const [reopenedUntil, setReopenedUntil] = useState('');
  const reviewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stands in for the district reviewing the request; a real build would poll or push this.
  useEffect(() => {
    return () => {
      if (reviewTimer.current) clearTimeout(reviewTimer.current);
    };
  }, []);

  function requestReopen(proposedCloseDate: string, proposedCloseTime: string) {
    setShowReopenModal(false);

    // With direct permission there is nobody to ask — the survey collects again straight away.
    if (canReopenDirectly) {
      const until = proposedCloseDate
        ? `${formatIsoDate(proposedCloseDate)}${proposedCloseTime ? ` at ${proposedCloseTime}` : ''}`
        : '';
      setReopenedUntil(until);
      setReopenState('reopened');
      toast('success', until ? `Survey reopened until ${until}.` : 'Survey reopened.');
      return;
    }

    setReopenState('pending');
    toast('neutral', 'Reopen requested. Your district / SFWG will review it.');

    if (!reopenRejection) return;
    reviewTimer.current = setTimeout(() => {
      setReopenState('declined');
      toast('error', 'Your reopen request was declined. See the reason on this page.');
    }, 4000);
  }

  function withdrawReopen() {
    if (reviewTimer.current) clearTimeout(reviewTimer.current);
    setShowWithdrawReopenModal(false);
    setReopenState('none');
    toast('neutral', 'Reopen request removed.');
  }
  /** Set once the closing date is extended, so every date on the screen reflects the new window. */
  const [extendedClose, setExtendedClose] = useState<{ day: string; clock: string } | null>(null);
  const [phase, setPhase] = useState<Phase>(() => {
    // Every status maps to exactly one screen; anything unmapped would wrongly look "open".
    switch (survey?.status) {
      case 'draft': return 'draft';
      case 'scheduled': return 'scheduled';
      case 'paused': return 'paused';
      case 'closed':
      case 'analysing':
      case 'under-review': return 'analysing';
      case 'published': return 'published';
      case 'cancelled': return 'cancelled';
      default: return 'live';
    }
  });

  // Fallback survey details if not provided
  const currentGradeBand = survey?.gradeBand || '6-8';
  const currentPeriod = survey?.period || 'Fall 2025';
  const responseCount = survey?.responseCount || 83;
  const targetCount = survey?.targetCount || 130;
  const responseRate = Math.round((responseCount / targetCount) * 100);
  const status = survey?.status || 'open';
  const accessCode = survey?.accessCode || 'LUNCH7';
  const daysRemaining = survey?.daysRemaining ?? 3;
  const openedDay = survey?.openedDate ?? '7 Jul 2026';
  const closesDay = extendedClose?.day ?? survey?.closesDate ?? '18 Jul 2026';
  const openedClock = (survey?.openedTime ?? '08:00').slice(0, 5);
  const closesClock = extendedClose?.clock ?? (survey?.closesTime ?? '16:00').slice(0, 5);
  const openedAt = `${openedDay} at ${openedClock}`;
  const closesAt = `${closesDay} at ${closesClock}`;
  const openedDateTime = `${openedDay}, ${openedClock}`;
  const closesDateTime = `${closesDay}, ${closesClock}`;
  const isPaused = phase === 'paused';
  /** The summary strip only earns its place once the collection window has actually changed. */
  const showSummary = isPaused || extendedClose !== null;

  const shareModal = (
    <ShareLinkQrModal
      open={showShareModal}
      surveyUrl={survey ? `https://school.cafeteria-pulse.app/survey/${survey.id}` : 'https://pulse.cafe/s1-a3m9'}
      accessCode={accessCode}
      status={status === 'open' ? 'open' : 'scheduled'}
      isReadOnly={isReadOnly}
      onClose={() => setShowShareModal(false)}
    />
  );

  const breadcrumb = (
    <div className="flex flex-wrap items-center gap-1.5 text-[12px] sm:text-[13px] text-[#9A9A9A]" aria-label="Breadcrumb">
      <Link href="/school/surveys" className="hover:underline transition-colors hover:text-[#2B2B2B]">
        Surveys
      </Link>
      <span>/</span>
      <span className="text-[#2B2B2B] font-medium">{currentGradeBand} · {currentPeriod}</span>
    </div>
  );

  const backToSurveys = (
    <Link
      href="/school/surveys"
      className="text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-1 rounded text-[#6D28D9]"
    >
      Back to all surveys
    </Link>
  );

  // A draft has no window and no responses — only setup actions apply.
  if (phase === 'draft') {
    return (
      <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12">
        {breadcrumb}

        <StatusSummaryCard
          phase="draft"
          gradeBand={currentGradeBand}
          period={currentPeriod}
        />

        <DraftNotice />

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] space-y-4">
          <label className="block text-[11px] font-semibold text-[#9A9A9A]">
            Survey controls
          </label>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
            <Link
              href="/school/surveys/create"
              className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
            >
              <i className="ri-edit-line text-base"></i>
              Edit draft
            </Link>
            <button
              onClick={() => setShowDeleteDraftModal(true)}
              disabled={isReadOnly}
              className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap bg-white border border-[#D8201D] text-[#D8201D] hover:bg-red-50 disabled:opacity-40"
            >
              <i className="ri-delete-bin-line text-base"></i>
              Delete draft
            </button>
          </div>
        </div>

        <DetailsAndSettings
          targetCount={targetCount}
          accessCode={accessCode}
          footer={<div className="pt-4 mt-1 border-t border-[#E8E6E1]">{backToSurveys}</div>}
        />

        <DeleteDraftModal
          open={showDeleteDraftModal}
          onConfirm={() => {
            setShowDeleteDraftModal(false);
            toast('neutral', 'Draft deleted.');
          }}
          onCancel={() => setShowDeleteDraftModal(false)}
        />
      </div>
    );
  }

  // Scheduled: set up and waiting to open, so there is nothing to measure yet.
  if (phase === 'scheduled') {
    return (
      <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12">
        {breadcrumb}

        <StatusSummaryCard
          phase="scheduled"
          gradeBand={currentGradeBand}
          period={currentPeriod}
          openedAt={openedAt}
          closesAt={closesAt}
          action={
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full lg:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
            >
              <i className="ri-share-line text-base"></i>
              Share link / QR
            </button>
          }
        />

        <ScheduledNotice opensAt={openedAt} />

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] space-y-4">
          <label className="block text-[11px] font-semibold text-[#9A9A9A]">
            Survey controls
          </label>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                setPhase('live');
                toast('success', 'Survey opened. Students can respond now.');
              }}
              disabled={isReadOnly}
              className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40"
            >
              <i className="ri-play-fill text-base"></i>
              Open now
            </button>
            <button
              onClick={() => setShowExtendModal(true)}
              disabled={isReadOnly}
              className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap bg-[#F4F7F1] border border-[#DCE4D6] text-[#586D4D] hover:bg-[#eaf0e7] disabled:opacity-40"
            >
              <i className="ri-calendar-event-line text-base"></i>
              Extend closing date
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={isReadOnly}
              className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap bg-white border border-[#D8201D] text-[#D8201D] hover:bg-red-50 disabled:opacity-40"
            >
              <i className="ri-close-circle-line text-base"></i>
              Cancel survey
            </button>
          </div>
        </div>

        <DetailsAndSettings
          targetCount={targetCount}
          accessCode={accessCode}
          footer={<div className="pt-4 mt-1 border-t border-[#E8E6E1]">{backToSurveys}</div>}
        />

        {shareModal}

        <ExtendClosingDateModal
          open={showExtendModal}
          currentCloseDate={closesDateTime}
          onConfirm={(newDate, newTime) => {
            setShowExtendModal(false);
            const day = formatIsoDate(newDate);
            setExtendedClose({ day, clock: newTime });
            toast('success', `Closing date extended to ${day} at ${newTime}.`);
          }}
          onCancel={() => setShowExtendModal(false)}
        />

        <CancelSurveyModal
          open={showCancelModal}
          onConfirm={() => {
            setShowCancelModal(false);
            setPhase('cancelled');
            toast('neutral', 'Survey cancelled. No report will be produced.');
          }}
          onCancel={() => setShowCancelModal(false)}
        />
      </div>
    );
  }

  // Once the report is out, the screen becomes a record plus the one remaining ask: reopen it.
  if (phase === 'published') {
    const reportId = surveysListData.surveys.find((s) => s.id === (survey?.id ?? surveyId))?.reportId;

    return (
      <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12">
        {breadcrumb}

        <StatusSummaryCard
          phase="published"
          gradeBand={currentGradeBand}
          period={currentPeriod}
          openedAt={openedAt}
          closesAt={closesAt}
        />

        {responseCount < 30 && <SmallSampleNotice responseCount={responseCount} />}

        <SurveyCompleteNotice
          responseCount={responseCount}
          targetCount={targetCount}
          responseRate={responseRate}
        />

        <ReopenActionsCard
          state={reopenState}
          rejection={reopenRejection}
          reportHref={reportId ? `/school/reports/${reportId}` : null}
          isReadOnly={isReadOnly}
          canReopenDirectly={canReopenDirectly}
          reopenedUntil={reopenedUntil}
          onRequest={() => setShowReopenModal(true)}
          onWithdraw={() => setShowWithdrawReopenModal(true)}
        />

        <DetailsAndSettings
          targetCount={targetCount}
          accessCode={accessCode}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-1 border-t border-[#E8E6E1]">
              <p className="text-[13px] text-[#9A9A9A]">
                This is the single official report for this survey run.
              </p>
              {backToSurveys}
            </div>
          }
        />

        <RequestReopenModal
          open={showReopenModal}
          mode={canReopenDirectly ? 'direct' : 'request'}
          onConfirm={requestReopen}
          onCancel={() => setShowReopenModal(false)}
        />

        <DeleteReopenRequestModal
          open={showWithdrawReopenModal}
          onConfirm={withdrawReopen}
          onCancel={() => setShowWithdrawReopenModal(false)}
        />
      </div>
    );
  }

  // A cancelled run produces no report, so only the record and the deletion request remain.
  if (phase === 'cancelled') {
    return (
      <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12">
        {breadcrumb}

        <CancelledNotice />

        <StatusSummaryCard
          phase="cancelled"
          gradeBand={currentGradeBand}
          period={currentPeriod}
          openedAt={openedAt}
          closesAt={closesAt}
        />

        <DeletionActionsCard
          state={deletionState}
          rejection={rejection}
          isReadOnly={isReadOnly}
          onRequest={() => setShowDeletionModal(true)}
          onWithdraw={() => setShowWithdrawDeletionModal(true)}
        />

        <DetailsAndSettings
          targetCount={targetCount}
          accessCode={accessCode}
          footer={<div className="pt-4 mt-1 border-t border-[#E8E6E1]">{backToSurveys}</div>}
        />

        <RequestDeletionModal
          open={showDeletionModal}
          onConfirm={() => {
            setShowDeletionModal(false);
            setDeletionState('pending');
            toast('neutral', 'Deletion request sent to SFWG.');
          }}
          onCancel={() => setShowDeletionModal(false)}
        />

        <DeleteDeletionRequestModal
          open={showWithdrawDeletionModal}
          onConfirm={() => {
            setShowWithdrawDeletionModal(false);
            setDeletionState('none');
            toast('neutral', 'Deletion request removed.');
          }}
          onCancel={() => setShowWithdrawDeletionModal(false)}
        />
      </div>
    );
  }

  // Once collection stops, participation charts and survey controls no longer apply —
  // the screen becomes a read-only record plus the analysis status.
  if (phase === 'analysing') {
    return (
      <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12">
        {breadcrumb}

        <StatusSummaryCard
          phase="analysing"
          gradeBand={currentGradeBand}
          period={currentPeriod}
          openedAt={openedAt}
          closesAt={closesAt}
        />

        <AnalysingNotice />

        <DetailsAndSettings
          targetCount={targetCount}
          accessCode={accessCode}
          footer={
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 mt-1 border-t border-[#E8E6E1]">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-1 text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-1 rounded text-[#6D28D9]"
              >
                Share link / QR
                <i className="ri-arrow-right-s-line text-sm"></i>
              </button>
              <span className="hidden sm:block w-px h-4 bg-[#E8E6E1]" />
              {backToSurveys}
            </div>
          }
        />

        {shareModal}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12">
      {breadcrumb}

      {/* Pausing or extending changes the collection window, so the new one is spelled out up top. */}
      {showSummary && (
        <StatusSummaryCard
          phase={phase}
          gradeBand={currentGradeBand}
          period={currentPeriod}
          openedAt={openedAt}
          closesAt={closesAt}
          daysRemaining={isPaused ? undefined : daysRemaining}
          action={
            isPaused ? undefined : (
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full lg:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
              >
                <i className="ri-share-line text-base"></i>
                Share link / QR
              </button>
            )
          }
        />
      )}

      <SurveyOverviewBanner
        isPaused={isPaused}
        gradeBand={currentGradeBand}
        period={currentPeriod}
        openedDateTime={openedDateTime}
        closesDateTime={closesDateTime}
        responseCount={responseCount}
        targetCount={targetCount}
        responseRate={responseRate}
        daysRemaining={daysRemaining}
        // The summary card carries the share action whenever it is on screen.
        onShare={showSummary ? undefined : () => setShowShareModal(true)}
      />

      {isPaused ? <PausedNotice /> : <LiveNotices responseRate={responseRate} daysRemaining={daysRemaining} />}

      <ParticipationTrendCard />

      <GradeBreakdownCard />

      <SurveyControlsCard
        isPaused={isPaused}
        isReadOnly={isReadOnly}
        onCloseEarly={() => setShowCloseModal(true)}
        onPause={() => setShowPauseModal(true)}
        onResume={() => setShowResumeModal(true)}
        onExtend={() => setShowExtendModal(true)}
        onCancel={() => setShowCancelModal(true)}
      />

      <DetailsAndSettings targetCount={targetCount} accessCode={accessCode} />

      {shareModal}

      <CloseEarlyModal
        open={showCloseModal}
        responseCount={responseCount}
        onConfirm={() => {
          setShowCloseModal(false);
          setPhase('analysing');
          toast('neutral', 'Survey closed. Analysis has started. A report will be ready soon.');
        }}
        onCancel={() => setShowCloseModal(false)}
      />

      <PauseModal
        open={showPauseModal}
        onConfirm={() => {
          setShowPauseModal(false);
          setPhase('paused');
          toast('neutral', 'Survey paused. Students will see a "not available" message. Resume to continue collecting responses.');
        }}
        onCancel={() => setShowPauseModal(false)}
      />

      <ResumeModal
        open={showResumeModal}
        closesDateTime={closesDateTime}
        onConfirm={() => {
          setShowResumeModal(false);
          setPhase('live');
          toast('success', 'Survey resumed. Students can respond again.');
        }}
        onCancel={() => setShowResumeModal(false)}
      />

      <ExtendClosingDateModal
        open={showExtendModal}
        currentCloseDate={closesDateTime}
        onConfirm={(newDate, newTime) => {
          setShowExtendModal(false);
          const day = formatIsoDate(newDate);
          setExtendedClose({ day, clock: newTime });
          toast('success', `Closing date extended to ${day} at ${newTime}.`);
        }}
        onCancel={() => setShowExtendModal(false)}
      />

      <CancelSurveyModal
        open={showCancelModal}
        onConfirm={() => {
          setShowCancelModal(false);
          setPhase('cancelled');
          toast('neutral', 'Survey cancelled. No report will be produced.');
        }}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
}
