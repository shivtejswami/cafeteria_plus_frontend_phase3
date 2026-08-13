export interface SchoolAdminSurvey {
  id: string;
  title: string;
  gradeBand: string;
  period: string;
  status: 'live' | 'scheduled' | 'closed' | 'analysing' | 'under-review';
  responseCount: number;
  targetCount: number;
  openedDate: string;
  closesDate: string;
  daysRemaining: number;
  /** Whether this survey is gated behind a student access code. */
  hasAccessCode?: boolean;
  /** The access code itself, when `hasAccessCode` is true. */
  accessCode?: string;
}

export interface SchoolAdminReport {
  id: string;
  gradeBand: string;
  period: string;
  responseCount: number;
  targetCount: number;
  status: 'published' | 'under-review';
  isSmallSample: boolean;
  publishedDate?: string;
}

export interface SchoolAdminAlert {
  id: string;
  type: 'closing-soon' | 'low-participation' | 'report-ready' | 'subscription-renewal' | 'grace-period' | 'read-only';
  message: string;
  linkLabel: string;
  linkHref: string;
}

export interface SchoolAdminData {
  adminName: string;
  adminInitials: string;
  schoolName: string;
  todayDate: string;
  surveys: SchoolAdminSurvey[];
  latestReport: SchoolAdminReport | null;
  alerts: SchoolAdminAlert[];
  subscriptionStatus: 'active' | 'grace-period' | 'read-only';
  graceDaysRemaining?: number;
  isStandalone: boolean;
}

export const schoolAdminData: SchoolAdminData = {
  adminName: 'Sarah Nguyen',
  adminInitials: 'SN',
  schoolName: 'Hillside Middle',
  todayDate: 'Wednesday, 15 July 2026',
  subscriptionStatus: 'active',
  isStandalone: false,
  surveys: [
    {
      id: 's1',
      title: 'Fall 2025 Student Survey',
      gradeBand: '6-8',
      period: 'Fall 2025',
      status: 'live',
      responseCount: 83,
      targetCount: 130,
      openedDate: '7 July 2026',
      closesDate: '18 July 2026',
      daysRemaining: 3,
    },
    {
      id: 's2',
      title: 'Fall 2026 Student Survey',
      gradeBand: '6-8',
      period: 'Fall 2026',
      status: 'scheduled',
      responseCount: 0,
      targetCount: 130,
      openedDate: '15 September 2026',
      closesDate: '30 September 2026',
      daysRemaining: 0,
    },
    {
      id: 's3',
      title: 'Spring 2024 Student Survey',
      gradeBand: '6-8',
      period: 'Spring 2024',
      status: 'closed',
      responseCount: 54,
      targetCount: 130,
      openedDate: '10 March 2024',
      closesDate: '28 March 2024',
      daysRemaining: 0,
    },
  ],
  latestReport: {
    id: 'r1',
    gradeBand: '6-8',
    period: 'Spring 2025',
    responseCount: 27,
    targetCount: 130,
    status: 'published',
    isSmallSample: true,
    publishedDate: '28 May 2025',
  },
  alerts: [
    {
      id: 'a1',
      type: 'closing-soon',
      message: 'Fall 2025 survey closes in 3 days — 47 students haven\'t responded yet.',
      linkLabel: 'View survey',
      linkHref: '/school/surveys/s1',
    },
    {
      id: 'a2',
      type: 'low-participation',
      message: 'Participation at 64% — below the 70% target with 3 days left.',
      linkLabel: 'Share link',
      linkHref: '/school/surveys/s1/share',
    },
    {
      id: 'a3',
      type: 'report-ready',
      message: 'Spring 2025 report published — small sample, directional insights only.',
      linkLabel: 'Open report',
      linkHref: '/school/reports/r1',
    },
  ],
};

export const gracePeriodData: SchoolAdminData = {
  ...schoolAdminData,
  subscriptionStatus: 'grace-period',
  graceDaysRemaining: 22,
};

/**
 * Read-only only changes what the school may *do*, not what is happening: a live survey keeps
 * collecting and stays on the dashboard, the actions around it are what get disabled.
 */
export const readOnlyData: SchoolAdminData = {
  ...schoolAdminData,
  subscriptionStatus: 'read-only',
};

export const standaloneSchoolData: SchoolAdminData = {
  ...schoolAdminData,
  isStandalone: true,
  schoolName: 'Riverside Academy',
  adminName: 'Maria Torres',
  adminInitials: 'MT',
};

export type SurveyListStatus =
  | 'draft'
  | 'scheduled'
  | 'open'
  | 'paused'
  | 'closed'
  | 'analysing'
  | 'under-review'
  | 'published'
  | 'cancelled';

export interface SurveyListItem {
  id: string;
  gradeBand: string;
  period: string;
  instrumentVersion?: string;
  status: SurveyListStatus;
  responseCount: number | null;
  targetCount: number;
  openedDate: string | null;
  closesDate: string | null;
  openedTime: string | null;
  closesTime: string | null;
  daysRemaining: number | null;
  daysUntilStart: number | null;
  reportId: string | null;
  reportPeriod: string | null;
  isSmallSample: boolean;
  publishedDate: string | null;
}

export interface SurveysListData {
  surveys: SurveyListItem[];
  gradeBands: string[];
  periods: string[];
}

export const surveysListData: SurveysListData = {
  gradeBands: ['K-5', '6-8', '9-12'],
  periods: ['Fall 2026', 'Fall 2025', 'Spring 2025', 'Fall 2024', 'Spring 2024', 'Fall 2023'],
  surveys: [
    {
      id: 's1',
      gradeBand: '6-8',
      period: 'Fall 2025',
      instrumentVersion: 'v3 (current instrument)',
      status: 'open',
      responseCount: 83,
      targetCount: 130,
      openedDate: '7 Jul 2026',
      closesDate: '25 Jul 2026',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: 3,
      daysUntilStart: null,
      reportId: null,
      reportPeriod: null,
      isSmallSample: false,
      publishedDate: null,
    },
    {
      id: 's2',
      gradeBand: '6-8',
      period: 'Fall 2026',
      instrumentVersion: 'v3 (current instrument)',
      status: 'scheduled',
      responseCount: 0,
      targetCount: 130,
      openedDate: '15 Sep 2026',
      closesDate: '30 Sep 2026',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: 55,
      reportId: null,
      reportPeriod: null,
      isSmallSample: false,
      publishedDate: null,
    },
    {
      id: 's3',
      gradeBand: '6-8',
      period: 'Spring 2025',
      instrumentVersion: 'v2',
      status: 'published',
      responseCount: 27,
      targetCount: 130,
      openedDate: '10 Apr 2025',
      closesDate: '24 May 2025',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: 'r1',
      reportPeriod: 'Spring 2025',
      isSmallSample: true,
      publishedDate: '28 May 2025',
    },
    {
      id: 's4',
      gradeBand: '9-12',
      period: 'Fall 2026',
      instrumentVersion: 'v4 (current instrument)',
      status: 'draft',
      responseCount: null,
      targetCount: 200,
      openedDate: null,
      closesDate: null,
      openedTime: null,
      closesTime: null,
      daysRemaining: null,
      daysUntilStart: null,
      reportId: null,
      reportPeriod: null,
      isSmallSample: false,
      publishedDate: null,
    },
    {
      id: 's5',
      gradeBand: '6-8',
      period: 'Spring 2024',
      instrumentVersion: 'v2',
      status: 'paused',
      responseCount: 54,
      targetCount: 130,
      openedDate: '10 Mar 2024',
      closesDate: '28 Mar 2024',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: null,
      reportPeriod: null,
      isSmallSample: false,
      publishedDate: null,
    },
    {
      id: 's6',
      gradeBand: '6-8',
      period: 'Fall 2023',
      instrumentVersion: 'v1',
      status: 'cancelled',
      responseCount: null,
      targetCount: 130,
      openedDate: null,
      closesDate: null,
      openedTime: null,
      closesTime: null,
      daysRemaining: null,
      daysUntilStart: null,
      reportId: null,
      reportPeriod: null,
      isSmallSample: false,
      publishedDate: null,
    },
    {
      id: 's7',
      gradeBand: 'K-5',
      period: 'Fall 2025',
      instrumentVersion: 'v2 (current instrument)',
      status: 'under-review',
      responseCount: 92,
      targetCount: 180,
      openedDate: '7 Jul 2026',
      closesDate: '18 Jul 2026',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: null,
      reportPeriod: null,
      isSmallSample: false,
      publishedDate: null,
    },
    {
      id: 's8',
      gradeBand: 'K-5',
      period: 'Spring 2025',
      instrumentVersion: 'v2',
      status: 'published',
      responseCount: 155,
      targetCount: 180,
      openedDate: '10 Apr 2025',
      closesDate: '24 May 2025',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: 'r3',
      reportPeriod: 'Spring 2025',
      isSmallSample: false,
      publishedDate: '28 May 2025',
    },
    {
      id: 's9',
      gradeBand: '9-12',
      period: 'Spring 2025',
      instrumentVersion: 'v4',
      status: 'published',
      responseCount: 210,
      targetCount: 240,
      openedDate: '10 Apr 2025',
      closesDate: '24 May 2025',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: 'r4',
      reportPeriod: 'Spring 2025',
      isSmallSample: false,
      publishedDate: '28 May 2025',
    },
    {
      id: 's10',
      gradeBand: 'K-5',
      period: 'Fall 2024',
      instrumentVersion: 'v2',
      status: 'published',
      responseCount: 142,
      targetCount: 180,
      openedDate: '12 Sep 2024',
      closesDate: '26 Sep 2024',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: 'r5',
      reportPeriod: 'Fall 2024',
      isSmallSample: false,
      publishedDate: '30 Sep 2024',
    },
    {
      id: 's11',
      gradeBand: '9-12',
      period: 'Fall 2024',
      instrumentVersion: 'v3',
      status: 'cancelled',
      responseCount: null,
      targetCount: 240,
      openedDate: '12 Sep 2024',
      closesDate: '26 Sep 2024',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: null,
      reportPeriod: null,
      isSmallSample: false,
      publishedDate: null,
    },
    {
      id: 's12',
      gradeBand: '6-8',
      period: 'Spring 2024',
      instrumentVersion: 'v1',
      status: 'published',
      responseCount: 21,
      targetCount: 130,
      openedDate: '10 Mar 2024',
      closesDate: '28 Mar 2024',
      openedTime: '08:00',
      closesTime: '16:00',
      daysRemaining: null,
      daysUntilStart: null,
      reportId: 'r6',
      reportPeriod: 'Spring 2024',
      isSmallSample: true,
      publishedDate: '2 Apr 2024',
    },
  ],
};

