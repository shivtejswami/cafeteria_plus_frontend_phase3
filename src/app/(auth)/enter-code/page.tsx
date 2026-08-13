'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

import {
  Alert,
  BackLink,
  Button,
  createEmptyCode,
  LoadingBlock,
  OtpInput,
  PageHeading,
} from '@/app/(auth)/components/ui';
import {
  AUTH_ROUTES,
  FAKE_LATENCY,
  MAX_CODE_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
} from '@/app/(auth)/constants';
import { formatCountdown, useCountdown } from '@/app/(auth)/hooks/useCountdown';
import type { CodeState } from '@/app/(auth)/types';

const DEMO_VALID_CODE = '123456';
const DEMO_EXPIRED_CODE = '999999';
const RESENT_NOTICE_MS = 3500;
const AUTO_VERIFY_DELAY_MS = 300;

function EnterCodeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [codeState, setCodeState] = useState<CodeState>('default');
  const [digits, setDigits] = useState<string[]>(createEmptyCode);
  const [resent, setResent] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const cooldown = useCountdown({ initialSeconds: RESEND_COOLDOWN_SECONDS });

  const allFilled = digits.every((digit) => digit !== '');
  const isVerifying = codeState === 'verifying';
  const isLocked = codeState === 'too-many-attempts';
  const isExpired = codeState === 'expired';
  const canVerify = allFilled && !isVerifying && !isLocked;

  const handleVerify = useCallback(() => {
    if (!allFilled || isVerifying || isLocked) return;

    setCodeState('verifying');

    setTimeout(() => {
      const code = digits.join('');

      if (code === DEMO_VALID_CODE) {
        window.location.href = `${AUTH_ROUTES.verifyOtp}?email=${encodeURIComponent(email)}`;
        return;
      }

      if (code === DEMO_EXPIRED_CODE) {
        setCodeState('expired');
        return;
      }

      const attemptsUsed = attempts + 1;
      setAttempts(attemptsUsed);

      if (attemptsUsed >= MAX_CODE_ATTEMPTS) {
        setCodeState('too-many-attempts');
        return;
      }

      // The digits stay on screen so the user can see and correct what they typed.
      setCodeState('error');
    }, FAKE_LATENCY.verifyCode);
  }, [allFilled, attempts, digits, email, isLocked, isVerifying]);

  useEffect(() => {
    if (!allFilled || codeState !== 'default') return;

    const timer = setTimeout(handleVerify, AUTO_VERIFY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [allFilled, codeState, handleVerify]);

  useEffect(() => {
    if (!resent) return;

    const timer = setTimeout(() => setResent(false), RESENT_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [resent]);

  const handleResend = () => {
    if (cooldown.secondsLeft > 0) return;

    cooldown.start(RESEND_COOLDOWN_SECONDS);
    setDigits(createEmptyCode());
    setCodeState('default');
    setAttempts(0);
    setResent(true);
  };

  const handleDigitsChange = (next: string[]) => {
    setDigits(next);
    if (codeState === 'error') setCodeState('default');
  };

  const resendAction = { label: 'Request a new code →', onClick: handleResend };

  return (
    <>
      <BackLink href={AUTH_ROUTES.forgotPassword}>Back</BackLink>

      <PageHeading title="Enter the code">
        We sent a 6-digit code to <span className="font-medium text-[#2b2b2b] break-all">{email || 'your email'}</span>. Enter
        it below to continue.
      </PageHeading>

      <div className="mb-4">
        <p className="block text-[13px] sm:text-sm font-medium mb-3 text-[#2b2b2b]">Verification code</p>
        <OtpInput
          value={digits}
          onChange={handleDigitsChange}
          error={codeState === 'error'}
          disabled={isVerifying || isExpired || isLocked}
        />
      </div>

      {codeState === 'error' && (
        <Alert tone="danger" icon="ri-error-warning-line" size="sm" className="mb-4">
          That code isn&apos;t correct. Please check and try again.
        </Alert>
      )}

      {isExpired && (
        <Alert
          tone="warning"
          icon="ri-time-line"
          size="sm"
          className="mb-4"
          title="This code has expired."
          action={resendAction}
        />
      )}

      {isLocked && (
        <Alert
          tone="warning"
          icon="ri-alert-line"
          size="sm"
          className="mb-4"
          title="Too many attempts."
          action={resendAction}
        />
      )}

      {resent && (
        <p className="text-[11px] sm:text-xs text-center mb-4 text-[#22a121]" role="status">
          A new code has been sent.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-center mb-5 sm:mb-6 text-[11px] sm:text-xs">
        <span className="text-[#9a9a9a]">Didn&apos;t get the code?</span>
        {cooldown.secondsLeft > 0 ? (
          <span className="text-[#9a9a9a]" aria-live="polite">
            Resend code in {formatCountdown(cooldown.secondsLeft)}
          </span>
        ) : (
          <button type="button" onClick={handleResend} className="font-medium text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2">
            Resend code
          </button>
        )}
      </div>

      <Button onClick={handleVerify} disabled={!canVerify} busy={isVerifying} busyLabel="Verifying…">
        Verify
      </Button>

      <p className="text-[11px] sm:text-xs mt-4 text-center text-[#9a9a9a]">The code expires in 10 minutes.</p>
    </>
  );
}

export default function EnterCodePage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <EnterCodeContent />
    </Suspense>
  );
}
