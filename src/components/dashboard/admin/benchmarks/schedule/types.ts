export type ScheduleFrequency = 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly';
export type ScheduleDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type LastRunStatus = 'Success' | 'Skipped below minimum' | 'Failed';

export interface BenchmarkScheduleRecord {
  id: string;
  title: string;
  subtitle: string;
  cadence: string;
  isOverride: boolean;
  overrideFrequency?: ScheduleFrequency;
  lastRefreshed: string;
  lastRefreshedAgo: string;
  nextRefresh: string;
  nextRefreshShort: string;
  lastRunStatus: LastRunStatus;
}