export interface SurveyDetailData {
  id: string;
  gradeBand: string;
  period: string;
  instrumentVersion: string;
  status: SurveyListStatus;
  responseCount: number;
  targetCount: number;
  openedDate: string;
  closesDate: string;
  openedTime: string;
  closesTime: string;
  daysRemaining: number;
  hasAccessCode: boolean;
  accessCode: string;
  remindersEnabled: boolean;
  gradeBreakdown: { grade: string; count: number }[];
  trendData: { date: string; cumulative: number }[];
  cancelledBy?: string;
  cancelledAt?: string;
  cancelledReason?: string;
}

export const surveyDetailData: Record<string, SurveyDetailData> = {
  's1': {
    id: 's1',
    gradeBand: '6-8',
    period: 'Fall 2025',
    instrumentVersion: 'v3 (current instrument)',
    status: 'open',
    responseCount: 83,
    targetCount: 130,
    openedDate: '7 Jul 2026',
    closesDate: '18 Jul 2026',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 3,
    hasAccessCode: true,
    accessCode: 'LUNCH7',
    remindersEnabled: true,
    gradeBreakdown: [
      { grade: 'Grade 6', count: 30 },
      { grade: 'Grade 7', count: 28 },
      { grade: 'Grade 8', count: 25 },
    ],
    trendData: [
      { date: '7 Jul', cumulative: 14 },
      { date: '8 Jul', cumulative: 22 },
      { date: '9 Jul', cumulative: 31 },
      { date: '10 Jul', cumulative: 42 },
      { date: '11 Jul', cumulative: 50 },
      { date: '12 Jul', cumulative: 57 },
      { date: '13 Jul', cumulative: 63 },
      { date: '14 Jul', cumulative: 70 },
      { date: '15 Jul', cumulative: 78 },
      { date: '16 Jul', cumulative: 83 },
    ],
  },
  's2': {
    id: 's2',
    gradeBand: '6-8',
    period: 'Fall 2026',
    instrumentVersion: 'v3 (current instrument)',
    status: 'scheduled',
    responseCount: 0,
    targetCount: 130,
    openedDate: '15 Sep 2026',
    closesDate: '30 Sep 2026',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: true,
    accessCode: 'LUNCH7',
    remindersEnabled: true,
    gradeBreakdown: [],
    trendData: [],
  },
  's3': {
    id: 's3',
    gradeBand: '6-8',
    period: 'Spring 2025',
    instrumentVersion: 'v2',
    status: 'published',
    responseCount: 27,
    targetCount: 130,
    openedDate: '10 Apr 2025',
    closesDate: '24 May 2025',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: false,
    gradeBreakdown: [
      { grade: 'Grade 6', count: 10 },
      { grade: 'Grade 7', count: 9 },
      { grade: 'Grade 8', count: 8 },
    ],
    trendData: [
      { date: '10 Apr', cumulative: 3 },
      { date: '12 Apr', cumulative: 7 },
      { date: '15 Apr', cumulative: 12 },
      { date: '20 Apr', cumulative: 18 },
      { date: '1 May', cumulative: 22 },
      { date: '15 May', cumulative: 25 },
      { date: '24 May', cumulative: 27 },
    ],
  },
  's4': {
    id: 's4',
    gradeBand: '9-12',
    period: 'Fall 2026',
    instrumentVersion: 'v4 (current instrument)',
    status: 'draft',
    responseCount: 0,
    targetCount: 130,
    openedDate: '',
    closesDate: '',
    openedTime: '',
    closesTime: '',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: false,
    gradeBreakdown: [],
    trendData: [],
  },
  's5': {
    id: 's5',
    gradeBand: '6-8',
    period: 'Spring 2024',
    instrumentVersion: 'v2',
    status: 'paused',
    responseCount: 54,
    targetCount: 130,
    openedDate: '10 Mar 2024',
    closesDate: '28 Mar 2024',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: true,
    accessCode: 'LUNCH4',
    remindersEnabled: true,
    gradeBreakdown: [
      { grade: 'Grade 6', count: 22 },
      { grade: 'Grade 7', count: 18 },
      { grade: 'Grade 8', count: 14 },
    ],
    trendData: [
      { date: '10 Mar', cumulative: 8 },
      { date: '11 Mar', cumulative: 15 },
      { date: '12 Mar', cumulative: 23 },
      { date: '13 Mar', cumulative: 32 },
      { date: '14 Mar', cumulative: 40 },
      { date: '15 Mar', cumulative: 47 },
      { date: '16 Mar', cumulative: 54 },
    ],
  },
  's6': {
    id: 's6',
    gradeBand: '6-8',
    period: 'Fall 2023',
    instrumentVersion: 'v1',
    status: 'cancelled',
    responseCount: 0,
    targetCount: 130,
    openedDate: '',
    closesDate: '',
    openedTime: '',
    closesTime: '',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: false,
    gradeBreakdown: [],
    trendData: [],
    cancelledBy: 'Sarah Nguyen',
    cancelledAt: '15 Oct 2023 at 14:30',
    cancelledReason: 'Survey was created in error — wrong instrument version for this period.',
  },
  's7': {
    id: 's7',
    gradeBand: 'K-5',
    period: 'Fall 2025',
    instrumentVersion: 'v2 (current instrument)',
    status: 'under-review',
    responseCount: 92,
    targetCount: 180,
    openedDate: '7 Jul 2026',
    closesDate: '18 Jul 2026',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: true,
    accessCode: 'LUNCH5',
    remindersEnabled: true,
    gradeBreakdown: [
      { grade: 'Kindergarten', count: 10 },
      { grade: 'Grade 1', count: 16 },
      { grade: 'Grade 2', count: 18 },
      { grade: 'Grade 3', count: 20 },
      { grade: 'Grade 4', count: 15 },
      { grade: 'Grade 5', count: 13 },
    ],
    trendData: [
      { date: '7 Jul', cumulative: 12 },
      { date: '8 Jul', cumulative: 22 },
      { date: '9 Jul', cumulative: 34 },
      { date: '10 Jul', cumulative: 46 },
      { date: '11 Jul', cumulative: 55 },
      { date: '12 Jul', cumulative: 63 },
      { date: '13 Jul', cumulative: 70 },
      { date: '14 Jul', cumulative: 78 },
      { date: '15 Jul', cumulative: 86 },
      { date: '16 Jul', cumulative: 92 },
    ],
  },
  's8': {
    id: 's8',
    gradeBand: 'K-5',
    period: 'Spring 2025',
    instrumentVersion: 'v2',
    status: 'published',
    responseCount: 155,
    targetCount: 180,
    openedDate: '10 Apr 2025',
    closesDate: '24 May 2025',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: true,
    gradeBreakdown: [
      { grade: 'Kindergarten', count: 20 },
      { grade: 'Grade 1', count: 28 },
      { grade: 'Grade 2', count: 30 },
      { grade: 'Grade 3', count: 32 },
      { grade: 'Grade 4', count: 25 },
      { grade: 'Grade 5', count: 20 },
    ],
    trendData: [
      { date: '10 Apr', cumulative: 15 },
      { date: '12 Apr', cumulative: 32 },
      { date: '15 Apr', cumulative: 52 },
      { date: '20 Apr', cumulative: 76 },
      { date: '25 Apr', cumulative: 95 },
      { date: '1 May', cumulative: 112 },
      { date: '10 May', cumulative: 130 },
      { date: '18 May', cumulative: 145 },
      { date: '24 May', cumulative: 155 },
    ],
  },
  's9': {
    id: 's9',
    gradeBand: '9-12',
    period: 'Spring 2025',
    instrumentVersion: 'v4',
    status: 'published',
    responseCount: 210,
    targetCount: 240,
    openedDate: '10 Apr 2025',
    closesDate: '24 May 2025',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: true,
    gradeBreakdown: [
      { grade: 'Grade 9', count: 58 },
      { grade: 'Grade 10', count: 54 },
      { grade: 'Grade 11', count: 51 },
      { grade: 'Grade 12', count: 47 },
    ],
    trendData: [
      { date: '10 Apr', cumulative: 24 },
      { date: '20 Apr', cumulative: 96 },
      { date: '1 May', cumulative: 148 },
      { date: '12 May', cumulative: 186 },
      { date: '24 May', cumulative: 210 },
    ],
  },
  's10': {
    id: 's10',
    gradeBand: 'K-5',
    period: 'Fall 2024',
    instrumentVersion: 'v2',
    status: 'published',
    responseCount: 142,
    targetCount: 180,
    openedDate: '12 Sep 2024',
    closesDate: '26 Sep 2024',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: true,
    gradeBreakdown: [
      { grade: 'Kindergarten', count: 18 },
      { grade: 'Grade 1', count: 25 },
      { grade: 'Grade 2', count: 27 },
      { grade: 'Grade 3', count: 29 },
      { grade: 'Grade 4', count: 24 },
      { grade: 'Grade 5', count: 19 },
    ],
    trendData: [
      { date: '12 Sep', cumulative: 20 },
      { date: '16 Sep', cumulative: 62 },
      { date: '20 Sep', cumulative: 104 },
      { date: '26 Sep', cumulative: 142 },
    ],
  },
  's11': {
    id: 's11',
    gradeBand: '9-12',
    period: 'Fall 2024',
    instrumentVersion: 'v3',
    status: 'cancelled',
    responseCount: 0,
    targetCount: 240,
    openedDate: '12 Sep 2024',
    closesDate: '26 Sep 2024',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: false,
    gradeBreakdown: [],
    trendData: [],
    cancelledBy: 'Sarah Nguyen',
    cancelledAt: '14 Sep 2024 at 11:20',
    cancelledReason: 'Timetable clash with the district assessment week meant most classes could not take part.',
  },
  's12': {
    id: 's12',
    gradeBand: '6-8',
    period: 'Spring 2024',
    instrumentVersion: 'v1',
    status: 'published',
    responseCount: 21,
    targetCount: 130,
    openedDate: '10 Mar 2024',
    closesDate: '28 Mar 2024',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: true,
    gradeBreakdown: [
      { grade: 'Grade 6', count: 8 },
      { grade: 'Grade 7', count: 7 },
      { grade: 'Grade 8', count: 6 },
    ],
    trendData: [
      { date: '10 Mar', cumulative: 4 },
      { date: '18 Mar', cumulative: 13 },
      { date: '28 Mar', cumulative: 21 },
    ],
  },
};

