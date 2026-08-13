export type CohortAvailability = 'Available' | 'Withheld' | 'Not yet';

export type CohortConcentration = 'Balanced' | 'Concentration risk' | 'None';

export interface CohortGroupRecord {
  id: string;
  title: string;
  gradeLevel: 'K-5' | '6-8' | '9-12' | 'Elementary' | 'Middle' | 'High';
  enrollmentBand: 'Under 300' | '300–599' | '600–999' | '1,000+';
  surveyVersion: 'v3' | 'v4';
  qualifyingSchools: number;
  isBelowMinimum: boolean;
  availability: CohortAvailability;
  concentration: CohortConcentration;
  linkedBenchmarkTitle?: string;
  linkedBenchmarkId?: string;
  withheldReason?: string;
}

export interface CohortKpiSummary {
  comparisonGroups: number;
  meetingMinimum: number;
  belowMinimum: number;
  schoolsContributing: number;
  minimumThreshold: number;
}
