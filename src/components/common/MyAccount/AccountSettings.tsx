'use client';

import { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import PasswordSecurity from './PasswordSecurity';
import SchoolLogoPanel from './SchoolLogoPanel';
import type { AccountLockedField, AccountProfileValues, AccountTab, AccountTabKey } from './types';

interface AccountSettingsProps {
  profile: AccountProfileValues;
  /** Role and school/district lines — copy differs per dashboard. */
  lockedFields: AccountLockedField[];
  /** School logo only makes sense for a school admin, so it is opt-in. */
  showSchoolLogo?: boolean;
  readOnly?: boolean;
  onSaveProfile?: (values: AccountProfileValues) => void;
  onUpdatePassword?: () => void;
}

const TAB_DEFS: Record<AccountTabKey, AccountTab> = {
  profile: { key: 'profile', label: 'Profile', icon: 'ri-user-line' },
  password: { key: 'password', label: 'Password & Security', icon: 'ri-key-2-line' },
  logo: { key: 'logo', label: 'School logo', icon: 'ri-image-line' },
};

export default function AccountSettings({
  profile,
  lockedFields,
  showSchoolLogo = false,
  readOnly = false,
  onSaveProfile,
  onUpdatePassword,
}: AccountSettingsProps) {
  const tabs: AccountTab[] = [
    TAB_DEFS.profile,
    TAB_DEFS.password,
    ...(showSchoolLogo ? [TAB_DEFS.logo] : []),
  ];
  const [activeTab, setActiveTab] = useState<AccountTabKey>('profile');

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-8">
      {/* Horizontal on small screens, a rail from lg up. */}
      <nav
        aria-label="Account sections"
        className="flex lg:flex-col gap-1 shrink-0 lg:w-56 -mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible overscroll-x-contain [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex items-center gap-2 lg:gap-3 shrink-0 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-[13px] lg:text-[14px] font-medium text-left whitespace-nowrap transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 ${isActive ? 'bg-iris-50 text-iris' : 'text-muted hover:bg-canvas'}`}
            >
              {isActive && (
                <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md bg-sage" />
              )}
              <span className={`w-4 h-4 flex items-center justify-center shrink-0 ${isActive ? 'text-iris' : 'text-subtle'}`}>
                <i className={`${tab.icon} text-sm lg:text-base`}></i>
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1 min-w-0 max-w-[720px]">
        {activeTab === 'profile' && (
          <ProfileSettings
            initial={profile}
            lockedFields={lockedFields}
            readOnly={readOnly}
            onSave={onSaveProfile}
          />
        )}
        {activeTab === 'password' && <PasswordSecurity readOnly={readOnly} onUpdate={onUpdatePassword} />}
        {activeTab === 'logo' && <SchoolLogoPanel readOnly={readOnly} />}
      </div>
    </div>
  );
}
