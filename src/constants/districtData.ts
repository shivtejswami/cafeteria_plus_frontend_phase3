import type { StatusVariant } from '@/components/ui/StatusChip';

/**
 * Single source of truth for the district dashboard.
 *
 * Every name, figure and string below is transcribed from the Cafeteria Pulse
 * Figma file (vpzehtETlOpcSSzI3s4F7M, page "District dashboard") so the screens
 * read exactly like the design.
 */

/* ------------------------------------------------------------------ */
/* District                                                            */
/* ------------------------------------------------------------------ */

export const DISTRICT = {
  name: 'North Hills School District',
  schoolYear: '2025/26',
  schools: 18,
  activeSurveys: 8,
  reportsAvailable: 14,
  schoolsBelowTarget: 3,
  reopenRequests: 4,
  satisfaction: 64,
};

export const CURRENT_USER = {
  name: 'Karen Lawson',
  firstName: 'Karen',
  email: 'karen.lawson@nhsd.edu',
  initials: 'KL',
  role: 'District administrator',
};

/* ------------------------------------------------------------------ */
/* Schools                                                             */
/* ------------------------------------------------------------------ */

export type SchoolLevel = 'Elementary' | 'Middle' | 'High';

export type DistrictSchool = {
  id: string;
  name: string;
  level: SchoolLevel;
  enrolmentBand: string;
  status: StatusVariant;
  responses: number | null;
  target: number | null;
  administrator: string | null;
  administratorEmail: string | null;
  latestReport: string | null;
  lastActivity: string;
  belowTarget: boolean;
  needsAttention: boolean;
  satisfaction: number | null;
  address: string;
  contactEmail: string;
};

