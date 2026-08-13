import { surveyInstruments } from './surveyInstruments';

export interface SchoolSurveyConfig {
  schoolCode: string;
  schoolName: string;
  schoolLogoUrl?: string;
  gradeBand: 'K-5' | '6-8' | '9-12';
  requiresAccessCode: boolean;
  surveyTitle: string;
  estimatedMinutes: string;
  questionCount: number;
  surveyStatus: 'not-started' | 'open' | 'paused' | 'closed' | 'cancelled' | 'link-invalid';
  opensAt: string;
  closesAt: string;
  surveyRunId: string;
}

function getQuestionCount(gradeBand: 'K-5' | '6-8' | '9-12'): number {
  const instrument = surveyInstruments[gradeBand];
  return instrument ? instrument.questions.length : 0;
}

export const schoolSurveyConfigs: Record<string, SchoolSurveyConfig> = {
  'north-hills-elementary': {
    schoolCode: 'north-hills-elementary',
    schoolName: 'North Hills Elementary',
    gradeBand: 'K-5',
    requiresAccessCode: false,
    surveyTitle: 'Tell us about your school meals!',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('K-5'),
    surveyStatus: 'open',
    opensAt: '2026-03-10T08:00:00',
    closesAt: '2026-03-24T16:00:00',
    surveyRunId: 'run-k5-spring-2026',
  },
  'sample-middle': {
    schoolCode: 'sample-middle',
    schoolName: 'Sample Middle School',
    gradeBand: '6-8',
    requiresAccessCode: false,
    surveyTitle: 'Share your thoughts on school meals',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('6-8'),
    surveyStatus: 'open',
    opensAt: '2026-03-10T08:00:00',
    closesAt: '2026-03-24T16:00:00',
    surveyRunId: 'run-68-spring-2026',
  },
  'westview-high': {
    schoolCode: 'westview-high',
    schoolName: 'Westview High School',
    gradeBand: '9-12',
    requiresAccessCode: false,
    surveyTitle: 'Share your thoughts on school meals',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('9-12'),
    surveyStatus: 'open',
    opensAt: '2026-03-10T08:00:00',
    closesAt: '2026-03-24T16:00:00',
    surveyRunId: 'run-912-spring-2026',
  },
  'oakdale-elementary': {
    schoolCode: 'oakdale-elementary',
    schoolName: 'Oakdale Elementary',
    gradeBand: 'K-5',
    requiresAccessCode: false,
    surveyTitle: 'Tell us about your school meals!',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('K-5'),
    surveyStatus: 'not-started',
    opensAt: '2026-08-15T08:00:00',
    closesAt: '2026-08-29T16:00:00',
    surveyRunId: 'run-k5-fall-2026',
  },
  'lincoln-middle': {
    schoolCode: 'lincoln-middle',
    schoolName: 'Lincoln Middle School',
    gradeBand: '6-8',
    requiresAccessCode: false,
    surveyTitle: 'Share your thoughts on school meals',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('6-8'),
    surveyStatus: 'closed',
    opensAt: '2026-02-01T08:00:00',
    closesAt: '2026-02-14T16:00:00',
    surveyRunId: 'run-68-winter-2026',
  },
  'springdale-high-paused': {
    schoolCode: 'springdale-high-paused',
    schoolName: 'Springdale High School',
    gradeBand: '9-12',
    requiresAccessCode: false,
    surveyTitle: 'Share your thoughts on school meals',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('9-12'),
    surveyStatus: 'paused',
    opensAt: '2026-03-10T08:00:00',
    closesAt: '2026-03-24T16:00:00',
    surveyRunId: 'run-912-paused-2026',
  },
  'eastside-high-code': {
    schoolCode: 'eastside-high-code',
    schoolName: 'Eastside High School',
    gradeBand: '9-12',
    requiresAccessCode: true,
    surveyTitle: 'Share your thoughts on school meals',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('9-12'),
    surveyStatus: 'open',
    opensAt: '2026-03-10T08:00:00',
    closesAt: '2026-03-24T16:00:00',
    surveyRunId: 'run-912-code-spring-2026',
  },
  'riverdale-cancelled': {
    schoolCode: 'riverdale-cancelled',
    schoolName: 'Riverdale Elementary',
    gradeBand: 'K-5',
    requiresAccessCode: false,
    surveyTitle: 'Tell us about your school meals!',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('K-5'),
    surveyStatus: 'cancelled',
    opensAt: '2026-03-01T08:00:00',
    closesAt: '2026-03-14T16:00:00',
    surveyRunId: 'run-k5-cancelled-2026',
  },
  'sunset-link-invalid': {
    schoolCode: 'sunset-link-invalid',
    schoolName: 'Sunset Middle School',
    gradeBand: '6-8',
    requiresAccessCode: false,
    surveyTitle: 'Share your thoughts on school meals',
    estimatedMinutes: '5\u20137',
    questionCount: getQuestionCount('6-8'),
    surveyStatus: 'link-invalid',
    opensAt: '2026-03-01T08:00:00',
    closesAt: '2026-03-14T16:00:00',
    surveyRunId: 'run-68-invalid-2026',
  },
};

export function getSchoolConfig(schoolCode: string): SchoolSurveyConfig | null {
  return schoolSurveyConfigs[schoolCode] || null;
}

export const allSchoolCodes = Object.keys(schoolSurveyConfigs);