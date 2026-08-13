'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { ButtonLink, LoadingBlock, StatusScreen, SupportNote } from '@/app/(auth)/components/ui';
import { AUTH_ROUTES, SUPPORT_EMAIL } from '@/app/(auth)/constants';

const DEFAULT_NAMES = {
  district: 'North Hills School District',
  school: 'Hillside Middle',
} as const;

function AccountInactiveContent() {
  const searchParams = useSearchParams();
  const orgType = searchParams.get('type') === 'district' ? 'district' : 'school';
  const orgName = searchParams.get('name') || DEFAULT_NAMES[orgType];

  const scope =
    orgType === 'district'
      ? 'Surveys and reports for schools in this district are suspended. No data has been deleted.'
      : 'Surveys and reports for this school are suspended. No data has been deleted.';

  return (
    <StatusScreen
      tone="danger"
      icon="ri-forbid-line"
      title={`This ${orgType} has been deactivated`}
      messages={[
        <>
          <strong>{orgName}</strong> is no longer active on the platform.
        </>,
        scope,
      ]}
    >
      <SupportNote action="to restore access." />
      <ButtonLink href={`mailto:${SUPPORT_EMAIL}`} className="mb-3">
        Contact SFWG
      </ButtonLink>
      <ButtonLink href={AUTH_ROUTES.login} variant="secondary">
        Back to sign in
      </ButtonLink>
    </StatusScreen>
  );
}

export default function AccountInactivePage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <AccountInactiveContent />
    </Suspense>
  );
}
