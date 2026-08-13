export type BenchmarkStatus = 'Active' | 'Below minimum' | 'Disabled' | 'Draft';

export type ComparisonBasis =
  | 'School level'
  | 'Enrollment band'
  | 'Survey version'
  | 'Setting';

export type BenchmarkLabel = 'Participating-school' | 'National pending approval' | 'National';

export interface BenchmarkRecord {
  id: string;
  title: string;
  subtitle: string;
  comparisonBasis: ComparisonBasis[];
  schoolCount: number;
  isBelowMinimum: boolean;
  label: BenchmarkLabel;
  status: BenchmarkStatus;
  effectivePeriod: string;
  refreshedText: string;
  nextRefreshText: string;
  gradeLevel: 'K-5' | '6-8' | '9-12' | 'All';
  type: 'School level' | 'Enrollment band' | 'Survey version' | 'Setting';
}

export type TypeFilterOption = 'All' | 'School level' | 'Enrollment band' | 'Survey version';

export type StatusFilterOption = 'All' | 'Active' | 'Below minimum' | 'Disabled' | 'Draft';

export type GradeFilterOption = 'All' | 'K-5' | '6-8' | '9-12';

export type SortFilterOption =
  | 'name'
  | 'recently_updated'
  | 'cohort_size'
  | 'effective_date';

export interface BenchmarkKpiSummary {
  active: number;
  expiring30Days: number;
  inGrace: number;
  readOnly: number;
  deactivated: number;
}