export const SCHOOLS: DistrictSchool[] = [
  {
    id: 'brookside-elementary',
    name: 'Brookside Elementary',
    level: 'Elementary',
    enrolmentBand: '300–599',
    status: 'open',
    responses: 62,
    target: 115,
    administrator: 'Alan Whitfield',
    administratorEmail: 'awhitfield@nhsd.edu',
    latestReport: null,
    lastActivity: '4 hours ago',
    belowTarget: true,
    needsAttention: true,
    satisfaction: 58,
    address: '1420 Brookside Ave, Pittsburgh, PA 15229',
    contactEmail: 'office@brookside.nhsd.edu',
  },
  {
    id: 'cedar-grove-elementary',
    name: 'Cedar Grove Elementary',
    level: 'Elementary',
    enrolmentBand: '150–299',
    status: 'open',
    responses: 95,
    target: 106,
    administrator: 'Tomas Reyes',
    administratorEmail: 'treyes@nhsd.edu',
    latestReport: 'Fall 2024',
    lastActivity: '8 hours ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 71,
    address: '88 Cedar Grove Rd, Pittsburgh, PA 15237',
    contactEmail: 'office@cedargrove.nhsd.edu',
  },
  {
    id: 'fairview-elementary',
    name: 'Fairview Elementary',
    level: 'Elementary',
    enrolmentBand: '150–299',
    status: 'open',
    responses: 78,
    target: 95,
    administrator: 'Patricia Hayes',
    administratorEmail: 'phayes@nhsd.edu',
    latestReport: 'Fall 2024',
    lastActivity: '12 hours ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 69,
    address: '3 Fairview Ln, Pittsburgh, PA 15229',
    contactEmail: 'office@fairview.nhsd.edu',
  },
  {
    id: 'hillside-middle',
    name: 'Hillside Middle',
    level: 'Middle',
    enrolmentBand: '600–999',
    status: 'ready',
    responses: 115,
    target: 149,
    administrator: 'Patricia Hayes',
    administratorEmail: 'phayes@nhsd.edu',
    latestReport: 'Fall 2025',
    lastActivity: '1 day ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 66,
    address: '900 Hillside Dr, Pittsburgh, PA 15237',
    contactEmail: 'office@hillside.nhsd.edu',
  },
  {
    id: 'lakeside-middle',
    name: 'Lakeside Middle',
    level: 'Middle',
    enrolmentBand: '600–999',
    status: 'scheduled',
    responses: null,
    target: null,
    administrator: 'James Morrison',
    administratorEmail: 'jmorrison@nhsd.edu',
    latestReport: null,
    lastActivity: '3 days ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: null,
    address: '210 Lakeside Blvd, Pittsburgh, PA 15090',
    contactEmail: 'office@lakeside.nhsd.edu',
  },
  {
    id: 'maple-ridge-middle',
    name: 'Maple Ridge Middle',
    level: 'Middle',
    enrolmentBand: '600–999',
    status: 'scheduled',
    responses: null,
    target: null,
    administrator: null,
    administratorEmail: null,
    latestReport: null,
    lastActivity: '5 hours ago',
    belowTarget: false,
    needsAttention: true,
    satisfaction: null,
    address: '77 Maple Ridge Way, Pittsburgh, PA 15101',
    contactEmail: 'office@mapleridge.nhsd.edu',
  },
  {
    id: 'north-hills-elementary',
    name: 'North Hills Elementary',
    level: 'Elementary',
    enrolmentBand: '300–599',
    status: 'open',
    responses: 94,
    target: 120,
    administrator: 'James Morrison',
    administratorEmail: 'jmorrison@nhsd.edu',
    latestReport: 'Fall 2024',
    lastActivity: '2 hours ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 74,
    address: '135 Rochester Rd, Pittsburgh, PA 15229',
    contactEmail: 'office@nhe.nhsd.edu',
  },
  {
    id: 'north-hills-high',
    name: 'North Hills High',
    level: 'High',
    enrolmentBand: '1,000+',
    status: 'none',
    responses: null,
    target: null,
    administrator: 'Michael Torres',
    administratorEmail: 'mtorres@nhsd.edu',
    latestReport: 'Spring 2025',
    lastActivity: '4 days ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 61,
    address: '53 Rochester Rd, Pittsburgh, PA 15229',
    contactEmail: 'office@nhh.nhsd.edu',
  },
  {
    id: 'oak-valley-middle',
    name: 'Oak Valley Middle',
    level: 'Middle',
    enrolmentBand: '600–999',
    status: 'open',
    responses: 48,
    target: 120,
    administrator: 'Daniel Greene',
    administratorEmail: 'dgreene@nhsd.edu',
    latestReport: null,
    lastActivity: '6 hours ago',
    belowTarget: true,
    needsAttention: true,
    satisfaction: 52,
    address: '640 Oak Valley Rd, Pittsburgh, PA 15090',
    contactEmail: 'office@oakvalley.nhsd.edu',
  },
  {
    id: 'pine-grove-elementary',
    name: 'Pine Grove Elementary',
    level: 'Elementary',
    enrolmentBand: '300–599',
    status: 'open',
    responses: 41,
    target: 108,
    administrator: 'Lisa Tran',
    administratorEmail: 'ltran@nhsd.edu',
    latestReport: null,
    lastActivity: '3 hours ago',
    belowTarget: true,
    needsAttention: true,
    satisfaction: 55,
    address: '18 Pine Grove St, Pittsburgh, PA 15237',
    contactEmail: 'office@pinegrove.nhsd.edu',
  },
  {
    id: 'riverside-high',
    name: 'Riverside High',
    level: 'High',
    enrolmentBand: '1,000+',
    status: 'closed',
    responses: 88,
    target: 191,
    administrator: 'Sandra Lopez',
    administratorEmail: 'slopez@nhsd.edu',
    latestReport: 'Fall 2025',
    lastActivity: '6 days ago',
    belowTarget: true,
    needsAttention: true,
    satisfaction: 68,
    address: '410 Riverside Dr, Pittsburgh, PA 15101',
    contactEmail: 'office@riverside.nhsd.edu',
  },
  {
    id: 'summit-high',
    name: 'Summit High',
    level: 'High',
    enrolmentBand: '1,000+',
    status: 'open',
    responses: 210,
    target: 260,
    administrator: 'Daniel Greene',
    administratorEmail: 'dgreene@nhsd.edu',
    latestReport: 'Spring 2025',
    lastActivity: '9 hours ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 63,
    address: '1 Summit Pkwy, Pittsburgh, PA 15090',
    contactEmail: 'office@summit.nhsd.edu',
  },
  {
    id: 'sunset-elementary',
    name: 'Sunset Elementary',
    level: 'Elementary',
    enrolmentBand: '300–599',
    status: 'published',
    responses: 88,
    target: 105,
    administrator: 'Janet Cole',
    administratorEmail: 'jcole@nhsd.edu',
    latestReport: 'Fall 2025',
    lastActivity: '7 days ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 72,
    address: '260 Sunset Ave, Pittsburgh, PA 15229',
    contactEmail: 'office@sunset.nhsd.edu',
  },
  {
    id: 'west-valley-high',
    name: 'West Valley High',
    level: 'High',
    enrolmentBand: '1,000+',
    status: 'closed',
    responses: 115,
    target: 150,
    administrator: 'Rachel Foster',
    administratorEmail: 'rfoster@nhsd.edu',
    latestReport: 'Fall 2025',
    lastActivity: '7 days ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 59,
    address: '2100 West Valley Rd, Pittsburgh, PA 15090',
    contactEmail: 'office@westvalley.nhsd.edu',
  },
  {
    id: 'willow-creek-high',
    name: 'Willow Creek High',
    level: 'High',
    enrolmentBand: '600–999',
    status: 'closed',
    responses: 64,
    target: 82,
    administrator: 'Nina Shah',
    administratorEmail: 'nshah@nhsd.edu',
    latestReport: 'Fall 2025',
    lastActivity: '9 days ago',
    belowTarget: false,
    needsAttention: false,
    satisfaction: 76,
    address: '9 Willow Creek Ct, Pittsburgh, PA 15101',
    contactEmail: 'office@willowcreek.nhsd.edu',
  },
  {
    id: 'eastgate-middle',
    name: 'Eastgate Middle',
    level: 'Middle',
    enrolmentBand: '300–599',
    status: 'none',
    responses: null,
    target: null,
    administrator: null,
    administratorEmail: null,
    latestReport: null,
    lastActivity: '21 days ago',
    belowTarget: false,
    needsAttention: true,
    satisfaction: null,
    address: '505 Eastgate Rd, Pittsburgh, PA 15101',
    contactEmail: 'office@eastgate.nhsd.edu',
  },
];

export const LEVEL_CHIP: Record<SchoolLevel, string> = {
  Elementary: 'bg-[#F0EAFB] text-[#6D28D9]',
  Middle: 'bg-[#E3F5E3] text-[#586D4D]',
  High: 'bg-[#FEF2E2] text-[#D97706]',
};

export const ENROLMENT_BANDS = [
  '<150',
  '150–299',
  '300–599',
  '600–999',
  '1,000+',
] as const;

/** Default participation target per enrolment band. */
export const BAND_TARGET: Record<string, number> = {
  '<150': 72,
  '150–299': 106,
  '300–599': 120,
  '600–999': 149,
  '1,000+': 260,
};

