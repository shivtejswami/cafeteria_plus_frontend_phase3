'use client';

interface SurveyControlsCardProps {
  isPaused: boolean;
  isReadOnly: boolean;
  onCloseEarly: () => void;
  onPause: () => void;
  onResume: () => void;
  onExtend: () => void;
  onCancel: () => void;
}

/** Actions available while a survey is still collecting. Paused runs swap close/pause for resume. */
export default function SurveyControlsCard({
  isPaused,
  isReadOnly,
  onCloseEarly,
  onPause,
  onResume,
  onExtend,
  onCancel,
}: SurveyControlsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-[11px] font-semibold text-[#9A9A9A]">
          Survey controls
        </label>
        {/* <span className="w-7 h-7 rounded-full bg-[#F5F3F0] flex items-center justify-center shrink-0 text-[#9A9A9A] text-xs">
          <i className="ri-settings-3-line"></i>
        </span> */}
      </div>
    
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
        {isPaused ? (
          <button
            onClick={onResume}
            disabled={isReadOnly}
            className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40 w-full sm:w-auto"
          >
            <i className="ri-play-circle-line text-base"></i>
            Resume
          </button>
        ) : (
          <>
            <button
              onClick={onCloseEarly}
              disabled={isReadOnly}
              className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] disabled:opacity-40 w-full sm:w-auto"
            >
              <i className="ri-stop-circle-line text-base"></i>
              Close early
            </button>
            <button
              onClick={onPause}
              disabled={isReadOnly}
              className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] disabled:opacity-40 w-full sm:w-auto"
            >
              <i className="ri-pause-circle-line text-base"></i>
              Pause
            </button>
          </>
        )}
        <button
          onClick={onExtend}
          disabled={isReadOnly}
          className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] disabled:opacity-40 w-full sm:w-auto"
        >
          <i className="ri-calendar-event-line text-base"></i>
          Extend closing date
        </button>
        <button
          onClick={onCancel}
          disabled={isReadOnly}
          className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-white border border-[#D8201D] text-[#D8201D] hover:bg-red-50 disabled:opacity-40 w-full sm:w-auto"
        >
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.77334 15.167C6.03724 15.167 5.33361 15.0262 4.66246 14.7445C4.02018 14.47 3.44826 14.0819 2.9467 13.5799C2.44514 13.078 2.05725 12.5056 1.78301 11.8628C1.50156 11.1912 1.36084 10.487 1.36084 9.75033C1.36084 9.01366 1.50156 8.30949 1.78301 7.63783C2.05725 6.99505 2.44514 6.42269 2.9467 5.92074C3.44826 5.4188 4.02018 5.0306 4.66246 4.75616C5.33361 4.47449 6.03724 4.33366 6.77334 4.33366C7.50944 4.33366 8.21306 4.47449 8.88421 4.75616C9.5265 5.0306 10.0984 5.4188 10.6 5.92074C11.1015 6.42269 11.4894 6.99505 11.7637 7.63783C12.0451 8.30949 12.1858 9.01366 12.1858 9.75033C12.1858 10.487 12.0451 11.1912 11.7637 11.8628C11.4894 12.5056 11.1015 13.078 10.6 13.5799C10.0984 14.0819 9.5265 14.47 8.88421 14.7445C8.21306 15.0262 7.50944 15.167 6.77334 15.167ZM6.77334 14.0837C7.55996 14.0837 8.28884 13.885 8.95999 13.4878C9.60949 13.105 10.1255 12.5887 10.508 11.9387C10.9049 11.267 11.1033 10.5375 11.1033 9.75033C11.1033 8.9631 10.9049 8.23366 10.508 7.56199C10.1255 6.91199 9.60949 6.91199 8.95999 6.01283C8.28884 5.6156 7.55996 5.41699 6.77334 5.41699C5.98672 5.41699 5.25784 5.6156 4.58669 6.01283C3.93719 6.3956 3.4212 6.91199 3.03871 7.56199C2.6418 8.23366 2.44334 8.9631 2.44334 9.75033C2.44334 10.5375 2.6418 11.267 3.03871 11.9387C3.4212 12.5887 3.93719 13.105 4.58669 13.4878C5.25784 13.885 5.98672 14.0837 6.77334 14.0837ZM4.88979 7.09616L9.42546 11.6353C9.31721 11.7798 9.19814 11.917 9.06824 12.047C8.93834 12.177 8.80122 12.2962 8.65689 12.4045L4.12121 7.86533C4.22946 7.72088 4.34854 7.58366 4.47844 7.45366C4.60834 7.32366 4.74546 7.20449 4.88979 7.09616Z" fill="#D8201D"/>
          </svg>
          Cancel survey
        </button>
      </div>
    </div>
    
  );
}
