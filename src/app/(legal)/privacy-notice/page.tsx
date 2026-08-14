import type { Metadata } from 'next';

import { LegalDocument } from '@/app/(legal)/components/LegalDocument';
import { PRIVACY_NOTICE } from '@/app/(legal)/content/privacyNotice';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description:
    'How the School Food & Wellness Group collects, uses, and protects information through Cafeteria Pulse.',
};

export default function PrivacyNoticePage() {
  return <LegalDocument content={PRIVACY_NOTICE} />;
}