/* ------------------------------------------------------------------ */
/* Surveys per school                                                  */
/* ------------------------------------------------------------------ */

export type SchoolSurvey = {
  id: string;
  schoolId: string;
  grades: string;
  term: string;
  status: StatusVariant;
  responses: number;
  target: number;
  closesOn: string;
};

export const SCHOOL_SURVEYS: SchoolSurvey[] = [
  { id: 'sv-1', schoolId: 'cedar-grove-elementary', grades: 'K–5', term: 'Fall 2025', status: 'open', responses: 95, target: 106, closesOn: '3 Oct 2025' },
  { id: 'sv-2', schoolId: 'cedar-grove-elementary', grades: 'K–5', term: 'Spring 2025', status: 'under-review', responses: 98, target: 105, closesOn: '28 Mar 2025' },
  { id: 'sv-3', schoolId: 'cedar-grove-elementary', grades: 'K–5', term: 'Fall 2024', status: 'published', responses: 92, target: 100, closesOn: '30 Sep 2024' },
  { id: 'sv-4', schoolId: 'north-hills-elementary', grades: '3–5', term: 'Fall 2025', status: 'open', responses: 94, target: 120, closesOn: '10 Oct 2025' },
  { id: 'sv-5', schoolId: 'north-hills-elementary', grades: '3–5', term: 'Spring 2025', status: 'published', responses: 101, target: 118, closesOn: '2 Apr 2025' },
  { id: 'sv-6', schoolId: 'hillside-middle', grades: '6–8', term: 'Fall 2025', status: 'ready', responses: 115, target: 149, closesOn: '8 Oct 2025' },
  { id: 'sv-7', schoolId: 'hillside-middle', grades: '6–8', term: 'Spring 2025', status: 'published', responses: 108, target: 145, closesOn: '30 Mar 2025' },
  { id: 'sv-8', schoolId: 'pine-grove-elementary', grades: '3–5', term: 'Fall 2025', status: 'open', responses: 41, target: 108, closesOn: '15 Oct 2025' },
  { id: 'sv-9', schoolId: 'oak-valley-middle', grades: '6–8', term: 'Fall 2025', status: 'open', responses: 48, target: 120, closesOn: '12 Oct 2025' },
  { id: 'sv-10', schoolId: 'west-valley-high', grades: '9–12', term: 'Fall 2025', status: 'closed', responses: 115, target: 150, closesOn: '3 Oct 2025' },
  { id: 'sv-11', schoolId: 'sunset-elementary', grades: '3–5', term: 'Fall 2025', status: 'published', responses: 88, target: 105, closesOn: '1 Oct 2025' },
  { id: 'sv-12', schoolId: 'summit-high', grades: '9–12', term: 'Fall 2025', status: 'open', responses: 210, target: 260, closesOn: '20 Oct 2025' },
];

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

export type SchoolReport = {
  id: string;
  schoolId: string;
  title: string;
  term: string;
  responses: number;
  satisfaction: number;
  publishedOn: string;
  status: StatusVariant;
};

export const SCHOOL_REPORTS: SchoolReport[] = [
  { id: 'rp-1', schoolId: 'cedar-grove-elementary', title: 'Cedar Grove Elementary — Fall 2024', term: 'Fall 2024', responses: 92, satisfaction: 71, publishedOn: '8 Oct 2024', status: 'published' },
  { id: 'rp-2', schoolId: 'cedar-grove-elementary', title: 'Cedar Grove Elementary — Spring 2025', term: 'Spring 2025', responses: 98, satisfaction: 73, publishedOn: '—', status: 'under-review' },
  { id: 'rp-3', schoolId: 'hillside-middle', title: 'Hillside Middle — Fall 2025', term: 'Fall 2025', responses: 115, satisfaction: 66, publishedOn: '12 Oct 2025', status: 'published' },
  { id: 'rp-4', schoolId: 'north-hills-elementary', title: 'North Hills Elementary — Fall 2024', term: 'Fall 2024', responses: 88, satisfaction: 70, publishedOn: '6 Oct 2024', status: 'published' },
  { id: 'rp-5', schoolId: 'sunset-elementary', title: 'Sunset Elementary — Fall 2025', term: 'Fall 2025', responses: 88, satisfaction: 72, publishedOn: '5 Oct 2025', status: 'published' },
  { id: 'rp-6', schoolId: 'west-valley-high', title: 'West Valley High — Fall 2025', term: 'Fall 2025', responses: 115, satisfaction: 59, publishedOn: '9 Oct 2025', status: 'published' },
  { id: 'rp-7', schoolId: 'north-hills-high', title: 'North Hills High — Spring 2025', term: 'Spring 2025', responses: 302, satisfaction: 61, publishedOn: '4 Apr 2025', status: 'published' },
  { id: 'rp-8', schoolId: 'summit-high', title: 'Summit High — Spring 2025', term: 'Spring 2025', responses: 248, satisfaction: 63, publishedOn: '2 Apr 2025', status: 'published' },
];

/* ------------------------------------------------------------------ */
/* Reports & Analytics — district roll-up (frame 2233:718)             */
/* ------------------------------------------------------------------ */

export const ROLLUP = {
  gradeBand: '6-8',
  period: 'Fall 2025',
  schoolsReporting: 14,
  schoolsTotal: 18,
  responses: 1284,
  averageScore: 62,
  averageScoreFromSchools: 14,
  participation: 71,
  sentiment: 58,
  reportsThisPeriod: 14,
  reportsUnderReview: 2,
  conceptSchools: 10,
  smallSampleSchools: 2,
  excludedSchools: 1,
};

