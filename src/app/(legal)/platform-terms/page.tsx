import type { Metadata } from 'next';

import { LegalDocument } from '@/app/(legal)/components/LegalDocument';
import { PLATFORM_TERMS } from '@/app/(legal)/content/platformTerms';

export const metadata: Metadata = {
  title: 'Platform Terms',
  description:
    'The agreement between your organisation and the School Food & Wellness Group for using Cafeteria Pulse.',
};

export default function PlatformTermsPage() {
  return <LegalDocument content={PLATFORM_TERMS} />;
}
