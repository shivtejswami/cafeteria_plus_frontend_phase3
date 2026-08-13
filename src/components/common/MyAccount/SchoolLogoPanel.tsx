'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { getSchoolLogo, setSchoolLogo, subscribe } from '@/lib/schoolLogoStore';
import { useToast } from '@/components/ToastContext';
import { barWidthClass } from '@/utils/barWidth';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const MAX_SIZE = 2 * 1024 * 1024;

type UploadState = 'empty' | 'dragging' | 'uploading' | 'success' | 'error';

export default function SchoolLogoPanel({ readOnly = false }: { readOnly?: boolean }) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<UploadState>('empty');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [savedLogo, setSavedLogo] = useState<string | null>(null);

  useEffect(() => {
    const logo = getSchoolLogo();
    if (logo) {
      setSavedLogo(logo);
      setPreviewUrl(logo);
      setUploadState('success');
    }
    const unsub = subscribe(() => {
      const updated = getSchoolLogo();
      setSavedLogo(updated);
      setPreviewUrl(updated);
      setUploadState(updated ? 'success' : 'empty');
    });
    return unsub;
  }, []);

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File must be a PNG, JPG, or SVG. Please choose a supported format.';
    }
    if (file.size > MAX_SIZE) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 2 MB.`;
    }
    return null;
  }

  const processFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setUploadState('error');
      return;
    }

    setErrorMessage('');
    setUploadState('uploading');
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25 + 10;
      if (currentProgress >= 95) {
        currentProgress = 95;
        clearInterval(interval);
      }
      setProgress(Math.min(currentProgress, 95));
    }, 200);

    const reader = new FileReader();
    reader.onloadend = () => {
      clearInterval(interval);
      setProgress(100);
      const result = reader.result as string;
      setTimeout(() => {
        setPreviewUrl(result);
        setUploadState('success');
      }, 300);
    };
    reader.onerror = () => {
      clearInterval(interval);
      setErrorMessage('Failed to read the file. Please try again.');
      setUploadState('error');
    };
    reader.readAsDataURL(file);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (uploadState === 'empty' || uploadState === 'success') {
      setUploadState('dragging');
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    if (uploadState === 'dragging') {
      setUploadState(savedLogo ? 'success' : 'empty');
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
    if (uploadState === 'dragging') {
      setUploadState(savedLogo ? 'success' : 'empty');
    }
  }

  function handleCancelUpload() {
    setUploadState(savedLogo ? 'success' : 'empty');
    setProgress(0);
    setPreviewUrl(savedLogo);
  }

  function handleRemove() {
    setPreviewUrl(null);
    setSavedLogo(null);
    setUploadState('empty');
    setProgress(0);
    setSchoolLogo(null);
    toast('neutral', 'School logo removed.');
  }

  function handleReplace() {
    setUploadState('empty');
    setPreviewUrl(savedLogo);
  }

  function handleSave() {
    if (previewUrl) {
      setSchoolLogo(previewUrl);
      setSavedLogo(previewUrl);
      toast('success', 'School logo saved. It will now appear on your reports.');
    }
  }

  const hasUnsavedChange = uploadState === 'success' && previewUrl !== savedLogo;

  return (
    <div
      className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card"
    >
      <h2
        className="text-[17px] font-semibold mb-1 text-ink"
      >
        School logo
      </h2>
      <p
        className="text-[13px] mb-5 text-subtle"
      >
        Upload your school&apos;s logo to appear on your reports. It shows on the right side of your report header and in the downloadable PDF.
      </p>

      {uploadState === 'empty' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Upload school logo — drag and drop or browse"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrowse(); }}
          onClick={handleBrowse}
          className="rounded-xl p-5 sm:p-8 text-center cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 bg-canvas border-2 border-dashed border-sage-200"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#586d4d'; e.currentTarget.style.background = '#f2f5f0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d6e0d2'; e.currentTarget.style.background = '#faf9f6'; }}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-sage-50">
            <span className="w-6 h-6 flex items-center justify-center text-sage">
              <i className="ri-image-add-line text-[22px]"></i>
            </span>
          </div>
          <p className="text-[14px] font-medium mb-1 text-ink">
            Drag and drop your logo here, or <span className="text-iris">browse</span>
          </p>
          <p className="text-[12px] text-subtle">
            PNG, JPG, or SVG &middot; Max 2 MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg"
            onChange={handleFileSelect}
            className="hidden"
            aria-hidden="true"
          />
        </div>
      )}

      {uploadState === 'dragging' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="rounded-xl p-5 sm:p-8 text-center transition-colors duration-150 bg-iris-50 border-2 border-dashed border-iris"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#e8ddf8]">
            <span className="w-6 h-6 flex items-center justify-center text-iris">
              <i className="ri-upload-cloud-2-line text-[22px]"></i>
            </span>
          </div>
          <p className="text-[14px] font-medium text-[#4d1c9a]">
            Drop your logo here
          </p>
        </div>
      )}

      {uploadState === 'uploading' && (
        <div className="rounded-xl p-4 sm:p-6 bg-canvas border border-line">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-5 h-5 flex items-center justify-center animate-spin text-iris">
              <i className="ri-loader-4-line text-lg"></i>
            </span>
            <p className="text-[14px] font-medium text-ink">
              Uploading...
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-3 bg-surface-100">
            <div
              className={`h-full rounded-full transition-all duration-300 bg-iris ${barWidthClass(progress)}`}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-subtle">
              {Math.round(progress)}%
            </p>
            <button
              onClick={handleCancelUpload}
              className="inline-flex items-center h-8 px-4 rounded-full text-[12px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 bg-surface-100 text-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {uploadState === 'error' && (
        <div className="rounded-xl p-4 sm:p-5 bg-brick-50 border border-[#f5c8c8]">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-brick">
              <i className="ri-error-warning-line text-[18px]"></i>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium mb-1 text-ink">
                Upload failed
              </p>
              <p className="text-[13px] mb-3 text-muted">
                {errorMessage}
              </p>
              <button
                onClick={() => { setUploadState('empty'); setErrorMessage(''); }}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2 bg-white text-ink border border-line"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-refresh-line text-[14px]"></i>
                </span>
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadState === 'success' && previewUrl && (
        <div className="space-y-5">
          <div className="flex items-start gap-5 flex-wrap">
            <div
              className="rounded-xl p-4 flex items-center justify-center flex-shrink-0 w-[120px] h-[80px] bg-canvas border border-line"
            >
              <img
                src={previewUrl}
                alt="School logo preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium mb-2 text-ink">
                Logo preview
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleReplace}
                  disabled={readOnly}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-sage-50 text-ink"
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-upload-line text-[14px]"></i>
                  </span>
                  Replace
                </button>
                <button
                  onClick={handleRemove}
                  disabled={readOnly}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-brick-50 text-brick"
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-delete-bin-line text-[14px]"></i>
                  </span>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-4 bg-canvas border border-line"
          >
            <p className="text-[12px] font-medium uppercase tracking-wider mb-3 text-subtle">
              Report header preview
            </p>
            <div
              className="rounded-lg p-4 flex items-center justify-between gap-4 bg-white border border-sage-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-iris-50 text-iris">
                    6-8
                  </span>
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-surface-100 text-muted">
                    Fall 2024
                  </span>
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-leaf-50 text-sage">
                    Published
                  </span>
                </div>
                <p className="text-[12px] text-muted">
                  Published 3 Dec 2024 &middot; v1
                </p>
              </div>
              <div className="flex-shrink-0 max-w-[80px] max-h-[48px]">
                <img
                  src={previewUrl}
                  alt="Hillside Middle logo"
                  className="max-w-full max-h-[48px] object-contain"
                />
              </div>
            </div>
          </div>

          {hasUnsavedChange && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={readOnly}
                className="inline-flex items-center h-[42px] px-6 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-sage text-white"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setPreviewUrl(savedLogo);
                  setUploadState(savedLogo ? 'success' : 'empty');
                }}
                className="inline-flex items-center h-[42px] px-5 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed bg-transparent text-muted border border-sage-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 pt-4 border-t flex items-start gap-2.5 border-line">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-subtle">
          <i className="ri-information-line text-[14px]"></i>
        </span>
        <p className="text-[12px] text-subtle">
          For best results, use a logo with a transparent background at least 200px wide. A good-quality image renders best on both screen and PDF. If no logo is uploaded, reports use the standard header without a school logo.
        </p>
      </div>
    </div>
  );
}