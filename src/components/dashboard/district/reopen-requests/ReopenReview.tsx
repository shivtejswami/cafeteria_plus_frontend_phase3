'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarPlus, CheckCircle2, Quote, XCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { LevelChip } from '@/components/dashboard/district/shared/LevelChip';
import { cn } from '@/utils/tailwind';
import { REOPEN_REQUESTS, participationRate } from '@/constants/districtData';

type Mode = 'approve' | 'decline' | null;

/**
 * Tailwind generates classes at build time, so a runtime `w-[${n}%]` would never
 * exist. These literal classes are picked up by the scanner; the bar snaps to
 * the nearest 5%, which is invisible next to the exact figure printed above it.
 */
const BAR_WIDTH_CLASS: Record<number, string> = {
  0: 'w-0',
  5: 'w-[5%]',
  10: 'w-[10%]',
  15: 'w-[15%]',
  20: 'w-[20%]',
  25: 'w-[25%]',
  30: 'w-[30%]',
  35: 'w-[35%]',
  40: 'w-[40%]',
  45: 'w-[45%]',
  50: 'w-[50%]',
  55: 'w-[55%]',
  60: 'w-[60%]',
  65: 'w-[65%]',
  70: 'w-[70%]',
  75: 'w-[75%]',
  80: 'w-[80%]',
  85: 'w-[85%]',
  90: 'w-[90%]',
  95: 'w-[95%]',
  100: 'w-full',
};

/**
 * "…>reopen request>review request" (2226:12818) plus its approve (2226:13298)
 * and decline (2226:13735) variants.
 */
export function ReopenReview({ requestId }: { requestId: string }) {
  const router = useRouter();
  const request = REOPEN_REQUESTS.find((r) => r.id === requestId);

  const [mode, setMode] = useState<Mode>(null);
  const [additionalDays, setAdditionalDays] = useState(request?.additionalDays ?? 7);
  const [note, setNote] = useState('');
  const [declineTouched, setDeclineTouched] = useState(false);
  const [decision, setDecision] = useState<string | null>(null);

  if (!request) return null;

  const rate = participationRate(request.responses, request.target);
  const decided = request.status !== 'pending' || decision !== null;
  const daysValid = additionalDays >= 1 && additionalDays <= 30;
  const noteValid = note.trim().length >= 10;

  const handleApprove = () => {
    if (!daysValid) return;
    setDecision('approved');
    setMode(null);
    router.push('/district/reopen-requests');
  };

  const handleDecline = () => {
    setDeclineTouched(true);
    if (!noteValid) return;
    setDecision('declined');
    setMode(null);
    router.push('/district/reopen-requests');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/district/reopen-requests"
            className="text-sm text-indigo-600 hover:underline"
          >
            Reopen requests
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-600">{request.schoolName}</span>
          <LevelChip level={request.level} />
          <span className="text-sm text-slate-500">{request.surveyLabel}</span>
        </div>

        {decided ? (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              (decision ?? request.status) === 'approved'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700',
            )}
          >
            {(decision ?? request.status) === 'approved' ? 'Approved' : 'Declined'}
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMode('decline')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-full transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
            <button
              onClick={() => setMode('approve')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B7963] hover:bg-[#4a6350] text-white text-sm font-medium rounded-full transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve and reopen
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Responses so far"
          value={request.responses}
          subtext={`of ${request.target} target`}
          className="border-orange-200"
        />
        <StatCard title="Participation" value={`${rate}%`} subtext="At time of request" />
        <StatCard
          title="Extra days asked for"
          value={request.additionalDays}
          subtext="Requested extension"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900">Why they are asking</h2>

          <blockquote className="relative mt-4 rounded-xl bg-slate-50 p-5 pl-12 text-sm leading-relaxed text-slate-600">
            <Quote className="absolute left-4 top-5 w-5 h-5 text-indigo-300" />
            {request.reason}
          </blockquote>

          <div className="mt-5 space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-500">Progress against target</span>
              <span className="font-semibold text-slate-900">{rate}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full',
                  rate < 60 ? 'bg-orange-400' : 'bg-emerald-500',
                  BAR_WIDTH_CLASS[Math.round(Math.min(100, Math.max(0, rate)) / 5) * 5],
                )}
              />
            </div>
          </div>

          {request.decisionNote && (
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Your decision
              </p>
              <p className="mt-2 text-sm text-slate-600">{request.decisionNote}</p>
              <p className="mt-2 text-xs text-slate-400">
                {request.decidedBy} · {request.decidedOn}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900">Request details</h2>
          <dl className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
            {[
              ['Reference', request.id.toUpperCase()],
              ['School', request.schoolName],
              ['Survey', request.surveyLabel],
              ['Requested by', request.requestedBy],
              ['Role', request.requestedByRole],
              ['Submitted', request.requestedOn],
              ['Report impact', request.reportImpact],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="shrink-0 text-xs text-slate-400">{label}</dt>
                <dd className="text-right text-sm font-medium text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Approve modal --------------------------------------------------- */}
      <Modal isOpen={mode === 'approve'} onClose={() => setMode(null)}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900">Approve and reopen</h2>
          <p className="text-sm text-slate-500 mt-1">
            The survey reopens immediately and {request.requestedBy} is notified.
            Students who already responded will not be asked again.
          </p>

          <div className="space-y-4 mt-6">
            <div>
              <label htmlFor="additional-days" className="block text-sm font-medium text-slate-700 mb-1">
                Extend by (days)
              </label>
              <div className="relative">
                <CalendarPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="additional-days"
                  type="number"
                  min={1}
                  max={30}
                  value={additionalDays}
                  onChange={(e) => setAdditionalDays(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                />
              </div>
              {!daysValid && (
                <p role="alert" className="text-xs text-red-600 mt-1">
                  Extend by between 1 and 30 days.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="approve-note" className="block text-sm font-medium text-slate-700 mb-1">
                Note to the school (optional)
              </label>
              <textarea
                id="approve-note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything the school should do differently this time…"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setMode(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={!daysValid}
              className="px-4 py-2 bg-[#5B7963] hover:bg-[#4a6350] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors text-sm"
            >
              Approve and reopen
            </button>
          </div>
        </div>
      </Modal>

      {/* Decline modal --------------------------------------------------- */}
      <Modal isOpen={mode === 'decline'} onClose={() => setMode(null)}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900">Decline this request</h2>
          <p className="text-sm text-slate-500 mt-1">
            The survey stays closed. Your note is the only explanation the school
            receives, so be specific about what they should do instead.
          </p>

          <div className="mt-6">
            <label htmlFor="decline-note" className="block text-sm font-medium text-slate-700 mb-1">
              Reason
            </label>
            <textarea
              id="decline-note"
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain the decision and the alternative…"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
            {declineTouched && !noteValid && (
              <p role="alert" className="text-xs text-red-600 mt-1">
                Explain the decision so the school knows what to do next.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setMode(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors text-sm"
            >
              Decline request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
