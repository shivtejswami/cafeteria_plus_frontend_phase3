'use client';

import { Suspense } from 'react';

import { ActivationFlow } from '@/app/(auth)/components/activation/ActivationFlow';
import { LoadingBlock } from '@/app/(auth)/components/ui';

/**
 * Alias of /auth/activate. Invitation emails sent before the rename still point
 * here, so the route stays alive and renders the same single flow.
 */
export default function SetPasswordPage() {
  return (
    <Suspense fallback={<LoadingBlock label="Verifying your invitation…" />}>
      <ActivationFlow />
    </Suspense>
  );
}
