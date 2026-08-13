import { redirect } from 'next/navigation';

import { AUTH_ROUTES } from '@/app/(auth)/constants';

/**
 * The activation steps are states inside one flow, not separate routes.
 * This alias keeps links from earlier builds working.
 */
export default function ActivateTermsRedirect() {
  redirect(AUTH_ROUTES.activate);
}
