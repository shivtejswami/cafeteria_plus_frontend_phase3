'use client';

import { HelpContactPage } from '@/components/common/Help';
import type { HelpContactCategory, HelpRoutes } from '@/components/common/Help';
import { CURRENT_USER, SUPPORT_REQUESTS } from '@/constants/districtData';

const districtHelpRoutes: HelpRoutes = {
  home: '/district/help',
  contact: '/district/help/contact',
  requests: '/district/help/my-requests',
  topic: (topicSlug) => `/district/help/${topicSlug}`,
  article: (topicSlug, articleSlug) => `/district/help/${topicSlug}/${articleSlug}`,
};

const CATEGORIES: HelpContactCategory[] = [
  { value: 'surveys', label: 'Surveys' },
  { value: 'reports', label: 'Reports' },
  { value: 'people-access', label: 'People & access' },
  { value: 'billing', label: 'Billing' },
  { value: 'something-else', label: 'Something else' },
];

/** "Help > contact support" (2242:26494). */
export function ContactSupport() {
  const openCount = SUPPORT_REQUESTS.filter((r) => r.status !== 'resolved').length;

  return (
    <HelpContactPage
      routes={districtHelpRoutes}
      categories={CATEGORIES}
      defaultEmail={CURRENT_USER.email}
      supportEmail="support@sfwgroup.org"
      openRequestCount={openCount}
    />
  );
}

export default ContactSupport;
