/**
 * Shared account-settings contract. The screen is the same for every dashboard;
 * what changes per role is the copy on the locked fields and whether the school
 * logo tab exists at all.
 */

export interface AccountProfileValues {
  fullName: string;
  email: string;
}

/** A field the user can see but not edit — rendered with a padlock and helper. */
export interface AccountLockedField {
  label: string;
  value: string;
  helper: string;
}

export type AccountTabKey = 'profile' | 'password' | 'logo';

export interface AccountTab {
  key: AccountTabKey;
  label: string;
  icon: string;
}
