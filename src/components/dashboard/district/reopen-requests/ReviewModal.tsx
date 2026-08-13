'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/tailwind';
import {
  REOPEN_REQUESTS,
  participationRate,
  type ReopenRequest,
} from '@/constants/districtData';

interface ReviewModalProps {
  requestId: string | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

export function ReviewModal({
  requestId,
  onClose,
  onApprove,
  onDecline,
}: ReviewModalProps) {
  const request = REOPEN_REQUESTS.find((r) => r.id === requestId);

  const [mode, setMode] = useState<'approve' | 'decline' | null>(null);
  const [note, setNote] = useState('');
  const [understandChecked, setUnderstandChecked] = useState(false);
  const [declineTouched, setDeclineTouched] = useState(false);

  if (!request) return null;

  const noteValid = note.trim().length >= 10;

  const statusStyles = {
    pending: {
      className: 'bg-[#FFECD1] text-[#8A5A04]',
      badge:
        'bg-[#FFECD1] text-[#8A5A04] border border-[#F0C070]',
      label: 'Pending',
      bannerTitle: 'Current report will be affected',
      bannerText:
        'If this request is approved, the current report (Spring 2025 · v1) will be superseded and temporarily unavailable. A new report version will be generated when the survey closes again.',
    },

    approved: {
      className: 'bg-[#E3F5E3] text-[#586D4D]',
      badge:
        'bg-[#E3F5E3] text-[#586D4D] border border-[#B7D7B2]',
      label: 'Approved',
      bannerTitle: 'Current report will be affected',
      bannerText:
        'If this request is approved, the current report (Spring 2025 · v1) will be superseded and temporarily unavailable. A new report version will be generated when the survey closes again.',
    },

    declined: {
      className: 'bg-[#FDE2E2] text-[#B91C1C]',
      badge:
        'bg-[#FDE2E2] text-[#B91C1C] border border-[#E8B0B0]',
      label: 'Declined',
      bannerTitle: 'Current report will be affected',
      bannerText:
        'This request was declined, so the survey remains closed and the current report stays unchanged. The school will be notified with the reason provided.',
    },
  } as const;

  const currentStatusStyle = statusStyles[request.status];

  const handleApprove = () => {
    if (!understandChecked) return;

    onApprove(request.id);
    setMode(null);
    setUnderstandChecked(false);
  };

  const handleDecline = () => {
    setDeclineTouched(true);

    if (!noteValid) return;

    onDecline(request.id);
    setMode(null);
    setNote('');
  };

  const closeDialogs = () => {
    setMode(null);
    setUnderstandChecked(false);
    setNote('');
    setDeclineTouched(false);
  };

  return (
    <>
      {/* Slide-over backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity mb-0"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl animate-in slide-in-from-right flex-col bg-white shadow-2xl duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {request.schoolName}
              </h2>

              <span
                className={cn(
                  'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                  currentStatusStyle.badge
                )}
              >
                {currentStatusStyle.label}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Survey reopen request
            </p>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-2 text-slate-400 transition-colors hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {/* School / Survey Run */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-canvas p-4">
              <p className="mb-1 text-xs font-medium text-slate-500">
                School
              </p>

              <p className="font-semibold text-iris">
                {request.schoolName}
              </p>

              <span className="mt-2 inline-flex rounded bg-[#E3F5E3] px-1.5 py-0.5 text-[10px] font-medium text-sage">
                {request.level}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-canvas p-4">
              <p className="mb-1 text-xs font-medium text-slate-500">
                Survey run
              </p>

              <p className="font-semibold text-slate-900">
                {request.surveyGrades}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Closed 3 Oct 2025 · {request.responses} / {request.target}{' '}
                responses
              </p>
            </div>
          </div>

          {/* Requested By */}
          <div className="rounded-xl border border-border bg-canvas p-4">
            <p className="mb-1 text-xs font-medium text-slate-500">
              Requested by
            </p>

            <p className="font-semibold text-slate-900">
              {request.requestedBy}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              {request.requestedByRole} - {request.requestedOn}{' '}
              <span className="font-medium text-[#D8201D]">
                ({request.waitingDays} days)
              </span>
            </p>
          </div>

          {/* Reason */}
          <div className="rounded-xl border border-border bg-canvas p-4">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Reason for reopening
            </p>

            <p className="text-sm leading-relaxed text-slate-700">
              {request.reason}
            </p>
          </div>

          {/* Requested New Date / Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-canvas p-4">
              <p className="mb-1 text-xs font-medium text-slate-500">
                Requested new closing date
              </p>

              <p className="font-medium text-slate-900">
                02/01/2026
              </p>
            </div>

            <div className="rounded-xl border border-border bg-canvas p-4">
              <p className="mb-1 text-xs font-medium text-slate-500">
                Requested new closing time
              </p>

              <p className="font-medium text-slate-900">17:00</p>
            </div>
          </div>

          {/* Current Report Affected */}
          <div className="rounded-xl border border-[#F2C48A] bg-[#FFF1E0] p-4">
            <div className="flex gap-2">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {request.status === 'declined' ? (
                  <XCircle className="h-4 w-4 text-[#B86B00]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-[#B86B00]" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#8A4B04]">
                  {currentStatusStyle.bannerTitle}
                </p>

                <div className="mt-1 mb-2 flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium',
                      request.status === 'approved' || request.status === 'declined'
                        ? 'bg-[#E3F5E3] text-sage'
                        : 'bg-[#F0EAFB] text-iris'
                    )}
                  >
                    {request.status === 'approved' || request.status === 'declined'
                      ? 'Published'
                      : 'Analysing'}
                  </span>

                  <span className="text-xs text-[#8A4B04]">
                    {request.surveyGrades} · v1
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#7A4A12]/80">
                  {currentStatusStyle.bannerText}
                </p>
              </div>
            </div>
          </div>

          {/* Decision */}
          {request.status !== 'pending' && (
            <div
              className={cn(
                'rounded-xl border p-4',
                request.status === 'approved'
                  ? 'border-[#B8D9B8] bg-[#E3F5E3]'
                  : 'border-[#E7B0B0] bg-[#FDECEC]'
              )}
            >
              <p
                className={cn(
                  'text-xs font-semibold',
                  request.status === 'approved'
                    ? 'text-[#9A9A9A]'
                    : 'text-[#9A9A9A]'
                )}
              >
                Decision
              </p>

              <p
                className={cn(
                  'mt-2 text-sm font-medium',
                  request.status === 'approved'
                    ? 'text-ink'
                    : 'text-ink'
                )}
              >
                {request.status === 'approved'
                  ? 'Approved'
                  : 'Declined'}{' '}
                by {request.decidedBy ?? 'district admin'} on{' '}
                {request.decidedOn ?? 'recently'}
              </p>

              <p
                className={cn(
                  'mt-2 text-sm leading-relaxed',
                  request.status === 'approved'
                    ? 'text-sage'
                    : 'text-[#7F1D1D]'
                )}
              >
                {request.decisionNote ??
                  'No additional decision note was provided.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {request.status === 'pending' && (
          <div className="flex items-center gap-3 border-t border-slate-100 p-6">
            <button
              onClick={() => setMode('approve')}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#5B7963] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a6350]"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve & reopen
            </button>

            <button
              onClick={() => setMode('decline')}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-red-500 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Decline
            </button>
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      <Modal
        isOpen={mode === 'approve'}
        onClose={closeDialogs}
        className="max-w-xl"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3F5E3]">
              <Check className="h-5 w-5 text-sage" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-ink">
                Approve & reopen survey?
              </h2>

              <p className="mt-1 text-sm text-muted">
                For {request.schoolName} · {request.surveyGrades}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#B8D9B8] bg-[#E3F5E3] p-4">
            <div className="flex gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sage" />

              <div>
                <p className="text-sm font-semibold text-sage">
                  What happens on approval
                </p>

                <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-sage">
                  <li>
                    The survey reopens and goes back to collecting responses.
                  </li>

                  <li>
                    The current report (Fall 2025 - v1) is superseded and
                    temporarily unavailable.
                  </li>

                  <li>
                    When the survey closes again at the new date, a new report
                    version is generated.
                  </li>

                  <li>
                    This action is audit-logged and the requester is notified.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              id="understand"
              checked={understandChecked}
              onChange={(e) => setUnderstandChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded bg-sage border-border text-emerald-600 focus:ring-emerald-500"
            />

            <label
              htmlFor="understand"
              className="cursor-pointer text-sm leading-relaxed text-slate-700"
            >
              I understand the current report will be superseded and a new
              report version will be generated when the survey closes again.
            </label>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={closeDialogs}
              className="rounded-full cursor-pointer bg-sage-50 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              onClick={handleApprove}
              disabled={!understandChecked}
              className="rounded-full cursor-pointer bg-sage px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#85968a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Approve & reopen
            </button>
          </div>
        </div>
      </Modal>

      {/* Decline Dialog */}
      <Modal
        isOpen={mode === 'decline'}
        onClose={closeDialogs}
        className="max-w-xl"
      >
        <div className="p-6">
          <h2 className="mb-1 text-xl font-bold text-slate-900">
            Decline request
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            {request.schoolName} · {request.level} · {request.surveyGrades}
          </p>

          <div className="mb-6 rounded-xl border border-[#F0B8B6] bg-[#FEF5F5] p-4">
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-[#D8201D]" />

              <p className="text-sm leading-relaxed text-[#991B1B]">
                Declining means the survey stays closed and the current report
                remains unchanged. The school will be notified of your
                decision. This is recorded in the activity log.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="decline-reason"
              className="mb-2 block text-sm font-medium text-slate-900"
            >
              Reason <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <textarea
                id="decline-reason"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Explain why this request is being declined..."
                className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm "
              />

              <span className="absolute right-3 bottom-3 text-[11px] text-slate-400">
                {note.length}/500
              </span>
            </div>

            {declineTouched && !noteValid && (
              <p className="mt-1 text-xs text-red-600">
                Please provide a reason for declining (min 10 chars).
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={closeDialogs}
              className="rounded-full cursor-pointer bg-sage-50 px-5 py-2.5 text-sm font-medium text-sage transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              onClick={handleDecline}
              className="rounded-full cursor-pointer border border-red-500 bg-[#D8201D] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-80"
            >
              Decline request
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}