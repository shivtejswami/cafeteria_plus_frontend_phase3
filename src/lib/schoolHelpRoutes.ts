import type { HelpContactCategory, HelpRoutes } from '@/components/common/Help';

/** Where the school dashboard mounts each shared help screen. */
export const schoolHelpRoutes: HelpRoutes = {
  home: '/school/help',
  contact: '/school/help/contact',
  requests: '/school/help/requests',
  topic: (topicSlug) => `/school/help/${topicSlug}`,
  article: (topicSlug, articleSlug) => `/school/help/${topicSlug}/${articleSlug}`,
};

export const schoolContactCategories: HelpContactCategory[] = [
  { value: 'access-login', label: 'Access & login' },
  { value: 'running-survey', label: 'Running a survey' },
  { value: 'reports', label: 'Reports' },
  { value: 'benchmarks', label: 'Benchmarks' },
  { value: 'account-subscription', label: 'Account & subscription' },
  { value: 'something-else', label: 'Something else' },
  { value: 'other', label: 'Other' },
];

export const SUPPORT_EMAIL = 'support@sfwgroup.org';
