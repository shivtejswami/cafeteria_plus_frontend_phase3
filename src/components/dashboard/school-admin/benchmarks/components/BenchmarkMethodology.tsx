'use client';

import { useState } from 'react';
import { MINIMUM_COHORT_SIZE, type NationalBenchmarkState } from '@/lib/schoolAdminData';

export default function BenchmarkMethodology({
  lastRefreshed,
  nationalState,
}: {
  lastRefreshed: string;
  nationalState?: NationalBenchmarkState;
}) {
  const [expanded, setExpanded] = useState(false);

  const nationalNote = () => {
    if (nationalState === 'B') {
      return (
        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-t-line">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-iris">
            <i className="ri-global-line text-sm"></i>
          </span>
          <p className="text-[12px] leading-relaxed text-ink-700">
            <strong>The national benchmark is active.</strong> It aggregates de-identified results from participating schools nationwide that use the same survey version, approved and maintained by SFWG (methodology documented; refreshed after each survey cycle).
          </p>
        </div>
      );
    }
    if (nationalState === 'C') {
      return (
        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-t-line">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-information-line text-sm"></i>
          </span>
          <p className="text-[12px] leading-relaxed text-ink-700">
            <strong>A national benchmark is active for the Cafeteria Pulse programme, but not yet available for your grade band / survey version.</strong>
          </p>
        </div>
      );
    }
    return (
      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-t-line">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-subtle">
          <i className="ri-information-line text-sm"></i>
        </span>
        <p className="text-[12px] leading-relaxed text-ink-700">
          <strong>A national benchmark dataset is not available yet.</strong> The Cafeteria Pulse participating-school benchmark is used instead. Check back once SFWG activates an approved national dataset.
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white border border-line shadow-hairline"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors duration-100 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded-2xl whitespace-nowrap"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-muted-500">
            <i className="ri-information-line text-lg"></i>
          </span>
          <span className="text-[13px] font-semibold text-ink">
            How this benchmark works
          </span>
        </div>
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-muted-500">
          <i className={`${expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-sm`}></i>
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t border-t-line">
          <div className="pt-4 space-y-3">
            <p className="text-[13px] leading-relaxed text-ink-700">
              Benchmarks let you see how your school compares with other schools &mdash; without ever seeing other schools&apos; identities or individual results.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <p className="text-[12px] leading-relaxed text-ink-700">
                  <strong>Minimum of {MINIMUM_COHORT_SIZE} comparable schools required</strong> &mdash; this protects every school&apos;s anonymity and ensures reliable group averages.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <p className="text-[12px] leading-relaxed text-ink-700">
                  <strong>Grouped by three criteria:</strong> school level, enrolment band, and survey version. Only schools using the same or compatible survey version are compared.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <p className="text-[12px] leading-relaxed text-ink-700">
                  <strong>De-identified group averages only</strong> &mdash; no individual school&apos;s scores are ever shown. Results are weighted so no single school can be identified or reverse-engineered.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <p className="text-[12px] leading-relaxed text-ink-700">
                  <strong>Refreshed after each survey cycle</strong> &mdash; benchmarks are recalculated as new survey periods close and reports are published, so they always reflect the most recent available data.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <p className="text-[12px] leading-relaxed text-ink-700">
                  <strong>Scoring formula (all grade bands):</strong> Score = Yes% + &frac12; &times; Sometimes% (0&ndash;100). Green &ge; 65, Amber 50&ndash;64, Red &lt; 50.
                </p>
              </div>
            </div>

            {nationalNote()}

            <p className="text-[11px] pt-2 text-subtle">
              Last refreshed: {lastRefreshed}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}