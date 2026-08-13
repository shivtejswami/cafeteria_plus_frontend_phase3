'use client';

import { useSearchParams } from 'next/navigation';
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

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const resetPasswordHref = email
    ? `${AUTH_ROUTES.resetPassword}?email=${encodeURIComponent(email)}`
    : AUTH_ROUTES.resetPassword;

  return (
    <StatusScreen
      tone="success"
      icon="check"
      customIcon={<CheckIcon />}
      title="OTP Verified"
      messages={['OTP has been verified successfully.']}
    >
      <div className="mt-6">
        <ButtonLink href={resetPasswordHref}>
          Reset Password
        </ButtonLink>
      </div>
    </StatusScreen>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
