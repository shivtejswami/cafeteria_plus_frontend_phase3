export interface SchoolSupportRequest {
  id: string;
  reference: string;
  category: string;
  subject: string;
  message: string;
  contactEmail: string;
  submittedDate: string;
  status: 'open' | 'resolved';
  resolvedDate?: string;
  /** What SFWG did; shown in the expanded row once resolved. */
  resolutionNote?: string;
  attachmentName?: string;
}

export const schoolSupportRequests: SchoolSupportRequest[] = [
  {
    id: 'sr1',
    reference: 'SR-LP2M8X',
    category: 'Running a survey',
    subject: 'Survey link not received by half of Grade 7 students',
    message: 'We opened the Fall survey on Monday but about half of the Grade 7 students say they never received the link. They tried entering the access code and it worked for some but not others. Can you help figure out what happened?',
    contactEmail: 'sarah.nguyen@hillsidemiddle.edu',
    submittedDate: '2026-07-08',
    status: 'resolved',
    resolvedDate: '2026-07-10',
    resolutionNote:
      'Identified a delivery issue with the bulk email provider — the Grade 7 batch was queued but not sent due to a rate-limit threshold. Cleared the queue and re-sent all missing links. All 142 students now confirmed as receiving the survey link.',
    attachmentName: 'student_error_screenshot.png',
  },
  {
    id: 'sr2',
    reference: 'SR-9K4TR2',
    category: 'Reports',
    subject: 'Spring 2025 report showing "small sample" — can we get more detail?',
    message: 'Our Spring 2025 report is flagged as a small sample with only 27 responses. Is there any way to get more detailed concept scores despite the low count? We need to present findings to the school board next week and the directional flag makes it hard to draw conclusions.',
    contactEmail: 'sarah.nguyen@hillsidemiddle.edu',
    submittedDate: '2026-06-12',
    status: 'resolved',
    resolvedDate: '2026-06-14',
    resolutionNote:
      'Concept scores stay hidden below 30 responses to protect reliability and student anonymity, so we cannot release a detailed breakdown for this period. Sent guidance on presenting directional results to the board, plus tips for lifting participation in the next cycle.',
  },
  {
    id: 'sr3',
    reference: 'SR-W7HN5P',
    category: 'Access & login',
    subject: 'Cannot log in — "account not found" error',
    message: 'I tried logging in this morning but got an "account not found" error. I\'ve been using the same credentials for the past year. I need to check on our Fall survey response rates today — any help would be appreciated.',
    contactEmail: 'sarah.nguyen@hillsidemiddle.edu',
    submittedDate: '2026-07-19',
    status: 'open',
  },
  {
    id: 'sr4',
    reference: 'SR-F3BQ6M',
    category: 'Benchmarks',
    subject: 'Benchmark comparison missing for our school',
    message: 'We ran the Fall 2024 survey and the report is published, but the benchmark comparison tab says "not available." Other schools in our district seem to have it. Can you check if something is configured wrong on our account?',
    contactEmail: 'sarah.nguyen@hillsidemiddle.edu',
    submittedDate: '2026-07-15',
    status: 'open',
    attachmentName: 'benchmark_missing_screenshot.png',
  },
];