export type ScoreBand = 'positive' | 'moderate' | 'attention';

export type ConceptScore = {
  concept: string;
  score: number;
  band: ScoreBand;
  low: number;
  high: number;
  topSchool: string;
  topScore: number;
};

export const CONCEPT_SCORES: ConceptScore[] = [
  { concept: 'Taste', score: 66, band: 'positive', low: 42, high: 82, topSchool: 'Cedar Grove Elementary', topScore: 82 },
  { concept: 'Freshness', score: 64, band: 'moderate', low: 40, high: 80, topSchool: 'Cedar Grove Elementary', topScore: 80 },
  { concept: 'Variety', score: 58, band: 'moderate', low: 35, high: 76, topSchool: 'Cedar Grove Elementary', topScore: 74 },
  { concept: 'Staff', score: 61, band: 'moderate', low: 38, high: 78, topSchool: 'Cedar Grove Elementary', topScore: 76 },
  { concept: 'Cleanliness', score: 68, band: 'positive', low: 48, high: 84, topSchool: 'Cedar Grove Elementary', topScore: 82 },
  { concept: 'Time to eat', score: 52, band: 'moderate', low: 30, high: 72, topSchool: 'Cedar Grove Elementary', topScore: 70 },
];

export const SCORE_DISTRIBUTION: {
  band: ScoreBand;
  label: string;
  schools: number;
  directional: number;
}[] = [
  { band: 'positive', label: 'Positive (65–100)', schools: 4, directional: 0 },
  { band: 'moderate', label: 'Moderate (50–64)', schools: 6, directional: 2 },
  { band: 'attention', label: 'Needs attention (0–49)', schools: 1, directional: 1 },
];

export const PARTICIPATION_ROWS: {
  school: string;
  rate: number;
  responses: number;
  target: number;
  belowTarget?: boolean;
  flag?: string;
}[] = [
  { school: 'Maple Ridge Middle', rate: 91, responses: 128, target: 140 },
  { school: 'Cedar Grove Elementary', rate: 90, responses: 95, target: 105 },
  { school: 'Sunset Elementary', rate: 86, responses: 112, target: 130 },
  { school: 'Fairview Elementary', rate: 82, responses: 78, target: 95 },
  { school: 'Summit High', rate: 82, responses: 148, target: 180 },
  { school: 'Willow Creek High', rate: 78, responses: 132, target: 170 },
  { school: 'Hillside Middle', rate: 77, responses: 115, target: 150 },
  { school: 'North Hills High', rate: 75, responses: 210, target: 280 },
  { school: 'West Valley High', rate: 68, responses: 98, target: 145 },
  { school: 'North Hills Elementary', rate: 64, responses: 83, target: 130 },
  { school: 'Riverside High', rate: 46, responses: 71, target: 155, belowTarget: true },
  { school: 'Pine Grove Elementary', rate: 23, responses: 25, target: 108, belowTarget: true, flag: 'directional' },
  { school: 'Oak Valley Middle', rate: 23, responses: 27, target: 120, belowTarget: true, flag: 'directional' },
  { school: 'Brookside Elementary', rate: 6, responses: 7, target: 115, belowTarget: true, flag: '< 10' },
];

export const GRADE_BANDS = ['All grades', 'K-2', '3-5', '6-8', '9-12'] as const;
export const REPORT_PERIODS = ['Fall 2025', 'Spring 2025', 'Fall 2024', 'Spring 2024'] as const;

export const ROLLUP_FOOTNOTES = [
  'Score = Yes% + ½ × Sometimes% (0–100). Positive ≥ 65 · Moderate 50–64 · Needs attention below 50.',
  'Schools marked “Small sample · directional” have fewer than 30 responses — treat their figures as indicative only.',
  'Too few responses to show a concept breakdown — this protects anonymity and avoids unreliable conclusions.',
];

export const ROLLUP_METHODOLOGY = [
  'District figures are a simple mean across schools with published reports; each school counts equally regardless of size. Schools with fewer than 10 responses are excluded from concept-level averages.',
  'The total only shows the current period’s roll-up. The change value shows the direction of movement.',
  'Schools marked “Small sample · directional” have fewer than 30 responses — treat their figures as indicative only.',
];

/* ------------------------------------------------------------------ */
/* Year over year (frame 2235:1612)                                    */
/* ------------------------------------------------------------------ */

export const YOY_PERIODS = { previous: 'Fall 2024', current: 'Fall 2025' };

export const YOY_COMPARE_OPTIONS = [
  'Fall 2023',
  'Spring 2024',
  'Fall 2024',
  'Spring 2025',
  'Fall 2025',
] as const;

export const YOY_METHODOLOGY_NOTE = {
  title: 'Different survey or methodology versions',
  chip: 'Context only',
  body: "Fall 2024 used instrument v2 with methodology m1.1, while Fall 2025 used instrument v3 with methodology m1.2. Because questions or scoring may have changed, score, sentiment, and concept comparisons are shown for context and aren't an exact like-for-like. Score and sentiment deltas are muted and marked with an asterisk on both tabs. Participation comparisons are unaffected.",
};

export type ComparisonMetric = {
  key: string;
  label: string;
  accent: string;
  icon: 'score' | 'participation' | 'sentiment' | 'schools';
  previous: { value: string; caption: string };
  current: { value: string; caption: string };
  delta: { label: string; tone: 'muted' | 'positive' };
  amberValues?: boolean;
  footnote?: string;
  callout?: string;
};