export type ReportStatus = 'published' | 'under-review' | 'analysing' | 'superseded';

export interface ReportListItem {
  id: string;
  gradeBand: string;
  period: string;
  status: ReportStatus;
  responseCount: number | null;
  targetCount: number;
  publishedDate: string | null;
  version: string;
  isSmallSample: boolean;
  isLimitedDetail: boolean;
  hasVersionHistory: boolean;
  supersededByVersion: string | null;
}

export const reportsListData: ReportListItem[] = [
  {
    id: 'r1',
    gradeBand: '6-8',
    period: 'Fall 2024',
    status: 'published',
    responseCount: 118,
    targetCount: 130,
    publishedDate: '3 Dec 2024',
    version: 'v1',
    isSmallSample: false,
    isLimitedDetail: false,
    hasVersionHistory: false,
    supersededByVersion: null,
  },
  {
    id: 'r2',
    gradeBand: '6-8',
    period: 'Spring 2025',
    status: 'published',
    responseCount: 27,
    targetCount: 130,
    publishedDate: '28 May 2025',
    version: 'v1',
    isSmallSample: true,
    isLimitedDetail: false,
    hasVersionHistory: false,
    supersededByVersion: null,
  },
  {
    id: 'r3',
    gradeBand: '6-8',
    period: 'Fall 2025',
    status: 'analysing',
    responseCount: null,
    targetCount: 130,
    publishedDate: null,
    version: '—',
    isSmallSample: false,
    isLimitedDetail: false,
    hasVersionHistory: false,
    supersededByVersion: null,
  },
  {
    id: 'r4',
    gradeBand: '6-8',
    period: 'Fall 2023',
    status: 'under-review',
    responseCount: null,
    targetCount: 130,
    publishedDate: null,
    version: '—',
    isSmallSample: false,
    isLimitedDetail: false,
    hasVersionHistory: false,
    supersededByVersion: null,
  },
  {
    id: 'r5',
    gradeBand: '6-8',
    period: 'Spring 2024',
    status: 'superseded',
    responseCount: 45,
    targetCount: 130,
    publishedDate: '5 Apr 2024',
    version: 'v1',
    isSmallSample: false,
    isLimitedDetail: false,
    hasVersionHistory: true,
    supersededByVersion: 'v2',
  },
];

export const reportsGradeBands = ['K-5', '6-8', '9-12'];
export const reportsPeriods = ['Fall 2025', 'Spring 2025', 'Fall 2024', 'Spring 2024', 'Fall 2023'];

export interface ConceptScore {
  concept: string;
  score: number;
  yesPct: number;
  sometimesPct: number;
  noPct: number;
  band: 'positive' | 'mid' | 'negative';
}

export interface ReportInsightData {
  executiveSummary: string;
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
}

export interface MenuItemMention {
  name: string;
  mentions: number;
}

export interface CommentThemeEntry {
  theme: string;
  prevalence: number;
  examples: string[];
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
  themes: CommentThemeEntry[];
}

export interface GradeParticipation {
  grade: string;
  count: number;
  share: number;
}

export type ReportDetailStatus = 'published' | 'superseded' | 'analysing' | 'under-review';

export interface ReportDetailData {
  id: string;
  gradeBand: string;
  period: string;
  status: ReportDetailStatus;
  publishedDate: string;
  version: string;
  responseCount: number;
  targetCount: number;
  responseRate: number;
  isSmallSample: boolean;
  isLimitedDetail: boolean;
  supersededByVersion: string | null;
  hasVersionHistory: boolean;
  overallSatisfaction: number;
  concepts: ConceptScore[];
  insights: ReportInsightData | null;
  topFavourites: MenuItemMention[];
  topLeastFavourites: MenuItemMention[];
  sentiment: SentimentBreakdown | null;
  gradeBreakdown: GradeParticipation[];
}

