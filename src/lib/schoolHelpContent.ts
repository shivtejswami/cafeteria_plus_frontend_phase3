export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  body: string;
  topic: string;
}

export interface HelpTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const helpTopics: HelpTopic[] = [
  { id: 'getting-started', slug: 'getting-started', title: 'Getting started', description: 'Setting up your school, your account, and finding your way around.', icon: 'ri-rocket-line' },
  { id: 'surveys', slug: 'surveys', title: 'Running surveys', description: 'Creating, scheduling, sharing, monitoring, and managing student surveys.', icon: 'ri-clipboard-line' },
  { id: 'reports', slug: 'reports', title: 'Understanding reports', description: 'Reading your dashboard, scores, top items, insights, sentiment, and downloading PDFs.', icon: 'ri-file-chart-line' },
  { id: 'benchmarks', slug: 'benchmarks', title: 'Benchmarks & Survey to survey comparison', description: 'How comparisons work, why a benchmark may not be available, and comparing across periods.', icon: 'ri-bar-chart-grouped-line' },
  { id: 'privacy', slug: 'privacy', title: 'Privacy & anonymity', description: 'How student anonymity works and its limits, and what data is collected.', icon: 'ri-shield-check-line' },
  { id: 'account', slug: 'account', title: 'Account & subscription', description: 'Managing your account, notifications, and subscription status.', icon: 'ri-user-settings-line' },
];

