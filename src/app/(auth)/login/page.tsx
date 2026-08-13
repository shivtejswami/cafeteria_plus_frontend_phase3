'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';

import {
  Alert,
  Button,
  ButtonLink,
  PageHeading,
  PasswordField,
  StatusScreen,
  SupportNote,
  TextField,
} from '@/app/(auth)/components/ui';
import {
  AUTH_ROUTES,
  FAKE_LATENCY,
  PORTAL_ROUTES,
  RATE_LIMIT_SECONDS,
} from '@/app/(auth)/constants';
import { useCountdown } from '@/app/(auth)/hooks/useCountdown';
import type { LoginState } from '@/app/(auth)/types';

/** Demo accounts that drive each sign-in outcome in this build. */
const DEMO_OUTCOMES: Record<string, LoginState> = {
  'deactivated@sfwgroup.org': 'deactivated',
  'suspended@sfwgroup.org': 'suspended',
  'unverified@sfwgroup.org': 'error-unverified',
  'rate@sfwgroup.org': 'error-rate-limited',
  'network@sfwgroup.org': 'error-network',
  'emily@sfwgroup.org': 'error-credentials',
  'error@sfwgroup.org': 'error-credentials',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>('idle');

  const onCooldownEnd = useCallback(() => setLoginState('ready'), []);
  const rateLimit = useCountdown({ onComplete: onCooldownEnd });

  const fieldsFilled = email.trim() !== '' && password !== '';
  const isSigningIn = loginState === 'submitting';
  const isRateLimited = loginState === 'error-rate-limited';
  const isDeactivated = loginState === 'deactivated';
  const isSuspended = loginState === 'suspended';

  useEffect(() => {
    if (fieldsFilled && loginState === 'idle') {
      setLoginState('ready');
    } else if (!fieldsFilled && loginState === 'ready') {
      setLoginState('idle');
    }
  }, [fieldsFilled, loginState]);

  const handleSignIn = () => {
    if (!fieldsFilled || isSigningIn || isRateLimited) return;

    setLoginState('submitting');

    setTimeout(() => {
      const outcome = DEMO_OUTCOMES[email.toLowerCase().trim()];

      if (outcome) {
        setLoginState(outcome);
        if (outcome === 'error-rate-limited') {
          rateLimit.start(RATE_LIMIT_SECONDS);
        }
        return;
      }

      // Default success: redirect to the portal home.
      window.location.href = PORTAL_ROUTES.home;
    }, FAKE_LATENCY.signIn);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') handleSignIn();
  };

  if (isDeactivated) {
    return (
      <StatusScreen
        tone="danger"
        icon="ri-forbid-line"
        title="Account deactivated"
        messages={[
          'Your account has been deactivated by your organization administrator.',
          'Please contact your system administrator to reactivate your access.',
        ]}
      >
        <SupportNote action="if you believe this is an error." className="mt-6 mb-6" />
        <ButtonLink href={AUTH_ROUTES.login} variant="secondary">
          Back to sign in
        </ButtonLink>
      </StatusScreen>
    );
  }

  if (isSuspended) {
    return (
      <StatusScreen
        tone="warning"
        icon="ri-pause-circle-line"
        title="Your account has been suspended"
        messages={[
          'Interactive access for SFW Group is currently suspended. Your surveys and reports are retained. Nothing has been deleted.',
        ]}
      >
        <SupportNote action="to restore access." className="mt-6 mb-6" />
        <ButtonLink href={AUTH_ROUTES.login} variant="secondary">
          Back to sign in
        </ButtonLink>
      </StatusScreen>
    );
  }

  return (
    <>
      <PageHeading title="Sign in">
        Welcome back. Sign in to manage your survey reports.
      </PageHeading>

      {loginState === 'error-credentials' && (
        <Alert tone="danger" icon="ri-error-warning-line" size="sm" className="mb-4">
          Incorrect email or password.
        </Alert>
      )}

      {loginState === 'error-unverified' && (
        <Alert
          tone="warning"
          icon="ri-mail-send-line"
          size="sm"
          className="mb-4"
        >
          Please verify your email address to sign in. Check your inbox for the verification link.
        </Alert>
      )}

      {isRateLimited && (
        <Alert tone="warning" icon="ri-timer-line" size="sm" className="mb-4" live>
          Too many attempts. Try again in {rateLimit.secondsLeft}s.
        </Alert>
      )}

      {loginState === 'error-network' && (
        <Alert
          tone="danger"
          icon="ri-wifi-off-line"
          size="sm"
          className="mb-4"
          action={{ label: 'Try again', onClick: handleSignIn }}
        >
          Connection lost. Check your internet connection and try again.
        </Alert>
      )}

      <TextField
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSigningIn}
        placeholder="Please enter your email"
        autoComplete="email"
        invalid={loginState === 'error-credentials'}
      />

      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSigningIn}
        placeholder="Enter your password"
        autoComplete="current-password"
        invalid={loginState === 'error-credentials'}
      />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-5 sm:mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="w-4 h-4 rounded accent-[#6d28d9] cursor-pointer"
          />
          <span className="text-xs text-[#6d6d6d]">Remember me</span>
        </label>
        <Link
          href={AUTH_ROUTES.forgotPassword}
          className="text-xs sm:text-sm font-medium text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        onClick={handleSignIn}
        disabled={!fieldsFilled || isRateLimited}
        busy={isSigningIn}
        busyLabel="Signing in…"
      >
        Sign in
      </Button>
    </>
  );
}
