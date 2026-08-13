'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { Alert, BackLink, Button, PageHeading, TextField } from '@/app/(auth)/components/ui';
import { AUTH_ROUTES, FAKE_LATENCY, RATE_LIMIT_SECONDS } from '@/app/(auth)/constants';
import { useCountdown } from '@/app/(auth)/hooks/useCountdown';
import type { ForgotState } from '@/app/(auth)/types';
import { isValidEmail } from '@/app/(auth)/validation';

const DEMO_OUTCOMES: Record<string, ForgotState> = {
  'rate@sfwgroup.org': 'rate-limited',
  'network@sfwgroup.org': 'network-error',
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [forgotState, setForgotState] = useState<ForgotState>('idle');

  const onCooldownEnd = useCallback(() => setForgotState('ready'), []);
  const rateLimit = useCountdown({ onComplete: onCooldownEnd });

  const fieldsFilled = email.trim() !== '';
  const isSending = forgotState === 'sending';
  const isRateLimited = forgotState === 'rate-limited';
  const isInvalidFormat = forgotState === 'invalid-format';

  useEffect(() => {
    if (fieldsFilled && (forgotState === 'idle' || forgotState === 'network-error')) {
      setForgotState('ready');
    } else if (!fieldsFilled && forgotState === 'ready') {
      setForgotState('idle');
    }
  }, [fieldsFilled, forgotState]);

  const handleSendCode = () => {
    if (!fieldsFilled || isSending || isRateLimited) return;

    if (!isValidEmail(email)) {
      setForgotState('invalid-format');
      return;
    }

    setForgotState('sending');

    setTimeout(() => {
      const outcome = DEMO_OUTCOMES[email.toLowerCase().trim()];

      if (outcome) {
        setForgotState(outcome);
        if (outcome === 'rate-limited') rateLimit.start(RATE_LIMIT_SECONDS);
        return;
      }

      router.push(`${AUTH_ROUTES.enterCode}?email=${encodeURIComponent(email)}`);
    }, FAKE_LATENCY.sendCode);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') handleSendCode();
  };

  return (
    <>
      <BackLink href={AUTH_ROUTES.login}>Back to sign in</BackLink>

      <PageHeading title="Reset your password">
        Enter your email and we&apos;ll send you a 6-digit code to reset your password.
      </PageHeading>

      {isInvalidFormat && (
        <Alert tone="danger" icon="ri-error-warning-line" size="sm" className="mb-4">
          Enter a valid email address.
        </Alert>
      )}

      {isRateLimited && (
        <Alert tone="warning" icon="ri-timer-line" size="sm" className="mb-4" live>
          Too many requests. Try again in {rateLimit.secondsLeft}s.
        </Alert>
      )}

      {forgotState === 'network-error' && (
        <Alert
          tone="danger"
          icon="ri-wifi-off-line"
          size="sm"
          className="mb-4"
          action={{ label: 'Try again', onClick: handleSendCode }}
        >
          Couldn&apos;t send the code. Check your connection and try again.
        </Alert>
      )}

      <TextField
        id="forgot-email"
        label="Email"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (isInvalidFormat) setForgotState('ready');
        }}
        onKeyDown={handleKeyDown}
        disabled={isSending}
        placeholder="Please enter your email"
        autoComplete="email"
        invalid={isInvalidFormat}
        wrapperClassName="mb-6"
      />

      <Button
        onClick={handleSendCode}
        disabled={!fieldsFilled || isRateLimited}
        busy={isSending}
        busyLabel="Sending…"
      >
        Send code
      </Button>

      <p className="text-[11px] sm:text-xs mt-4 text-center text-[#9a9a9a]">
        We&apos;ll send a code to this email if an account exists.
      </p>
    </>
  );
}
