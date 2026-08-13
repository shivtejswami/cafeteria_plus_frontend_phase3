import React, { useState, useEffect } from 'react';
import { Check, X, Info } from 'lucide-react';
import { ReopenRequest } from './types';

interface ApproveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ReopenRequest | null;
  onConfirm: (id: string, newClosingDate: string, notes: string) => void;
}

export function ApproveConfirmModal({
  isOpen,
  onClose,
  request,
  onConfirm,
}: ApproveConfirmModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsChecked(false);
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const handleApprove = () => {
    if (!isChecked) return;
    onConfirm(
      request.id,
      request.requestedClosingDate || '12 Jul 2026 | 17:00',
      'Approving reopen for survey administration window extension.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 modal-backdrop animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E8E6E1] z-10 animate-in zoom-in-95 fade-in duration-200">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            {/* Green Check Circle Icon */}
            <div className="w-10 h-10 rounded-full bg-[#E3F5E3] flex items-center justify-center text-[#1D6B1D] shrink-0 mt-0.5">
              <Check className="w-5 h-5" strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1F1F1F] font-sans leading-tight">
                Approve &amp; reopen survey?
              </h2>
              <p className="text-[13px] text-slate-500 font-secondary mt-1">
                For {request.school} {request.gradeBand} · {request.period}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Information Box: What happens on approval */}
        <div className="bg-[#EAF5EA] border border-[#C5D5BF] rounded-2xl p-4 sm:p-5 mt-5">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#1D6B1D] shrink-0" />
            <span className="text-[13px] font-bold text-[#1D6B1D] font-sans">
              What happens on approval
            </span>
          </div>

          <ul className="mt-3 space-y-2 text-[12px] text-[#4B5563] font-secondary list-none">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#1D6B1D] mt-1.5 shrink-0" />
              <span>The survey reopens and goes back to collecting responses.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#1D6B1D] mt-1.5 shrink-0" />
              <span>
                The current report ({request.publishedVersion || 'Fall 2025 · v1'}) is superseded and temporarily unavailable.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#1D6B1D] mt-1.5 shrink-0" />
              <span>
                When the survey closes again at the new date, a new report version is generated.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#1D6B1D] mt-1.5 shrink-0" />
              <span>This action is audit-logged and the requester is notified.</span>
            </li>
          </ul>
        </div>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 mt-5 cursor-pointer select-none group">
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center cursor-pointer ${
                isChecked
                  ? 'bg-[#4E6B48] border-[#4E6B48] text-white shadow-sm'
                  : 'bg-white border-slate-300 group-hover:border-slate-400'
              }`}
            >
              {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </div>
          </div>
          <span className="text-[12px] sm:text-[13px] text-[#2B2B2B] font-secondary leading-snug cursor-pointer">
            I understand the current report will be superseded and a new report version will be generated when the survey closes again.
          </span>
        </label>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#EFEDE8]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#F1F5F0] hover:bg-[#E5EAE2] text-[#3A4A32] text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApprove}
            disabled={!isChecked}
            className={`px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${
              isChecked
                ? 'bg-[#4E6B48] hover:bg-[#3E563A] text-white shadow-sm cursor-pointer'
                : 'bg-[#A2B49F] text-white cursor-not-allowed opacity-90'
            }`}
          >
            Approve &amp; reopen
          </button>
        </div>
      </div>
    </div>
  );
}
