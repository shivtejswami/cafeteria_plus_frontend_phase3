'use client';

import AccountSettings from '@/components/common/MyAccount/AccountSettings';
import { CURRENT_USER, DISTRICT } from '@/constants/districtData';

/** District administrator's account. Schools use /school/my-account. */
export default function MyAccountPage() {
  return (
    <AccountSettings
      profile={{ fullName: CURRENT_USER.name, email: CURRENT_USER.email }}
      lockedFields={[
        {
          label: 'Role',
          value: 'District administrator',
          helper:
            'Your role is set by SFWG. A district has one district administrator; to change who holds this role, contact SFWG.',
        },
        {
          label: 'District',
          value: DISTRICT.name,
          helper: 'Managed by SFWG.',
        },
      ]}
    />
  );
}
