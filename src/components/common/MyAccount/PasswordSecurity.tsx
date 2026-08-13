'use client';

import { useState } from 'react';

interface PasswordSecurityProps {
  readOnly?: boolean;
  onUpdate?: () => void;
}

/** 0–4, one point each for length, upper case, digit and symbol. */
function getStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium mb-1.5 text-ink">
        {label} <span className="text-brick">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full h-11 pl-4 pr-11 rounded-xl text-[14px] transition-colors duration-150 outline-none focus:outline-none focus:ring-0 disabled:opacity-60 text-ink bg-white border border-line"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris text-subtle"
        >
          {/* The icon shows the current state: open eye = password is visible. */}
          <i className={`${visible ? 'ri-eye-line' : 'ri-eye-off-line'} text-base`}></i>
        </button>
      </div>
    </div>
  );
}

export default function PasswordSecurity({ readOnly = false, onUpdate }: PasswordSecurityProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const strength = getStrength(newPassword);
  const matches = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = !readOnly && currentPassword.length > 0 && matches && strength >= 4;

  const strengthLabel = strength < 2 ? 'Weak' : strength < 3 ? 'Fair' : strength < 4 ? 'Good' : 'Strong';
  const strengthTextClass =
    strength < 2 ? 'text-brick' : strength < 3 ? 'text-gold' : strength < 4 ? 'text-info' : 'text-sage';

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
        <h2 className="text-[16px] sm:text-[18px] font-semibold mb-4 sm:mb-5 text-ink">Password</h2>

        <div className="space-y-5">
          <PasswordField
            id="account-current-password"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            disabled={readOnly}
          />

          <div>
            <PasswordField
              id="account-new-password"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              disabled={readOnly}
            />
            {newPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1.5 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={`flex-1 rounded-full ${strength >= step ? 'bg-sage' : 'bg-surface-100'}`}
                    />
                  ))}
                </div>
                <p className={`text-[12px] font-medium mt-1.5 ${strengthTextClass}`}>{strengthLabel}</p>
              </div>
            )}
          </div>

          <div>
            <PasswordField
              id="account-confirm-password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={readOnly}
            />
            {confirmPassword.length > 0 && !matches && (
              <p className="flex items-center gap-1 mt-1.5 text-[12px] text-brick">
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-error-warning-line text-sm"></i>
                </span>
                Passwords do not match.
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => canSubmit && onUpdate?.()}
          disabled={!canSubmit}
          className={`inline-flex w-full sm:w-auto justify-center items-center h-11 px-6 rounded-full text-[14px] font-semibold whitespace-nowrap mt-6 transition-opacity duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${canSubmit ? 'bg-sage text-white hover:opacity-90' : 'bg-sage-50 text-sage/50 cursor-not-allowed'}`}
        >
          Update password
        </button>
      </div>

      <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
        <h2 className="text-[16px] sm:text-[18px] font-semibold mb-3 text-ink">Sign-in &amp; security</h2>
        <p className="text-[14px] leading-relaxed mb-5 text-muted">
          Keep your account secure by using a strong, unique password. Do not share your login credentials with anyone.
          Cafeteria Pulse will never ask you for your password by email or phone.
        </p>

        <div className="rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 bg-canvas border border-line">
          <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-subtle">
            <i className="ri-shield-check-line text-lg"></i>
          </span>
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold mb-1 text-ink">Account protection</h3>
            <p className="text-[13px] leading-relaxed text-muted">
              Multi-factor authentication and single sign-on are not yet available in this version. Your password is
              your primary account protection — choose it carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
