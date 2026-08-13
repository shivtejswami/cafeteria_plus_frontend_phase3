'use client';

import { useMemo } from 'react';
import { HelpRequestsPage } from '@/components/common/Help';
import type { HelpRoutes, HelpSupportRequestItem } from '@/components/common/Help';
import { SUPPORT_REQUESTS } from '@/constants/districtData';

const districtHelpRoutes: HelpRoutes = {
  home: '/district/help',
  contact: '/district/help/contact',
  requests: '/district/help/my-requests',
  topic: (topicSlug) => `/district/help/${topicSlug}`,
  article: (topicSlug, articleSlug) => `/district/help/${topicSlug}/${articleSlug}`,
};

/** "Help > my requests" (2242:26494). */
export function MyRequests() {
  const requests = useMemo<HelpSupportRequestItem[]>(
    () =>
      SUPPORT_REQUESTS.map((r) => ({
        id: r.id,
        reference: r.reference,
        category: r.category,
        subject: r.subject,
        message: r.lastMessage,
        submittedDate: r.submittedOn,
        status: r.status,
        updatedLabel: r.updatedAgo,
      })),
    []
  );

  return <HelpRequestsPage routes={districtHelpRoutes} requests={requests} />;
}

export default MyRequests;