export const helpArticles: HelpArticle[] = [
  {
    id: 'a1', slug: 'setting-up-school-profile', title: 'Setting up your school profile', topic: 'getting-started',
    snippet: 'How to configure your school details and get started with Cafeteria Pulse.',
    body: 'Once your school is registered with SFWG, you will receive an invitation to activate your administrator account. After logging in, go to your account settings to review your school name, address, and grade-band configuration.\n\nYour school profile determines which survey version students see and which benchmark comparison group your school belongs to. Grade-band configuration is set by SFWG during onboarding — if you need to change it, contact support.\n\nYou can also upload a school logo from the account page, which appears on your reports.',
  },
  {
    id: 'a2', slug: 'your-account-and-login', title: 'Your account and login', topic: 'getting-started',
    snippet: 'How to sign in, reset your password, and manage your account.',
    body: 'Access the Cafeteria Pulse school portal at the URL provided in your welcome email. Use the email address and password you set during activation.\n\nIf you forget your password, use the "Forgot password" link on the login page. You will receive a reset code by email. Codes expire after 15 minutes.\n\nTo update your password, go to Account → Security. Passwords must be at least 12 characters.',
  },
  {
    id: 'a3', slug: 'understanding-the-dashboard', title: 'Understanding the dashboard', topic: 'getting-started',
    snippet: 'A tour of the school admin dashboard and what each section means.',
    body: 'The dashboard is your home page after logging in. It shows:\n\n- A greeting with your school name\n- Quick links to common actions\n- Any surveys that need attention (live, scheduled, or recently closed)\n- Your latest report summary\n- A participation and sentiment trend chart\n\nUse the sidebar to navigate between Surveys, Reports, Benchmarks, Activity, and Help.',
  },
  {
    id: 'a4', slug: 'creating-a-new-survey', title: 'Creating a new survey', topic: 'surveys',
    snippet: 'Step-by-step guide to creating and configuring a student survey.',
    body: 'Go to [Surveys](/school-admin/surveys) → Create survey. You will step through:\n\n1. Survey name — give it a clear name like "Fall 2026 Survey"\n2. Grade band — confirm the band shown matches your school (set by SFWG)\n3. Schedule — set the open date, close date, and whether to auto-close on the end date\n4. Review — confirm all details before launching\n\nOnce created, the survey appears on your Surveys page as "Scheduled" until the open date arrives.',
  },
  {
    id: 'a5', slug: 'scheduling-a-survey', title: 'Scheduling a survey', topic: 'surveys',
    snippet: 'How to set open and close dates, and what happens when a survey is live.',
    body: 'During survey creation, you set:\n\n- Open date/time: When students can begin responding\n- Close date/time: When the survey stops accepting responses\n- Auto-close toggle: If on, the survey closes automatically at the close time\n\nWhile scheduled, the survey is not yet visible to students. You can edit the schedule until the survey opens. Once open, you can extend the close date but cannot move it earlier.',
  },
  {
    id: 'a6', slug: 'sharing-survey-with-students', title: 'How do I share the survey with students?', topic: 'surveys',
    snippet: 'Sharing the access code, link, and QR code with your students.',
    body: 'Once your survey is open, go to the survey detail page and click "Share." You will see:\n\n- An access code (for example, LUNCH7) unique to your school and survey period\n- A direct link students can use\n- A QR code for students to scan\n\nShare the access code with teachers, post it in common areas, or send the link via your usual school communication channels. Students enter the code at the survey start page to begin.\n\n> The access link only accepts responses while the survey is open. If a student tries the link after the survey closes, they will see a "survey closed" message. Need to understand why results are not visible while the survey is open? See [Why can\'t I see results while my survey is open?](/school-admin/help/surveys/why-no-results-while-open).',
  },
  {
    id: 'a7', slug: 'monitoring-participation', title: 'Monitoring participation', topic: 'surveys',
    snippet: 'Tracking response rates and understanding the participation target.',
    body: 'While a survey is open, the survey detail page shows:\n\n- Total responses received so far\n- Participation rate as a percentage of eligible students\n- A participation target indicator\n\nThe participation target is based on your school\'s enrolment. To protect anonymity, you cannot see which specific students have or have not responded — only the aggregate count.',
  },
  {
    id: 'a8', slug: 'pausing-extending-closing-survey', title: 'Pausing, extending, or closing a survey', topic: 'surveys',
    snippet: 'How to manage an in-progress survey and what each action does.',
    body: 'From the survey detail page while a survey is open:\n\n- Pause: Temporarily stops accepting new responses. Students who already started can finish. You can resume later.\n- Extend: Push the close date further out. You can only extend, not shorten.\n- Close early: Manually close the survey before the scheduled close date. This triggers report generation.\n\n! Closing a survey is permanent — once closed, it cannot be reopened without a formal request. See [How do I request a closed survey to be reopened?](/school-admin/help/surveys/request-reopen-closed-survey) for the process.',
  },
  {
    id: 'a9', slug: 'why-no-results-while-open', title: 'Why can\'t I see results while my survey is open?', topic: 'surveys',
    snippet: 'While a survey is open, only participation data is visible — scores and insights are generated once at close.',
    body: 'While a survey is open, only participation information is visible. You can see:\n\n- Response count — the number of students who have completed the survey so far\n- Approximate participation rate — the percentage of eligible students who have responded\n- Collection dates — when the survey opened and when it is scheduled to close\n\n> Preliminary scores, sentiment analysis, themes, and draft reports are never shown while a survey is open. The report is generated once, at close, as the single authoritative version. This protects student anonymity and ensures results are based on a complete dataset.\n\nTo check participation, go to [Surveys](/school-admin/surveys) and open the active survey.',
  },
  {
    id: 'a10', slug: 'reading-your-report', title: 'Reading your report dashboard', topic: 'reports',
    snippet: 'Understanding the overview, scores, and the six-concept framework.',
    body: 'Each report is organised into tabs:\n\n- Overview: Executive summary, participation stats, and key highlights\n- Scores: Six-concept scores with comparisons where available\n- Insights: AI-generated themes from student comments\n- Comments: All open-ended student comments, grouped by sentiment\n- Full report: Complete printable view\n\nScores range from 0–100. Higher is better. The six concepts are Taste, Freshness, Variety, Staff, Cleanliness, and Time to eat.',
  },
  {
    id: 'a11', slug: 'six-concepts-explained', title: 'Six concepts explained', topic: 'reports',
    snippet: 'Taste, Freshness, Variety, Staff, Cleanliness, and Time to eat — what each measures.',
    body: 'The Cafeteria Pulse survey measures six concepts:\n\n- Taste: Whether students enjoy the flavour of the food\n- Freshness: Perceived freshness and quality of ingredients\n- Variety: Whether there are enough different options\n- Staff: Friendliness and helpfulness of cafeteria staff\n- Cleanliness: Cleanliness of the cafeteria and eating areas\n- Time to eat: Whether students feel they have enough time to finish their meal\n\nEach concept is scored 0–100 from multiple survey questions.',
  },
  {
    id: 'a12', slug: 'small-sample-directional', title: 'What does "small sample — directional" mean?', topic: 'reports',
    snippet: 'When response counts are low, results carry a directional notice — useful but not definitive. Detailed breakdowns are suppressed below 10 responses.',
    body: 'When fewer than 30 students complete a survey, the report is shown with a "Small sample — directional only" notice. Results are still useful but may not represent the full student body — interpret them as indicative rather than definitive. The margin of error is larger because of the smaller respondent group.\n\nWhen fewer than 10 students respond:\n\n- Detailed breakdowns, comparisons, and AI-generated conclusions are suppressed to protect anonymity and avoid unreliable conclusions\n- The report itself is not withheld — you will still see high-level participation data and limited summary information\n\n! Minimum response thresholds are set by SFWG and may change. These rules exist to balance providing useful feedback with protecting student anonymity.\n\nIf zero or insufficient valid responses are received, no full report is generated.',
  },
  {
    id: 'a13', slug: 'top-items-and-sentiment', title: 'Understanding top items and sentiment', topic: 'reports',
    snippet: 'How favourite and least-favourite items are surfaced, and how sentiment themes work.',
    body: 'The report identifies:\n\n- Top-rated items: Menu items that students rated most positively\n- Lowest-rated items: Items that received the lowest ratings\n\nSentiment analysis scans all open-ended comments for themes — for example, "pizza is always cold" or "staff are really nice." These themes are grouped into positive and constructive categories so you can quickly spot patterns.',
  },
  {
    id: 'a14', slug: 'download-report-pdf', title: 'How do I download my report as a PDF?', topic: 'reports',
    snippet: 'Downloading a formatted PDF of your full report for sharing and record-keeping.',
    body: 'Open any published report and click the "Download" button in the report header. This generates a formatted PDF of your report.\n\nThe PDF includes all scores, charts, insights, top items, and comments — the complete published report in a print-ready format suitable for sharing with stakeholders such as school boards or parent committees.\n\n> There is one PDF — the full report. There is no separate "summary" variant or other output format.',
  },
  {
    id: 'a15', slug: 'benchmarks-and-comparisons', title: 'How benchmarks and comparisons work', topic: 'benchmarks',
    snippet: 'Understanding how your school compares to others and what the benchmark label means.',
    body: 'Benchmarks compare your school\'s concept scores against a group of comparable schools. They appear on your report\'s Scores tab and on the [Benchmarks](/school-admin/benchmarks) page.\n\nA benchmark becomes available when:\n\n- The comparison group has at least the minimum number of comparable schools\n- Those schools used the same survey version over a similar period\n\nIf your school is below the minimum threshold, you will see "will become available when enough comparable schools have participated" instead of benchmark data. It activates automatically — you do not need to request it.\n\nComparisons show de-identified group averages only. Other schools in the comparison group are never named. The label reads "Cafeteria Pulse participating-school benchmark" — not "national benchmark" — until an approved national dataset is activated.\n\n! Benchmarks require enough comparable schools running the same survey version. If your school is among the first to use a new version, benchmarks may not be available for your first survey period.',
  },
  {
    id: 'a16', slug: 'benchmark-not-available', title: 'Why isn\'t a benchmark available for my school yet?', topic: 'benchmarks',
    snippet: 'Benchmarks require a minimum cohort of comparable schools using the same survey version.',
    body: 'Benchmarks require a minimum number of schools using the same survey version over a similar period in the comparison group. If your school is the first to use a new version, or if there are not enough comparable schools in your cohort yet, the benchmark will not be available.\n\nIt will appear automatically once enough data exists. You do not need to request it.',
  },
  {
    id: 'a17', slug: 'survey-to-survey-comparisons', title: 'Survey to survey comparisons', topic: 'benchmarks',
    snippet: 'Comparing your school\'s results across different survey periods.',
    body: 'Survey to survey comparisons show how your school\'s scores have changed between two survey periods. Access them from Reports → Survey to survey.\n\nSelect two periods to compare. The comparison shows:\n\n- Score change per concept (with direction and magnitude)\n- Whether the change is statistically meaningful\n- A note if survey versions differ between periods\n\nLarge version differences may limit comparability.',
  },
  {
    id: 'a18', slug: 'student-anonymity', title: 'How student anonymity works', topic: 'privacy',
    snippet: 'How Cafeteria Pulse protects student identity and what data is never collected.',
    body: 'Cafeteria Pulse is designed to protect student anonymity:\n\n- No student names, email addresses, or ID numbers are ever collected\n- The survey does not track which student gave which answer\n- Results are only shown when enough students respond (minimum thresholds)\n- Individual responses are never shown to school staff\n\nStudents are informed of these protections on the privacy screen before they begin the survey.',
  },
  {
    id: 'a19', slug: 'what-data-is-collected', title: 'What data is collected', topic: 'privacy',
    snippet: 'A clear overview of the data points captured during a student survey.',
    body: 'The survey collects:\n\n- Ratings for menu items (multiple choice)\n- Satisfaction ratings (scale questions)\n- Open-ended comments (free text)\n\nIt does NOT collect: student names, email addresses, student ID numbers, demographic information, or any personally identifiable information.\n\nGrade band is associated at the school level, not per student.',
  },
  {
    id: 'a20', slug: 'account-and-notifications', title: 'Managing your account and notifications', topic: 'account',
    snippet: 'Updating your profile, password, and notification preferences.',
    body: 'From [Account](/school-admin/account), you can:\n\n- Update your display name and contact email\n- Change your password (requires current password)\n- Configure notification preferences: choose whether to receive emails when surveys open, close, or when reports are ready\n- Upload or change your school logo\n\nNotifications are sent to your account email. You can also view recent notifications from the bell icon in the top bar.',
  },
  {
    id: 'a21', slug: 'understanding-subscription', title: 'Understanding your subscription', topic: 'account',
    snippet: 'How your subscription works, what\'s included, and what happens at renewal.',
    body: 'Your school\'s Cafeteria Pulse subscription is managed by SFWG. The Subscription page shows:\n\n- Current subscription status (active, expiring, expired)\n- Coverage period (start and end dates)\n- What\'s included in your plan\n- Renewal status\n\nIf your subscription is near expiry, you will see a notice on your dashboard. Contact SFWG for questions about pricing, renewals, or upgrading your plan.',
  },
  {
    id: 'a22', slug: 'request-reopen-closed-survey', title: 'How do I request a closed survey to be reopened?', topic: 'surveys',
    snippet: 'A school admin cannot reopen a survey directly. Submit a reopen request, and a district or SFWG administrator decides.',
    body: 'A school administrator cannot reopen a closed survey directly. If you need to reopen one, you must submit a reopen request.\n\nTo submit a request:\n\n1. Go to [Surveys](/school-admin/surveys) and find the closed survey\n2. Open the survey detail page\n3. Select "Request reopen" and provide a reason for the request\n4. Submit the request\n\nA district or SFWG administrator reviews the request. If approved:\n\n- The survey reopens with a new closing date\n- The current report becomes temporarily unavailable and is superseded\n- A new report version is generated when the survey closes again\n\nYou can track the status of your request from the survey detail page:\n\n- Pending — the request is under review\n- Approved — the survey has been reopened\n- Declined — the survey remains closed (the reason is provided)\n\n> A reopen request may not be available during certain periods, such as end-of-year processing. Contact [SFWG support](/school-admin/help/contact) if the option is not visible.',
  },
  {
    id: 'a23', slug: 'cancelling-survey-before-close', title: 'Cancelling a survey before it closes', topic: 'surveys',
    snippet: 'Cancellation is permanent — no report is produced, and the record is retained in your school\'s history.',
    body: 'Before cancelling, consider pausing or extending the survey instead. Cancellation is permanent.\n\nTo cancel:\n\n1. Go to [Surveys](/school-admin/surveys) and open the active survey\n2. Select "Cancel survey"\n3. Confirm the cancellation and provide a reason\n4. The survey closes immediately and no report is generated\n\n! Cancelling a survey is irreversible. No official report is produced once cancelled. The record is retained in your school\'s survey history for audit purposes, but no scores or insights are calculated.\n\nIf you simply need more time, extend the closing date instead. If you need to stop temporarily, pause the survey — you can resume later. See [Pausing, extending, or closing a survey](/school-admin/help/surveys/pausing-extending-closing-survey) for more details.',
  },
  {
    id: 'a24', slug: 'adding-school-logo-to-reports', title: 'Adding your school logo to reports', topic: 'account',
    snippet: 'Where to upload your logo, accepted formats and size, and where it appears on reports and PDFs.',
    body: 'You can add your school logo to appear on reports and the downloadable PDF. The logo appears on the right side of the report header.\n\nTo upload or change your logo:\n\n1. Go to [Account](/school-admin/account)\n2. Find the "School logo" section\n3. Click "Upload" and select an image file\n4. Preview how it looks, then save\n\nAccepted formats: PNG or JPEG\nRecommended size: 400 × 200 pixels (width × height)\nMaximum file size: 5 MB\n\nThe logo updates across all existing and future reports once saved.\n\n> If you do not upload a logo, the report header displays your school name only — no placeholder or fallback image is shown.',
  },
  {
    id: 'a25', slug: 'using-the-activity-page', title: 'Using the Activity page', topic: 'getting-started',
    snippet: 'What the school\'s Activity feed records and how to filter it.',
    body: 'The Activity page keeps a chronological record of events in your school\'s Cafeteria Pulse account. Access it from the sidebar under [Activity](/school-admin/activity).\n\nThe feed records:\n\n- Surveys opened — when a scheduled survey becomes live for students\n- Surveys closed — when a survey ends and report generation begins\n- Reports published — when a new report is available to view\n- Account events — logins, password changes, and profile updates\n\nTo filter the feed:\n\n1. Use the filter bar at the top of the page\n2. Select an event type to narrow the list\n3. Select a date range to show activity within a specific period\n\nEach entry shows the event type, a brief description, and the date and time it occurred.\n\n> The Activity feed is read-only — it cannot be edited, deleted, or exported. It provides an audit trail of account and survey events.',
  },
];

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.slug === slug);
}

