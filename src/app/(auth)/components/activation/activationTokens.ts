import type { ActivationData, ActivationToken, CustomerRole } from '@/app/(auth)/types';

const SCHOOL_ADMIN: ActivationData = {
  role: 'school',
  customerName: 'Hillside Middle',
  email: 'jane@hillsidemiddle.edu',
  fullName: 'Jane Morrison',
  orgLabel: 'school',
};

const DISTRICT_ADMIN: ActivationData = {
  role: 'district',
  customerName: 'North Hills School District',
  email: 'mike@northhills.edu',
  fullName: 'Michael Chen',
  orgLabel: 'district',
};

const SFWG_ADMIN: ActivationData = {
  role: 'sfwg',
  customerName: 'School Food & Wellness Group',
  email: 'elena@sfwgroup.org',
  fullName: 'Elena Vasquez',
  orgLabel: 'SFWG',
};

/** Invitation tokens recognised by this build. Swap for an API call when the backend lands. */
export const ACTIVATION_TOKENS: Record<string, ActivationToken> = {
  'school-admin-valid': { type: 'valid', data: SCHOOL_ADMIN },
  'district-admin-valid': { type: 'valid', data: DISTRICT_ADMIN },
  'sfwg-valid': { type: 'valid', data: SFWG_ADMIN },
  'already-active': { type: 'used', data: SCHOOL_ADMIN },
  expired: { type: 'expired' },
  'deactivated-school': { type: 'deactivated', data: SCHOOL_ADMIN },
  'deactivated-district': { type: 'deactivated', data: DISTRICT_ADMIN },
};

export const DEFAULT_ACTIVATION_TOKEN = 'school-admin-valid';

export function resolveActivationToken(token: string): ActivationToken | null {
  return ACTIVATION_TOKENS[token] ?? null;
}

const ROLE_LABELS: Record<CustomerRole, string> = {
  school: 'School administrator',
  district: 'District administrator',
  sfwg: 'SFWG internal',
};

export function roleLabel(role: CustomerRole | undefined): string {
  return role ? ROLE_LABELS[role] : ROLE_LABELS.school;
}

/** Schools get an extra logo step, so their flow is one step longer. */
export function totalSteps(role: CustomerRole | undefined): number {
  return role === 'school' ? 3 : 2;
}
