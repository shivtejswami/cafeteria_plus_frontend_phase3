'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

import {
  Alert,
  Button,
  ButtonLink,
  LoadingBlock,
  PageHeading,
  PasswordField,
  PasswordRequirements,
  StatusScreen,
} from '@/app/(auth)/components/ui';
import { AUTH_ROUTES, FAKE_LATENCY } from '@/app/(auth)/constants';
import { checkPasswordStrength, describePasswordGaps } from '@/app/(auth)/validation';

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

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const canSubmit = password.length > 0 && confirmPassword.length > 0 && !isSubmitting;

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;

    setErrorMessage(null);

    const strength = checkPasswordStrength(password);
    const gaps = describePasswordGaps(strength);
    if (gaps) {
      setErrorMessage(gaps);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, FAKE_LATENCY.savePassword);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') handleSubmit();
  };

  if (isSuccess) {
    return (
      <StatusScreen
        tone="success"
        icon="check"
        customIcon={<CheckIcon />}
        title="Password updated"
        messages={[
          'Your password has been changed. You can now sign in with your new password.',
        ]}
      >
        <div className="mt-6">
          <ButtonLink href={AUTH_ROUTES.login}>
            Sign in
          </ButtonLink>
        </div>
      </StatusScreen>
    );
  }

  const strength = checkPasswordStrength(password);

  return (
    <>
      <PageHeading title="Create a new password">
        Choose a strong password you don&apos;t use elsewhere.
      </PageHeading>

      {errorMessage && (
        <Alert tone="danger" icon="ri-error-warning-line" size="sm" className="mb-4">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          invalid={Boolean(errorMessage)}
          wrapperClassName="mb-4"
          footer={<PasswordRequirements strength={strength} hasInput={password.length > 0} className="mt-2" />}
        />

        <PasswordField
          id="confirm-new-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          invalid={Boolean(errorMessage)}
          wrapperClassName="mb-6"
        />

        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
          busy={isSubmitting}
          busyLabel="Resetting password…"
        >
          Reset password
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
