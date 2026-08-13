'use client';

import ToggleField from '@/components/school-admin/surveys/components/ToggleField';

interface AccessCodeSectionProps {
  useAccessCode: boolean;
  accessCode: string;
  onToggle: (v: boolean) => void;
  onCodeChange: (v: string) => void;
  disabled?: boolean;
}

export default function AccessCodeSection({ useAccessCode, accessCode, onToggle, onCodeChange, disabled }: AccessCodeSectionProps) {
  return (
    <div className="space-y-5">
      <ToggleField
        id="access-code"
        label="Require a short access code"
        helper="Optional. Announce to students for extra protection."
        checked={useAccessCode}
        onChange={onToggle}
        disabled={disabled}
      />

      {useAccessCode && (
        <div>
          <label className="block text-[13px] font-semibold mb-1.5 text-ink">
            Access code<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => onCodeChange(e.target.value.toUpperCase().slice(0, 8))}
              disabled={disabled}
              placeholder="e.g. LUNCH7"
              className="min-w-0 flex-1 h-10 px-3 rounded-xl text-base sm:text-[14px] placeholder:text-subtle focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors duration-150 disabled:opacity-40 uppercase bg-white border border-[#E8E6E1] text-ink"
            />
            <button
              type="button"
              onClick={() => onCodeChange(generateCode())}
              disabled={disabled}
              className="shrink-0 h-10 px-5 rounded-full text-[14px] font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#586D4D] focus-visible:ring-offset-1 disabled:opacity-40 bg-[#586D4D] text-white shadow-sm"
            >
              Generate
            </button>
          </div>
          <p className="text-[12px] mt-1.5 text-muted-500">
            You can regenerate or change this later.
          </p>
        </div>
      )}

    </div>
  );
}

function generateCode(): string {
  const words = ['LUNCH', 'MEAL', 'SNACK', 'BITE', 'FOOD', 'CHEW', 'TASTE', 'YUM', 'EAT'];
  const suffix = Math.floor(Math.random() * 99) + 1;
  return `${words[Math.floor(Math.random() * words.length)]}${suffix}`;
}