'use client';

import { useState } from 'react';
import type { SentimentBreakdown } from '@/lib/schoolAdminData';
import { barWidthClass } from '@/utils/barWidth';

interface ReportCommentsProps {
  sentiment: SentimentBreakdown;
}

export default function ReportComments({ sentiment }: ReportCommentsProps) {
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  return (
    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-[18px] font-semibold mb-4 text-ink">Comments & sentiment</h2>

      <div className="rounded-2xl p-4 sm:p-5 mb-6 bg-white border border-line shadow-card">
        <h3 className="text-[14px] font-semibold mb-4 text-ink">Overall sentiment</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-medium text-leaf">Positive</span>
              <span className="text-[14px] font-semibold text-leaf">{sentiment.positive}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-surface-100">
              <div className={`h-full rounded-full bg-leaf ${barWidthClass(sentiment.positive)}`} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-medium text-[#ECBF6A]">Neutral</span>
              <span className="text-[14px] font-semibold text-[#ECBF6A]">{sentiment.neutral}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-surface-100">
              <div className={`h-full rounded-full bg-[#ECBF6A] ${barWidthClass(sentiment.neutral)}`} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-medium text-brick-600">Negative</span>
              <span className="text-[14px] font-semibold text-brick-600">{sentiment.negative}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-surface-100">
              <div className={`h-full rounded-full bg-brick-600 ${barWidthClass(sentiment.negative)}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
        <h3 className="text-[14px] font-semibold mb-4 text-ink">Comment themes</h3>
        <p className="text-[12px] mb-4 text-subtle">
          All comments are anonymous and aggregated. No individual student is identifiable.
        </p>
        {sentiment.themes.length === 0 ? (
          <div className="rounded-xl py-12 sm:py-14 text-center border border-line">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center bg-surface-200">
              <span className="w-6 h-6 flex items-center justify-center text-subtle">
                <i className="ri-chat-3-line text-2xl"></i>
              </span>
            </div>
            <p className="text-[14px] font-semibold text-ink">No comments found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sentiment.themes.map((theme) => {
              const isOpen = expandedTheme === theme.theme;
              return (
                /* Header and examples share one bordered box so the open row reads as a single panel. */
                <div key={theme.theme} className="rounded-xl overflow-hidden border border-line">
                  <button
                    onClick={() => setExpandedTheme(isOpen ? null : theme.theme)}
                    aria-expanded={isOpen}
                    className={`w-full text-left p-4 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-inset ${isOpen ? 'bg-iris-50' : 'bg-white hover:bg-canvas'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[14px] font-medium text-ink">{theme.theme}</span>
                        <span className="inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold flex-shrink-0 bg-iris-100 text-iris">{theme.prevalence}%</span>
                      </div>
                      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-subtle">
                        <i className={`${isOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-sm`}></i>
                      </span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-2 bg-canvas border-t border-line">
                      {theme.examples.map((example, i) => (
                        <p key={i} className="text-[13px] leading-relaxed py-2.5 border-b last:border-b-0 italic text-ink-800 border-line">
                          &ldquo;{example}&rdquo;
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}