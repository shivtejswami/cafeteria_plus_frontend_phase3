import React, { useState, useEffect } from 'react';
import { X, Check, Clock, Info, AlertTriangle } from 'lucide-react';
import { ReopenRequest } from './types';
import { ApproveConfirmModal } from './ApproveConfirmModal';
import { DeclineConfirmModal } from './DeclineConfirmModal';

interface ReopenRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: ReopenRequest | null;
  onApprove: (id: string, newClosingDate: string, notes: string) => void;
  onDecline: (id: string, reason: string) => void;
}

export function ReopenRequestDrawer({
  isOpen,
  onClose,
  request,
  onApprove,
  onDecline,
}: ReopenRequestDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isApproveModalOpen && !isDeclineModalOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isApproveModalOpen, isDeclineModalOpen]);

  if (!isOpen || !request) return null;

  const isPending = request.status === 'Pending';
  const isApproved = request.status === 'Approved';
  const isDeclined = request.status === 'Declined';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 modal-backdrop transition-opacity duration-300 cursor-pointer ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={onClose}
        />

        {/* Drawer Container: Fullscreen on mobile, right drawer on sm+ */}
        <div className="fixed inset-y-0 right-0 w-full sm:w-auto max-w-full flex pl-0 sm:pl-10">
          <div
            className={`w-full sm:w-[540px] md:w-[620px] lg:w-[680px] bg-[#FFFFFF] shadow-2xl transition-transform duration-300 ease-out transform ${isVisible ? 'translate-x-0' : 'translate-x-full'
              } flex flex-col h-full overflow-hidden sm:border-l border-[#E8E6E1]`}
          >
            {/* Top Fixed Header (Intact during scroll) */}
            <div className="p-4 sm:p-6 md:p-8 pb-4 sm:pb-4 md:pb-4 border-b border-[#EFEDE8] flex justify-between items-start shrink-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[20px] sm:text-[24px] font-bold text-[#2B2B2B] font-sans leading-tight">
                    {request.school}
                  </h1>
                  {isPending && (
                    <span className="bg-[#FFF1DD] text-[#8A4B04] text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      Pending
                    </span>
                  )}
                  {isApproved && (
                    <span className="bg-[#E3F5E3] text-[#1D6B1D] text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      Approved
                    </span>
                  )}
                  {isDeclined && (
                    <span className="bg-[#F1EFEA] text-[#6D6D6D] text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      Declined
                    </span>
                  )}
                </div>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-secondary mt-1">
                  Survey reopen request
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 -mr-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body Content (Only this scrolls) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8 space-y-3.5 sm:space-y-4 custom-scrollbar">
              {/* Card 1: School & Survey Run 2-Col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* School Box */}
                <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
                  <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans">
                    School
                  </span>
                  <div className="mt-1">
                    <div className="text-[14px] font-bold text-[#6D28D9] font-sans">
                      {request.school}
                    </div>
                    <span className="bg-[#F0EAFB] text-[#6D28D9] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md inline-block mt-1 font-sans">
                      {request.schoolType === 'District school' ? 'District school' : 'Standalone school'}
                    </span>
                    {request.district && (
                      <div className="text-[12px] text-[#6D28D9] mt-1 font-medium font-secondary">
                        {request.district}
                      </div>
                    )}
                  </div>
                </div>

                {/* Survey Run Box */}
                <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
                  <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans">
                    Survey run
                  </span>
                  <div className="mt-1">
                    <div className="text-[14px] font-bold text-[#2B2B2B] font-sans">
                      {request.gradeBand} · {request.period}
                    </div>
                    <div className="text-[12px] text-slate-500 font-secondary mt-1">
                      Closed {request.closedDate || '10 Dec 2025'} · {request.responses} / {request.targetResponses} responses
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Requested By */}
              <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block mb-1">
                  Requested by
                </span>
                <div className="text-[14px] sm:text-[15px] font-bold text-[#2B2B2B] font-sans">
                  {request.requestedBy}
                </div>
                <div className="text-[12px] text-slate-500 font-secondary mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{request.requestedRole || 'School administrator'}</span>
                  <span>·</span>
                  <span>{request.requestedDate}</span>
                  <span className="text-[#D8201D] font-semibold">({request.daysWaiting} days)</span>
                </div>
              </div>

              {/* Card 3: Requested New Closing Date & Time (2-Col Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Date */}
                <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                  <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block">
                    Requested new closing date
                  </span>
                  <div className="text-[14px] sm:text-[15px] font-bold text-[#2B2B2B] font-sans mt-1">
                    {request.requestedClosingDate || '15/08/2026'}
                  </div>
                </div>

                {/* Time */}
                <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                  <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block">
                    Requested new closing time
                  </span>
                  <div className="text-[14px] sm:text-[15px] font-bold text-[#2B2B2B] font-sans mt-1">
                    {request.requestedClosingTime || '17:00'}
                  </div>
                </div>
              </div>

              {/* Card 4: Reason For Reopening */}
              <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block mb-1.5">
                  Reason for reopening
                </span>
                <p className="text-[13px] text-[#2B2B2B] font-secondary leading-relaxed">
                  {request.reason || 'Survey QR badges were not distributed to kindergarten and 1st grade lunch monitors on time.'}
                </p>
              </div>

              {/* Card 5: Current Report Warning Banner (Amber Box) */}
              <div className="bg-[#FFF9F0] border border-[#F0C070] rounded-2xl p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span className="text-[13px] font-bold text-[#8A4B04] font-sans">
                    Current report will be affected
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <span className="bg-[#E3F5E3] text-[#1D6B1D] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block">
                    Published
                  </span>
                  <span className="text-[12px] font-bold text-[#2B2B2B] font-sans">
                    {request.publishedVersion || 'Fall 2025 · v1'}
                  </span>
                </div>

                <p className="text-[11px] sm:text-[12px] text-[#8A4B04] font-secondary leading-relaxed mt-2">
                  If this request is approved, the current report ({request.publishedVersion || 'Fall 2025 · v1'}) will be superseded and temporarily unavailable. A new report version will be generated when the survey closes again.
                </p>
              </div>

              {/* Card 6: Decision Info Box (Shown when Approved or Declined) */}
              {isApproved && (
                <div className="bg-[#EAF5EA] border border-[#B4DDB4] rounded-2xl p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D6B1D] shrink-0" strokeWidth={2.5} />
                    <span className="text-[13px] font-bold text-[#1D6B1D] font-sans">
                      Request Approved
                    </span>
                  </div>
                  <p className="text-[12px] text-[#1D6B1D] font-secondary mt-1">
                    Approved by {request.decision?.decidedBy || 'Emily Chatelain'} on {request.decision?.decidedDate || '2 Jul 2026'}
                  </p>
                  <p className="text-[12px] text-[#2B2B2B] font-secondary mt-2 bg-white/70 p-3 rounded-xl border border-[#B4DDB4]">
                    {request.decision?.notes || 'Reopened for 5 days. New closing date set to 7 Jul 2026.'}
                  </p>
                </div>
              )}

              {isDeclined && (
                <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-[#D8201D] shrink-0" strokeWidth={2.5} />
                    <span className="text-[13px] font-bold text-[#D8201D] font-sans">
                      Request Declined
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 font-secondary mt-1">
                    Declined by {request.decision?.decidedBy || 'Emily Chatelain'} on {request.decision?.decidedDate || '2 Jul 2026'}
                  </p>
                  <p className="text-[12px] text-[#2B2B2B] font-secondary mt-2 bg-white p-3 rounded-xl border border-[#E8E6E1]">
                    {request.decision?.notes || 'The quantitative participation is strong at 61% and the report is already published. Qualitative data thinness is not grounds for reopening  the school can address this in the next survey cycle. Closing-date error is also not present. Suggest re-running in Fall 2026 with better communication about the open-ended section.'}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Fixed Action Buttons (Full width on mobile, auto on desktop) */}
            {isPending && (
              <div className="p-4 sm:p-6 md:p-8 pt-3 sm:pt-4 border-t border-[#EFEDE8] flex items-center gap-3 w-full shrink-0 bg-white z-10">
                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(true)}
                  className="flex-1 sm:flex-none w-full sm:w-auto text-nowrap bg-[#4E6B48] hover:bg-[#3E563A] text-white font-semibold text-[13px] px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  <span>Approve &amp; reopen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeclineModalOpen(true)}
                  className="flex-1 sm:flex-none w-full sm:w-auto bg-white border border-[#D8201D] text-[#D8201D] hover:bg-[#FDEAEA] font-semibold text-[13px] px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                  <span>Decline</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ApproveConfirmModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        request={request}
        onConfirm={onApprove}
      />

      <DeclineConfirmModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        request={request}
        onConfirm={onDecline}
      />
    </>
  );
}