export const reportDetailData: Record<string, ReportDetailData> = {
  'r1': {
    id: 'r1',
    gradeBand: '6-8',
    period: 'Fall 2024',
    status: 'published',
    publishedDate: '3 Dec 2024',
    version: 'v1',
    responseCount: 118,
    targetCount: 130,
    responseRate: 91,
    isSmallSample: false,
    isLimitedDetail: false,
    supersededByVersion: null,
    hasVersionHistory: false,
    overallSatisfaction: 63,
    concepts: [
      { concept: 'Taste', score: 72, yesPct: 56, sometimesPct: 32, noPct: 12, band: 'positive' },
      { concept: 'Freshness', score: 65, yesPct: 48, sometimesPct: 34, noPct: 18, band: 'positive' },
      { concept: 'Variety', score: 48, yesPct: 30, sometimesPct: 36, noPct: 34, band: 'mid' },
      { concept: 'Staff', score: 78, yesPct: 64, sometimesPct: 28, noPct: 8, band: 'positive' },
      { concept: 'Cleanliness', score: 71, yesPct: 54, sometimesPct: 34, noPct: 12, band: 'positive' },
      { concept: 'Time to eat', score: 42, yesPct: 22, sometimesPct: 40, noPct: 38, band: 'negative' },
    ],
    insights: {
      executiveSummary: 'Students at Hillside Middle feel positively about cafeteria staff and the taste of food served this fall. Cleanliness also rates well. The main areas for attention are time to eat — where nearly two in five students say they don\'t have enough time — and variety, where a third of students would like to see more options. Overall satisfaction is moderate, with clear strengths to build on and a couple of focused improvement areas.',
      strengths: [
        'Cafeteria staff are rated highest across all six areas — students consistently describe them as friendly and helpful.',
        'Taste scores well, with over half of students answering "Yes" to taste-related questions.',
        'Cleanliness meets expectations for most students, with few reporting concerns.',
      ],
      opportunities: [
        'Time to eat is the lowest-scoring concept — 38% of students say they don\'t have enough time to finish their meal.',
        'Variety is a mid-range score with room for improvement — a third of students want more diverse menu options.',
        'Freshness is borderline — while most students are satisfied, there is a notable group who feel food could be fresher.',
      ],
      recommendations: [
        'Consider reviewing the lunch period schedule or layout to give students more seated eating time.',
        'Survey the student body on specific menu items they\'d like added — use the top-item data as a starting point.',
        'Track freshness perceptions alongside any supply-chain or preparation changes in the next survey cycle.',
      ],
    },
    topFavourites: [
      { name: 'Pizza', mentions: 42 },
      { name: 'Chicken tenders', mentions: 35 },
      { name: 'Tacos', mentions: 28 },
      { name: 'Mac & cheese', mentions: 22 },
      { name: 'Burgers', mentions: 18 },
      { name: 'Pasta', mentions: 15 },
      { name: 'Grilled cheese', mentions: 12 },
    ],
    topLeastFavourites: [
      { name: 'Vegetable stir-fry', mentions: 31 },
      { name: 'Fish fillet', mentions: 26 },
      { name: 'Meatloaf', mentions: 22 },
      { name: 'Broccoli casserole', mentions: 18 },
      { name: 'Tuna salad', mentions: 14 },
    ],
    sentiment: {
      positive: 52,
      neutral: 30,
      negative: 18,
      themes: [
        {
          theme: 'Food quality',
          prevalence: 38,
          examples: [
            'Pizza day is the best — always fresh and hot.',
            'Sometimes the vegetables look a bit sad, but most days it\'s good.',
            'The chicken tenders are actually really good, better than last year.',
          ],
        },
        {
          theme: 'Portion sizes',
          prevalence: 22,
          examples: [
            'I wish the portions were a bit bigger — I\'m still hungry after lunch.',
            'The main dish portions are fine but the sides are really small.',
          ],
        },
        {
          theme: 'Time pressure',
          prevalence: 28,
          examples: [
            'By the time I get through the line I only have 10 minutes to eat.',
            'If you\'re near the back of the line you barely have time to finish.',
          ],
        },
        {
          theme: 'Menu variety',
          prevalence: 25,
          examples: [
            'We get the same things every week — it gets boring.',
            'More international food options would be really cool.',
          ],
        },
        {
          theme: 'Staff friendliness',
          prevalence: 18,
          examples: [
            'The lunch staff are always smiling and say hi.',
            'Mrs. Rivera knows everyone\'s name — she\'s the best.',
          ],
        },
        {
          theme: 'Cleanliness',
          prevalence: 12,
          examples: [
            'Tables are usually clean when I sit down.',
            'The salad bar area is always really neat.',
          ],
        },
      ],
    },
    gradeBreakdown: [
      { grade: 'Grade 6', count: 40, share: 34 },
      { grade: 'Grade 7', count: 42, share: 36 },
      { grade: 'Grade 8', count: 36, share: 30 },
    ],
  },
  'r2': {
    id: 'r2',
    gradeBand: '6-8',
    period: 'Spring 2025',
    status: 'published',
    publishedDate: '28 May 2025',
    version: 'v1',
    responseCount: 27,
    targetCount: 130,
    responseRate: 21,
    isSmallSample: true,
    isLimitedDetail: false,
    supersededByVersion: null,
    hasVersionHistory: false,
    overallSatisfaction: 58,
    concepts: [
      { concept: 'Taste', score: 68, yesPct: 52, sometimesPct: 32, noPct: 16, band: 'positive' },
      { concept: 'Freshness', score: 60, yesPct: 44, sometimesPct: 32, noPct: 24, band: 'mid' },
      { concept: 'Variety', score: 44, yesPct: 28, sometimesPct: 32, noPct: 40, band: 'mid' },
      { concept: 'Staff', score: 74, yesPct: 60, sometimesPct: 28, noPct: 12, band: 'positive' },
      { concept: 'Cleanliness', score: 66, yesPct: 48, sometimesPct: 36, noPct: 16, band: 'positive' },
      { concept: 'Time to eat', score: 38, yesPct: 18, sometimesPct: 40, noPct: 42, band: 'negative' },
    ],
    insights: {
      executiveSummary: 'With only 27 responses, these results should be treated as directional rather than definitive. The pattern broadly mirrors the Fall 2024 survey — staff and taste rate well, time to eat is the clearest concern — but the small sample means individual scores may not accurately reflect the full student body.',
      strengths: [
        'Staff continue to be rated positively by the students who responded.',
        'Taste scores align with previous patterns, suggesting consistency.',
      ],
      opportunities: [
        'Time to eat remains a concern — but with only 27 responses, the severity is uncertain.',
        'Variety and freshness show similar patterns to Fall 2024 but can\'t be confirmed with this sample size.',
      ],
      recommendations: [
        'Treat these results as indicative — confirm with the next full survey cycle before making major changes.',
        'Consider why participation dropped to 21% and address for the next survey (timing, communication, incentives).',
        'Focus improvement efforts on the areas that were also flagged in the Fall 2024 report with stronger data.',
      ],
    },
    topFavourites: [
      { name: 'Pizza', mentions: 11 },
      { name: 'Chicken tenders', mentions: 8 },
      { name: 'Tacos', mentions: 6 },
    ],
    topLeastFavourites: [
      { name: 'Vegetable stir-fry', mentions: 9 },
      { name: 'Fish fillet', mentions: 7 },
      { name: 'Meatloaf', mentions: 5 },
    ],
    sentiment: {
      positive: 46,
      neutral: 34,
      negative: 20,
      // Too few written comments in this small sample to extract themes — drives the empty state.
      themes: [],
    },
    gradeBreakdown: [
      { grade: 'Grade 6', count: 10, share: 37 },
      { grade: 'Grade 7', count: 9, share: 33 },
      { grade: 'Grade 8', count: 8, share: 30 },
    ],
  },
  'r5': {
    id: 'r5',
    gradeBand: '6-8',
    period: 'Spring 2024',
    status: 'superseded',
    publishedDate: '5 Apr 2024',
    version: 'v1',
    responseCount: 45,
    targetCount: 130,
    responseRate: 35,
    isSmallSample: false,
    isLimitedDetail: false,
    supersededByVersion: 'v2',
    hasVersionHistory: true,
    overallSatisfaction: 55,
    concepts: [
      { concept: 'Taste', score: 60, yesPct: 42, sometimesPct: 36, noPct: 22, band: 'mid' },
      { concept: 'Freshness', score: 52, yesPct: 36, sometimesPct: 32, noPct: 32, band: 'mid' },
      { concept: 'Variety', score: 40, yesPct: 24, sometimesPct: 32, noPct: 44, band: 'negative' },
      { concept: 'Staff', score: 70, yesPct: 56, sometimesPct: 28, noPct: 16, band: 'positive' },
      { concept: 'Cleanliness', score: 58, yesPct: 40, sometimesPct: 36, noPct: 24, band: 'mid' },
      { concept: 'Time to eat', score: 46, yesPct: 26, sometimesPct: 40, noPct: 34, band: 'mid' },
    ],
    insights: {
      executiveSummary: 'The Spring 2024 survey showed moderate satisfaction across most areas, with staff friendliness standing out as a strength. Variety was the lowest-scoring concept. A newer version of this report (v2) is available — this v1 has been superseded.',
      strengths: ['Staff remain the highest-rated concept.', 'Taste and freshness are in the moderate range, with room to improve.'],
      opportunities: ['Variety scored lowest — nearly half of students said no to variety-related questions.', 'Time to eat was a mid-range concern.'],
      recommendations: ['This report has been superseded by v2 — refer to the current version for the most accurate analysis.'],
    },
    topFavourites: [
      { name: 'Pizza', mentions: 18 },
      { name: 'Chicken tenders', mentions: 14 },
      { name: 'Tacos', mentions: 10 },
    ],
    topLeastFavourites: [
      { name: 'Vegetable stir-fry', mentions: 15 },
      { name: 'Fish fillet', mentions: 11 },
      { name: 'Meatloaf', mentions: 8 },
    ],
    sentiment: {
      positive: 42,
      neutral: 36,
      negative: 22,
      themes: [
        { theme: 'Food quality', prevalence: 34, examples: ['Pizza day is everyone\'s favourite.', 'Some meals feel a bit repetitive.'] },
        { theme: 'Time pressure', prevalence: 26, examples: ['Lunch period feels too short most days.'] },
        { theme: 'Menu variety', prevalence: 30, examples: ['Would love to see more options on the menu.'] },
      ],
    },
    gradeBreakdown: [
      { grade: 'Grade 6', count: 18, share: 40 },
      { grade: 'Grade 7', count: 15, share: 33 },
      { grade: 'Grade 8', count: 12, share: 27 },
    ],
  },
  'r3': {
    id: 'r3',
    gradeBand: '6-8',
    period: 'Fall 2025',
    status: 'analysing',
    publishedDate: '',
    version: '—',
    responseCount: 0,
    targetCount: 130,
    responseRate: 0,
    isSmallSample: false,
    isLimitedDetail: false,
    supersededByVersion: null,
    hasVersionHistory: false,
    overallSatisfaction: 0,
    concepts: [],
    insights: null,
    topFavourites: [],
    topLeastFavourites: [],
    sentiment: null,
    gradeBreakdown: [],
  },
  'r4': {
    id: 'r4',
    gradeBand: '6-8',
    period: 'Fall 2023',
    status: 'under-review',
    publishedDate: '',
    version: '—',
    responseCount: 0,
    targetCount: 130,
    responseRate: 0,
    isSmallSample: false,
    isLimitedDetail: false,
    supersededByVersion: null,
    hasVersionHistory: false,
    overallSatisfaction: 0,
    concepts: [],
    insights: null,
    topFavourites: [],
    topLeastFavourites: [],
    sentiment: null,
    gradeBreakdown: [],
  },
  'suppressed': {
    id: 'suppressed',
    gradeBand: '6-8',
    period: 'Summer 2025',
    status: 'published',
    publishedDate: '5 Aug 2025',
    version: 'v1',
    responseCount: 7,
    targetCount: 130,
    responseRate: 5,
    isSmallSample: true,
    isLimitedDetail: true,
    supersededByVersion: null,
    hasVersionHistory: false,
    overallSatisfaction: 0,
    concepts: [],
    insights: null,
    topFavourites: [],
    topLeastFavourites: [],
    sentiment: null,
    gradeBreakdown: [
      { grade: 'Grade 6', count: 3, share: 43 },
      { grade: 'Grade 7', count: 2, share: 29 },
      { grade: 'Grade 8', count: 2, share: 28 },
    ],
  },
};

