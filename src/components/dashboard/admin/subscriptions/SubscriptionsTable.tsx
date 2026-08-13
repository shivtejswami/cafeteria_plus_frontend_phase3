import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SubscriptionItem } from './types';

interface SubscriptionsTableProps {
  subscriptions: SubscriptionItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onManage: (sub: SubscriptionItem) => void;
}

export function SubscriptionsTable({
  subscriptions,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onManage,
}: SubscriptionsTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = subscriptions.slice(startIndex, startIndex + pageSize);
  const startItem = totalCount === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, totalCount);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden flex flex-col w-full min-w-0 font-sans">
      {/* Table Scrollable Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#EFEDE8]">
              <th className="text-left text-[12px] font-medium text-[#9A9A9A] font-sans py-4 px-5 sm:px-6 whitespace-nowrap min-w-[210px]">
                Customer
              </th>
              <th className="text-left text-[12px] font-medium text-[#9A9A9A] font-sans py-4 px-4 whitespace-nowrap min-w-[130px]">
                Status
              </th>
              <th className="text-left text-[12px] font-medium text-[#9A9A9A] font-sans py-4 px-4 whitespace-nowrap min-w-[190px]">
                Term
              </th>
              <th className="text-left text-[12px] font-medium text-[#9A9A9A] font-sans py-4 px-4 whitespace-nowrap min-w-[130px]">
                Renewal date
              </th>
              <th className="text-left text-[12px] font-medium text-[#9A9A9A] font-sans py-4 px-4 whitespace-nowrap min-w-[90px]">
                Schools
              </th>
              <th className="text-left text-[12px] font-medium text-[#9A9A9A] font-sans py-4 px-4 whitespace-nowrap min-w-[150px]">
                Billing ref
              </th>
              <th className="py-4 px-5 sm:px-6 w-20 text-right whitespace-nowrap text-[12px] font-medium text-[#9A9A9A]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs sm:text-sm text-slate-500">
                  No subscriptions match the selected filters.
                </td>
              </tr>
            ) : (
              currentItems.map((sub) => {
                // Status Chip styling with dot
                let statusBg = 'bg-[#E3F5E3]';
                let statusText = 'text-[#1D6B1D]';
                let dotColor = 'bg-[#1D6B1D]';

                if (sub.status === 'Deactivated') {
                  statusBg = 'bg-[#FDEAEA]';
                  statusText = 'text-[#D8201D]';
                  dotColor = 'bg-[#D8201D]';
                } else if (sub.status === 'Read-only') {
                  statusBg = 'bg-[#F1EFEA]';
                  statusText = 'text-[#6D6D6D]';
                  dotColor = 'bg-[#6D6D6D]';
                } else if (sub.status === 'In grace' || sub.status === 'Expiring') {
                  statusBg = 'bg-[#FFF1DD]';
                  statusText = 'text-[#D97706]';
                  dotColor = 'bg-[#D97706]';
                }

                const isExpiring = sub.status === 'Expiring';

                return (
                  <tr
                    key={sub.id}
                    className="border-b border-[#EFEDE8] hover:bg-[#FAF9F6]/60 transition-colors last:border-b-0"
                  >
                    {/* Customer */}
                    <td className="py-4 px-5 sm:px-6 align-middle whitespace-nowrap">
                      <div className="flex flex-col items-start">
                        <button
                          type="button"
                          onClick={() => onManage(sub)}
                          className="text-[14px] font-bold text-[#2B2B2B] hover:text-[#6D28D9] cursor-pointer text-left font-sans transition-colors"
                        >
                          {sub.customer}
                        </button>
                        <div className="flex items-center gap-1.5 mt-1">
                          {sub.type === 'District' ? (
                            <span className="bg-[#F0EAFB] text-[#6D28D9] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md font-sans">
                              District
                            </span>
                          ) : (
                            <span className="bg-[#F1EFEA] text-[#6D6D6D] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md font-sans">
                              Standalone school
                            </span>
                          )}
                          {sub.type === 'District' && (
                            <span className="text-[12px] text-[#9A9A9A] font-secondary">
                              · {sub.schoolCount} schools
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold font-sans ${statusBg} ${statusText}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        <span>{sub.status}</span>
                      </span>
                    </td>

                    {/* Term */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <span className="text-[13px] text-[#6D6D6D] font-secondary">
                        {sub.termStart} — {sub.termEnd}
                      </span>
                    </td>

                    {/* Renewal date */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <span
                        className={`text-[13px] font-bold font-sans ${
                          isExpiring ? 'text-[#D97706]' : 'text-[#2B2B2B]'
                        }`}
                      >
                        {sub.renewalDate}
                      </span>
                    </td>

                    {/* Schools */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      {sub.schoolLimit ? (
                        <span className="text-[13px] font-bold text-[#D97706] font-sans">
                          {sub.schoolCount} / {sub.schoolLimit}
                        </span>
                      ) : (
                        <span className="text-[13px] text-[#2B2B2B] font-sans font-medium">
                          {sub.schoolCount}
                        </span>
                      )}
                    </td>

                    {/* Billing ref */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <span className="text-[13px] text-[#2B2B2B] font-secondary truncate max-w-[140px] block">
                        {sub.billingRef || '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 sm:px-6 align-middle text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onManage(sub)}
                        className="text-[13px] font-bold text-[#6D28D9] font-sans hover:underline cursor-pointer"
                      >
                        Manage
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
      <div className="flex flex-row justify-between items-center px-5 sm:px-6 py-4 border-t border-[#EFEDE8] bg-[#FFFFFF] w-full">
        <div className="text-[13px] font-normal text-[#9A9A9A] font-secondary shrink-0">
          Showing {startItem}–{endItem} of {totalCount}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="w-8 h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
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
            className="w-8 h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
