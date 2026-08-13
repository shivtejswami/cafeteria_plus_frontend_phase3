'use client';

import type { YoYPeriodDetail } from '@/lib/schoolAdminData';

interface YoYKpiCardsProps {
  periodA: YoYPeriodDetail;
  periodB: YoYPeriodDetail;
  comparable: boolean;
}

function getScoreTextClass(score: number): string {
  if (score >= 65) return 'text-leaf';
  if (score >= 50) return 'text-[#b07d28]';
  return 'text-brick-600';
}

function SmallSampleTag() {
  return (
    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-100 text-gold">
      <span className="w-3 h-3 flex items-center justify-center">
        <i className="ri-error-warning-line text-[10px]"></i>
      </span>
      Small sample
    </span>
  );
}

function ChangeIndicator({ delta, unit, muted }: { delta: number; unit: string; muted: boolean }) {
  const absDelta = Math.abs(delta);
  if (absDelta < 0.5) {
    return (
      <span className="text-[13px] font-medium text-subtle">No change</span>
    );
  }

  if (muted) {
    return (
      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-subtle">
        <span className="w-4 h-4 flex items-center justify-center">
          <i className="ri-subtract-line text-[14px]"></i>
        </span>
        ~{delta > 0 ? '+' : ''}{delta} {unit}
        <span className="relative group cursor-help ml-0.5">
          <span className="w-3.5 h-3.5 flex items-center justify-center text-subtle">
            <i className="ri-information-line text-[12px]"></i>
          </span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 px-3 py-2 rounded-lg text-[11px] leading-snug opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-20 whitespace-normal bg-ink text-white">
            Different survey versions — context only, not directly comparable.
          </span>
        </span>
      </span>
    );
  }

  const improved = delta > 0;
  const textClass = improved ? 'text-leaf' : 'text-brick-600';
  const bgClass = improved ? 'bg-sage-100' : 'bg-brick-50';
  const sign = delta > 0 ? '+' : '';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap ${bgClass} ${textClass}`}
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center">
        <i className={`${improved ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-[13px]`}></i>
      </span>
      {sign}{delta} {unit}
    </span>
  );
}

function CardShell({ accentBg, accentText, label, icon, children }: { accentBg: string; accentText: string; label: string; icon: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden relative transition-all duration-200 ease-out hover:-translate-y-0.5 bg-white border border-line shadow-raised"
    >
      <div className={`h-1 w-full ${accentBg}`} />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[12px] font-medium text-[#9A9A9A]">{label}</p>
          <span className={`w-5 h-5 flex items-center justify-center ${accentText}`}>
            <i className={`${icon} text-[18px]`}></i>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function YoYKpiCards({ periodA, periodB, comparable }: YoYKpiCardsProps) {
  const scoreDelta = periodB.overallScore - periodA.overallScore;
  const rateDelta = periodB.responseRate - periodA.responseRate;
  const sentimentDelta = periodB.sentimentPositive - periodA.sentimentPositive;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <CardShell accentBg="bg-iris" accentText="text-iris" label="Overall Score" icon="ri-award-line">
        <div className="flex items-stretch">
          <div className="flex-1 min-w-0 pr-3 border-r border-r-line">
            <p className="text-[11px] font-semibold mb-1 text-subtle">{periodA.period}</p>
            <p className={`text-[22px] sm:text-[28px] font-bold leading-none ${getScoreTextClass(periodA.overallScore)}`}>
              {periodA.overallScore}
            </p>
            <p className="text-[11px] mt-1.5 text-subtle">
              {periodA.responseCount} responses
            </p>
            {periodA.isSmallSample && <SmallSampleTag />}
          </div>
          <div className="flex-1 min-w-0 pl-3 text-right">
            <p className="text-[11px] font-semibold mb-1 text-subtle">{periodB.period}</p>
            <p className={`text-[22px] sm:text-[28px] font-bold leading-none ${getScoreTextClass(periodB.overallScore)}`}>
              {periodB.overallScore}
            </p>
            <p className="text-[11px] mt-1.5 text-subtle">
              {periodB.responseCount} responses
            </p>
            {periodB.isSmallSample && <SmallSampleTag />}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t flex items-center justify-center border-line">
          <ChangeIndicator delta={scoreDelta} unit="pts" muted={!comparable} />
        </div>
      </CardShell>

      <CardShell accentBg="bg-sage" accentText="text-sage" label="Response Rate" icon="ri-user-heart-line">
        <div className="flex items-stretch">
          <div className="flex-1 min-w-0 pr-3 border-r border-r-line">
            <p className="text-[11px] font-semibold mb-1 text-subtle">{periodA.period}</p>
            <p className="text-[22px] sm:text-[28px] font-bold leading-none text-ink">
              {periodA.responseRate}%
            </p>
            <p className="text-[11px] mt-1.5 text-subtle">
              {periodA.responseCount} of {periodA.targetCount}
            </p>
            {periodA.isSmallSample && <SmallSampleTag />}
          </div>
          <div className="flex-1 min-w-0 pl-3 text-right">
            <p className="text-[11px] font-semibold mb-1 text-subtle">{periodB.period}</p>
            <p className="text-[22px] sm:text-[28px] font-bold leading-none text-ink">
              {periodB.responseRate}%
            </p>
            <p className="text-[11px] mt-1.5 text-subtle">
              {periodB.responseCount} of {periodB.targetCount}
            </p>
            {periodB.isSmallSample && <SmallSampleTag />}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t flex items-center justify-center border-line">
          <ChangeIndicator delta={rateDelta} unit="pp" muted={false} />
        </div>
      </CardShell>

      <CardShell accentBg="bg-iris" accentText="text-iris" label="Positive Sentiment" icon="ri-emotion-happy-line">
        <div className="flex items-stretch">
          <div className="flex-1 min-w-0 pr-3 border-r border-r-line">
            <p className="text-[11px] font-semibold mb-1 text-subtle">{periodA.period}</p>
            <p className="text-[22px] sm:text-[28px] font-bold leading-none text-ink">
              {periodA.sentimentPositive}%
            </p>
            <p className="text-[11px] mt-1.5 text-subtle">
              {periodA.responseCount} responses
            </p>
            {periodA.isSmallSample && <SmallSampleTag />}
          </div>
          <div className="flex-1 min-w-0 pl-3 text-right">
            <p className="text-[11px] font-semibold mb-1 text-subtle">{periodB.period}</p>
            <p className="text-[22px] sm:text-[28px] font-bold leading-none text-ink">
              {periodB.sentimentPositive}%
            </p>
            <p className="text-[11px] mt-1.5 text-subtle">
              {periodB.responseCount} responses
            </p>
            {periodB.isSmallSample && <SmallSampleTag />}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t flex items-center justify-center border-line">
          <ChangeIndicator delta={sentimentDelta} unit="pp" muted={!comparable} />
        </div>
      </CardShell>
    </div>
  );
}