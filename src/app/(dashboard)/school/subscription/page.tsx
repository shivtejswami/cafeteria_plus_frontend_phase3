'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SubscriptionPage from '@/components/school-admin/subscription/SubscriptionPage';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import {
  schoolAdminData,
  readOnlyData,
  subscriptionDataActive,
  subscriptionDataGrace,
  subscriptionDataReadOnly,
  type SubscriptionData,
} from '@/lib/schoolAdminData';

/**
 * Until SFWG drives these states for real, `?state=` and `?billing=` let the
 * lifecycle screens be reviewed:
 *   ?state=grace | read-only        ?billing=standalone
 */
function SubscriptionRouteInner() {
  const { isReadOnly } = useReadOnlyMode();
  const searchParams = useSearchParams();

  const state = searchParams.get('state');
  const isStandalone = searchParams.get('billing') === 'standalone';

  const base: SubscriptionData =
    state === 'grace'
      ? subscriptionDataGrace
      : state === 'read-only' || isReadOnly
        ? subscriptionDataReadOnly
        : subscriptionDataActive;

  const subscriptionData: SubscriptionData = isStandalone
    ? { ...base, customerType: 'school', districtName: null }
    : base;

  const usesReadOnlyShell = subscriptionData.status === 'read-only';

  return (
    <SubscriptionPage
      schoolData={usesReadOnlyShell ? readOnlyData : schoolAdminData}
      subscriptionData={subscriptionData}
    />
  );
}

export default function SubscriptionRoute() {
  return (
    <Suspense fallback={null}>
      <SubscriptionRouteInner />
    </Suspense>
  );
}
