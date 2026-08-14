/* ==========================================================================
   Auth constants: configuration values and routes.
   ========================================================================== */

export const SUPPORT_EMAIL = 'support@sfwgroup.org';

export const AUTH_ROUTES = {
  login: '/login',
  forgotPassword: '/forget-password',
  enterCode: '/enter-code',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',
  passwordUpdated: '/password-updated',
  setPassword: '/set-password',
  activate: '/activate',
  accountInactive: '/account-inactive',
  platformTerms: '/platform-terms',
  privacyNotice: '/privacy-notice',
} as const;

export const PORTAL_ROUTES = {
  school: '/school',
  district: '/district-admin',
  home: '/',
} as const;

/** Seconds a user must wait before a code can be requested again. */
export const RESEND_COOLDOWN_SECONDS = 30;

/** Seconds a user must wait after too many failed attempts. */
export const RATE_LIMIT_SECONDS = 30;

/** Failed code entries allowed before the flow locks. */
export const MAX_CODE_ATTEMPTS = 3;

export const OTP_LENGTH = 6;

/** Simulated network latency for the demo build, in milliseconds. */
export const FAKE_LATENCY = {
  signIn: 1200,
  sendCode: 1200,
  verifyCode: 1000,
  savePassword: 1000,
  saveDetails: 800,
  resolveToken: 800,
  uploadLogo: 1200,
} as const;
export const BRAND_HEX = '#6d28d9';
