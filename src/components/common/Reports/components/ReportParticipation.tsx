'use client';

import type { GradeParticipation } from '@/lib/schoolAdminData';
import { barWidthClass } from '@/utils/barWidth';

interface ReportParticipationProps {
  responseCount: number;
  targetCount: number;
  responseRate: number;
  gradeBreakdown: GradeParticipation[];
}

export default function ReportParticipation({ responseCount, targetCount, responseRate, gradeBreakdown }: ReportParticipationProps) {
  return (
    <section aria-labelledby="participation-heading">
      <h2 id="participation-heading" className="text-[18px] font-semibold mb-4 text-ink">Participation</h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
          <p className="text-[13px] font-medium mb-1 text-[#8A8A8A]">Completed responses</p>
          <p className="text-[24px] sm:text-[32px] font-semibold leading-tight text-ink">{responseCount}</p>
          <p className="text-[12px] text-subtle">of {targetCount} enrolled</p>
        </div>
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
          <p className="text-[13px] font-medium mb-1 text-[#8A8A8A]">Response rate</p>
          <p className="text-[24px] sm:text-[32px] font-semibold leading-tight text-ink">{responseRate}%</p>
          <div className="mt-2 h-2 rounded-full overflow-hidden bg-surface-100">
            <div className={`h-full rounded-full bg-sage ${barWidthClass(responseRate)}`} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-white border border-line shadow-card">
        <div className="px-5 py-3.5 border-b border-line">
          <h3 className="text-[14px] font-semibold text-ink">By grade level</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-b-line">
              <th className="text-left px-5 py-3 text-[13px] font-medium text-[#9A9A9A]">Grade</th>
              <th className="text-left px-5 py-3 text-[13px] font-medium text-[#9A9A9A]">Responses</th>
              <th className="text-left px-5 py-3 text-[13px] font-medium text-[#9A9A9A]">Share</th>
              <th className="hidden sm:table-cell text-left px-5 py-3 text-[13px] font-medium text-[#9A9A9A]"></th>
            </tr>
          </thead>
          <tbody>
            {gradeBreakdown.map((g) => (
              <tr className="border-b border-b-line last:border-b-0" key={g.grade}>
                <td className="px-5 py-3.5 text-[14px] font-medium whitespace-nowrap text-ink">{g.grade}</td>
                <td className="px-5 py-3.5 text-[14px] font-semibold text-ink">{g.count}</td>
                <td className="px-5 py-3.5 text-[14px] text-sage">{g.share}%</td>
                <td className="hidden sm:table-cell px-5 py-3.5">
                  <div className="h-2 rounded-full overflow-hidden w-24 bg-surface-100">
                    <div className={`h-full rounded-full bg-sage ${barWidthClass(g.share)}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[12px] mt-3 text-muted-500">
        Participation counts by grade level. No individual student is identifiable.
      </p>
    </section>
  );
}