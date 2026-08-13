export type RequestStatus = 'Pending' | 'Approved' | 'Declined';
export type SchoolType = 'District school' | 'Standalone school' | 'Standalone' | 'District';

export interface DecisionInfo {
  status: 'Approved' | 'Declined';
  decidedBy: string;
  decidedDate: string;
  notes: string;
  newClosingDate?: string;
}

export interface ReopenRequest {
  id: string;
  school: string;
  schoolType: SchoolType;
  district?: string;
  gradeBand: string;
  period: string;
  responses: number;
  targetResponses: number;
  closedDate?: string;
  requestedBy: string;
  requestedRole?: string;
  requestedDate: string;
  waitingDurationText?: string;
  daysWaiting: number;
  requestedClosingDate?: string;
  requestedClosingTime?: string;
  reason: string;
  reportImpact: string;
  publishedVersion?: string;
  status: RequestStatus;
  decision?: DecisionInfo;
}

export type StatusFilterOption = 'All' | 'Pending' | 'Approved' | 'Declined';

export type DistrictFilterOption =
  | 'All'
  | 'North Hills School District'
  | 'Riverside Unified'
  | 'Summit Valley District'
  | 'Westbrook Unified'
  | 'DeKalb County';

export type SortFilterOption =
  | 'oldest'
  | 'newest'
  | 'school-asc'
  | 'school-desc';

export interface KpiSummary {
  pendingCount: number;
  approvedThisWeek: number;
  declinedThisWeek: number;
  oldestWaitingDays: number;
}