export const YOY_METRICS: ComparisonMetric[] = [
  {
    key: 'score',
    label: 'District average score',
    accent: 'bg-[#6D28D9]',
    icon: 'score',
    previous: { value: '58', caption: 'Moderate · n=1,420' },
    current: { value: '62', caption: 'Moderate · n=1,680' },
    delta: { label: '~+4 pts', tone: 'muted' },
    amberValues: true,
    footnote: 'Simple average across schools with published reports only',
  },
  {
    key: 'participation',
    label: 'District participation',
    accent: 'bg-[#586D4D]',
    icon: 'participation',
    previous: { value: '66%', caption: 'n=1,420 · 12 of 18 schools' },
    current: { value: '71%', caption: 'n=1,680 · 14 of 18 schools' },
    delta: { label: '+5 pp', tone: 'positive' },
  },
  {
    key: 'sentiment',
    label: 'Positive sentiment',
    accent: 'bg-[#6D28D9]',
    icon: 'sentiment',
    previous: { value: '54%', caption: 'n=1,420' },
    current: { value: '58%', caption: 'n=1,680' },
    delta: { label: '~+4 pp', tone: 'muted' },
  },
  {
    key: 'schools',
    label: 'Schools reporting',
    accent: 'bg-[#D97706]',
    icon: 'schools',
    previous: { value: '12', caption: 'of 18 schools' },
    current: { value: '14', caption: 'of 18 schools' },
    delta: { label: '+2 schools', tone: 'muted' },
    callout:
      "Fall 2024's district average covers 12 schools; Fall 2025's covers 14. Because the schools included differ, the district average isn't a like-for-like comparison.",
  },
];

export const YOY_CONCEPTS = [
  { concept: 'Taste', previous: 62, current: 66, schools: 10 },
  { concept: 'Freshness', previous: 61, current: 64, schools: 10 },
  { concept: 'Variety', previous: 55, current: 58, schools: 10 },
  { concept: 'Staff', previous: 59, current: 61, schools: 10 },
  { concept: 'Cleanliness', previous: 64, current: 68, schools: 10 },
  { concept: 'Time to eat', previous: 51, current: 52, schools: 10 },
];

/* ------------------------------------------------------------------ */
/* District benchmarks                                                 */
/* ------------------------------------------------------------------ */

export const BENCHMARKS = [
  { metric: 'Overall satisfaction', district: 64, state: 61, national: 58 },
  { metric: 'Food quality', district: 61, state: 59, national: 56 },
  { metric: 'Menu variety', district: 57, state: 62, national: 60 },
  { metric: 'Wait time', district: 72, state: 66, national: 64 },
  { metric: 'Dining space', district: 68, state: 64, national: 63 },
  { metric: 'Staff friendliness', district: 79, state: 74, national: 71 },
];

/* ------------------------------------------------------------------ */
/* Reopen requests (frame 2226:11604)                                  */
/* ------------------------------------------------------------------ */

export type ReopenStatus = 'pending' | 'approved' | 'declined';

export type ReopenRequest = {
  id: string;
  schoolId: string;
  schoolName: string;
  level: SchoolLevel;
  surveyGrades: string;
  surveyLabel: string;
  requestedBy: string;
  requestedByRole: string;
  requestedOn: string;
  waitingDays: number;
  reportImpact: string;
  reason: string;
  additionalDays: number;
  status: ReopenStatus;
  responses: number;
  target: number;
  decisionNote?: string;
  decidedOn?: string;
  decidedBy?: string;
};

