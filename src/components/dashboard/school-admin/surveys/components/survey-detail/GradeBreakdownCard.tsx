'use client';

/** Response split across grade levels. Counts only, so no scores can be inferred. */
export default function GradeBreakdownCard() {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Card Header */}
      <div className="p-5 sm:p-6 pb-4 flex items-start justify-between gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#9A9A9A]">
            Participation by grade level
          </label>
          <p className="text-[13px] font-normal text-[#6D6D6D] mt-0.5">
            Breakdown of responses across grades
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#F0EAFB] flex items-center justify-center flex-shrink-0">
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.99902 8.33301H3.33152V14.333H1.99902V8.33301ZM3.99777 9.66634H5.33027V14.333H3.99777V9.66634ZM11.3265 5.66634H12.659V14.333H11.3265V5.66634ZM13.3253 6.99967H14.6578V14.333H13.3253V6.99967ZM6.66277 1.66634H7.99527V14.333H6.66277V1.66634ZM8.66152 2.99967H9.99402V14.333H8.66152V2.99967Z" fill="#6D28D9"/>
          </svg>
        </div>
      </div>
    
      {/* Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[320px]">
          <thead>
            <tr className="bg-[#FAF9F6] border-t border-b border-[#E8E6E1] text-[12px] font-semibold text-[#9A9A9A]">
              <th className="py-3 px-5 sm:px-6">Grade</th>
              <th className="py-3 px-5 sm:px-6">Responses</th>
              <th className="py-3 px-5 sm:px-6">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6E1] text-[#2B2B2B]">
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-3.5 px-5 sm:px-6 font-semibold text-[13px]">Grade 6</td>
              <td className="py-3.5 px-5 sm:px-6 font-semibold text-[13px]">30</td>
              <td className="py-3.5 px-5 sm:px-6 text-[#9A9A9A] text-[13px]">36%</td>
            </tr>
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-3.5 px-5 sm:px-6 font-semibold text-[13px]">Grade 7</td>
              <td className="py-3.5 px-5 sm:px-6 font-semibold text-[13px]">28</td>
              <td className="py-3.5 px-5 sm:px-6 text-[#9A9A9A] text-[13px]">34%</td>
            </tr>
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-3.5 px-6 font-semibold text-[13px]">Grade 8</td>
              <td className="py-3.5 px-6 font-semibold text-[13px]">25</td>
              <td className="py-3.5 px-6 text-[#9A9A9A] text-[13px]">30%</td>
            </tr>
          </tbody>
        </table>
      </div>
    
      {/* Card Footer */}
      <div className="bg-[#FAF9F6] border-t border-[#E8E6E1] px-5 sm:px-6 py-3">
        <p className="text-[12px] text-[#9A9A9A]">
          Participation by grade &mdash; counts only, no scores.
        </p>
      </div>
    </div>
  );
}
