'use client';

import React from 'react';
import { Check, Timer, Hourglass, EyeOff, XCircle } from 'lucide-react';
import { BenchmarkKpiSummary } from './types';

interface KpiCardsProps {
  metrics: BenchmarkKpiSummary;
}

export function KpiCards({ metrics }: KpiCardsProps) {
  const cardBorderStyle = {
    borderWidth: '3px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#E8E6E1',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full font-sans">
      {/* 1. Active */}
      <div
        style={cardBorderStyle}
        className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[95px] sm:min-h-[110px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Active
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E3F5E3] flex items-center justify-center text-[#1D6B1D] shrink-0">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
          </div>
        </div>
        <div className="text-[26px] sm:text-[32px] font-bold text-[#2B2B2B] font-sans leading-none mt-2">
          {metrics.active}
        </div>
      </div>

      {/* 2. Expiring ≤30 Days */}
      <div
        style={cardBorderStyle}
        className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[95px] sm:min-h-[110px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Expiring ≤30 Days
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF1DD] flex items-center justify-center text-[#D97706] shrink-0">
            <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-[26px] sm:text-[32px] font-bold text-[#2B2B2B] font-sans leading-none mt-2">
          {metrics.expiring30Days}
        </div>
      </div>

      {/* 3. In Grace */}
      <div
        style={cardBorderStyle}
        className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[95px] sm:min-h-[110px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            In Grace
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF1DD] flex items-center justify-center text-[#D97706] shrink-0">
            <Hourglass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-[26px] sm:text-[32px] font-bold text-[#2B2B2B] font-sans leading-none mt-2">
          {metrics.inGrace}
        </div>
      </div>

      {/* 4. Read-only */}
      <div
        style={cardBorderStyle}
        className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[95px] sm:min-h-[110px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Read-only
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#6D6D6D] shrink-0">
            <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-[26px] sm:text-[32px] font-bold text-[#2B2B2B] font-sans leading-none mt-2">
          {metrics.readOnly}
        </div>
      </div>

      {/* 5. Deactivated */}
      <div
        style={cardBorderStyle}
        className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[95px] sm:min-h-[110px] min-w-0"
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans leading-tight">
            Deactivated
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FDEAEA] flex items-center justify-center text-[#D8201D] shrink-0">
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-[26px] sm:text-[32px] font-bold text-[#2B2B2B] font-sans leading-none mt-2">
          {metrics.deactivated}
        </div>
      </div>
    </div>
  );
}
