'use client';

import AccountSettings from '@/components/common/MyAccount/AccountSettings';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { accountData } from '@/lib/schoolAdminData';

/** School administrator's account — same shared screen, plus the logo tab. */
export default function SchoolMyAccountPage() {
  const { isReadOnly } = useReadOnlyMode();

  return (
    <AccountSettings
      profile={{ fullName: accountData.fullName, email: accountData.email }}
      lockedFields={[
        {
          label: 'Role',
          value: accountData.role,
          helper: 'Your role is set by your district administrator or SFWG.',
        },
        {
          label: 'School',
          value: accountData.school,
          helper: `Part of ${accountData.district}. To change your school, contact your district administrator or SFWG.`,
        },
      ]}
      showSchoolLogo
      readOnly={isReadOnly}
    />
  );
}
