'use client';

import { Suspense } from 'react';

import { ActivationFlow } from '@/app/(auth)/components/activation/ActivationFlow';
import { LoadingBlock } from '@/app/(auth)/components/ui';

export default function ActivatePage() {
  return (
    <Suspense fallback={<LoadingBlock label="Verifying your invitation…" />}>
      <ActivationFlow />
    </Suspense>
  );
}
