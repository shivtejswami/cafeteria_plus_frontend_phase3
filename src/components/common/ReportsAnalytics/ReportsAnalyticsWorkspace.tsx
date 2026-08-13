'use client';

import React, { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { DistrictBenchmarks } from './DistrictBenchmarks';
import { DistrictRollup } from './DistrictRollup';
import { SchoolComparison } from './SchoolComparison';
import { SurveyToSurvey } from './SurveyToSurvey';

type PrimaryView = 'rollup' | 'comparison';
type SecondaryView = 'survey' | 'benchmarks';

export function ReportsAnalyticsWorkspace() {
  const [primaryView, setPrimaryView] = useState<PrimaryView>('rollup');
  const [secondaryView, setSecondaryView] = useState<SecondaryView | null>(null);

  const activeTab = primaryView === 'comparison' ? 'comparison' : 'rollup';

  const openRollup = () => {
    setPrimaryView('rollup');
    setSecondaryView(null);
  };

  const openComparison = () => {
    setPrimaryView('comparison');
    setSecondaryView(null);
  };

  const openSurvey = () => {
    setSecondaryView('survey');
  };

  const openBenchmarks = () => {
    setSecondaryView('benchmarks');
  };

  return (
    <div className="space-y-6">
      {secondaryView === null && (
        <Tabs
          tabs={[
            { id: 'rollup', label: 'District roll-up' },
            { id: 'comparison', label: 'School comparison' },
          ]}
          activeTab={activeTab}
          onChange={(id) => {
            setSecondaryView(null);
            setPrimaryView(id === 'comparison' ? 'comparison' : 'rollup');
          }}
        />
      )}

      {secondaryView === 'survey' ? (
        <SurveyToSurvey onBack={() => setSecondaryView(null)} onOpenRollup={openRollup} onOpenBenchmarks={openBenchmarks} />
      ) : secondaryView === 'benchmarks' ? (
        <DistrictBenchmarks
          onBack={() => setSecondaryView(null)}
          onOpenRollup={openRollup}
          onOpenSchoolComparison={openComparison}
          onOpenSurveyToSurvey={openSurvey}
        />
      ) : primaryView === 'comparison' ? (
        <SchoolComparison
          onOpenRollup={openRollup}
          onOpenSurveyToSurvey={openSurvey}
          onOpenBenchmarks={openBenchmarks}
        />
      ) : (
        <DistrictRollup onOpenSurveyToSurvey={openSurvey} onOpenBenchmarks={openBenchmarks} />
      )}
    </div>
  );
}
