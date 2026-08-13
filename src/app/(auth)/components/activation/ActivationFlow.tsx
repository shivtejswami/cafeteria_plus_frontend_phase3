'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';

import {
  Alert,
  Button,
  ButtonLink,
  LoadingBlock,
  PageHeading,
  PasswordField,
  PasswordRequirements,
  StatusScreen,
  StepBadge,
  SupportNote,
  TextField,
} from '@/app/(auth)/components/ui';
import {
  AUTH_ROUTES,
  FAKE_LATENCY,
  PORTAL_ROUTES,
  SUPPORT_EMAIL,
} from '@/app/(auth)/constants';
import type { ActivationData, ActivationScreen } from '@/app/(auth)/types';
import { checkPasswordStrength, describePasswordGaps } from '@/app/(auth)/validation';

import {
  DEFAULT_ACTIVATION_TOKEN,
  resolveActivationToken,
  roleLabel,
  totalSteps,
} from './activationTokens';
import { EMPTY_LOGO_STATE, LogoUploader } from './LogoUploader';
import type { LogoState } from './LogoUploader';
import { TermsDocument, TermsSummary } from './TermsDocument';

const STEP_ORDER: ActivationScreen[] = ['password', 'details', 'terms'];

interface ActivationFlowProps {
  /** Token used when the URL carries none, so the screen still renders in review builds. */
  fallbackToken?: string;
}

