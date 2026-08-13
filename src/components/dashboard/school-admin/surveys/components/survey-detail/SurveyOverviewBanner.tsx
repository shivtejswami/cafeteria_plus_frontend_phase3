'use client';

import CircularProgress from '@/components/school-admin/common/CircularProgress';

interface SurveyOverviewBannerProps {
  isPaused: boolean;
  gradeBand: string;
  period: string;
  openedDateTime: string;
  closesDateTime: string;
  responseCount: number;
  targetCount: number;
  responseRate: number;
  daysRemaining: number;
  /** Omitted while paused — the link isn't accepting responses. */
  onShare?: () => void;
}

/** Headline card for a survey that is still open or paused: identity, totals and time left. */
export default function SurveyOverviewBanner({
  isPaused,
  gradeBand,
  period,
  openedDateTime,
  closesDateTime,
  responseCount,
  targetCount,
  responseRate,
  daysRemaining,
  onShare,
}: SurveyOverviewBannerProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
      {/* Identity takes the slack so the metrics sit against the right edge. */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${isPaused ? 'bg-[#FFECD1] text-[#D97706]' : 'bg-[#006EB21A] text-[#006EB2]'}`}
        >
          <i className={`${isPaused ? 'ri-pause-circle-line' : 'ri-pulse-line'} text-lg sm:text-xl`}></i>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">{period}</h1>
            {isPaused ? (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-[#FFECD1] text-[#D97706]">
                Paused
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-[#006EB21A] text-[#006EB2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006EB2]"></span>
                Open
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="rounded-md px-2 py-0.5 text-[12px] font-medium bg-[#F0EAFB] text-[#6D28D9]">
              {gradeBand}
            </span>
            <p className="text-[12px] text-[#9A9A9A]">
              {openedDateTime} &ndash; {closesDateTime}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 flex-wrap lg:shrink-0">
        <div className="hidden lg:block h-10 w-px bg-[#E8E6E1]"></div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-[32px] font-bold text-[#2B2B2B] leading-none">{responseCount}</span>
          <span className="text-[14px] text-[#9A9A9A]">/ {targetCount}</span>
          <span className="text-[13px] text-[#9A9A9A]">responses</span>
        </div>

        <CircularProgress percentage={responseRate} size={64} strokeWidth={7} />

        {/* Countdown only applies while responses are still coming in. */}
        {!isPaused && (
          <>
            <div className="hidden lg:block h-10 w-px bg-[#E8E6E1]"></div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#D97706]">
              <i className="ri-time-line text-base"></i>
              <span>{daysRemaining}d left</span>
            </div>
          </>
        )}
      </div>

      {onShare && (
        <button
          onClick={onShare}
          className="w-full lg:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <i className="ri-share-line text-base"></i>
          Share link / QR
        </button>
      )}
    </div>
  );
}
