'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';

import { Alert, Button, Spinner } from '@/app/(auth)/components/ui';
import { FAKE_LATENCY } from '@/app/(auth)/constants';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

export interface LogoState {
  file: File | null;
  previewUrl: string | null;
  uploading: boolean;
  uploaded: boolean;
  skipped: boolean;
  error: string | null;
}

export const EMPTY_LOGO_STATE: LogoState = {
  file: null,
  previewUrl: null,
  uploading: false,
  uploaded: false,
  skipped: false,
  error: null,
};

interface LogoUploaderProps {
  state: LogoState;
  onChange: (state: LogoState) => void;
}

export function LogoUploader({ state, onChange }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Object URLs are revoked when they are replaced and on unmount.
  useEffect(() => {
    return () => {
      if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    };
  }, [pendingUrl]);

  const acceptFile = useCallback(
    (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        onChange({
          ...state,
          error: 'Please upload a PNG, JPG, or SVG file.',
        });
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        onChange({
          ...state,
          error: 'File size must be under 2 MB.',
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setPendingUrl(url);

      onChange({
        file,
        previewUrl: url,
        uploading: true,
        uploaded: false,
        skipped: false,
        error: null,
      });

      // Simulated network upload latency.
      window.setTimeout(() => {
        onChange({
          file,
          previewUrl: url,
          uploading: false,
          uploaded: true,
          skipped: false,
          error: null,
        });
      }, FAKE_LATENCY.uploadLogo);
    },
    [onChange, state]
  );

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) acceptFile(file);
  };

  const reset = (skipped = false) => {
    if (pendingUrl) {
      URL.revokeObjectURL(pendingUrl);
      setPendingUrl(null);
    }
    onChange({ ...EMPTY_LOGO_STATE, skipped });
  };

  return (
    <div className="mb-4">
      {state.error && (
        <Alert
          tone="danger"
          icon="ri-error-warning-line"
          size="sm"
          className="mb-3"
          action={{ label: 'Try again', onClick: () => onChange({ ...state, error: null }) }}
        >
          {state.error}
        </Alert>
      )}

      {!state.uploaded && !state.skipped && (
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 sm:p-6 text-center cursor-pointer rounded-xl border-2 border-dashed transition-colors duration-150 ${state.uploading ? 'bg-[#f8faf7] border-[#586d4d]' : 'bg-[#fafbfa] border-[#d6d8dc]'}`}
        >
          {state.uploading ? (
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#586d4d]">
                <Spinner className="w-6 h-6" />
              </span>
              <p className="text-xs text-[#6d6d6d]">Uploading…</p>
            </div>
          ) : (
            <>
              <span className="w-8 h-8 flex items-center justify-center mx-auto mb-2 text-3xl text-[#9a9a9a]">
                <i className="ri-image-add-line" aria-hidden="true" />
              </span>
              <p className="text-[13px] sm:text-sm font-medium mb-1 text-[#2b2b2b]">
                Drag and drop your logo here, or <span className="underline text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2">browse</span>
              </p>
              <p className="text-xs text-[#9a9a9a]">PNG, JPG, or SVG · up to 2 MB</p>
              <p className="text-xs mt-1 text-[#9a9a9a]">A transparent background works best.</p>
            </>
          )}
        </div>
      )}

      {state.uploaded && state.previewUrl && (
        <div className="overflow-hidden rounded-xl border border-[#e8e6e1]">
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border border-[#e8e6e1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={state.previewUrl} alt="Logo preview" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-[#2b2b2b]">{state.file?.name}</p>
              <p className="text-xs text-[#9a9a9a]">Uploaded</p>
            </div>
            <button
              type="button"
              onClick={() => reset(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#9a9a9a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2"
              aria-label="Remove logo"
            >
              <i className="ri-close-line text-lg" aria-hidden="true" />
            </button>
          </div>

          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="rounded-lg p-3 sm:p-4 flex items-center gap-3 bg-[#f5f6f8] border border-[#e8e6e1]">
              <div className="flex-1 min-w-0">
                <div className="h-16 rounded-md flex items-center bg-white">
                  <div className="flex-1 min-w-0 p-3">
                    <div className="h-2.5 w-24 sm:w-32 max-w-full mb-1.5 rounded bg-[#e8e6e1]" />
                    <div className="h-2 w-16 sm:w-24 max-w-full rounded bg-[#e8e6e1]" />
                  </div>
                  <div className="shrink-0 w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center mr-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={state.previewUrl}
                      alt="Logo in report header preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs mt-1.5 text-center text-[#9a9a9a]">
              Preview — how your logo will sit in the report header
            </p>
          </div>
        </div>
      )}

      {state.skipped && (
        <div className="rounded-xl bg-[#f5f6f8] border border-[#e8e6e1] p-4 text-center">
          <p className="text-xs text-[#6d6d6d]">Logo skipped.</p>
          <button
            type="button"
            onClick={() => reset(false)}
            className="text-xs font-medium mt-1 text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2"
          >
            Add logo now
          </button>
        </div>
      )}

      {!state.uploaded && !state.skipped && (
        <Button variant="quiet" compact onClick={() => reset(true)} className="mt-3">
          Skip for now
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) acceptFile(file);
          event.target.value = '';
        }}
        className="hidden"
        tabIndex={-1}
      />
    </div>
  );
}
