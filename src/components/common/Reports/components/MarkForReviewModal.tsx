'use client';

interface MarkForReviewModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function MarkForReviewModal({ open, onConfirm, onCancel }: MarkForReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onCancel}>
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mark for review"
      >
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#F1EFEA] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage text-[#9A9A9A]"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#E3F2DE]">
          <span className="w-6 h-6 flex items-center justify-center text-sage">
            <i className="ri-flag-line text-2xl"></i>
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Mark for review</h3>

        <p className="text-[14px] leading-relaxed mt-2 text-[#6D6D6D]">
          This will mark the report for review under SFWG.
          <br className="hidden sm:block" />
          {' '}SFWG may make changes and can regenerate the report.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 mt-6">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm"
          >
            Mark for review
          </button>
        </div>
      </div>
    </div>
  );
}
