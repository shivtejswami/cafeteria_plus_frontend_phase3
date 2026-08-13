'use client';

import type { SurveyDeletionRejection } from '@/lib/schoolAdminData';

import type { DeletionState } from './types';

interface DeletionActionsCardProps {
  state: DeletionState;
  /** Present only once SFWG has turned a request down. */
  rejection?: SurveyDeletionRejection;
  isReadOnly: boolean;
  onRequest: () => void;
  onWithdraw: () => void;
}

/** The only action left on a cancelled survey: asking SFWG to delete the record permanently. */
export default function DeletionActionsCard({
  state,
  rejection,
  isReadOnly,
  onRequest,
  onWithdraw,
}: DeletionActionsCardProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] space-y-4">
      <label className="block text-[11px] font-semibold text-[#9A9A9A]">
        Actions
      </label>

      {state === 'rejected' && rejection && (
        <div className="rounded-xl p-4 bg-[#FDF2F2] border border-[#F5C6C4]">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#D8201D]">
              <i className="ri-close-circle-line text-base"></i>
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#2B2B2B]">
                Deletion request rejected
              </p>
              <p className="text-[12px] mt-0.5 text-[#6D6D6D]">
                Rejected by {rejection.rejectedBy} &middot; {rejection.rejectedAt}
              </p>
            </div>
          </div>

          <div className="rounded-xl p-3.5 mt-3 bg-white border border-[#F5C6C4]">
            <p className="text-[12px] font-semibold mb-1.5 text-[#D8201D]">
              Reason for rejection
            </p>
            <p className="text-[13px] leading-relaxed text-[#2B2B2B]">
              {rejection.reason}
            </p>
          </div>

          <p className="text-[12px] mt-3 text-[#6D6D6D]">
            You can submit a new deletion request if circumstances have changed.
          </p>
        </div>
      )}

      {state === 'pending' && (
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 bg-[#F5F3F0] border border-[#EAE7E1]">
          <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#9A9A9A]">
            <i className="ri-information-line"></i>
          </span>
          <p className="text-[13px] text-[#6D6D6D]">
            Deletion request sent to SFWG &mdash; awaiting review under the retention policy.
          </p>
        </div>
      )}

      {state === 'pending' ? (
        <button
          onClick={onWithdraw}
          disabled={isReadOnly}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-white border border-[#D8201D] text-[#D8201D] hover:bg-red-50 disabled:opacity-40"
        >
          <i className="ri-delete-bin-line text-base"></i>
          Delete deletion request
        </button>
      ) : (
        <button
          onClick={onRequest}
          disabled={isReadOnly}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-white border border-[#D8201D] text-[#D8201D] hover:bg-red-50 disabled:opacity-40"
        >
          <i className="ri-delete-bin-line text-base"></i>
          {state === 'rejected' ? 'Request deletion again' : 'Request deletion'}
        </button>
      )}
    </div>
  );
}
