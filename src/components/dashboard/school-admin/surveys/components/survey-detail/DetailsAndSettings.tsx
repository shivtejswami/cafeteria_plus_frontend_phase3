import type { ReactNode } from 'react';

/** Read-only record of how the survey was configured — shown in both phases. */
export default function DetailsAndSettings({
  targetCount,
  accessCode,
  footer,
}: {
  targetCount: number;
  accessCode: string;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#F0EAFB] flex items-center justify-center text-[#6D28D9] shrink-0 text-xs">
          <i className="ri-information-line"></i>
        </span>
        <label className="block text-[11px] font-semibold text-[#9A9A9A]">
          Details &amp; settings
        </label>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-[#FAF9F6] border border-[#F0EDE6] rounded-2xl p-4 space-y-1.5">
            <p className="text-[11px] font-semibold text-[#9A9A9A] flex items-center gap-1.5">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 3V4H8.25V11C8.25 11.36 8.16 11.6933 7.98 12C7.8 12.3067 7.55667 12.55 7.25 12.73C6.94333 12.91 6.61 13 6.25 13C5.89 13 5.55667 12.91 5.25 12.73C4.94333 12.55 4.7 12.3067 4.52 12C4.34 11.6933 4.25 11.36 4.25 11V4H3.75V3H8.75ZM7.25 7H5.25V11C5.25 11.18 5.295 11.3467 5.385 11.5C5.475 11.6533 5.59667 11.775 5.75 11.865C5.90333 11.955 6.07 12 6.25 12C6.43 12 6.59667 11.955 6.75 11.865C6.90333 11.775 7.025 11.6533 7.115 11.5C7.205 11.3467 7.25 11.18 7.25 11V7ZM6.75 9.5C6.89 9.5 7.00833 9.54833 7.105 9.645C7.20167 9.74167 7.25 9.86 7.25 10C7.25 10.14 7.20167 10.2583 7.105 10.355C7.00833 10.4517 6.89 10.5 6.75 10.5C6.61 10.5 6.49167 10.4517 6.395 10.355C6.29833 10.2583 6.25 10.14 6.25 10C6.25 9.86 6.29833 9.74167 6.395 9.645C6.49167 9.54833 6.61 9.5 6.75 9.5ZM5.75 8C5.89 8 6.00833 8.04833 6.105 8.145C6.20167 8.24167 6.25 8.36 6.25 8.5C6.25 8.64 6.20167 8.75833 6.105 8.855C6.00833 8.95167 5.89 9 5.75 9C5.61 9 5.49167 8.95167 5.395 8.855C5.29833 8.75833 5.25 8.64 5.25 8.5C5.25 8.36 5.29833 8.24167 5.395 8.145C5.49167 8.04833 5.61 8 5.75 8ZM7.25 4H5.25V6H7.25V4Z" fill="#9A9A9A"/>
              </svg>
              Instrument version
            </p>
            <p className="text-sm font-medium text-[#2B2B2B]">v3 (current instrument)</p>
          </div>

          <div className="bg-[#FAF9F6] border border-[#F0EDE6] rounded-2xl p-4 space-y-1.5">
            <p className="text-[11px] font-semibold text-[#9A9A9A] flex items-center gap-1.5">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 13.25C2.25 12.5233 2.43333 11.85 2.8 11.23C3.15333 10.63 3.63 10.1533 4.23 9.8C4.85 9.43333 5.52333 9.25 6.25 9.25C6.97667 9.25 7.65 9.43333 8.27 9.8C8.87 10.1533 9.34667 10.63 9.7 11.23C10.0667 11.85 10.25 12.5233 10.25 13.25H9.25C9.25 12.71 9.11333 12.2067 8.84 11.74C8.57333 11.2867 8.21333 10.9267 7.76 10.66C7.29333 10.3867 6.79 10.25 6.25 10.25C5.71 10.25 5.20667 10.3867 4.74 10.66C4.28667 10.9267 3.92667 11.2867 3.66 11.74C3.38667 12.2067 3.25 12.71 3.25 13.25H2.25ZM6.25 8.75C5.70333 8.75 5.2 8.61333 4.74 8.34C4.28667 8.07333 3.92667 7.71333 3.66 7.26C3.38667 6.8 3.25 6.29667 3.25 5.75C3.25 5.20333 3.38667 4.7 3.66 4.24C3.92667 3.78667 4.28667 3.42667 4.74 3.16C5.2 2.88667 5.70333 2.75 6.25 2.75C6.79667 2.75 7.3 2.88667 7.76 3.16C8.21333 3.42667 8.57333 3.78667 8.84 4.24C9.11333 4.7 9.25 5.20333 9.25 5.75C9.25 6.29667 9.11333 6.8 8.84 7.26C8.57333 7.71333 8.21333 8.07333 7.76 8.34C7.3 8.61333 6.79667 8.75 6.25 8.75ZM6.25 7.75C6.61 7.75 6.94333 7.66 7.25 7.48C7.55667 7.3 7.8 7.05667 7.98 6.75C8.16 6.44333 8.25 6.11 8.25 5.75C8.25 5.39 8.16 5.05667 7.98 4.75C7.8 4.44333 7.55667 4.2 7.25 4.02C6.94333 3.84 6.61 3.75 6.25 3.75C5.89 3.75 5.55667 3.84 5.25 4.02C4.94333 4.2 4.7 4.44333 4.52 4.75C4.34 5.05667 4.25 5.39 4.25 5.75C4.25 6.11 4.34 6.44333 4.52 6.75C4.7 7.05667 4.94333 7.3 5.25 7.48C5.55667 7.66 5.89 7.75 6.25 7.75Z" fill="#9A9A9A"/>
              </svg>
              Enrolment target
            </p>
            <p className="text-sm font-medium text-[#2B2B2B]">{targetCount} students</p>
          </div>

          <div className="bg-[#FAF9F6] border border-[#F0EDE6] rounded-2xl p-4 space-y-1.5">
            <p className="text-[11px] font-semibold text-[#9A9A9A] flex items-center gap-1.5">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.25 10.25H11.25V11.25H1.25V10.25H2.25V6.75C2.25 6.02333 2.43333 5.35 2.8 4.73C3.15333 4.13 3.63 3.65333 4.23 3.3C4.85 2.93333 5.52333 2.75 6.25 2.75C6.97667 2.75 7.65 2.93333 8.27 3.3C8.87 3.65333 9.34667 4.13 9.7 4.73C10.0667 5.35 10.25 6.02333 10.25 6.75V10.25ZM9.25 10.25V6.75C9.25 6.21 9.11333 5.70667 8.84 5.24C8.57333 4.78667 8.21333 4.42667 7.76 4.16C7.29333 3.88667 6.79 3.75 6.25 3.75C5.71 3.75 5.20667 3.88667 4.74 4.16C4.28667 4.42667 3.92667 4.78667 3.66 5.24C3.38667 5.70667 3.25 6.21 3.25 6.75V10.25H9.25ZM4.75 12.25H7.75V13.25H4.75V12.25Z" fill="#9A9A9A"/>
              </svg>
              Reminders
            </p>
            <p className="text-sm font-medium text-[#2B2B2B]">On &middot; sent to you, not students</p>
          </div>

          <div className="bg-[#FAF9F6] border border-[#F0EDE6] rounded-2xl p-4 space-y-1.5">
            <p className="text-[11px] font-semibold text-[#9A9A9A] flex items-center gap-1.5">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_2181_13459)">
                  <path d="M6.71 8.5C6.63 8.96667 6.45 9.39167 6.17 9.775C5.89 10.1583 5.54 10.4567 5.12 10.67C4.69333 10.89 4.23667 11 3.75 11C3.21 11 2.70667 10.8633 2.24 10.59C1.78667 10.3233 1.42667 9.96333 1.16 9.51C0.886667 9.04333 0.75 8.54 0.75 8C0.75 7.46 0.886667 6.95667 1.16 6.49C1.42667 6.03667 1.78667 5.67667 2.24 5.41C2.70667 5.13667 3.21 5 3.75 5C4.23667 5 4.69333 5.11 5.12 5.33C5.54 5.54333 5.89 5.84167 6.17 6.225C6.45 6.60833 6.63 7.03333 6.71 7.5H11.75V8.5H10.75V10.5H9.75V8.5H8.75V10.5H7.75V8.5H6.71ZM3.75 10C4.11 10 4.44333 9.91 4.75 9.73C5.05667 9.55 5.3 9.30667 5.48 9C5.66 8.69333 5.75 8.36 5.75 8C5.75 7.64 5.66 7.30667 5.48 7C5.3 6.69333 5.05667 6.45 4.75 6.27C4.44333 6.09 4.11 6 3.75 6C3.39 6 3.05667 6.09 2.75 6.27C2.44333 6.45 2.2 6.69333 2.02 7C1.84 7.30667 1.75 7.64 1.75 8C1.75 8.36 1.84 8.69333 2.02 9C2.2 9.30667 2.44333 9.55 2.75 9.73C3.05667 9.91 3.39 10 3.75 10Z" fill="#9A9A9A"/>
                </g>
                <defs>
                  <clipPath id="clip0_2181_13459">
                    <rect width="12.5" height="12" fill="white" transform="translate(0 2)"/>
                  </clipPath>
                </defs>
              </svg>
              Access code
            </p>
            <p className="text-sm font-bold text-[#6D28D9] uppercase tracking-wide">{accessCode}</p>
          </div>

          <div className="bg-[#FAF9F6] border border-[#F0EDE6] rounded-2xl p-4 space-y-1.5">
            <p className="text-[11px] font-semibold text-[#9A9A9A] flex items-center gap-1.5">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 2.5L10.36 3.41C10.4733 3.43667 10.5667 3.49667 10.64 3.59C10.7133 3.68333 10.75 3.78667 10.75 3.9V8.89C10.75 9.39667 10.6317 9.87 10.395 10.31C10.1583 10.75 9.83 11.11 9.41 11.39L6.25 13.5L3.09 11.39C2.67 11.11 2.34167 10.75 2.105 10.31C1.86833 9.87 1.75 9.39667 1.75 8.89V3.9C1.75 3.78667 1.78667 3.68333 1.86 3.59C1.93333 3.49667 2.02667 3.43667 2.14 3.41L6.25 2.5ZM6.25 3.52L2.75 4.3V8.89C2.75 9.23 2.82833 9.54667 2.985 9.84C3.14167 10.1333 3.36 10.3733 3.64 10.56L6.25 12.3L8.86 10.56C9.14 10.3733 9.35833 10.1333 9.515 9.84C9.67167 9.54667 9.75 9.23 9.75 8.89V4.3L6.25 3.52ZM8.48 6.11L9.18 6.82L6 10L3.88 7.88L4.59 7.17L6 8.59L8.48 6.11Z" fill="#9A9A9A"/>
              </svg>
              Anonymity
            </p>
            <p className="text-sm font-medium text-[#2B2B2B]">Anonymous &middot; no logins, no names collected</p>
          </div>
        </div>

      {footer}
    </div>
  );
}
