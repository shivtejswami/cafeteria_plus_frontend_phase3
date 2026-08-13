'use client';

import Link from 'next/link';
import type { SurveyReopenRejection } from '@/lib/schoolAdminData';

import type { ReopenState } from './types';

interface ReopenActionsCardProps {
  state: ReopenState;
  /** Present only once the district or SFWG has turned a request down. */
  rejection?: SurveyReopenRejection;
  reportHref: string | null;
  isReadOnly: boolean;
  /** District policy: with direct permission the school reopens itself, no approval step. */
  canReopenDirectly: boolean;
  /** Set once a direct reopen has happened, so the card can name the new closing date. */
  reopenedUntil?: string;
  onRequest: () => void;
  onWithdraw: () => void;
}

/** What a school can still do once the report is published: read it, or collect again. */
export default function ReopenActionsCard({
  state,
  rejection,
  reportHref,
  isReadOnly,
  canReopenDirectly,
  reopenedUntil,
  onRequest,
  onWithdraw,
}: ReopenActionsCardProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] space-y-4">
      <label className="block text-[11px] font-semibold text-[#9A9A9A]">
        Survey controls
      </label>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
        {reportHref && (
          <Link
            href={reportHref}
            className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M6.70592 4.08301H7.87217V9.91634H6.70592V4.08301ZM9.03842 6.41634H10.2047V9.91634H9.03842V6.41634ZM4.37342 7.58301H5.53967V9.91634H4.37342V7.58301ZM9.03842 2.33301H3.20717V11.6663H11.3709V4.66634H9.03842V2.33301ZM2.04092 1.74967C2.04092 1.58634 2.09729 1.44829 2.21003 1.33551C2.32277 1.22273 2.46077 1.16634 2.62405 1.16634H9.62155L12.5372 4.08301V12.2497C12.5372 12.4052 12.4808 12.5413 12.3681 12.658C12.2553 12.7747 12.1173 12.833 11.954 12.833H2.62405C2.46077 12.833 2.32277 12.7766 2.21003 12.6638C2.09729 12.5511 2.04092 12.413 2.04092 12.2497V1.74967Z" fill="white"/>
            </svg>
            View report
          </Link>
        )}

        {state === 'none' && (
          <button
            onClick={onRequest}
            disabled={isReadOnly}
            className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap bg-[#F4F7F1] border border-[#DCE4D6] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors disabled:opacity-40"
          >
            <i className="ri-refresh-line text-base"></i>
            {canReopenDirectly ? 'Reopen survey' : 'Request reopen'}
          </button>
        )}

        {state === 'pending' && (
          <button
            onClick={onWithdraw}
            disabled={isReadOnly}
            className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-white border border-[#D8201D] text-[#D8201D] hover:bg-red-50 disabled:opacity-40"
          >
            <i className="ri-delete-bin-line text-base"></i>
            Delete reopen request
          </button>
        )}
      </div>

      {state === 'reopened' && (
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 bg-[#006EB21A] border border-[#BFDCEF]">
          <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#006EB2]">
            <i className="ri-information-line"></i>
          </span>
          <p className="text-[13px] text-[#006EB2]">
            Survey reopened{reopenedUntil ? ` — it collects again until ${reopenedUntil}` : ''}. The current report is superseded and a new version is generated when the survey closes again.
          </p>
        </div>
      )}

      {state === 'pending' && (
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 bg-[#FAF8FC] border border-[#EDE3F5]">
          <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#5B3AA0]">
            <i className="ri-information-line"></i>
          </span>
          <p className="text-[13px] text-[#5B3AA0]">
            Reopen requested &mdash; awaiting district / SFWG approval. If approved, a new collection window will open and a new report version will be created.
          </p>
        </div>
      )}

      {state === 'declined' && rejection && (
        <div className="rounded-xl p-4 bg-[#FDF2F2] border border-[#F5C6C4]">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#D8201D]">
              <i className="ri-close-circle-line text-base"></i>
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#2B2B2B]">
                Reopen request declined
              </p>
              <p className="text-[12px] mt-0.5 text-[#6D6D6D]">
                Declined by {rejection.decidedBy} &middot; {rejection.decidedAt}
              </p>
            </div>
          </div>

          <div className="rounded-xl p-3.5 mt-3 bg-white border border-[#F5C6C4]">
            <p className="text-[12px] font-semibold mb-1.5 text-[#D8201D]">
              Reason for the decision
            </p>
            <p className="text-[13px] leading-relaxed text-[#2B2B2B]">
              {rejection.reason}
            </p>
          </div>

          <p className="text-[12px] font-semibold mt-4 mb-1.5 text-[#9A9A9A]">
            What this means
          </p>
          <ul className="space-y-1">
            <li className="flex items-start gap-2 text-[13px] text-[#6D6D6D]">
              <span className="shrink-0">&mdash;</span>
              The survey stays closed.
            </li>
            <li className="flex items-start gap-2 text-[13px] text-[#6D6D6D]">
              <span className="shrink-0">&mdash;</span>
              Your current report ({rejection.reportLabel}) remains published and unchanged.
            </li>
          </ul>

          <div className="rounded-xl p-3.5 mt-4 bg-[#FAF9F6] border border-[#E8E6E1]">
            <p className="text-[12px] font-semibold mb-1.5 text-[#9A9A9A]">
              Your original request
            </p>
            <p className="text-[13px] text-[#6D6D6D]">
              Proposed new close: {rejection.proposedClose}
            </p>
            <p className="text-[13px] mt-1 leading-relaxed text-[#6D6D6D]">
              Your reason: {rejection.requestReason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
