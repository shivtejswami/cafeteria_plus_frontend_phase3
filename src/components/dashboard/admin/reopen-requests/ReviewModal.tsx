import React, { useState } from 'react';
import { X, Calendar, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ReopenRequest } from './types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ReopenRequest | null;
  onApprove: (id: string, newClosingDate: string, notes: string) => void;
  onDecline: (id: string, notes: string) => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onDecline,
}: ReviewModalProps) {
  const [actionType, setActionType] = useState<'approve' | 'decline'>('approve');
  const [extensionDays, setExtensionDays] = useState('7');
  const [notes, setNotes] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === 'approve') {
      const today = new Date();
      today.setDate(today.getDate() + parseInt(extensionDays, 10));
      const dateString = today.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      onApprove(request.id, dateString, notes);
    } else {
      onDecline(request.id, notes);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 modal-backdrop transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-[#E8E6E1]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EFEDE8] flex justify-between items-start bg-[#FAF9F6]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-bold text-[#2B2B2B] font-sans">
                Review Reopen Request
              </h3>
              <span className="bg-[#F0EAFB] text-[#6D28D9] text-[10px] font-semibold px-2 py-0.5 rounded-md font-sans">
                {request.schoolType}
              </span>
            </div>
            <p className="text-[13px] text-slate-500 font-secondary mt-0.5">
              {request.school} • {request.gradeBand} · {request.period}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Request details summary */}
          <div className="bg-[#FAF9F6] rounded-xl p-4 border border-[#EFEDE8] space-y-2.5 text-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Requested by:</span>
              <span className="font-semibold text-[#2B2B2B]">{request.requestedBy}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Date requested:</span>
              <span className="font-semibold text-[#2B2B2B]">
                {request.requestedDate} ({request.daysWaiting} days ago)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Current sample:</span>
              <span className="font-semibold text-[#2B2B2B]">
                {request.responses} / {request.targetResponses} responses
              </span>
            </div>

            <div className="pt-2 border-t border-[#EFEDE8]">
              <span className="text-xs text-slate-500 font-medium block mb-1">
                Reason provided:
              </span>
              <p className="text-xs text-[#2B2B2B] font-normal leading-relaxed bg-white p-2.5 rounded-lg border border-[#E8E6E1]">
                "{request.reason}"
              </p>
            </div>
          </div>

          {/* Impact Alert */}
          <div className="flex items-start gap-2.5 bg-[#FFF9F0] border border-[#FFECD1] p-3 rounded-xl text-xs text-[#8A4B04]">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Report Impact:</span>
              {request.reportImpact}. Reopening this survey will pause current published analytics.
            </div>
          </div>

          {/* Action Choice Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2 font-sans">
              Select Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActionType('approve')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  actionType === 'approve'
                    ? 'border-[#1D6B1D] bg-[#E3F5E3] text-[#1D6B1D] shadow-sm'
                    : 'border-[#E8E6E1] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Extension
              </button>

              <button
                type="button"
                onClick={() => setActionType('decline')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  actionType === 'decline'
                    ? 'border-[#D8201D] bg-[#FDEAEA] text-[#D8201D] shadow-sm'
                    : 'border-[#E8E6E1] bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Decline Request
              </button>
            </div>
          </div>

          {/* Approval Settings */}
          {actionType === 'approve' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="text-xs font-semibold text-slate-700 block font-sans">
                Extension Duration
              </label>
              <div className="flex gap-2">
                {['3', '5', '7', '14'].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setExtensionDays(days)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      extensionDays === days
                        ? 'border-[#5B2DA3] bg-[#F0EAFB] text-[#5B2DA3]'
                        : 'border-[#E8E6E1] bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    +{days} days
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes / Comments */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block font-sans">
              {actionType === 'approve' ? 'Internal Notes / Instructions' : 'Decline Reason (shared with school)'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                actionType === 'approve'
                  ? 'Optional notes regarding this survey window extension...'
                  : 'Explain why this request is declined...'
              }
              className="w-full p-2.5 border border-[#E8E6E1] rounded-xl text-xs text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#EFEDE8] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#E8E6E1] text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-full text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer ${
                actionType === 'approve'
                  ? 'bg-[#526B4E] hover:bg-[#465C42]'
                  : 'bg-[#D8201D] hover:bg-[#B91C1C]'
              }`}
            >
              {actionType === 'approve' ? 'Approve Extension' : 'Decline Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
