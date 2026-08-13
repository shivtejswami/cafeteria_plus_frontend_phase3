'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SurveysFilterBar from '@/components/school-admin/surveys/components/SurveysFilterBar';
import SurveysTable from '@/components/school-admin/surveys/components/SurveysTable';
import CircularProgress from '@/components/school-admin/common/CircularProgress';
import CreateSurveyForm from '@/components/dashboard/school-admin/surveys/CreateSurveyForm';
import ShareLinkQrModal from '@/components/school-admin/common/ShareLinkQrModal';
import { CloseEarlyModal, PauseModal, ResumeModal, CancelSurveyModal, DeleteDraftModal } from '@/components/school-admin/surveys/components/ConfirmDialogs';
import ExtendClosingDateModal from '@/components/school-admin/surveys/components/ExtendClosingDateModal';
import RequestReopenModal from '@/components/school-admin/surveys/components/RequestReopenModal';
import RequestDeletionModal from '@/components/school-admin/surveys/components/RequestDeletionModal';
import GracePeriodBanner from '@/components/school-admin/common/GracePeriodBanner';
import ReadOnlyBanner from '@/components/school-admin/common/ReadOnlyBanner';
import type { SchoolAdminData, SurveyListItem, SurveyListStatus } from '@/lib/schoolAdminData';
import { surveysListData, schoolReopenPolicy } from '@/lib/schoolAdminData';
import { formatIsoDate } from '@/components/ui/dateFormat';
import type { SurveyActionPayload } from '@/components/school-admin/surveys/components/SurveysTable';

interface SurveysPageProps {
  schoolData: SchoolAdminData;
}

type ModalType =
  | 'create'
  | 'edit-draft'
  | 'share'
  | 'close-early'
  | 'pause'
  | 'resume'
  | 'cancel'
  | 'delete-draft'
  | 'extend'
  | 'request-reopen'
  | 'request-deletion'
  | null;

const gradeBandOptions = [
  { value: 'k-5', label: 'K-5', instrumentVersion: 'v2 (current instrument)' },
  { value: '6-8', label: '6-8', instrumentVersion: 'v3 (current instrument)' },
  { value: '9-12', label: '9-12', instrumentVersion: 'v4 (current instrument)' },
];

