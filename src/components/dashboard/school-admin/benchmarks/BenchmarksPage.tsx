'use client';

import { useState, useMemo } from 'react';
import BenchmarkContextControls from '@/components/school-admin/benchmarks/components/BenchmarkContextControls';
import BenchmarkLabelBanner from '@/components/school-admin/benchmarks/components/BenchmarkLabelBanner';
import BenchmarkScopeCard from '@/components/school-admin/benchmarks/components/BenchmarkScopeCard';
import BenchmarkComparisonChart from '@/components/school-admin/benchmarks/components/BenchmarkComparisonChart';
import BenchmarkComparisonTable from '@/components/school-admin/benchmarks/components/BenchmarkComparisonTable';
import BenchmarkSummaryStats from '@/components/school-admin/benchmarks/components/BenchmarkSummaryStats';
import BenchmarkMethodology from '@/components/school-admin/benchmarks/components/BenchmarkMethodology';
import BenchmarkEmptyState from '@/components/school-admin/benchmarks/components/BenchmarkEmptyState';
import {
  SchoolAdminData,
  BenchmarkScope,
  BenchmarkScopeData,
  benchmarkGradeBands,
  benchmarkPeriods,
  benchmarkComparableData,
  benchmarkDistrictData,
  benchmarkNationalActiveData,
  benchmarkNationalUnavailableData,
  benchmarkNationalInactiveData,
  benchmarkPeriodMeta,
  MINIMUM_COHORT_SIZE,
  getSchoolNationalBenchmarkState,
  type NationalBenchmarkState,
} from '@/lib/schoolAdminData';
import Link from 'next/link';

