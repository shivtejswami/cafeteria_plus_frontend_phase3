'use client';

import { HelpRequestsPage } from '@/components/common/Help';
import { schoolSupportRequests } from '@/lib/schoolSupportRequests';
import { schoolHelpRoutes } from '@/lib/schoolHelpRoutes';

export default function RequestsPage() {
  return <HelpRequestsPage routes={schoolHelpRoutes} requests={schoolSupportRequests} />;
}
