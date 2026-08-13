'use client';

import { useState } from 'react';
import type { AccountLockedField, AccountProfileValues } from './types';

interface ProfileSettingsProps {
  initial: AccountProfileValues;
  /** Role, school/district — anything the user can see but not change. */
  lockedFields: AccountLockedField[];
  readOnly?: boolean;
  onSave?: (values: AccountProfileValues) => void;
}

export default function ProfileSettings({ initial, lockedFields, readOnly = false, onSave }: ProfileSettingsProps) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [email, setEmail] = useState(initial.email);

  const isDirty = fullName !== initial.fullName || email !== initial.email;
  const canSave = isDirty && !readOnly && fullName.trim().length > 0 && email.trim().length > 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
        <h2 className="text-[16px] sm:text-[18px] font-semibold mb-4 sm:mb-5 text-ink">Your profile</h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="account-full-name" className="block text-[13px] font-medium mb-1.5 text-ink">
              Full name <span className="text-brick">*</span>
            </label>
            <input
              id="account-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={readOnly}
              className="w-full h-11 px-4 rounded-xl text-[14px] transition-colors duration-150 outline-none focus:outline-none focus:ring-0 disabled:opacity-60 text-ink bg-white border border-line"
            />
          </div>

          <div>
            <label htmlFor="account-email" className="block text-[13px] font-medium mb-1.5 text-ink">
              Email address <span className="text-brick">*</span>
            </label>
            <input
              id="account-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={readOnly}
              className="w-full h-11 px-4 rounded-xl text-[14px] transition-colors duration-150 outline-none focus:outline-none focus:ring-0 disabled:opacity-60 text-ink bg-white border border-line"
            />
          </div>

          {lockedFields.map((field) => (
            <div key={field.label}>
              <p className="text-[13px] font-medium mb-1.5 text-ink">{field.label}</p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center h-9 px-3.5 rounded-full text-[13px] wrap-break-word bg-canvas border border-line text-muted">
                  {field.value}
                </span>
                <span className="w-4 h-4 flex items-center justify-center shrink-0 text-subtle" aria-hidden="true">
                  <i className="ri-lock-line text-sm"></i>
                </span>
              </div>
              <p className="text-[12px] mt-1.5 leading-relaxed text-subtle">{field.helper}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            setFullName(initial.fullName);
            setEmail(initial.email);
          }}
          disabled={!isDirty}
          className="inline-flex justify-center items-center h-11 px-6 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-ink bg-white border border-line"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => canSave && onSave?.({ fullName: fullName.trim(), email: email.trim() })}
          disabled={!canSave}
          className={`inline-flex justify-center items-center h-11 px-6 rounded-full text-[14px] font-semibold whitespace-nowrap transition-opacity duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${canSave ? 'bg-sage text-white hover:opacity-90' : 'bg-sage-50 text-sage/50 cursor-not-allowed'}`}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