interface BenchmarksPageProps {
  schoolData: SchoolAdminData;
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl ${className || ''} bg-surface-200`}
    />
  );
}

function LoadingSkeletons() {
  return (
    <>
      <SkeletonBlock className="h-[280px]" />
      <SkeletonBlock className="h-[300px]" />
      <div className="flex flex-col sm:flex-row gap-4">
        <SkeletonBlock className="h-[160px] flex-1" />
        <SkeletonBlock className="h-[160px] flex-1" />
        <SkeletonBlock className="h-[160px] flex-1" />
      </div>
    </>
  );
}

function NoPublishedPeriodState() {
  return (
    <div className="rounded-2xl p-5 sm:p-8 text-center bg-canvas border border-line shadow-hairline"
    >
      <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-sage-50"
      >
        <span className="w-6 h-6 flex items-center justify-center text-muted-500">
          <i className="ri-bar-chart-grouped-line text-2xl"></i>
        </span>
      </div>
      <h3 className="text-[15px] font-semibold mb-1.5 text-ink">
        Benchmarks appear once your first survey closes and its report is published
      </h3>
      <p className="text-[13px] leading-relaxed max-w-lg mx-auto text-muted"
      >
        There is no published period for this grade band yet. Run a survey and publish its report to see how your school compares.
      </p>
    </div>
  );
}

function SmallSampleBanner({ responseCount, isVerySmall }: { responseCount: number; isVerySmall: boolean }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-[#fff9ed] border border-[#f0dba0]"
    >
      <div className="flex items-start gap-3">
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#b0770a]">
          <i className="ri-information-line text-lg"></i>
        </span>
        <div>
          <p className="text-[13px] leading-relaxed font-semibold text-[#7a5200]">
            {isVerySmall
              ? 'Too few responses to show a detailed comparison — this protects anonymity and avoids unreliable conclusions.'
              : `Small sample — results are directional only (${responseCount} responses, below 30).`
            }
          </p>
          {!isVerySmall && (
            <p className="text-[12px] mt-1 text-[#9a7a30]">
              Scores and comparisons still appear, tagged as directional. Confirm findings with a larger sample in the next survey cycle.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function VersionMismatchBanner({ warning }: { warning: string }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-[#fff9ed] border border-[#f0dba0]"
    >
      <div className="flex items-start gap-3">
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#b0770a]">
          <i className="ri-error-warning-line text-lg"></i>
        </span>
        <div>
          <p className="text-[13px] leading-relaxed font-semibold text-[#7a5200]">
            Mixed survey versions detected
          </p>
          <p className="text-[12px] mt-1 text-[#9a7a30]">
            {warning}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BenchmarksPage({ schoolData }: BenchmarksPageProps) {
  const [selectedGradeBand, setSelectedGradeBand] = useState('6-8');
  const [selectedPeriod, setSelectedPeriod] = useState('fall2024');
  const [selectedScope, setSelectedScope] = useState<BenchmarkScope>('comparable');
  const [isLoading, setIsLoading] = useState(false);

  const isStandalone = schoolData.isStandalone;
  const subscriptionIsLimited = schoolData.subscriptionStatus === 'grace-period' || schoolData.subscriptionStatus === 'read-only';

  const nationalState: NationalBenchmarkState = useMemo(
    () => getSchoolNationalBenchmarkState(selectedPeriod),
    [selectedPeriod]
  );

  const publishedPeriodsForBand = useMemo(() => {
    return benchmarkPeriods.filter((p) => {
      const meta = benchmarkPeriodMeta[p.value];
      if (!meta) return false;
      return meta.responseCount > 0;
    });
  }, []);

  const periodMeta = benchmarkPeriodMeta[selectedPeriod];
  const schoolResponseCount = periodMeta?.responseCount ?? 0;
  const schoolTargetCount = periodMeta?.targetCount ?? 0;
  const isVerySmallSample = schoolResponseCount > 0 && schoolResponseCount < 10;
  const isSmallSample = schoolResponseCount > 0 && schoolResponseCount < 30 && schoolResponseCount >= 10;
  const hasNoPublishedPeriod = publishedPeriodsForBand.length === 0;

  const scopeDataMap: Record<string, BenchmarkScopeData> = useMemo(() => {
    const map: Record<string, BenchmarkScopeData> = {
      comparable: benchmarkComparableData,
      district: benchmarkDistrictData,
    };
    if (nationalState === 'B') {
      map.national = benchmarkNationalActiveData;
    } else if (nationalState === 'C') {
      map.national = benchmarkNationalUnavailableData;
    } else {
      map.national = benchmarkNationalInactiveData;
    }
    return map;
  }, [nationalState]);

  const activeScopeData = scopeDataMap[selectedScope];

  const selectedPeriodInfo = benchmarkPeriods.find(p => p.value === selectedPeriod) || benchmarkPeriods[0];

  const effectiveScopeData: BenchmarkScopeData = useMemo(() => {
    return {
      ...activeScopeData,
      schoolResponseCount,
      schoolTargetCount,
    };
  }, [activeScopeData, schoolResponseCount, schoolTargetCount]);

  const selectableScopes = useMemo(() => {
    return (Object.entries(scopeDataMap) as [BenchmarkScope, BenchmarkScopeData][])
      .filter(([scope]) => {
        if (scope === 'district' && isStandalone) return false;
        if (scope === 'national') return nationalState === 'B';
        return true;
      });
  }, [isStandalone, scopeDataMap, nationalState]);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <BenchmarkContextControls
          selectedGradeBand={selectedGradeBand}
          onGradeBandChange={(band) => { setSelectedGradeBand(band); }}
          selectedPeriod={selectedPeriod}
          onPeriodChange={(period) => { setSelectedPeriod(period); }}
          gradeBands={benchmarkGradeBands}
          periods={publishedPeriodsForBand}
          instrumentVersion={selectedPeriodInfo.instrumentVersion}
        />
        <LoadingSkeletons />
      </div>
    );
  }

  if (hasNoPublishedPeriod) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <BenchmarkContextControls
          selectedGradeBand={selectedGradeBand}
          onGradeBandChange={setSelectedGradeBand}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          gradeBands={benchmarkGradeBands}
          periods={publishedPeriodsForBand}
          instrumentVersion={selectedPeriodInfo.instrumentVersion}
        />
        <NoPublishedPeriodState />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/school/reports" className="text-[13px] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-muted">
          Reports
        </Link>
        <span className="text-[13px] text-subtle">/</span>
        <span className="text-[13px] font-medium text-ink">Benchmarks</span>
      </div>
      <h1 className="sr-only">Benchmarks</h1>

      <BenchmarkContextControls
        selectedGradeBand={selectedGradeBand}
        onGradeBandChange={(band) => { setSelectedGradeBand(band); setIsLoading(true); setTimeout(() => setIsLoading(false), 400); }}
        selectedPeriod={selectedPeriod}
        onPeriodChange={(period) => { setSelectedPeriod(period); setIsLoading(true); setTimeout(() => setIsLoading(false), 400); }}
        gradeBands={benchmarkGradeBands}
        periods={publishedPeriodsForBand}
        instrumentVersion={selectedPeriodInfo.instrumentVersion}
      />

      {subscriptionIsLimited && (
        <div className="rounded-2xl p-4 bg-[#fef3c7] border border-[#fcd34d]"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-4 h-4 flex items-center justify-center shrink-0 text-gold-800">
              <i className="ri-timer-line text-sm"></i>
            </span>
            <p className="flex-1 min-w-[180px] text-[12px] sm:text-[13px] text-gold-800">
              {schoolData.subscriptionStatus === 'grace-period'
                ? `Your subscription is in a grace period — benchmarks remain viewable. ${schoolData.graceDaysRemaining} days remaining.`
                : 'Your subscription is in read-only mode — benchmarks remain viewable.'
              }
            </p>
            <Link
              href="/school/subscription"
              className="text-[13px] font-medium underline whitespace-nowrap ml-auto text-gold-800"
            >
              View subscription
            </Link>
          </div>
        </div>
      )}

      <BenchmarkLabelBanner
        selectedScope={selectedScope}
        instrumentVersion={selectedPeriodInfo.instrumentVersion}
        gradeBand={selectedGradeBand}
        benchmarkPeriod={effectiveScopeData.benchmarkPeriod}
        nationalState={nationalState}
        nationalCohortSize={selectedScope === 'national' ? effectiveScopeData.cohortSize : undefined}
        nationalLastRefreshed={selectedScope === 'national' ? effectiveScopeData.lastRefreshed : undefined}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {selectableScopes.map(([scope, data]) => (
          <div key={scope} className="min-w-0">
            <BenchmarkScopeCard
              data={data}
              isSelected={selectedScope === scope}
              onSelect={() => setSelectedScope(scope)}
            />
          </div>
        ))}
      </div>

      {effectiveScopeData.isVersionMismatched && (
        <VersionMismatchBanner warning={effectiveScopeData.versionMismatchWarning || ''} />
      )}

      {isVerySmallSample && (
        <SmallSampleBanner responseCount={schoolResponseCount} isVerySmall={true} />
      )}
      {isSmallSample && (
        <SmallSampleBanner responseCount={schoolResponseCount} isVerySmall={false} />
      )}

      {!effectiveScopeData.isAvailable ? (
        <BenchmarkEmptyState
          reason={effectiveScopeData.unavailableReason || ''}
          isWithheldCohort={effectiveScopeData.cohortSize > 0 && effectiveScopeData.cohortSize < MINIMUM_COHORT_SIZE}
          cohortSize={effectiveScopeData.cohortSize}
        />
      ) : (
        <>
          {!isVerySmallSample && (
            <BenchmarkComparisonChart
              concepts={effectiveScopeData.concepts}
              benchmarkLabel={effectiveScopeData.label.toLowerCase()}
              schoolN={schoolResponseCount}
              isVersionMismatched={effectiveScopeData.isVersionMismatched}
            />
          )}

          {!isVerySmallSample && (
            <BenchmarkComparisonTable
              concepts={effectiveScopeData.concepts}
              benchmarkLabel={effectiveScopeData.label.toLowerCase()}
              schoolN={schoolResponseCount}
              isVersionMismatched={effectiveScopeData.isVersionMismatched}
            />
          )}

          <BenchmarkSummaryStats
            data={{
              ...effectiveScopeData,
              isDirectional: isSmallSample || isVerySmallSample,
            }}
            isVersionMismatched={effectiveScopeData.isVersionMismatched}
          />
        </>
      )}

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px]"
      >
        <Link
          href={`/school/reports/${selectedPeriodInfo.reportId}`}
          className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full h-9 px-4 font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 border border-[#D6E0D2] text-sage-900"
        >
          View full report dashboard
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-arrow-right-line text-sm"></i>
          </span>
        </Link>
        <Link
          href="/school/reports/survey-to-survey"
          className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full h-9 px-4 font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 border border-[#D6E0D2] text-sage-900"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-line-chart-line text-sm"></i>
          </span>
          Survey to survey comparison
        </Link>
      </div>

      {effectiveScopeData.isAvailable && (
        <BenchmarkMethodology lastRefreshed={effectiveScopeData.lastRefreshed} nationalState={nationalState} />
      )}
    </div>
  );
}