export interface YoYCompletedPeriod {
  value: string;
  label: string;
  reportId: string;
  instrumentVersion: string;
  methodologyVersion: string;
  responseCount: number;
  targetCount: number;
}

export interface YoYPeriodDetail {
  period: string;
  reportId: string;
  instrumentVersion: string;
  methodologyVersion: string;
  responseCount: number;
  targetCount: number;
  responseRate: number;
  overallScore: number;
  sentimentPositive: number;
  isSmallSample: boolean;
  concepts: { concept: string; score: number }[];
}

export interface YoYComparisonData {
  gradeBand: string;
  periodA: YoYPeriodDetail;
  periodB: YoYPeriodDetail;
  comparable: boolean;
}

export const yoyCompletedPeriods: Record<string, YoYCompletedPeriod[]> = {
  'K-5': [
    { value: 'fall2023', label: 'Fall 2023', reportId: 'r-k5-f23', instrumentVersion: 'v1', methodologyVersion: 'v1', responseCount: 142, targetCount: 180 },
    { value: 'spring2024', label: 'Spring 2024', reportId: 'r-k5-s24', instrumentVersion: 'v1', methodologyVersion: 'v1', responseCount: 155, targetCount: 180 },
    { value: 'fall2024', label: 'Fall 2024', reportId: 'r-k5-f24', instrumentVersion: 'v1', methodologyVersion: 'v2', responseCount: 168, targetCount: 180 },
    { value: 'spring2025', label: 'Spring 2025', reportId: 'r-k5-s25', instrumentVersion: 'v2', methodologyVersion: 'v2', responseCount: 155, targetCount: 180 },
  ],
  '6-8': [
    { value: 'fall2023', label: 'Fall 2023', reportId: 'r-68-f23', instrumentVersion: 'v1', methodologyVersion: 'v1', responseCount: 85, targetCount: 130 },
    { value: 'spring2024', label: 'Spring 2024', reportId: 'r-68-s24', instrumentVersion: 'v1', methodologyVersion: 'v1', responseCount: 45, targetCount: 130 },
    { value: 'fall2024', label: 'Fall 2024', reportId: 'r1', instrumentVersion: 'v2', methodologyVersion: 'v2', responseCount: 118, targetCount: 130 },
    { value: 'spring2025', label: 'Spring 2025', reportId: 'r2', instrumentVersion: 'v2', methodologyVersion: 'v2', responseCount: 27, targetCount: 130 },
  ],
  '9-12': [
    { value: 'fall2023', label: 'Fall 2023', reportId: 'r-912-f23', instrumentVersion: 'v1', methodologyVersion: 'v1', responseCount: 92, targetCount: 200 },
    { value: 'spring2024', label: 'Spring 2024', reportId: 'r-912-s24', instrumentVersion: 'v1', methodologyVersion: 'v1', responseCount: 78, targetCount: 200 },
    { value: 'fall2024', label: 'Fall 2024', reportId: 'r-912-f24', instrumentVersion: 'v2', methodologyVersion: 'v2', responseCount: 104, targetCount: 200 },
    { value: 'spring2025', label: 'Spring 2025', reportId: 'r-912-s25', instrumentVersion: 'v2', methodologyVersion: 'v2', responseCount: 88, targetCount: 200 },
  ],
};

function makePeriodDetail(
  period: string,
  reportId: string,
  instrumentVersion: string,
  methodologyVersion: string,
  responseCount: number,
  targetCount: number,
  overallScore: number,
  sentimentPositive: number,
  conceptScores: number[],
): YoYPeriodDetail {
  const conceptNames = ['Taste', 'Freshness', 'Variety', 'Staff', 'Cleanliness', 'Time to eat'];
  return {
    period,
    reportId,
    instrumentVersion,
    methodologyVersion,
    responseCount,
    targetCount,
    responseRate: Math.round((responseCount / targetCount) * 100),
    overallScore,
    sentimentPositive,
    isSmallSample: responseCount < 30,
    concepts: conceptNames.map((concept, i) => ({ concept, score: conceptScores[i] })),
  };
}

export const yoyPeriodDetails: Record<string, YoYPeriodDetail> = {
  'K-5-fall2023': makePeriodDetail('Fall 2023', 'r-k5-f23', 'v1', 'v1', 142, 180, 58, 46, [64, 60, 52, 70, 62, 42]),
  'K-5-spring2024': makePeriodDetail('Spring 2024', 'r-k5-s24', 'v1', 'v1', 155, 180, 62, 50, [68, 63, 55, 73, 66, 45]),
  'K-5-fall2024': makePeriodDetail('Fall 2024', 'r-k5-f24', 'v1', 'v2', 168, 180, 65, 54, [70, 65, 58, 75, 68, 48]),
  'K-5-spring2025': makePeriodDetail('Spring 2025', 'r-k5-s25', 'v2', 'v2', 155, 180, 67, 56, [72, 68, 60, 77, 70, 50]),
  '6-8-fall2023': makePeriodDetail('Fall 2023', 'r-68-f23', 'v1', 'v1', 85, 130, 55, 42, [60, 52, 40, 70, 58, 46]),
  '6-8-spring2024': makePeriodDetail('Spring 2024', 'r-68-s24', 'v1', 'v1', 45, 130, 52, 38, [58, 48, 40, 68, 55, 44]),
  '6-8-fall2024': makePeriodDetail('Fall 2024', 'r1', 'v2', 'v2', 118, 130, 63, 52, [72, 65, 48, 78, 71, 42]),
  '6-8-spring2025': makePeriodDetail('Spring 2025', 'r2', 'v2', 'v2', 27, 130, 58, 46, [68, 60, 44, 74, 66, 38]),
  '9-12-fall2023': makePeriodDetail('Fall 2023', 'r-912-f23', 'v1', 'v1', 92, 200, 52, 40, [58, 50, 38, 68, 55, 44]),
  '9-12-spring2024': makePeriodDetail('Spring 2024', 'r-912-s24', 'v1', 'v1', 78, 200, 54, 42, [60, 52, 40, 70, 56, 46]),
  '9-12-fall2024': makePeriodDetail('Fall 2024', 'r-912-f24', 'v2', 'v2', 104, 200, 59, 48, [64, 56, 44, 74, 60, 50]),
  '9-12-spring2025': makePeriodDetail('Spring 2025', 'r-912-s25', 'v2', 'v2', 88, 200, 61, 50, [66, 58, 46, 76, 62, 52]),
};