export const REOPEN_REQUESTS: ReopenRequest[] = [
  {
    id: 'req-1041',
    schoolId: 'pine-grove-elementary',
    schoolName: 'Pine Grove Elementary',
    level: 'Elementary',
    surveyGrades: '3-5 · Fall 2025',
    surveyLabel: 'Fall 2025 · Grades 3–5',
    requestedBy: 'Lisa Tran',
    requestedByRole: 'School administrator',
    requestedOn: '8 Jul 2026',
    waitingDays: 13,
    reportImpact: 'Analysing · will be superseded',
    reason:
      'We received feedback from several teachers that some 3rd-grade students needed additional support understanding the survey questions. Many students needed adult assistance which slowed the process considerably. We would like to reopen for an additional two weeks with teacher-facilitated sessions scheduled during computer lab time to reach our target of 80% participation. Currently at 38%.',
    additionalDays: 14,
    status: 'pending',
    responses: 41,
    target: 108,
  },
  {
    id: 'req-1038',
    schoolId: 'west-valley-high',
    schoolName: 'West Valley High',
    level: 'High',
    surveyGrades: '9-12 · Fall 2025',
    surveyLabel: 'Fall 2025 · Grades 9–12',
    requestedBy: 'Rachel Foster',
    requestedByRole: 'School administrator',
    requestedOn: '10 Jul 2026',
    waitingDays: 10,
    reportImpact: 'Published · will be superseded',
    reason:
      'We discovered that the survey closed one week earlier than the date communicated to students and families. The scheduled close date was 10 Oct but the system shows it closed on 3 Oct. Several home-room teachers had planned to complete the survey during the final week. Participation is at 68% and we need to reopen for that missed week to reach our 80% target.',
    additionalDays: 7,
    status: 'pending',
    responses: 98,
    target: 145,
  },
  {
    id: 'req-1035',
    schoolId: 'north-hills-elementary',
    schoolName: 'North Hills Elementary',
    level: 'Elementary',
    surveyGrades: '3-5 · Spring 2026',
    surveyLabel: 'Spring 2026 · Grades 3–5',
    requestedBy: 'James Morrison',
    requestedByRole: 'School administrator',
    requestedOn: '12 Jul 2026',
    waitingDays: 9,
    reportImpact: 'Published · will be superseded',
    reason:
      'We had an unexpected school closure for three days due to a water main break. The survey was scheduled to close during that week and we were unable to extend before it automatically closed. We would like to reopen for five school days to capture responses from the affected home-room groups.',
    additionalDays: 5,
    status: 'pending',
    responses: 172,
    target: 290,
  },
  {
    id: 'req-1032',
    schoolId: 'hillside-middle',
    schoolName: 'Hillside Middle',
    level: 'Middle',
    surveyGrades: '6-8 · Fall 2025',
    surveyLabel: 'Fall 2025 · Grades 6–8',
    requestedBy: 'Patricia Hayes',
    requestedByRole: 'School administrator',
    requestedOn: '15 Jul 2026',
    waitingDays: 6,
    reportImpact: 'Analysing · will be superseded',
    reason:
      'We had a campus-wide internet outage for two days that prevented students from accessing the survey. We need about another week to get responses from the two affected grade levels — currently at 64% participation and aiming for at least 80%. Grade 7 participation is particularly low at 41 of 65.',
    additionalDays: 7,
    status: 'pending',
    responses: 83,
    target: 130,
  },
  {
    id: 'req-1030',
    schoolId: 'summit-high',
    schoolName: 'Summit High',
    level: 'High',
    surveyGrades: '9-12 · Spring 2025',
    surveyLabel: 'Spring 2025 · Grades 9–12',
    requestedBy: 'Daniel Greene',
    requestedByRole: 'School administrator',
    requestedOn: '20 Jun 2026',
    waitingDays: 0,
    reportImpact: 'Published · superseded',
    reason:
      'Senior class was off-site for college visits for most of the survey window.',
    additionalDays: 7,
    status: 'approved',
    responses: 210,
    target: 260,
    decisionNote: 'Approved — extended by 7 days.',
    decidedOn: '21 Jun 2026',
    decidedBy: 'Karen Lawson',
  },
  {
    id: 'req-1022',
    schoolId: 'willow-creek-high',
    schoolName: 'Willow Creek High',
    level: 'High',
    surveyGrades: '9-12 · Fall 2025',
    surveyLabel: 'Fall 2025 · Grades 9–12',
    requestedBy: 'Nina Shah',
    requestedByRole: 'School administrator',
    requestedOn: '5 Jun 2026',
    waitingDays: 0,
    reportImpact: 'Published · unchanged',
    reason: 'Would like to add the pre-K cohort to the same survey window.',
    additionalDays: 10,
    status: 'declined',
    responses: 64,
    target: 82,
    decisionNote:
      'Declined — pre-K is out of scope for this instrument. Run a separate survey next term.',
    decidedOn: '6 Jun 2026',
    decidedBy: 'Karen Lawson',
  },
];

/* ------------------------------------------------------------------ */
/* People — one row per school (frame 2235:5484)                       */
/* ------------------------------------------------------------------ */

export type AdministratorStatus = 'active' | 'pending' | 'deactivated' | 'vacant';

export type SchoolAdministratorRow = {
  id: string;
  schoolId: string;
  school: string;
  name: string | null;
  email: string | null;
  status: AdministratorStatus;
  invitedOn: string | null;
  lastActive: string | null;
  expiresInDays: number | null;
  accessEnabled: boolean;
};

