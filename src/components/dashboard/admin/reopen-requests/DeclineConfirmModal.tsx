import React, { useState, useEffect } from 'react';
import { X, Info, AlertTriangle } from 'lucide-react';
import { ReopenRequest } from './types';

interface DeclineConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ReopenRequest | null;
  onConfirm: (id: string, reason: string) => void;
}

export function DeclineConfirmModal({
  isOpen,
  onClose,
  request,
  onConfirm,
}: DeclineConfirmModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const isFormValid = reason.trim().length > 0;

  const handleDecline = () => {
    if (!isFormValid) return;
    onConfirm(request.id, reason.trim());
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
            {/* Red X Circle Icon */}
            <div className="w-10 h-10 rounded-full bg-[#FDEAEA] flex items-center justify-center text-[#D8201D] shrink-0 mt-0.5">
              <X className="w-5 h-5" strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1F1F1F] font-sans leading-tight">
                Decline this request?
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

        {/* Information Box: What happens on decline */}
        <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 sm:p-5 mt-5">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-[13px] font-bold text-[#2B2B2B] font-sans">
              What happens on decline
            </span>
          </div>

          <ul className="mt-3 space-y-2 text-[12px] text-[#4B5563] font-secondary list-none">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>The survey stays closed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>
                The current report ({request.publishedVersion || 'Fall 2025 · v1'}) remains published and unchanged.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>This action is audit-logged and the requester is notified with the reason.</span>
            </li>
          </ul>
        </div>

        {/* Reason for Declining Textarea */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center">
            <label className="text-[12px] font-bold text-[#2B2B2B] font-sans">
              Reason for declining
            </label>
            <span className="text-[12px] text-slate-400 font-normal font-sans ml-1">
              (required)
            </span>
          </div>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this request is being declined..."
            maxLength={400}
            rows={3}
            className="w-full p-3.5 bg-white border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none font-sans"
          />

          <div className="text-[11px] text-slate-400 text-right font-sans">
            {reason.length}/400
          </div>
        </div>

        {/* Warning Callout Box */}
        <div className="bg-[#FFF0F0] border border-[#FFD2D2] rounded-2xl p-3.5 flex items-start gap-2.5 mt-2">
          <AlertTriangle className="w-4 h-4 text-[#D8201D] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#A81D1A] font-secondary leading-relaxed">
            The requester ({request.requestedBy}) will see this reason. Be clear and constructive  this helps school administrators understand the decision and plan accordingly.
          </p>
        </div>

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
            onClick={handleDecline}
            disabled={!isFormValid}
            className={`px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${
              isFormValid
                ? 'bg-[#D8201D] hover:bg-[#B91815] text-white shadow-sm cursor-pointer'
                : 'bg-[#ECA19F] text-white cursor-not-allowed opacity-90'
            }`}
          >
            Decline request
          </button>
        </div>
      </div>
    </div>
  );
}
