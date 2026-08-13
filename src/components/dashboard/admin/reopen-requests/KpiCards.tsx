import React from 'react';
import { Hourglass, Check, X, Clock } from 'lucide-react';
import { KpiSummary } from './types';

interface KpiCardsProps {
  metrics: KpiSummary;
}

export function KpiCards({ metrics }: KpiCardsProps) {
  const cardBorderStyle = {
    borderWidth: '3px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#E8E6E1',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4 w-full font-sans">
      {/* 1. Pending */}
      <div
        style={cardBorderStyle}
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[85px] sm:min-h-[105px] lg:min-h-[116px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Pending
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#FFF1DD] flex items-center justify-center text-[#D97706] shrink-0">
            <Hourglass className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
          </div>
        </div>
        <div className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#D97706] font-sans leading-none mt-1.5 sm:mt-2">
          {metrics.pendingCount}
        </div>
      </div>

      {/* 2. Approved this week */}
      <div
        style={cardBorderStyle}
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[85px] sm:min-h-[105px] lg:min-h-[116px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Approved this week
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#E3F5E3] flex items-center justify-center text-[#1D6B1D] shrink-0">
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" strokeWidth={2.5} />
          </div>
        </div>
        <div className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#2B2B2B] font-sans leading-none mt-1.5 sm:mt-2">
          {metrics.approvedThisWeek}
        </div>
      </div>

      {/* 3. Declined this week */}
      <div
        style={cardBorderStyle}
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[85px] sm:min-h-[105px] lg:min-h-[116px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Declined this week
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#6D6D6D] shrink-0">
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" strokeWidth={2.5} />
          </div>
        </div>
        <div className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#2B2B2B] font-sans leading-none mt-1.5 sm:mt-2">
          {metrics.declinedThisWeek}
        </div>
      </div>

      {/* 4. Oldest waiting */}
      <div
        style={cardBorderStyle}
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[85px] sm:min-h-[105px] lg:min-h-[116px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Oldest waiting
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#FDEAEA] flex items-center justify-center text-[#D8201D] shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
          </div>
        </div>
        <div className="text-[20px] sm:text-[26px] lg:text-[30px] font-bold text-[#D8201D] font-sans leading-none mt-1.5 sm:mt-2 whitespace-nowrap">
          {metrics.oldestWaitingDays} days
        </div>
      </div>
    </div>
  );
}
