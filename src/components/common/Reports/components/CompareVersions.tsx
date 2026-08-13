'use client';

import type { VersionComparisonData } from '@/lib/versionHistoryData';
import { barWidthClass } from '@/utils/barWidth';

interface CompareVersionsProps {
  comparison: VersionComparisonData;
  reportId: string;
  onClose: () => void;
}

export default function CompareVersions({ comparison, onClose }: CompareVersionsProps) {
  const { versionA, versionB, keyDifferences } = comparison;

  const allConcepts = versionA.concepts.map((ca, i) => ({
    concept: ca.concept,
    scoreA: ca.score,
    scoreB: versionB.concepts[i]?.score ?? null,
  }));

  function scoreDiff(scoreA: number, scoreB: number | null) {
    if (scoreB === null) return null;
    const diff = scoreB - scoreA;
    if (diff > 0) return { label: `+${diff}`, className: 'bg-[#D8F3DC] text-[#2D6A4F]' };
    if (diff < 0) return { label: `${diff}`, className: 'bg-[#FFCCD5] text-[#9B2226]' };
    return { label: 'No change', className: 'bg-[#F1EFEA] text-[#6C757D]' };
  }

  const overallDiff = versionB.overallSatisfaction - versionA.overallSatisfaction;
  const overallDiffChip = overallDiff > 0 ? 'bg-[#D8F3DC] text-[#2D6A4F]' : overallDiff < 0 ? 'bg-[#FFCCD5] text-[#9B2226]' : 'bg-[#F1EFEA] text-[#6C757D]';

  const responseDiff = versionB.responseCount - versionA.responseCount;
  const responseDiffChip = responseDiff > 0 ? 'bg-[#D8F3DC] text-[#2D6A4F]' : responseDiff < 0 ? 'bg-[#FFCCD5] text-[#9B2226]' : 'bg-[#F1EFEA] text-[#6C757D]';

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-line shadow-card"
    >
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-iris">
            <i className="ri-arrow-left-right-line text-base"></i>
          </span>
          <h3 className="text-[14px] font-semibold text-ink">
            Side-by-side comparison
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-[#f1efea] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-1"
          aria-label="Close comparison"
        >
          <span className="w-5 h-5 flex items-center justify-center text-subtle">
            <i className="ri-close-line text-lg"></i>
          </span>
        </button>
      </div>

      {/* Version header badges */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex-1 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 bg-canvas border border-line">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-100 text-muted">
              Version {versionA.version}
            </span>
          </div>
          <p className="text-[12px] text-subtle">
            Published {versionA.publishedDate}
          </p>
        </div>

        <div className="flex-shrink-0 self-center w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-iris-50 border border-iris-300 my-1 sm:my-0">
          <span className="text-[11px] font-bold text-iris">VS</span>
        </div>

        <div className="flex-1 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 bg-canvas border border-line">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-leaf-50 text-leaf-700">
              Version {versionB.version}
            </span>
          </div>
          <p className="text-[12px] text-subtle">
            Published {versionB.publishedDate}
          </p>
        </div>
      </div>

      {/* Response count row */}
      <div className="px-4 sm:px-5 py-3 flex items-center gap-2 sm:gap-4 border-b border-surface-100">
        <div className="flex-1 text-center">
          <p className="text-[18px] sm:text-[22px] font-bold text-ink">
            {versionA.responseCount}<span className="text-[12px] sm:text-[13px] font-normal text-subtle"> / {versionA.targetCount}</span>
          </p>
          <p className="text-[11px] mt-0.5 text-subtle">{versionA.responseRate}% response rate</p>
          <div className="mt-2 mx-auto max-w-[120px] h-1.5 rounded-full overflow-hidden bg-surface-100">
            <div className={`h-full rounded-full bg-iris ${barWidthClass(versionA.responseRate)}`} />
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
          {responseDiff !== 0 ? (
            <span className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-[12px] font-semibold ${responseDiffChip}`}>
              {responseDiff > 0 ? '+' : ''}{responseDiff} responses
            </span>
          ) : (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-[12px] font-semibold bg-surface-100 text-[#6c757d]">
              No change
            </span>
          )}
        </div>

        <div className="flex-1 text-center">
          <p className="text-[18px] sm:text-[22px] font-bold text-ink">
            {versionB.responseCount}<span className="text-[12px] sm:text-[13px] font-normal text-subtle"> / {versionB.targetCount}</span>
          </p>
          <p className="text-[11px] mt-0.5 text-subtle">{versionB.responseRate}% response rate</p>
          <div className="mt-2 mx-auto max-w-[120px] h-1.5 rounded-full overflow-hidden bg-surface-100">
            <div className={`h-full rounded-full bg-leaf-700 ${barWidthClass(versionB.responseRate)}`} />
          </div>
        </div>
      </div>

      {/* Overall satisfaction row */}
      <div className="px-4 sm:px-5 py-3 flex items-center gap-2 sm:gap-4 border-b border-surface-100">
        <div className="flex-1 text-center">
          <p className="text-[18px] sm:text-[22px] font-bold text-ink">
            {versionA.overallSatisfaction}
          </p>
          <p className="text-[11px] mt-0.5 text-subtle">Overall satisfaction</p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
          {overallDiff !== 0 ? (
            <span className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-[12px] font-semibold ${overallDiffChip}`}>
              {overallDiff > 0 ? '+' : ''}{overallDiff} pts
            </span>
          ) : (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-[12px] font-semibold bg-surface-100 text-[#6c757d]">
              No change
            </span>
          )}
        </div>

        <div className="flex-1 text-center">
          <p className="text-[18px] sm:text-[22px] font-bold text-ink">
            {versionB.overallSatisfaction}
          </p>
          <p className="text-[11px] mt-0.5 text-subtle">Overall satisfaction</p>
        </div>
      </div>

      {/* Concept scores */}
      <div className="px-4 sm:px-5 py-4 border-b border-surface-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-subtle">
          Concept scores
        </p>
        <div className="space-y-3">
          {allConcepts.map((c) => {
            const diff = scoreDiff(c.scoreA, c.scoreB);
            const maxScore = 100;
            return (
              <div key={c.concept}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-medium text-ink">{c.concept}</span>
                  {diff && (
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${diff.className}`}>
                      {diff.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-surface-100">
                        <div className={`h-full rounded-full bg-iris ${barWidthClass((c.scoreA / maxScore) * 100)}`} />
                      </div>
                      <span className="text-[13px] font-semibold w-8 text-right text-ink">{c.scoreA}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-surface-100">
                        <div className={`h-full rounded-full bg-leaf-700 ${barWidthClass(((c.scoreB ?? 0) / maxScore) * 100)}`} />
                      </div>
                      <span className="text-[13px] font-semibold w-8 text-right text-ink">{c.scoreB ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summaries */}
      <div className="px-4 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 border-b border-surface-100">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-subtle">
            v{versionA.version} summary
          </p>
          <p className="text-[13px] leading-relaxed text-ink-700">{versionA.summary}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-subtle">
            v{versionB.version} summary
          </p>
          <p className="text-[13px] leading-relaxed text-ink-700">{versionB.summary}</p>
        </div>
      </div>

      {/* Key differences */}
      {keyDifferences.length > 0 && (
        <div className="px-4 sm:px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-subtle">
            Key differences
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {keyDifferences.map((d, i) => {
              const lower = d.toLowerCase();
              let icon = 'ri-subtract-line';
              let iconColor = 'text-[#6C757D]';
              let iconBg = 'bg-[#F1EFEA]';
              if (lower.includes('improv') || lower.includes('increas') || lower.includes('higher') || lower.includes('gain')) {
                icon = 'ri-arrow-up-line';
                iconColor = 'text-[#2D6A4F]';
                iconBg = 'bg-[#D8F3DC]';
              } else if (lower.includes('declin') || lower.includes('decreas') || lower.includes('lower') || lower.includes('drop') || lower.includes('worse') || lower.includes('lost')) {
                icon = 'ri-arrow-down-line';
                iconColor = 'text-[#9B2226]';
                iconBg = 'bg-[#FFCCD5]';
              } else if (lower.includes('added') || lower.includes('new')) {
                icon = 'ri-add-line';
                iconColor = 'text-[#2D6A4F]';
                iconBg = 'bg-[#D8F3DC]';
              } else if (lower.includes('remov') || lower.includes('delet')) {
                icon = 'ri-close-line';
                iconColor = 'text-[#9B2226]';
                iconBg = 'bg-[#FFCCD5]';
              }
              return (
                <div key={i} className="flex items-start gap-2.5 rounded-xl p-3 bg-canvas border border-line">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
                    <span className={`w-4 h-4 flex items-center justify-center ${iconColor}`}>
                      <i className={`${icon} text-xs`}></i>
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-ink font-medium">{d}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}