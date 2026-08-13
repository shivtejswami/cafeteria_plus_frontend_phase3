export type LoginState =
  | 'idle'
  | 'ready'
  | 'submitting'
  | 'error-credentials'
  | 'error-rate-limited'
  | 'error-unverified'
  | 'error-network'
  | 'deactivated'
  | 'suspended';

export type ForgotState =
  | 'idle'
  | 'ready'
  | 'invalid-format'
  | 'sending'
  | 'rate-limited'
  | 'network-error';

export type CodeState = 'default' | 'verifying' | 'error' | 'expired' | 'too-many-attempts';

export type ResetState = 'form' | 'submitting' | 'session-expired' | 'success' | 'deactivated';

export type CustomerRole = 'school' | 'district' | 'sfwg';

export interface ActivationData {
  role: CustomerRole;
  customerName: string;
  email: string;
  fullName: string;
  orgLabel: string;
}

export type ActivationScreen =
  | 'loading'
  | 'password'
  | 'details'
  | 'terms'
  | 'success'
  | 'expired'
  | 'already-active'
  | 'deactivated'
  | 'invalid';

export type ActivationToken =
  | { type: 'valid'; data: ActivationData }
  | { type: 'used'; data: ActivationData }
  | { type: 'deactivated'; data: ActivationData }
  | { type: 'expired' };