export function ActivationFlow({ fallbackToken = DEFAULT_ACTIVATION_TOKEN }: ActivationFlowProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? searchParams.get('preview') ?? fallbackToken;

  const [screen, setScreen] = useState<ActivationScreen>('loading');
  const [activation, setActivation] = useState<ActivationData | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [logo, setLogo] = useState<LogoState>(EMPTY_LOGO_STATE);
  const [logoWasSkipped, setLogoWasSkipped] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const entry = resolveActivationToken(token);

    if (!entry) {
      setScreen('invalid');
      return;
    }

    const timer = setTimeout(() => {
      if (entry.type === 'expired') {
        setActivation(null);
        setScreen('expired');
        return;
      }

      setActivation(entry.data);
      setFullName(entry.data.fullName);

      if (entry.type === 'valid') setScreen('password');
      if (entry.type === 'used') setScreen('already-active');
      if (entry.type === 'deactivated') setScreen('deactivated');
    }, FAKE_LATENCY.resolveToken);

    return () => clearTimeout(timer);
  }, [token]);

  const isSchool = activation?.role === 'school';
  const strength = checkPasswordStrength(password);

  const goToPortal = () => {
    const role = activation?.role;
    window.location.href =
      role === 'school'
        ? PORTAL_ROUTES.school
        : role === 'district'
          ? PORTAL_ROUTES.district
          : PORTAL_ROUTES.home;
  };

  const advance = (next: ActivationScreen, delay: number, before?: () => void) => {
    setSubmitting(true);
    setSubmitError(null);

    setTimeout(() => {
      setSubmitting(false);
      before?.();
      setScreen(next);
    }, delay);
  };

  const handlePasswordStep = () => {
    setPasswordError(null);
    setConfirmError(null);
    setSubmitError(null);

    const gaps = describePasswordGaps(strength);
    if (gaps) {
      setPasswordError(gaps);
      setSubmitError(gaps);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords don't match.");
      setSubmitError("Passwords don't match.");
      return;
    }

    advance('details', FAKE_LATENCY.savePassword);
  };

  const handleDetailsStep = () => {
    if (logo.uploading) return;

    advance('terms', FAKE_LATENCY.saveDetails, () => {
      if (isSchool && logo.skipped) setLogoWasSkipped(true);
      setTermsAccepted(false);
    });
  };

  const handleTermsStep = () => {
    if (!termsAccepted) return;
    advance('success', FAKE_LATENCY.savePassword);
  };

  const goBack = () => {
    const index = STEP_ORDER.indexOf(screen);
    if (index > 0) setScreen(STEP_ORDER[index - 1]);
  };

  if (screen === 'loading') {
    return <LoadingBlock label="Verifying your invitation…" />;
  }

  if (screen === 'invalid') {
    return (
      <StatusScreen
        tone="danger"
        icon="ri-forbid-line"
        title="Invalid invitation"
        messages={["This link isn't valid. If you were expecting an invitation, contact SFWG."]}
      >
        <ButtonLink href={AUTH_ROUTES.login} variant="secondary">
          Go to sign in
        </ButtonLink>
      </StatusScreen>
    );
  }

  if (screen === 'expired') {
    return (
      <StatusScreen
        tone="warning"
        icon="ri-history-line"
        title="This invitation has expired"
        messages={['Invitations are valid for a limited time. This one is no longer active.']}
      >
        <SupportNote action="and they'll issue a new invitation." />
        <ButtonLink href={`mailto:${SUPPORT_EMAIL}`} className="mb-3">
          Contact SFWG
        </ButtonLink>
        <ButtonLink href={AUTH_ROUTES.login} variant="secondary">
          Back to sign in
        </ButtonLink>
      </StatusScreen>
    );
  }

  if (screen === 'already-active') {
    return (
      <StatusScreen
        tone="success"
        icon="ri-check-double-line"
        title="This account is already active"
        messages={[
          activation
            ? `Your account for ${activation.customerName} has already been set up. Sign in with your email and password.`
            : 'This account has already been set up. Sign in with your email and password.',
        ]}
      >
        <ButtonLink href={AUTH_ROUTES.login} className="mb-3">
          Go to sign in
        </ButtonLink>
        <ButtonLink href={AUTH_ROUTES.forgotPassword} variant="brand">
          Forgot password?
        </ButtonLink>
      </StatusScreen>
    );
  }

  if (screen === 'deactivated') {
    const orgType = activation?.role === 'district' ? 'district' : 'school';

    return (
      <StatusScreen
        tone="danger"
        icon="ri-forbid-line"
        title={`This ${orgType} has been deactivated`}
        messages={[
          <>
            <strong>{activation?.customerName}</strong> is no longer active on the platform.
          </>,
          orgType === 'district'
            ? 'Surveys and reports for schools in this district are suspended. No data has been deleted.'
            : 'Surveys and reports for this school are suspended. No data has been deleted.',
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

  if (screen === 'success') {
    return (
      <StatusScreen
        tone="success"
        icon="ri-check-line"
        largeGlyph
        title="You're all set"
        messages={[
          `Your account for ${activation?.customerName ?? 'Cafeteria Pulse'} is ready.`,
          ...(logoWasSkipped && isSchool
            ? ['You can add your school logo any time from My account.']
            : []),
        ]}
      >
        <Button onClick={goToPortal}>Go to your dashboard</Button>
      </StatusScreen>
    );
  }

  const total = totalSteps(activation?.role);
  const stepNumber = STEP_ORDER.indexOf(screen) + 1;
  const currentStep = screen === 'terms' ? total : stepNumber;
  // const backButton = screen === 'password' ? null : (
  //   <button
  //     type="button"
  //     onClick={goBack}
  //     disabled={submitting}
  //     className="flex items-center gap-1.5 text-[13px] font-medium mb-4 text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2"
  //   >
  //     <span className="w-4 h-4 flex items-center justify-center">
  //       <i className="ri-arrow-left-line text-sm" aria-hidden="true" />
  //     </span>
  //     Back
  //   </button>
  // );

  const submitAlert = submitError && (
    <Alert tone="danger" icon="ri-error-warning-line" className="mb-4">
      {submitError}
    </Alert>
  );

  if (screen === 'password') {
    const submitOnEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter') handlePasswordStep();
    };

    return (
      <>
        <StepBadge current={currentStep} total={total} />
        <PageHeading title="Activate your account" />

        <div className="rounded-xl bg-[#f5f6f8] border border-[#e8e6e1] p-3 sm:p-3.5 mb-4">
          <ul className="flex flex-col gap-1.5">
            <li className="flex items-center gap-2 min-w-0">
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[#6d6d6d]">
                <i className="ri-building-line text-sm" aria-hidden="true" />
              </span>
              <span className="text-[13px] sm:text-sm font-medium text-[#2b2b2b] truncate">{activation?.customerName}</span>
            </li>
            <li className="flex items-center gap-2 min-w-0">
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[#6d6d6d]">
                <i className="ri-user-settings-line text-sm" aria-hidden="true" />
              </span>
              <span className="text-[13px] sm:text-sm text-[#6d6d6d] truncate">{roleLabel(activation?.role)}</span>
            </li>
            <li className="flex items-center gap-2 min-w-0">
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[#6d6d6d]">
                <i className="ri-mail-line text-sm" aria-hidden="true" />
              </span>
              <span className="text-[13px] sm:text-sm text-[#6d6d6d] truncate">{activation?.email}</span>
            </li>
          </ul>
        </div>

        <p className="text-[13px] sm:text-sm mb-4 sm:mb-5 text-[#6d6d6d]">
          Choose a password to finish setting up your account.
        </p>

        {submitAlert}

        <PasswordField
          id="activate-password"
          label="New password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError(null);
            setSubmitError(null);
          }}
          onKeyDown={submitOnEnter}
          disabled={submitting}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          invalid={Boolean(passwordError)}
          footer={<PasswordRequirements strength={strength} hasInput={password.length > 0} />}
        />

        <PasswordField
          id="activate-confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setConfirmError(null);
            setSubmitError(null);
          }}
          onKeyDown={submitOnEnter}
          disabled={submitting}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          invalid={Boolean(confirmError)}
          wrapperClassName="mb-5"
        />

        <Button onClick={handlePasswordStep} busy={submitting} busyLabel="Saving…">
          Continue
        </Button>
      </>
    );
  }

  if (screen === 'details') {
    return (
      <>
        <StepBadge current={currentStep} total={total} />
        {/* {backButton} */}

        <PageHeading title="Confirm your details">
          {activation?.role === 'district'
            ? "Check your name is right — it appears in your district's activity record."
            : "Check your name is right — it appears in your school's activity record."}
        </PageHeading>

        <TextField
          id="activate-name"
          label="Full name"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          disabled={submitting}
          autoComplete="name"
        />

        <TextField
          id="activate-email"
          label="Email"
          type="email"
          value={activation?.email ?? ''}
          readOnly
          tabIndex={-1}
          locked
          hint="To change your email, contact SFWG."
        />

        <div className="rounded-xl bg-[#f5f6f8] border border-[#e8e6e1] p-3 mb-4 sm:mb-5">
          <span className="text-[11px] sm:text-xs text-[#6d6d6d]">
            {roleLabel(activation?.role)} at{' '}
            <span className="font-medium text-[#2b2b2b]">{activation?.customerName}</span>
          </span>
        </div>

        {isSchool && <LogoUploader state={logo} onChange={setLogo} />}

        {submitAlert}

        <Button
          onClick={handleDetailsStep}
          disabled={logo.uploading}
          busy={submitting}
          busyLabel="Saving…"
        >
          Continue
        </Button>
      </>
    );
  }

  return (
    <>
      <StepBadge current={currentStep} total={total} />
      {/* {backButton} */}

      <PageHeading title="Terms and privacy">
        Please review these before you start using Cafeteria Pulse.
      </PageHeading>

      <TermsSummary />
      <TermsDocument />

      <div className="flex flex-col gap-2 mb-4 sm:mb-5">
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="text-xs font-medium text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2"
        >
          View full platform terms →
        </a>
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="text-xs font-medium text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2"
        >
          View full privacy notice →
        </a>
      </div>

      <label className="flex items-start gap-3 cursor-pointer mb-1">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}
          className="w-4 h-4 rounded accent-[#6d28d9] cursor-pointer mt-0.5 flex-shrink-0"
        />
        <span className="text-[13px] sm:text-sm leading-snug text-[#2b2b2b]">
          I&apos;ve read and accept the platform terms and privacy notice.
        </span>
      </label>

      {submitError && (
        <Alert tone="danger" icon="ri-error-warning-line" className="mt-4">
          {submitError}
        </Alert>
      )}

      <Button
        onClick={handleTermsStep}
        disabled={!termsAccepted}
        busy={submitting}
        busyLabel="Activating…"
        className="mt-5"
      >
        Accept and continue
      </Button>
    </>
  );
}