export default function SurveysPage({ schoolData }: SurveysPageProps) {
  const isReadOnly = schoolData.subscriptionStatus === 'read-only';
  const canReopenDirectly = schoolReopenPolicy === 'direct';
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SurveyListStatus | 'all'>('all');
  const [gradeBandFilter, setGradeBandFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalSurveyId, setModalSurveyId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const activeBands = useMemo(() => {
    return surveysListData.surveys
      .filter(s => s.status === 'open' || s.status === 'scheduled' || s.status === 'paused')
      .map(s => ({ band: s.gradeBand, surveyId: s.id }));
  }, []);

  const highlightSurvey = useMemo(() => {
    const open = surveysListData.surveys.find(s => s.status === 'open');
    if (open) return open;
    const scheduled = surveysListData.surveys.find(s => s.status === 'scheduled');
    if (scheduled) return scheduled;
    return null;
  }, []);

  const filteredSurveys = useMemo(() => {
    let result = [...surveysListData.surveys] as SurveyListItem[];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.gradeBand.toLowerCase().includes(q) ||
        s.period.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    if (gradeBandFilter !== 'all') {
      result = result.filter(s => s.gradeBand === gradeBandFilter);
    }

    if (periodFilter !== 'all') {
      result = result.filter(s => s.period === periodFilter);
    }

    return result;
  }, [searchQuery, statusFilter, gradeBandFilter, periodFilter]);

  function handleCreateClick() {
    setModalType('create');
  }

  function handleFormCancel() {
    setModalType(null);
    setModalSurveyId(null);
  }

  function handleTableAction(payload: SurveyActionPayload) {
    const { survey, action } = payload;
    setModalSurveyId(survey.id);

    switch (action) {
      case 'edit':
        setModalType('edit-draft');
        break;
      case 'schedule':
        setModalType('edit-draft');
        break;
      case 'open-now':
        showToast('Survey opened now.');
        break;
      case 'close-early':
        setModalType('close-early');
        break;
      case 'pause':
        setModalType('pause');
        break;
      case 'resume':
        setModalType('resume');
        break;
      case 'extend':
        setModalType('extend');
        break;
      case 'share':
        setModalType('share');
        break;
      case 'cancel':
        setModalType('cancel');
        break;
      case 'delete-draft':
        setModalType('delete-draft');
        break;
      case 'request-reopen':
        setModalType('request-reopen');
        break;
      case 'request-deletion':
        setModalType('request-deletion');
        break;
    }
  }

  const modalSurvey = useMemo(() => {
    if (!modalSurveyId) return null;
    return surveysListData.surveys.find(s => s.id === modalSurveyId) || null;
  }, [modalSurveyId]);

  function getShareSurvey() {
    if (modalType === 'share' && modalSurvey) return modalSurvey;
    if (highlightSurvey && (highlightSurvey.status === 'open' || highlightSurvey.status === 'scheduled')) return highlightSurvey;
    return null;
  }

  const shareSurvey = getShareSurvey();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <div>
      {schoolData.subscriptionStatus === 'grace-period' && schoolData.graceDaysRemaining && (
        <div className="mb-6">
          <GracePeriodBanner daysRemaining={schoolData.graceDaysRemaining} />
        </div>
      )}
      {schoolData.subscriptionStatus === 'read-only' && (
        <div className="mb-6">
          <ReadOnlyBanner />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <p className="text-[14px] font-semibold text-[#2B2B2B]">
            {surveysListData.surveys.length} surveys
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          disabled={isReadOnly}
          className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${isReadOnly ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'} bg-sage text-white ${isReadOnly ? 'shadow-none' : 'shadow-[0_4px_14px_rgba(88,109,77,0.25)]'}`}
          title={isReadOnly ? 'Creating surveys is not available in read-only mode' : undefined}
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-add-line"></i>
          </span>
          Create survey
        </button>
      </div>

      <div className="mb-5 rounded-2xl px-4 py-3 flex items-start gap-3 bg-[#FAF8FC] border border-[#EDE3F5]">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#5B3AA0]">
          <i className="ri-information-line"></i>
        </span>
        <p className="text-[13px] text-[#5B3AA0] font-medium">
          Your school can run one survey per grade band at a time.
        </p>
      </div>

      <SurveysFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        gradeBandFilter={gradeBandFilter}
        onGradeBandChange={setGradeBandFilter}
        periodFilter={periodFilter}
        onPeriodChange={setPeriodFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Open Survey Highlight Card */}
      {highlightSurvey && (
        <div className="my-5 sm:my-6 rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          {/* Left Section: All info & metrics */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap flex-1 min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#006EB21A] flex items-center justify-center shrink-0 text-[#006EB2]">
                <i className="ri-pulse-line text-xl"></i>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-bold text-[#2B2B2B]">{highlightSurvey.period}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-[#006EB21A] text-[#006EB2]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006EB2]"></span>
                    Open
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="rounded-md px-2 py-0.5 text-[12px] font-medium bg-[#F0EAFB] text-[#6D28D9]">
                    {highlightSurvey.gradeBand}
                  </span>
                  <p className="text-[12px] text-[#9A9A9A]">
                    7 Jul 2026, 08:00 – 25 Jul 2026, 16:00
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-[26px] sm:text-[32px] font-bold text-[#2B2B2B] leading-none">{highlightSurvey.responseCount ?? 0}</span>
              <span className="text-[14px] text-[#9A9A9A]">/ {highlightSurvey.targetCount ?? 130}</span>
              <span className="text-[13px] text-[#9A9A9A]">responses</span>
            </div>

            <CircularProgress percentage={Math.round(((highlightSurvey.responseCount ?? 0) / (highlightSurvey.targetCount || 1)) * 100)} size={64} strokeWidth={7} />

            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#6D6D6D]">
              <i className="ri-time-line text-base"></i>
              <span>3d left</span>
            </div>
          </div>

          {/* Right Section: Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => { setModalSurveyId(highlightSurvey.id); setModalType('share'); }}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full h-10 px-4 text-[13px] font-medium whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7]"
            >
              <i className="ri-share-line text-base"></i>
              Share link / QR
            </button>
            <Link
              href={`/school/surveys/${highlightSurvey.id}`}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
            >
              View survey
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6">
        <SurveysTable
          surveys={filteredSurveys}
          onAction={handleTableAction}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* Create / Edit Draft modal */}
      {(modalType === 'create' || modalType === 'edit-draft') && (
        <CreateSurveyForm
          open={true}
          onClose={handleFormCancel}
          gradeBands={gradeBandOptions}
          activeBands={activeBands}
          isReadOnly={isReadOnly}
          parentTab="Surveys"
        />
      )}

      {/* Share Link / QR Modal */}
      <ShareLinkQrModal
        open={shareModalOpen || modalType === 'share'}
        surveyUrl={shareSurvey ? `https://school.cafeteria-pulse.app/survey/${shareSurvey.id}` : ''}
        accessCode={shareSurvey?.id === 's1' ? 'LUNCH7' : null}
        status={shareSurvey?.status === 'open' ? 'open' : 'scheduled'}
        scheduledOpensDate={shareSurvey?.status === 'scheduled' ? `${shareSurvey.openedDate}, ${shareSurvey.openedTime?.slice(0, 5)}` : undefined}
        onClose={() => { setShareModalOpen(false); setModalType(null); }}
      />

      {/* Close early modal */}
      <CloseEarlyModal
        open={modalType === 'close-early'}
        responseCount={modalSurvey?.responseCount ?? 0}
        onConfirm={() => { setModalType(null); showToast('Survey closed. Analysis has started. A report will be ready soon.'); }}
        onCancel={() => setModalType(null)}
      />

      {/* Pause modal */}
      <PauseModal
        open={modalType === 'pause'}
        onConfirm={() => { setModalType(null); showToast('Survey paused. Students will see a "not available" message. Resume to continue collecting responses.'); }}
        onCancel={() => setModalType(null)}
      />

      {/* Resume modal */}
      <ResumeModal
        open={modalType === 'resume'}
        closesDateTime={modalSurvey ? `${modalSurvey.closesDate}, ${modalSurvey.closesTime?.slice(0, 5)}` : ''}
        onConfirm={() => { setModalType(null); showToast('Survey resumed. Students can respond again.'); }}
        onCancel={() => setModalType(null)}
      />

      {/* Cancel survey modal */}
      <CancelSurveyModal
        open={modalType === 'cancel'}
        onConfirm={() => { setModalType(null); showToast('Survey cancelled. No report will be produced.'); }}
        onCancel={() => setModalType(null)}
      />

      {/* Delete draft modal */}
      <DeleteDraftModal
        open={modalType === 'delete-draft'}
        onConfirm={() => { setModalType(null); showToast('Draft deleted.'); }}
        onCancel={() => setModalType(null)}
      />

      {/* Extend closing date modal */}
      <ExtendClosingDateModal
        open={modalType === 'extend'}
        currentCloseDate={modalSurvey ? `${modalSurvey.closesDate ?? ''}, ${modalSurvey.closesTime?.slice(0, 5) ?? ''}` : ''}
        onConfirm={(date, time) => { setModalType(null); showToast(`Closing date extended to ${date}, ${time}.`); }}
        onCancel={() => setModalType(null)}
      />

      {/* Reopen modal — reopens directly, or asks for approval, per district policy */}
      <RequestReopenModal
        open={modalType === 'request-reopen'}
        mode={canReopenDirectly ? 'direct' : 'request'}
        onConfirm={(date, time) => {
          setModalType(null);
          showToast(
            canReopenDirectly
              ? `Survey reopened until ${formatIsoDate(date)}${time ? ` at ${time}` : ''}.`
              : 'Reopen request sent for approval.',
          );
        }}
        onCancel={() => setModalType(null)}
      />

      {/* Request deletion modal */}
      <RequestDeletionModal
        open={modalType === 'request-deletion'}
        onConfirm={() => { setModalType(null); showToast('Deletion request sent to SFWG for review.'); }}
        onCancel={() => setModalType(null)}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-60 animate-fade-in">
          <div className="rounded-full px-5 py-3 flex items-center gap-2.5 shadow-lg bg-ink text-white">
            <span className="w-4 h-4 flex items-center justify-center text-sage">
              <i className="ri-check-line"></i>
            </span>
            <span className="text-[13px] font-medium">
              {toastMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