export const SCHOOL_ADMINISTRATORS: SchoolAdministratorRow[] = [
  { id: 'sa-1', schoolId: 'cedar-grove-elementary', school: 'Cedar Grove Elementary', name: 'Tomas Reyes', email: 'treyes@nhsd.edu', status: 'pending', invitedOn: null, lastActive: null, expiresInDays: 2, accessEnabled: false },
  { id: 'sa-2', schoolId: 'hillside-middle', school: 'Hillside Middle', name: 'Patricia Hayes', email: 'phayes@nhsd.edu', status: 'deactivated', invitedOn: '22 Jan 2025', lastActive: 'Today, 09:48', expiresInDays: null, accessEnabled: false },
  { id: 'sa-3', schoolId: 'maple-ridge-middle', school: 'Maple Ridge Middle', name: null, email: null, status: 'vacant', invitedOn: null, lastActive: null, expiresInDays: null, accessEnabled: false },
  { id: 'sa-4', schoolId: 'north-hills-elementary', school: 'North Hills Elementary', name: 'James Morrison', email: 'jmorrison@nhsd.edu', status: 'active', invitedOn: '14 Mar 2024', lastActive: 'Today, 11:05', expiresInDays: null, accessEnabled: true },
  { id: 'sa-5', schoolId: 'north-hills-high', school: 'North Hills High', name: 'Michael Torres', email: 'mtorres@nhsd.edu', status: 'active', invitedOn: '5 Aug 2024', lastActive: 'Today, 08:12', expiresInDays: null, accessEnabled: true },
  { id: 'sa-6', schoolId: 'oak-valley-middle', school: 'Oak Valley Middle', name: 'Daniel Greene', email: 'dgreene@nhsd.edu', status: 'active', invitedOn: '12 Dec 2024', lastActive: 'Today, 06:30', expiresInDays: null, accessEnabled: true },
  { id: 'sa-7', schoolId: 'pine-grove-elementary', school: 'Pine Grove Elementary', name: 'Lisa Tran', email: 'ltran@nhsd.edu', status: 'active', invitedOn: '18 Nov 2024', lastActive: 'Today, 10:22', expiresInDays: null, accessEnabled: true },
  { id: 'sa-8', schoolId: 'riverside-high', school: 'Riverside High', name: 'Sandra Lopez', email: 'slopez@nhsd.edu', status: 'active', invitedOn: '15 Jul 2024', lastActive: 'Today, 14:08', expiresInDays: null, accessEnabled: true },
  { id: 'sa-9', schoolId: 'sunset-elementary', school: 'Sunset Elementary', name: 'Janet Cole', email: 'jcole@nhsd.edu', status: 'active', invitedOn: '8 Jan 2025', lastActive: '2 days ago', expiresInDays: null, accessEnabled: true },
  { id: 'sa-10', schoolId: 'west-valley-high', school: 'West Valley High', name: 'Rachel Foster', email: 'rfoster@nhsd.edu', status: 'active', invitedOn: '20 Jun 2024', lastActive: 'Yesterday, 15:10', expiresInDays: null, accessEnabled: true },
  { id: 'sa-11', schoolId: 'brookside-elementary', school: 'Brookside Elementary', name: 'Alan Whitfield', email: 'awhitfield@nhsd.edu', status: 'active', invitedOn: '2 Sep 2024', lastActive: 'Today, 07:41', expiresInDays: null, accessEnabled: true },
  { id: 'sa-12', schoolId: 'eastgate-middle', school: 'Eastgate Middle', name: null, email: null, status: 'vacant', invitedOn: null, lastActive: null, expiresInDays: null, accessEnabled: false },
  { id: 'sa-13', schoolId: 'fairview-elementary', school: 'Fairview Elementary', name: 'Patricia Hayes', email: 'phayes@nhsd.edu', status: 'active', invitedOn: '3 Apr 2024', lastActive: 'Today, 12:19', expiresInDays: null, accessEnabled: true },
  { id: 'sa-14', schoolId: 'lakeside-middle', school: 'Lakeside Middle', name: 'James Morrison', email: 'jmorrison@nhsd.edu', status: 'active', invitedOn: '27 May 2024', lastActive: '3 days ago', expiresInDays: null, accessEnabled: true },
  { id: 'sa-15', schoolId: 'summit-high', school: 'Summit High', name: 'Daniel Greene', email: 'dgreene@nhsd.edu', status: 'active', invitedOn: '11 Feb 2024', lastActive: 'Today, 09:03', expiresInDays: null, accessEnabled: true },
  { id: 'sa-16', schoolId: 'willow-creek-high', school: 'Willow Creek High', name: 'Nina Shah', email: 'nshah@nhsd.edu', status: 'pending', invitedOn: null, lastActive: null, expiresInDays: 5, accessEnabled: false },
];

/* ------------------------------------------------------------------ */
/* Activity                                                            */
/* ------------------------------------------------------------------ */

export type ActivityCategory = 'survey' | 'report' | 'reopen' | 'school' | 'people' | 'settings';

export type DistrictActivity = {
  id: string;
  category: ActivityCategory;
  schoolId: string | null;
  schoolName: string | null;
  description: string;
  actor: string;
  timeAgo: string;
  needsAttention?: boolean;
};

export const DISTRICT_ACTIVITY: DistrictActivity[] = [
  { id: 'ac-1', category: 'report', schoolId: 'hillside-middle', schoolName: 'Hillside Middle', description: 'Spring 2025 report published', actor: 'System', timeAgo: '2 days ago' },
  { id: 'ac-2', category: 'survey', schoolId: 'pine-grove-elementary', schoolName: 'Pine Grove Elementary', description: 'Fall 2025 survey opened for grades 3–5', actor: 'Lisa Tran', timeAgo: '4 days ago' },
  { id: 'ac-3', category: 'survey', schoolId: 'sunset-elementary', schoolName: 'Sunset Elementary', description: 'Fall 2025 survey closed with 84% participation', actor: 'System', timeAgo: '1 week ago' },
  { id: 'ac-4', category: 'survey', schoolId: 'oak-valley-middle', schoolName: 'Oak Valley Middle', description: 'Participation still below its 120-responses target — 48 responses (40%) with 6 days remaining', actor: 'System', timeAgo: '1 week ago', needsAttention: true },
  { id: 'ac-5', category: 'reopen', schoolId: 'west-valley-high', schoolName: 'West Valley High', description: 'Reopen request approved for Fall 2025 survey', actor: 'Karen Lawson', timeAgo: '1 week ago' },
  { id: 'ac-6', category: 'people', schoolId: 'eastgate-middle', schoolName: 'Eastgate Middle', description: 'Administrator invitation sent to dgreene@nhsd.edu', actor: 'Karen Lawson', timeAgo: '10 days ago' },
  { id: 'ac-7', category: 'school', schoolId: 'summit-high', schoolName: 'Summit High', description: 'Enrolment band updated to 1,000+', actor: 'Daniel Greene', timeAgo: '12 days ago' },
  { id: 'ac-8', category: 'settings', schoolId: null, schoolName: null, description: 'Survey reopen policy changed to “District approval required”', actor: 'Karen Lawson', timeAgo: '15 days ago' },
  { id: 'ac-9', category: 'report', schoolId: 'riverside-high', schoolName: 'Riverside High', description: 'Fall 2025 report published', actor: 'System', timeAgo: '16 days ago' },
  { id: 'ac-10', category: 'survey', schoolId: 'summit-high', schoolName: 'Summit High', description: 'Fall 2025 survey opened for grades 9–12', actor: 'Daniel Greene', timeAgo: '18 days ago' },
  { id: 'ac-11', category: 'reopen', schoolId: 'brookside-elementary', schoolName: 'Brookside Elementary', description: 'Reopen request submitted for Fall 2025 survey', actor: 'Alan Whitfield', timeAgo: '20 days ago' },
  { id: 'ac-12', category: 'people', schoolId: null, schoolName: null, description: 'Patricia Hayes assigned to Fairview Elementary', actor: 'Karen Lawson', timeAgo: '24 days ago' },
];