export interface YoYTrendPoint {
  period: string;
  label: string;
  participationRate: number;
  sentimentPositive: number;
  responseCount: number;
  targetCount: number;
  overallScore: number;
}

export const yoyTrendData: Record<string, YoYTrendPoint[]> = {
  'K-5': [
    { period: 'Fall 2023', label: 'Fall 2023', participationRate: 79, sentimentPositive: 46, responseCount: 142, targetCount: 180, overallScore: 58 },
    { period: 'Spring 2024', label: 'Spring 2024', participationRate: 86, sentimentPositive: 50, responseCount: 155, targetCount: 180, overallScore: 62 },
    { period: 'Fall 2024', label: 'Fall 2024', participationRate: 93, sentimentPositive: 54, responseCount: 168, targetCount: 180, overallScore: 65 },
    { period: 'Spring 2025', label: 'Spring 2025', participationRate: 86, sentimentPositive: 56, responseCount: 155, targetCount: 180, overallScore: 67 },
  ],
  '6-8': [
    { period: 'Fall 2023', label: 'Fall 2023', participationRate: 65, sentimentPositive: 42, responseCount: 85, targetCount: 130, overallScore: 55 },
    { period: 'Spring 2024', label: 'Spring 2024', participationRate: 35, sentimentPositive: 38, responseCount: 45, targetCount: 130, overallScore: 52 },
    { period: 'Fall 2024', label: 'Fall 2024', participationRate: 91, sentimentPositive: 52, responseCount: 118, targetCount: 130, overallScore: 63 },
    { period: 'Spring 2025', label: 'Spring 2025', participationRate: 21, sentimentPositive: 46, responseCount: 27, targetCount: 130, overallScore: 58 },
  ],
  '9-12': [
    { period: 'Fall 2023', label: 'Fall 2023', participationRate: 46, sentimentPositive: 40, responseCount: 92, targetCount: 200, overallScore: 52 },
    { period: 'Spring 2024', label: 'Spring 2024', participationRate: 39, sentimentPositive: 42, responseCount: 78, targetCount: 200, overallScore: 54 },
    { period: 'Fall 2024', label: 'Fall 2024', participationRate: 52, sentimentPositive: 48, responseCount: 104, targetCount: 200, overallScore: 59 },
    { period: 'Spring 2025', label: 'Spring 2025', participationRate: 44, sentimentPositive: 50, responseCount: 88, targetCount: 200, overallScore: 61 },
  ],
};

export interface YoYInProgressInfo {
  period: string;
  status: string;
}

export const yoyInProgressInfo: Record<string, YoYInProgressInfo | null> = {
  'K-5': { period: 'Fall 2025', status: 'under review' },
  '6-8': { period: 'Fall 2025', status: 'open' },
  '9-12': null,
};

export type BenchmarkScope = 'district' | 'comparable' | 'national';

export type NationalBenchmarkState = 'A' | 'B' | 'C';

export interface ConceptBenchmark {
  concept: string;
  schoolScore: number;
  benchmarkScore: number;
  difference: number;
  schoolN?: number;
}

export const MINIMUM_COHORT_SIZE = 10;

export interface BenchmarkScopeData {
  scope: BenchmarkScope;
  label: string;
  description: string;
  isAvailable: boolean;
  unavailableReason?: string;
  cohortSize: number;
  minimumCohort: number;
  concepts: ConceptBenchmark[];
  schoolAverageScore: number;
  benchmarkAverageScore: number;
  schoolParticipation: number;
  benchmarkParticipation: number;
  schoolSentimentPositive: number;
  benchmarkSentimentPositive: number;
  instrumentVersion: string;
  benchmarkPeriod: string;
  lastRefreshed: string;
  schoolResponseCount: number;
  schoolTargetCount: number;
  isVersionMismatched?: boolean;
  versionMismatchWarning?: string;
}

interface BenchmarkPeriodMeta {
  value: string;
  label: string;
  reportId: string;
  instrumentVersion: string;
  responseCount: number;
  targetCount: number;
}

export const benchmarkPeriodMeta: Record<string, BenchmarkPeriodMeta> = {
  'fall2024': { value: 'fall2024', label: 'Fall 2024', reportId: 'r1', instrumentVersion: 'v2', responseCount: 118, targetCount: 130 },
  'spring2025': { value: 'spring2025', label: 'Spring 2025', reportId: 'r2', instrumentVersion: 'v2', responseCount: 27, targetCount: 130 },
  'fall2025': { value: 'fall2025', label: 'Fall 2025', reportId: 'r3', instrumentVersion: 'v3', responseCount: 0, targetCount: 130 },
};

export const benchmarkGradeBands = ['6-8'];

export const benchmarkPeriods = [
  { value: 'fall2024', label: 'Fall 2024', reportId: 'r1', instrumentVersion: 'v2' },
  { value: 'spring2025', label: 'Spring 2025', reportId: 'r2', instrumentVersion: 'v2' },
];

export const benchmarkComparableData: BenchmarkScopeData = {
  scope: 'comparable',
  label: 'Comparable schools',
  description: 'Middle schools with similar enrolment and the same survey version',
  isAvailable: true,
  cohortSize: 23,
  minimumCohort: MINIMUM_COHORT_SIZE,
  concepts: [
    { concept: 'Taste', schoolScore: 72, benchmarkScore: 68, difference: 4, schoolN: 118 },
    { concept: 'Freshness', schoolScore: 65, benchmarkScore: 62, difference: 3, schoolN: 118 },
    { concept: 'Variety', schoolScore: 48, benchmarkScore: 52, difference: -4, schoolN: 118 },
    { concept: 'Staff', schoolScore: 78, benchmarkScore: 72, difference: 6, schoolN: 118 },
    { concept: 'Cleanliness', schoolScore: 71, benchmarkScore: 68, difference: 3, schoolN: 118 },
    { concept: 'Time to eat', schoolScore: 42, benchmarkScore: 46, difference: -4, schoolN: 118 },
  ],
  schoolAverageScore: 62.7,
  benchmarkAverageScore: 61.3,
  schoolParticipation: 91,
  benchmarkParticipation: 78,
  schoolSentimentPositive: 52,
  benchmarkSentimentPositive: 48,
  instrumentVersion: 'v2',
  benchmarkPeriod: 'Fall 2024',
  lastRefreshed: '10 January 2025',
  schoolResponseCount: 118,
  schoolTargetCount: 130,
};

export const benchmarkDistrictData: BenchmarkScopeData = {
  scope: 'district',
  label: 'Your district',
  description: 'Schools in your district using the same survey version',
  isAvailable: true,
  cohortSize: 14,
  minimumCohort: MINIMUM_COHORT_SIZE,
  concepts: [
    { concept: 'Taste', schoolScore: 72, benchmarkScore: 66, difference: 6, schoolN: 118 },
    { concept: 'Freshness', schoolScore: 65, benchmarkScore: 60, difference: 5, schoolN: 118 },
    { concept: 'Variety', schoolScore: 48, benchmarkScore: 50, difference: -2, schoolN: 118 },
    { concept: 'Staff', schoolScore: 78, benchmarkScore: 74, difference: 4, schoolN: 118 },
    { concept: 'Cleanliness', schoolScore: 71, benchmarkScore: 66, difference: 5, schoolN: 118 },
    { concept: 'Time to eat', schoolScore: 42, benchmarkScore: 48, difference: -6, schoolN: 118 },
  ],
  schoolAverageScore: 62.7,
  benchmarkAverageScore: 60.7,
  schoolParticipation: 91,
  benchmarkParticipation: 74,
  schoolSentimentPositive: 52,
  benchmarkSentimentPositive: 46,
  instrumentVersion: 'v2',
  benchmarkPeriod: 'Fall 2024',
  lastRefreshed: '10 January 2025',
  schoolResponseCount: 118,
  schoolTargetCount: 130,
};

