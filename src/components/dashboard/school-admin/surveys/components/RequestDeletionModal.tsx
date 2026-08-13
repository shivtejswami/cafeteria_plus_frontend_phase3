'use client';

import { useState } from 'react';

interface RequestDeletionModalProps {
  open: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RequestDeletionModal({ open, onConfirm, onCancel }: RequestDeletionModalProps) {
  const [reason, setReason] = useState('');

  if (!open) return null;

  const canSubmit = reason.trim().length > 0 && reason.length <= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Request deletion"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Request deletion</h3>
        <p className="text-[14px] leading-relaxed text-[#6D6D6D]">
          Permanent deletion is reviewed and approved by SFWG under the data-retention policy. This can&apos;t be undone.
        </p>

        <div>
          <label className="block text-[13px] font-semibold mb-2 text-[#2B2B2B]">
            Reason (required)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            placeholder="Why should this cancelled survey be permanently deleted?"
            className="w-full h-32 p-3.5 rounded-2xl text-base sm:text-[14px] resize-none outline-none focus:outline-none focus:ring-0 bg-[#FAF9F6] border border-[#E8E6E1] text-[#2B2B2B]"
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
            Cancel
          </button>
          <button
            onClick={() => canSubmit && onConfirm(reason.trim())}
            disabled={!canSubmit}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#D8201D] text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Send deletion request
          </button>
        </div>
      </div>
    </div>
  );
}