/* ------------------------------------------------------------------ */
/* Help                                                                */
/* ------------------------------------------------------------------ */

export type HelpArticle = {
  slug: string;
  section: 'getting-started' | 'managing-schools';
  title: string;
  summary: string;
  readingMinutes: number;
  body: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: 'navigating-your-school-profile',
    section: 'getting-started',
    title: 'Navigating your school profile',
    summary:
      'Where to find survey status, participation, reports and activity for a single school.',
    readingMinutes: 4,
    body: [
      {
        heading: 'What a school profile shows',
        paragraphs: [
          'Every school in your district has a profile made up of five tabs. Overview is the summary you land on; Surveys, Reports, Administrator and Activity each hold the full history for that area.',
          'The header stays fixed as you move between tabs, so the school name, level and current survey status are always in view.',
        ],
      },
      {
        heading: 'Reading the overview',
        paragraphs: [
          'The overview leads with participation against target. A school is flagged below target when responses fall under 60% of the target with fewer than seven days left in the window.',
        ],
        bullets: [
          'Participation — responses received against the target set when the survey opened.',
          'Satisfaction — the headline score from the most recent published report.',
          'Administrator — the person who can open and close surveys at this school.',
        ],
      },
    ],
  },
  {
    slug: 'understanding-participation-targets',
    section: 'getting-started',
    title: 'Understanding participation targets',
    summary: 'How targets are set, and what happens when a school falls short.',
    readingMinutes: 3,
    body: [
      {
        heading: 'How targets are calculated',
        paragraphs: [
          'A target is derived from the enrolment band of the participating grades. You can override it per survey when you open the window.',
        ],
      },
      {
        heading: 'When a school falls short',
        paragraphs: [
          'Schools below target appear on the district home page and are marked with an amber dot in the schools table. Administrators receive a reminder at the halfway point and again with three days remaining.',
        ],
      },
    ],
  },
  {
    slug: 'adding-a-school-to-your-district',
    section: 'managing-schools',
    title: 'Adding a school to your district',
    summary:
      'Create the school record, set its enrolment band, assign an administrator.',
    readingMinutes: 5,
    body: [
      {
        heading: 'Before you start',
        paragraphs: [
          'You need the school name, level, and approximate enrolment for the grades that will take the survey. Only district administrators can add schools.',
        ],
      },
      {
        heading: 'Add the school',
        paragraphs: [
          'Open Schools and choose Add school. Enter the name and level, then pick the enrolment band that covers the participating grades.',
        ],
        bullets: [
          'Name — as it appears on district records.',
          'Level — Elementary, Middle or High.',
          'Enrolment band — used to set the default participation target.',
        ],
      },
      {
        heading: 'Assign an administrator',
        paragraphs: [
          'A school without an administrator cannot open a survey. Invite one from the Administrator tab on the new school profile, or assign someone who already has an account.',
        ],
      },
    ],
  },
  {
    slug: 'who-administers-a-school',
    section: 'managing-schools',
    title: 'Who administers a school',
    summary:
      'The difference between district and school administrators, and what each can do.',
    readingMinutes: 4,
    body: [
      {
        heading: 'Two levels of access',
        paragraphs: [
          'District administrators see every school, approve reopen requests, and change district-wide policy. School administrators work inside the school assigned to them.',
        ],
      },
      {
        heading: 'What a school administrator can do',
        paragraphs: [
          'Open and close surveys, read reports for their own school, and submit a reopen request when a survey window needs extending.',
        ],
      },
      {
        heading: 'Changing an assignment',
        paragraphs: [
          'Open People, find the school, and use the Access toggle to enable or disable their sign-in. Removing the administrator from a school leaves it unable to run surveys, so assign a replacement first.',
        ],
      },
    ],
  },
];

export type SupportRequest = {
  id: string;
  reference: string;
  subject: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved';
  submittedOn: string;
  updatedAgo: string;
  lastMessage: string;
};

export const SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: 'sup-1',
    reference: 'CP-2201',
    subject: 'Bulk import of school administrators',
    category: 'People & access',
    status: 'in-progress',
    submittedOn: '16 Jul 2026',
    updatedAgo: '1 day ago',
    lastMessage:
      'Thanks Karen — our team is preparing a CSV template for you. Expect it within two working days.',
  },
  {
    id: 'sup-2',
    reference: 'CP-2188',
    subject: 'Fall 2025 report missing free-text answers',
    category: 'Reports',
    status: 'resolved',
    submittedOn: '2 Jul 2026',
    updatedAgo: '2 weeks ago',
    lastMessage:
      'Free-text answers are now included. Re-open the report to see the new section.',
  },
  {
    id: 'sup-3',
    reference: 'CP-2170',
    subject: 'Change district billing contact',
    category: 'Billing',
    status: 'open',
    submittedOn: '18 Jul 2026',
    updatedAgo: '2 days ago',
    lastMessage: 'Request received. A billing specialist will respond shortly.',
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function participationRate(responses: number, target: number) {
  if (!target) return 0;
  return Math.round((responses / target) * 100);
}

export function getSchool(id: string) {
  return SCHOOLS.find((s) => s.id === id) ?? null;
}

export function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
