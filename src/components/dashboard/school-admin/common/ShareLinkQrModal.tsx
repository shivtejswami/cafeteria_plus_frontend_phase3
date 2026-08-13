'use client';

import { useState } from 'react';

interface ShareLinkQrModalProps {
  open: boolean;
  surveyUrl: string;
  accessCode: string | null;
  status: 'open' | 'scheduled';
  scheduledOpensDate?: string;
  isReadOnly?: boolean;
  onClose: () => void;
}

function ConfirmModal({ open, title, message, confirmLabel, tone, onConfirm, onCancel }: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  /** Destructive actions get the red pill; restorative ones get the sage pill. */
  tone: 'danger' | 'sage';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-[420px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h3 className="text-[17px] font-bold mb-2 text-[#2B2B2B]">{title}</h3>
        <p className="text-[14px] mb-6 leading-relaxed text-[#6D6D6D]">{message}</p>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap text-white shadow-sm transition-colors ${tone === 'danger' ? 'bg-[#D8201D] hover:bg-red-700' : 'bg-[#586D4D] hover:opacity-90'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShareLinkQrModal({
  open,
  surveyUrl,
  accessCode,
  status,
  scheduledOpensDate,
  isReadOnly = false,
  onClose,
}: ShareLinkQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [linkDisabled, setLinkDisabled] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showReenableConfirm, setShowReenableConfirm] = useState(false);

  if (!open) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(surveyUrl)}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadQr() {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'survey-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleDisable() {
    setShowDisableConfirm(false);
    setLinkDisabled(true);
  }

  function handleReenable() {
    setShowReenableConfirm(false);
    setLinkDisabled(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-[480px] w-full max-h-[calc(100dvh-2rem)] flex flex-col border border-[#E8E6E1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Share survey"
      >
        {/* Fixed Non-Scrolling Header */}
        <div className="p-4 sm:px-7 sm:pt-7 sm:pb-4 shrink-0 flex items-start justify-between gap-3 bg-white border-b border-[#E8E6E1]/50">
          <div className="min-w-0">
            <h3 className="text-[17px] sm:text-[20px] font-semibold mb-0.5 text-[#2B2B2B]">Share survey</h3>
            <p className="text-[13px] text-[#9A9A9A]">
              Students use this link or QR code to access the survey.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 text-[#9A9A9A] hover:text-[#2B2B2B] hover:bg-slate-100"
            aria-label="Close"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:px-7 sm:pb-7 flex-1 overflow-y-auto overscroll-contain space-y-5">

        {status === 'scheduled' && scheduledOpensDate && (
          <div className="rounded-2xl px-4 py-3 mb-5 flex items-start gap-3 bg-[#F0EAFB] border border-[#D8C7F7]">
            <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#6D28D9]">
              <i className="ri-information-line"></i>
            </span>
            <p className="text-[13px] font-medium text-[#6D28D9]">
              Students can respond once the survey opens on {scheduledOpensDate}.
            </p>
          </div>
        )}

        {linkDisabled && (
          <div className="rounded-2xl px-4 py-3 mb-5 flex items-start gap-3 bg-red-50 border border-red-200">
            <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600">
              <i className="ri-forbid-line"></i>
            </span>
            <div>
              <p className="text-[13px] font-semibold mb-0.5 text-red-700">
                Survey link is disabled
              </p>
              <p className="text-[13px] text-red-600">
                No new responses can be submitted. Re-enable below to allow access.
              </p>
            </div>
          </div>
        )}

        {/* QR Code Container */}
        <div className={`flex flex-col items-center mb-5 ${linkDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="rounded-2xl p-3 sm:p-4 mb-3.5 bg-white border border-[#E8E6E1] shadow-sm flex items-center justify-center">
            <img
              src={qrUrl}
              alt="Survey QR code"
              width={240}
              height={240}
              className="block rounded-lg max-w-[180px] sm:max-w-[240px] w-full h-auto"
            />
          </div>
          <button
            onClick={handleDownloadQr}
            className="inline-flex items-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap transition-all duration-150 bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7]"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-download-line text-sm"></i>
            </span>
            Download QR
          </button>
        </div>

        {/* Middle URL & Access Code Container */}
        <div className={`rounded-2xl p-3.5 sm:p-4 mb-4 space-y-4 ${linkDisabled ? 'opacity-40 pointer-events-none' : ''} bg-[#FAF9F6] border border-[#E8E6E1]`}>
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 text-[#9A9A9A]">
              Survey URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={surveyUrl}
                className="min-w-0 flex-1 h-10 px-3 sm:px-3.5 rounded-xl text-[12px] sm:text-[13px] bg-white outline-none focus:outline-none focus:ring-0 truncate border border-[#E8E6E1] text-[#2B2B2B] font-medium"
              />
              <button
                onClick={handleCopyLink}
                className="shrink-0 h-10 px-3 sm:px-5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-150 text-white shadow-sm bg-[#586D4D] hover:opacity-90 flex items-center justify-center gap-1.5"
                title="Copy survey URL"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className={copied ? "ri-check-line text-sm" : "ri-file-copy-line text-sm"}></i>
                </span>
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy link'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1.5 text-[#9A9A9A]">
              Access code
            </label>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1 h-10 px-3.5 rounded-xl flex items-center text-[15px] font-bold tracking-wider uppercase bg-white border border-[#E8E6E1] text-[#6D28D9]">
                {accessCode || 'LUNCH7'}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(accessCode || 'LUNCH7');
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="shrink-0 h-10 px-3 sm:px-5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] flex items-center justify-center gap-1.5"
                title="Copy access code"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className={copiedCode ? "ri-check-line text-sm" : "ri-file-copy-line text-sm"}></i>
                </span>
                <span className="hidden sm:inline">{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Anonymous Notice Box */}
        <div className="rounded-2xl p-4 mb-5 flex items-start gap-3 bg-[#F4F6F2] border border-[#E8E6E1]">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#586D4D]">
            <i className="ri-information-line text-base"></i>
          </span>
          <p className="text-[13px] text-[#6B7280] leading-snug">
            Students answer anonymously &mdash; no logins required. They&apos;ll need the access code above to start.
          </p>
        </div>

        {/* Link controls section */}
        <div className="h-px bg-[#E8E6E1] mb-5" />
        <div>
          <p className="text-[12px] font-semibold text-[#9A9A9A] mb-3">Link controls</p>
          <div className="flex items-center gap-3">
            {!linkDisabled ? (
              <button
                onClick={() => setShowDisableConfirm(true)}
                disabled={isReadOnly}
                className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap transition-all duration-150 bg-white text-[#D8201D] border border-[#D8201D] hover:bg-red-50 disabled:opacity-40"
              >
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.77334 15.167C6.03724 15.167 5.33361 15.0262 4.66246 14.7445C4.02018 14.47 3.44826 14.0819 2.9467 13.5799C2.44514 13.078 2.05725 12.5056 1.78301 11.8628C1.50156 11.1912 1.36084 10.487 1.36084 9.75033C1.36084 9.01366 1.50156 8.30949 1.78301 7.63783C2.05725 6.99505 2.44514 6.42269 2.9467 5.92074C3.44826 5.4188 4.02018 5.0306 4.66246 4.75616C5.33361 4.47449 6.03724 4.33366 6.77334 4.33366C7.50944 4.33366 8.21306 4.47449 8.88421 4.75616C9.5265 5.0306 10.0984 5.4188 10.6 5.92074C11.1015 6.42269 11.4894 6.99505 11.7637 7.63783C12.0451 8.30949 12.1858 9.01366 12.1858 9.75033C12.1858 10.487 12.0451 11.1912 11.7637 11.8628C11.4894 12.5056 11.1015 13.078 10.6 13.5799C10.0984 14.0819 9.5265 14.47 8.88421 14.7445C8.21306 15.0262 7.50944 15.167 6.77334 15.167ZM6.77334 14.0837C7.55996 14.0837 8.28884 13.885 8.95999 13.4878C9.60949 13.105 10.1255 12.5887 10.508 11.9387C10.9049 11.267 11.1033 10.5375 11.1033 9.75033C11.1033 8.9631 10.9049 8.23366 10.508 7.56199C10.1255 6.91199 9.60949 6.3956 8.95999 6.01283C8.28884 5.6156 7.55996 5.41699 6.77334 5.41699C5.98672 5.41699 5.25784 5.6156 4.58669 6.01283C3.93719 6.3956 3.4212 6.91199 3.03871 7.56199C2.6418 8.23366 2.44334 8.9631 2.44334 9.75033C2.44334 10.5375 2.6418 11.267 3.03871 11.9387C3.4212 12.5887 3.93719 13.105 4.58669 13.4878C5.25784 13.885 5.98672 14.0837 6.77334 14.0837ZM4.88979 7.09616L9.42546 11.6353C9.31721 11.7798 9.19814 11.917 9.06824 12.047C8.93834 12.177 8.80122 12.2962 8.65689 12.4045L4.12121 7.86533C4.22946 7.72088 4.34854 7.58366 4.47844 7.45366C4.60834 7.32366 4.74546 7.20449 4.88979 7.09616Z" fill="#D8201D"/>
                </svg>
                Disable link
              </button>
            ) : (
              <button
                onClick={() => setShowReenableConfirm(true)}
                disabled={isReadOnly}
                className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap transition-all duration-150 bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] disabled:opacity-40"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-play-circle-line text-sm"></i>
                </span>
                Re-enable link
              </button>
            )}
          </div>
          <p className="text-[12px] mt-2.5 text-[#9A9A9A] leading-normal">
            Use this if the link is shared outside your school or you need to stop new responses.
          </p>
        </div>

        <ConfirmModal
          open={showDisableConfirm}
          title="Disable survey link"
          message="No more responses can be submitted through this link. You can re-enable it later if needed."
          confirmLabel="Disable"
          tone="danger"
          onConfirm={handleDisable}
          onCancel={() => setShowDisableConfirm(false)}
        />

        <ConfirmModal
          open={showReenableConfirm}
          title="Re-enable survey link"
          message="More responses can be submitted through this link."
          confirmLabel="Re-enable"
          tone="sage"
          onConfirm={handleReenable}
          onCancel={() => setShowReenableConfirm(false)}
        />
        </div>
      </div>
    </div>
  );
}