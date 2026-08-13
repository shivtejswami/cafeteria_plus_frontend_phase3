import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReopenRequest } from './types';

interface ReopenRequestsTableProps {
  requests: ReopenRequest[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onReview: (request: ReopenRequest) => void;
}

export function ReopenRequestsTable({
  requests,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onReview,
}: ReopenRequestsTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentRequests = requests.slice(startIndex, startIndex + pageSize);
  const startItem = totalCount === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, totalCount);

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden flex flex-col w-full min-w-0">
      {/* Table Header Section */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#EFEDE8]">
        <h2 className="text-[14px] sm:text-[16px] font-bold text-[#2B2B2B] font-sans">
          Reopen requests
        </h2>
        <span className="text-[12px] sm:text-[13px] font-normal text-[#9A9A9A] font-secondary">
          {totalCount} {totalCount === 1 ? 'request' : 'requests'}
        </span>
      </div>

      {/* Table Scrollable Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[840px] lg:min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#EFEDE8] bg-[#FAF9F6]/50">
              <th className="text-left text-[11px] sm:text-[12px] font-medium text-[#9A9A9A] font-sans py-3 px-4 sm:px-6 whitespace-nowrap min-w-[160px]">
                School
              </th>
              <th className="text-left text-[11px] sm:text-[12px] font-medium text-[#9A9A9A] font-sans py-3 px-3 sm:px-4 whitespace-nowrap min-w-[130px]">
                Survey
              </th>
              <th className="text-left text-[11px] sm:text-[12px] font-medium text-[#9A9A9A] font-sans py-3 px-3 sm:px-4 whitespace-nowrap min-w-[120px]">
                Requested by
              </th>
              <th className="text-left text-[11px] sm:text-[12px] font-medium text-[#9A9A9A] font-sans py-3 px-3 sm:px-4 min-w-[190px] max-w-[240px]">
                Reason
              </th>
              <th className="text-left text-[11px] sm:text-[12px] font-medium text-[#9A9A9A] font-sans py-3 px-3 sm:px-4 whitespace-nowrap min-w-[100px]">
                Requested
              </th>
              <th className="text-left text-[11px] sm:text-[12px] font-medium text-[#9A9A9A] font-sans py-3 px-3 sm:px-4 whitespace-nowrap min-w-[150px]">
                Report impact
              </th>
              <th className="text-left text-[11px] sm:text-[12px] font-medium text-[#9A9A9A] font-sans py-3 px-3 sm:px-4 whitespace-nowrap min-w-[95px]">
                Status
              </th>
              <th className="py-3 px-4 sm:px-6 w-16 sm:w-20 text-right whitespace-nowrap" aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs sm:text-sm text-slate-500">
                  No reopen requests match the selected filters.
                </td>
              </tr>
            ) : (
              currentRequests.map((req) => {
                let statusBg = 'bg-[#FFF1DD]';
                let statusText = 'text-[#8A4B04]';
                if (req.status === 'Approved') {
                  statusBg = 'bg-[#E3F5E3]';
                  statusText = 'text-[#1D6B1D]';
                } else if (req.status === 'Declined') {
                  statusBg = 'bg-[#F1EFEA]';
                  statusText = 'text-[#6D6D6D]';
                }

                return (
                  <tr
                    key={req.id}
                    className="border-b border-[#EFEDE8] hover:bg-[#FAF9F6]/60 transition-colors last:border-b-0"
                  >
                    {/* School */}
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 align-top whitespace-nowrap">
                      <div className="flex flex-col items-start">
                        <button
                          type="button"
                          onClick={() => onReview(req)}
                          className="text-[13px] sm:text-[14px] font-bold text-[#6D28D9] hover:underline cursor-pointer text-left font-sans"
                        >
                          {req.school}
                        </button>
                        <span className="bg-[#F0EAFB] text-[#6D28D9] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md inline-block mt-1 font-sans">
                          {req.schoolType}
                        </span>
                      </div>
                    </td>

                    {/* Survey */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 align-top whitespace-nowrap">
                      <div className="text-[12px] sm:text-[13px] font-bold text-[#2B2B2B] font-sans leading-tight">
                        {req.gradeBand} · {req.period}
                      </div>
                      <div className="text-[11px] sm:text-[12px] font-normal text-[#9A9A9A] font-secondary mt-0.5">
                        {req.responses} / {req.targetResponses} responses
                      </div>
                    </td>

                    {/* Requested by */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 align-top whitespace-nowrap">
                      <span className="text-[12px] sm:text-[13px] font-bold text-[#2B2B2B] font-sans leading-tight">
                        {req.requestedBy}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 align-top max-w-[240px]">
                      <p
                        className="text-[12px] sm:text-[13px] font-normal text-[#6D6D6D] font-secondary truncate block"
                        title={req.reason}
                      >
                        {req.reason}
                      </p>
                    </td>

                    {/* Requested */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 align-top whitespace-nowrap">
                      <div className="text-[12px] sm:text-[13px] font-semibold text-[#2B2B2B] font-sans leading-tight">
                        {req.requestedDate}
                      </div>
                      {req.daysWaiting > 0 && (
                        <div className="text-[11px] sm:text-[12px] font-bold text-[#D8201D] font-sans mt-0.5">
                          {req.daysWaiting} days
                        </div>
                      )}
                    </td>

                    {/* Report impact */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 align-top whitespace-nowrap">
                      <span className="text-[12px] sm:text-[13px] font-normal text-[#8A4B04] font-secondary leading-snug">
                        {req.reportImpact}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 align-top whitespace-nowrap">
                      <span
                        className={`text-[11px] sm:text-[12px] font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full inline-flex items-center font-sans ${statusBg} ${statusText}`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 align-top text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onReview(req)}
                        className="text-[12px] sm:text-[13px] font-semibold text-[#6D28D9] font-secondary hover:underline cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination: strictly 1 row with Showing on left and page numbers on right */}
      <div className="flex flex-row justify-between items-center px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#EFEDE8] bg-white w-full">
        <div className="text-[12px] sm:text-[13px] font-normal text-[#9A9A9A] font-secondary shrink-0">
          Showing {startItem}–{endItem} of {totalCount}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#6D28D9] text-white shadow-sm'
                    : 'border border-[#E8E6E1] bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
