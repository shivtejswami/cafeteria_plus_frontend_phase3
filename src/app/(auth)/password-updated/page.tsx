'use client';

import { Suspense } from 'react';

import { ButtonLink, LoadingBlock, StatusScreen } from '@/app/(auth)/components/ui';
import { AUTH_ROUTES } from '@/app/(auth)/constants';

function CheckIcon() {
  return (
    <svg
      className="w-7 h-7 text-[#15803d]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PasswordUpdatedContent() {
  return (
    <StatusScreen
      tone="success"
      icon="check"
      customIcon={<CheckIcon />}
      title="Password updated"
      messages={['Your password has been changed. You can now sign in with your new password.']}
    >
      <div className="mt-6">
        <ButtonLink href={AUTH_ROUTES.login}>
          Sign in
        </ButtonLink>
      </div>
    </StatusScreen>
  );
}

export default function PasswordUpdatedPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <PasswordUpdatedContent />
    </Suspense>
  );
}