export const benchmarkComparableDataSmallCohort: BenchmarkScopeData = {
  ...benchmarkComparableData,
  isAvailable: false,
  cohortSize: 6,
  unavailableReason: 'A benchmark will become available when enough comparable schools have participated.',
  concepts: [],
  schoolAverageScore: 0,
  benchmarkAverageScore: 0,
  schoolParticipation: 0,
  benchmarkParticipation: 0,
  schoolSentimentPositive: 0,
  benchmarkSentimentPositive: 0,
};

export const benchmarkComparableDataVersionMismatch: BenchmarkScopeData = {
  ...benchmarkComparableData,
  isAvailable: true,
  isVersionMismatched: true,
  versionMismatchWarning: 'These results use different survey versions, so differences are shown for context and aren\'t a like-for-like comparison.',
  label: 'Comparable schools',
  description: 'Middle schools with similar enrolment — mixed survey versions',
};

export function getSchoolNationalBenchmarkState(period: string): NationalBenchmarkState {
  if (period === 'fall2024') return 'B';
  if (period === 'spring2025') return 'C';
  return 'A';
}

export const benchmarkNationalActiveData: BenchmarkScopeData = {
  scope: 'national',
  label: 'National benchmark',
  description: 'Participating schools nationwide · same survey version',
  isAvailable: true,
  cohortSize: 41,
  minimumCohort: MINIMUM_COHORT_SIZE,
  concepts: [
    { concept: 'Taste', schoolScore: 72, benchmarkScore: 70, difference: 2, schoolN: 118 },
    { concept: 'Freshness', schoolScore: 65, benchmarkScore: 64, difference: 1, schoolN: 118 },
    { concept: 'Variety', schoolScore: 48, benchmarkScore: 55, difference: -7, schoolN: 118 },
    { concept: 'Staff', schoolScore: 78, benchmarkScore: 71, difference: 7, schoolN: 118 },
    { concept: 'Cleanliness', schoolScore: 71, benchmarkScore: 67, difference: 4, schoolN: 118 },
    { concept: 'Time to eat', schoolScore: 42, benchmarkScore: 49, difference: -7, schoolN: 118 },
  ],
  schoolAverageScore: 62.7,
  benchmarkAverageScore: 62.7,
  schoolParticipation: 91,
  benchmarkParticipation: 72,
  schoolSentimentPositive: 52,
  benchmarkSentimentPositive: 50,
  instrumentVersion: 'v2',
  benchmarkPeriod: 'Fall 2024',
  lastRefreshed: '3 August 2026',
  schoolResponseCount: 118,
  schoolTargetCount: 130,
};

export const benchmarkNationalUnavailableData: BenchmarkScopeData = {
  scope: 'national',
  label: 'National benchmark',
  description: 'All Cafeteria Pulse participating schools nationally',
  isAvailable: false,
  unavailableReason: 'A national benchmark is active for the Cafeteria Pulse programme, but not yet available for your grade band / survey version.',
  cohortSize: 8,
  minimumCohort: MINIMUM_COHORT_SIZE,
  concepts: [],
  schoolAverageScore: 0,
  benchmarkAverageScore: 0,
  schoolParticipation: 0,
  benchmarkParticipation: 0,
  schoolSentimentPositive: 0,
  benchmarkSentimentPositive: 0,
  instrumentVersion: '',
  benchmarkPeriod: '',
  lastRefreshed: '',
  schoolResponseCount: 0,
  schoolTargetCount: 0,
};

export const benchmarkNationalInactiveData: BenchmarkScopeData = {
  scope: 'national',
  label: 'National benchmark',
  description: 'All Cafeteria Pulse participating schools nationally',
  isAvailable: false,
  unavailableReason: 'A national benchmark dataset has not been activated yet by the Cafeteria Pulse programme. The Cafeteria Pulse participating-school benchmark is used instead.',
  cohortSize: 0,
  minimumCohort: MINIMUM_COHORT_SIZE,
  concepts: [],
  schoolAverageScore: 0,
  benchmarkAverageScore: 0,
  schoolParticipation: 0,
  benchmarkParticipation: 0,
  schoolSentimentPositive: 0,
  benchmarkSentimentPositive: 0,
  instrumentVersion: '',
  benchmarkPeriod: '',
  lastRefreshed: '',
  schoolResponseCount: 0,
  schoolTargetCount: 0,
};

export type SubscriptionStatus = 'active' | 'renewal-due' | 'grace-period' | 'read-only' | 'deactivated';

export interface SubscriptionData {
  plan: string;
  status: SubscriptionStatus;
  renewalDate: string;
  termStart: string;
  termEnd: string;
  customerType: 'school' | 'district';
  districtName: string | null;
  graceDaysRemaining: number | null;
  includedFeatures: string[];
  billingContactName: string;
  billingContactEmail: string;
}

export const subscriptionDataActive: SubscriptionData = {
  plan: 'Annual — per school',
  status: 'active',
  renewalDate: '5 January 2027',
  termStart: '5 January 2026',
  termEnd: '5 January 2027',
  customerType: 'district',
  districtName: 'North Hills School District',
  graceDaysRemaining: null,
  includedFeatures: [
    'Run unlimited student surveys per school year',
    'View and download published reports',
    'Compare with anonymised school benchmarks',
    'Survey to survey trend analysis',
    'Email reminders and access-code distribution',
    'Data retained for the full subscription term',
  ],
  billingContactName: 'SFWG Programme Office',
  billingContactEmail: 'support@sfwg.edu',
};

export const subscriptionDataGrace: SubscriptionData = {
  ...subscriptionDataActive,
  status: 'grace-period',
  graceDaysRemaining: 22,
};

export const subscriptionDataReadOnly: SubscriptionData = {
  ...subscriptionDataActive,
  status: 'read-only',
  graceDaysRemaining: null,
};

export const subscriptionDataRenewalDue: SubscriptionData = {
  ...subscriptionDataActive,
  status: 'renewal-due',
  renewalDate: '5 January 2027',
  graceDaysRemaining: null,
};

export const subscriptionDataDeactivated: SubscriptionData = {
  ...subscriptionDataActive,
  status: 'deactivated',
  graceDaysRemaining: null,
};

export interface AccountData {
  fullName: string;
  email: string;
  role: string;
  school: string;
  district: string | null;
}

export const accountData: AccountData = {
  fullName: 'Sarah Nguyen',
  email: 'sarah.nguyen@hillsidemiddle.edu',
  role: 'School administrator',
  school: 'Hillside Middle',
  district: 'North Hills School District',
};

export type NotificationChannel = 'email' | 'inapp';

export interface NotificationItem {
  id: string;
  label: string;
  description: string;
  locked: boolean;
  lockReason?: string;
  email: boolean;
  inapp: boolean;
}

export interface NotificationGroup {
  id: string;
  title: string;
  items: NotificationItem[];
  controllable: boolean;
}

