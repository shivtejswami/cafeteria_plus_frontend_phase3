'use client';

import { useState } from 'react';

import DateField from '@/components/ui/DateField';

interface RequestReopenModalProps {
  open: boolean;
  /**
   * 'direct' when the district lets this school reopen on its own — the survey reopens on confirm.
   * 'request' when it has to be approved first.
   */
  mode?: 'direct' | 'request';
  onConfirm: (proposedCloseDate: string, proposedCloseTime: string, reason: string) => void;
  onCancel: () => void;
}

export default function RequestReopenModal({ open, mode = 'request', onConfirm, onCancel }: RequestReopenModalProps) {
  const isDirect = mode === 'direct';
  const [proposedCloseDate, setProposedCloseDate] = useState('');
  const [proposedCloseTime, setProposedCloseTime] = useState('15:00');
  const [reason, setReason] = useState('');

  if (!open) return null;

  const canSubmit = proposedCloseDate.trim().length > 0 && reason.trim().length > 0 && reason.length <= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isDirect ? 'Reopen survey' : 'Request reopen'}
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">
          {isDirect ? 'Reopen Survey' : 'Request reopen'}
        </h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          {isDirect
            ? 'Reopening a survey means that the survey collects again and a NEW report version is generated — the current report is preserved in history.'
            : 'Reopening is reviewed by your district / SFWG. If approved, the survey collects again and a NEW report version is generated — the current report is preserved in history.'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold mb-2 text-[#2B2B2B]">
              {isDirect ? 'New closing date' : 'Proposed new closing date'}
            </label>
            <DateField
              value={proposedCloseDate}
              onChange={setProposedCloseDate}
              aria-label="Proposed new closing date"
              className="w-full h-11 px-4 rounded-2xl flex items-center justify-between gap-2 text-base sm:text-[14px] text-left outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#586D4D] focus-visible:ring-offset-1 bg-[#FAF9F6] border border-[#E8E6E1]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold mb-2 text-[#2B2B2B]">
              {isDirect ? 'New closing time' : 'Proposed new closing time'}
            </label>
            <input
              type="time"
              value={proposedCloseTime}
              onChange={(e) => setProposedCloseTime(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl text-base sm:text-[14px] outline-none focus:outline-none focus:ring-0 bg-[#FAF9F6] border border-[#E8E6E1] text-[#2B2B2B]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold mb-2 text-[#2B2B2B]">
              Reason (required)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder={isDirect ? 'Why are you reopening this survey?' : 'Why are you requesting to reopen this survey?'}
              className="w-full h-32 p-3.5 rounded-2xl text-base sm:text-[14px] resize-none outline-none focus:outline-none focus:ring-0 bg-[#FAF9F6] border border-[#E8E6E1] text-[#2B2B2B]"
            />
            <p className={`text-[12px] mt-1 ${reason.length > 450 ? 'text-[#D97706]' : 'text-[#9A9A9A]'}`}>
              {500 - reason.length} characters remaining
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => canSubmit && onConfirm(proposedCloseDate, proposedCloseTime, reason.trim())}
            disabled={!canSubmit}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {isDirect ? 'Reopen survey' : 'Send reopen request'}
          </button>
        </div>
      </div>
    </div>
  );
}