export function getArticlesByTopic(topicId: string): HelpArticle[] {
  return helpArticles.filter((a) => a.topic === topicId);
}

export function getTopicBySlug(slug: string): HelpTopic | undefined {
  return helpTopics.find((t) => t.slug === slug);
}

export function getTopicById(id: string): HelpTopic | undefined {
  return helpTopics.find((t) => t.id === id);
}

export function getArticleCountForTopic(topicId: string): number {
  return helpArticles.filter((a) => a.topic === topicId).length;
}

export function searchArticles(query: string): HelpArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return helpArticles.filter(
    (a) => a.title.toLowerCase().includes(q) || a.snippet.toLowerCase().includes(q) || a.body.toLowerCase().includes(q),
  );
}

export interface PopularQuestion {
  id: number;
  question: string;
  articleSlug: string;
  topicSlug: string;
}

export const popularQuestions: PopularQuestion[] = [
  { id: 1, question: 'How do I share the survey with students?', articleSlug: 'sharing-survey-with-students', topicSlug: 'surveys' },
  { id: 2, question: 'Why can\'t I see results while my survey is open?', articleSlug: 'why-no-results-while-open', topicSlug: 'surveys' },
  { id: 3, question: 'What does "small sample — directional" mean?', articleSlug: 'small-sample-directional', topicSlug: 'reports' },
  { id: 4, question: 'Why isn\'t a benchmark available for my school yet?', articleSlug: 'benchmark-not-available', topicSlug: 'benchmarks' },
  { id: 5, question: 'How do I download my report as a PDF?', articleSlug: 'download-report-pdf', topicSlug: 'reports' },
  { id: 6, question: 'How do I request a closed survey to be reopened?', articleSlug: 'request-reopen-closed-survey', topicSlug: 'surveys' },
];