export const notificationGroups: NotificationGroup[] = [
  {
    id: 'surveys',
    title: 'Surveys',
    controllable: true,
    items: [
      { id: 'survey-opened', label: 'Survey scheduled or opened', description: 'When a survey is scheduled to open or has just opened for responses.', locked: false, email: true, inapp: true },
      { id: 'survey-participation', label: 'Participation below target', description: 'When response rate drops below the 70% target during an open survey.', locked: false, email: true, inapp: true },
      { id: 'survey-closing', label: 'Survey approaching close', description: '48 hours before a survey closes.', locked: false, email: true, inapp: true },
      { id: 'survey-closed', label: 'Survey closed', description: 'When a survey closes and responses are no longer being accepted.', locked: false, email: true, inapp: true },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    controllable: true,
    items: [
      { id: 'report-ready', label: 'Report ready to view', description: 'When a new report is published and ready to download or view.', locked: false, email: true, inapp: true },
      { id: 'report-review', label: 'Report requires review', description: 'When a report needs additional review before final publication.', locked: false, email: true, inapp: true },
    ],
  },
  {
    id: 'reminders',
    title: 'Participation reminders',
    controllable: true,
    items: [
      { id: 'reminder-open', label: 'Reminder at survey open', description: 'First reminder when a survey opens.', locked: false, email: true, inapp: true },
      { id: 'reminder-midway', label: 'Reminder at midway point', description: 'Midway reminder during an open survey period.', locked: false, email: true, inapp: true },
      { id: 'reminder-before-close', label: 'Reminder before close', description: 'Reminder in the final 24–48 hours before a survey closes.', locked: false, email: true, inapp: true },
      { id: 'reminder-low-participation', label: 'Low participation follow-up', description: 'Extra reminder sent only if participation is below target.', locked: false, email: true, inapp: true },
    ],
  },
  {
    id: 'account-security',
    title: 'Account & security',
    controllable: false,
    items: [
      { id: 'account-security', label: 'Important account or security changes', description: 'Critical updates about your account, password changes, or security events.', locked: true, lockReason: 'Required for your account\'s security.', email: true, inapp: true },
    ],
  },
  {
    id: 'access',
    title: 'Access & user changes',
    controllable: false,
    items: [
      { id: 'access-role', label: 'Material access or role changes', description: 'When your access level, role, or school affiliation changes.', locked: true, lockReason: 'Required to stay informed of access changes.', email: true, inapp: true },
    ],
  },
  {
    id: 'subscription',
    title: 'Subscription',
    controllable: false,
    items: [
      { id: 'sub-renewal', label: 'Renewal, grace period, or access changes', description: 'Notices about upcoming renewal, grace period, read-only mode, or deactivation.', locked: true, lockReason: 'Required so you don\'t lose access unexpectedly.', email: true, inapp: true },
    ],
  },
  {
    id: 'service',
    title: 'Material service notices',
    controllable: false,
    items: [
      { id: 'service-notice', label: 'Important service or operational notices', description: 'Essential updates about platform service status or operational changes that affect your school.', locked: true, lockReason: 'Required for operational awareness.', email: true, inapp: true },
    ],
  },
];

export interface SurveyReopenDeclinedData {
  id: string;
  gradeBand: string;
  period: string;
  instrumentVersion: string;
  status: 'published';
  responseCount: number;
  targetCount: number;
  openedDate: string;
  closesDate: string;
  openedTime: string;
  closesTime: string;
  daysRemaining: number;
  hasAccessCode: boolean;
  accessCode: string;
  remindersEnabled: boolean;
  decisionReason: string;
  decidedBy: string;
  decidedDate: string;
  reportLabel: string;
  reportVersion: number;
  proposedCloseDate: string;
  proposedCloseTime: string;
  requestReason: string;
}

export const surveyReopenDeclinedData: Record<string, SurveyReopenDeclinedData> = {
  's3-declined': {
    id: 's3-declined',
    gradeBand: '6-8',
    period: 'Fall 2024',
    instrumentVersion: 'v2',
    status: 'published',
    responseCount: 118,
    targetCount: 130,
    openedDate: '5 Sep 2024',
    closesDate: '20 Sep 2024',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: true,
    decisionReason: 'The current report already meets the participation threshold (91%) and provides sufficient data for the district review cycle. Reopening at this time would introduce unnecessary version fragmentation with minimal expected change to the survey results. A new survey cycle in Spring 2025 would better serve data collection needs.',
    decidedBy: 'Maria Chen (SFWG)',
    decidedDate: '18 Jan 2025 at 10:35',
    reportLabel: 'Fall 2024',
    reportVersion: 1,
    proposedCloseDate: '5 Feb 2025',
    proposedCloseTime: '15:00',
    requestReason: 'We had a number of absent students during the original survey window due to a flu outbreak in grades 6-7. I would like to reopen to capture responses from those students so our data is more complete.',
  },
  's2-declined': {
    id: 's2-declined',
    gradeBand: '6-8',
    period: 'Spring 2025',
    instrumentVersion: 'v2',
    status: 'published',
    responseCount: 27,
    targetCount: 130,
    openedDate: '10 Apr 2025',
    closesDate: '24 May 2025',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: false,
    decisionReason: 'With only 27 responses (21% participation), reopening the same survey window is unlikely to produce meaningfully different results. The low response rate was due to a broader communication gap rather than a time-constraint issue. We recommend the school focus on improving participation in the next scheduled survey cycle rather than reopening this one.',
    decidedBy: 'James Park (SFWG)',
    decidedDate: '12 Jun 2025 at 14:20',
    reportLabel: 'Spring 2025',
    reportVersion: 1,
    proposedCloseDate: '28 Jun 2025',
    proposedCloseTime: '16:00',
    requestReason: 'Our response rate was only 21% which is far below our usual rate. We would like to reopen the survey with better communication to families and an extended window to increase participation.',
  },
  's3': {
    id: 's3',
    gradeBand: '6-8',
    period: 'Fall 2024',
    instrumentVersion: 'v2',
    status: 'published',
    responseCount: 118,
    targetCount: 130,
    openedDate: '5 Sep 2024',
    closesDate: '20 Sep 2024',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: true,
    decisionReason: 'The current report already meets the participation threshold (91%) and provides sufficient data for the district review cycle. Reopening at this time would introduce unnecessary version fragmentation with minimal expected change to the survey results. A new survey cycle in Spring 2025 would better serve data collection needs.',
    decidedBy: 'Maria Chen (SFWG)',
    decidedDate: '18 Jan 2025 at 10:35',
    reportLabel: 'Fall 2024',
    reportVersion: 1,
    proposedCloseDate: '5 Feb 2025',
    proposedCloseTime: '15:00',
    requestReason: 'We had a number of absent students during the original survey window due to a flu outbreak in grades 6-7. I would like to reopen to capture responses from those students so our data is more complete.',
  },
  's8': {
    id: 's8',
    gradeBand: 'K-5',
    period: 'Spring 2025',
    instrumentVersion: 'v2',
    status: 'published',
    responseCount: 155,
    targetCount: 180,
    openedDate: '10 Apr 2025',
    closesDate: '24 May 2025',
    openedTime: '08:00',
    closesTime: '16:00',
    daysRemaining: 0,
    hasAccessCode: false,
    accessCode: '',
    remindersEnabled: true,
    decisionReason: 'The survey achieved 86% participation which exceeds the district threshold. The data collected is comprehensive and reopening would risk survey fatigue among K-5 students. The current report is complete and reliable for decision-making. Please plan to gather any additional feedback through the next scheduled survey cycle in Fall 2025.',
    decidedBy: 'Maria Chen (SFWG)',
    decidedDate: '8 Jun 2025 at 09:15',
    reportLabel: 'Spring 2025',
    reportVersion: 1,
    proposedCloseDate: '20 Jun 2025',
    proposedCloseTime: '15:00',
    requestReason: 'Several Kindergarten and Grade 1 teachers noted that some younger students were absent during the survey window due to a school trip. We would like to reopen briefly to allow those students to participate so our K-1 data is more representative.',
  },
};

/* ==========================================================================
   Deletion requests for cancelled surveys.
   ========================================================================== */

export interface SurveyDeletionRejection {
  rejectedBy: string;
  rejectedAt: string;
  reason: string;
}

/** Deletion requests SFWG has already turned down, keyed by survey id. */
export const surveyDeletionRejections: Record<string, SurveyDeletionRejection> = {
  's6': {
    rejectedBy: 'Jordan Patel (SFWG Platform Admin)',
    rejectedAt: '2 Nov 2023 at 09:15',
    reason: 'This survey is tied to a district-wide benchmark and must be retained for audit compliance. Deletion would break historical cohort comparisons.',
  },
};


/* ==========================================================================
   Reopen requests for published surveys.
   ========================================================================== */

/**
 * District policy for reopening closed surveys.
 * 'direct'    — the district has given this school permission to reopen its own surveys.
 * 'requested' — the school has to ask; the district / SFWG approves or declines.
 */
export type ReopenPolicy = 'direct' | 'requested';

/** Set by the district in Settings → Survey reopen permission. */
export const schoolReopenPolicy: ReopenPolicy = 'requested';

export interface SurveyReopenRejection {
  decidedBy: string;
  decidedAt: string;
  reason: string;
  /** The report that stays published because the reopen was refused. */
  reportLabel: string;
  proposedClose: string;
  requestReason: string;
}

/** Reopen requests the district or SFWG has already declined, keyed by survey id. */
export const surveyReopenRejections: Record<string, SurveyReopenRejection> = {
  's3': {
    decidedBy: 'Maria Chen (SFWG)',
    decidedAt: '18 Jan 2025 at 10:35',
    reason: 'The current report already meets the participation threshold (91%) and provides sufficient data for the district review cycle. Reopening at this time would introduce unnecessary version fragmentation with minimal expected change to the survey results. A new survey cycle in Spring 2025 would better serve data collection needs.',
    reportLabel: 'Fall 2024 · v1',
    proposedClose: '5 Feb 2025 at 15:00',
    requestReason: 'We had a number of absent students during the original survey window due to a flu outbreak in grades 6-7. I would like to reopen to capture responses from those students so our data is more complete.',
  },
};
