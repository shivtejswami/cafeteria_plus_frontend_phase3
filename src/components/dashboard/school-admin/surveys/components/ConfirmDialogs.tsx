'use client';

import { useState } from 'react';

/* ── Close early ── */

interface CloseEarlyModalProps {
  open: boolean;
  responseCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CloseEarlyModal({ open, responseCount, onConfirm, onCancel }: CloseEarlyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Close survey early"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Close survey early?</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          Closing now stops collection and starts final analysis &mdash; the report will be generated. This can&apos;t be undone without a reopen request.
        </p>
        <div className="rounded-2xl p-4 bg-[#FAF9F6] border border-[#F0EDE6]">
          <span className="text-[14px] font-semibold text-[#2B2B2B]">
            {responseCount} responses collected so far.
          </span>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Keep open
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#D97706] text-white hover:bg-[#b45309] transition-colors shadow-sm"
          >
            Close &amp; analyze
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Pause ── */

interface PauseModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PauseModal({ open, onConfirm, onCancel }: PauseModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Pause survey"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Pause survey?</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          Students will see a neutral &apos;not available&apos; message and can&apos;t respond until you resume. No data is lost.
        </p>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Keep open
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#D97706] text-white hover:bg-[#b45309] transition-colors shadow-sm"
          >
            Pause
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Resume ── */

interface ResumeModalProps {
  open: boolean;
  closesDateTime: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResumeModal({ open, closesDateTime, onConfirm, onCancel }: ResumeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Resume survey"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Resume survey?</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          Students can respond again until {closesDateTime}.
        </p>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Cancel survey ── */

interface CancelSurveyModalProps {
  open: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function CancelSurveyModal({ open, onConfirm, onCancel }: CancelSurveyModalProps) {
  const [reason, setReason] = useState('');

  if (!open) return null;

  const canSubmit = reason.trim().length > 0 && reason.length <= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cancel survey"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Cancel this survey?</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          This ends the survey with NO report. The record is kept in your school&apos;s history. This can&apos;t be undone.
        </p>
        <div>
          <label className="block text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wider mb-1.5">
            Reason (required)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            placeholder="Why is this survey being cancelled?"
            className="w-full h-24 p-3.5 rounded-2xl text-base sm:text-[14px] resize-none outline-none focus:outline-none focus:ring-0 bg-[#FAF9F6] border border-[#E8E6E1] text-[#2B2B2B]"
          />
          <p className={`text-[12px] mt-1 ${reason.length > 450 ? 'text-[#D97706]' : 'text-[#9A9A9A]'}`}>
            {500 - reason.length} characters remaining
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Keep survey
          </button>
          <button
            onClick={() => canSubmit && onConfirm(reason.trim())}
            disabled={!canSubmit}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#D8201D] text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Cancel survey
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete draft ── */

interface DeleteDraftModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDraftModal({ open, onConfirm, onCancel }: DeleteDraftModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Delete draft"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Delete this draft?</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          This permanently removes the draft. No responses have been collected.
        </p>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#D8201D] text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            Delete draft
          </button>
        </div>
      </div>
    </div>
  );
}
/* ── Withdraw a pending deletion request ── */

interface DeleteDeletionRequestModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDeletionRequestModal({ open, onConfirm, onCancel }: DeleteDeletionRequestModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Delete deletion request"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Delete deletion request?</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          The deletion request will be removed. SFWG will no longer be able to review it.
        </p>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#D8201D] text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            Delete deletion request
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Withdraw a pending reopen request ── */

interface DeleteReopenRequestModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteReopenRequestModal({ open, onConfirm, onCancel }: DeleteReopenRequestModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Delete reopen request"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Delete reopen request?</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          The reopen request will be removed. Your district / SFWG will no longer be able to review it.
        </p>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#D8201D] text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            Delete reopen request
          </button>
        </div>
      </div>
    </div>
  );
}
