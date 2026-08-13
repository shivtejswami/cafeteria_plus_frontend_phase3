'use client';

/** Grey record notice shown at the top of a cancelled survey. */
export function CancelledNotice() {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-[#F5F3F0] border border-[#EAE7E1]">
      <div className="flex items-start gap-3">
        <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#9A9A9A]">
          <i className="ri-close-circle-line text-base"></i>
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#2B2B2B]">
            This survey has been cancelled
          </p>
          <p className="text-[13px] mt-0.5 text-[#6D6D6D]">
            No report was produced. The record is retained for your school&apos;s history.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Status card shown while SFWG prepares the report for a closed survey. */
export function AnalysingNotice() {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#FFF1DD] text-[#D97706]">
          <i className="ri-loader-4-line text-base animate-spin"></i>
        </span>
        <div className="min-w-0">
          <p className="text-[14px] sm:text-[15px] font-semibold text-[#2B2B2B]">
            Analysis in progress
          </p>
          <p className="text-[13px] mt-0.5 text-[#6D6D6D]">
            Your report is being prepared. This usually takes a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

/** A draft has never been scheduled, so there is nothing to report on yet. */
export function DraftNotice() {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-[#F5F3F0] border border-[#EAE7E1]">
      <div className="flex items-start gap-3">
        <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#9A9A9A]">
          <i className="ri-draft-line text-base"></i>
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#2B2B2B]">
            Not scheduled yet
          </p>
          <p className="text-[13px] mt-0.5 text-[#6D6D6D]">
            Finish the schedule and launch it when you&apos;re ready. Students can&apos;t see anything until then.
          </p>
        </div>
      </div>
    </div>
  );
}

/** A scheduled survey is set up but not collecting yet. */
export function ScheduledNotice({ opensAt }: { opensAt: string }) {
  return (
    <div className="rounded-2xl p-4 flex items-start gap-3 bg-[#FAF8FC] border border-[#EDE3F5]">
      <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#5B3AA0]">
        <i className="ri-calendar-schedule-line text-base"></i>
      </span>
      <div>
        <p className="text-[13px] font-semibold text-[#5B3AA0]">
          Scheduled &mdash; not collecting yet
        </p>
        <p className="text-[13px] font-normal text-[#5B3AA0] leading-relaxed">
          The survey opens automatically on {opensAt}. Students can&apos;t respond before then.
        </p>
      </div>
    </div>
  );
}

/** Amber caveat shown when too few students responded for the results to be reliable. */
export function SmallSampleNotice({ responseCount }: { responseCount: number }) {
  return (
    <div className="rounded-2xl p-4 flex items-start gap-3 bg-[#FFF7E8] border border-[#F5D8A0]">
      <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#B45309]">
        <i className="ri-alert-line text-base"></i>
      </span>
      <div>
        <p className="text-[13px] font-semibold text-[#92400E]">
          Small sample
        </p>
        <p className="text-[13px] font-normal text-[#92400E] leading-relaxed">
          Results are directional only ({responseCount} responses, below 30).
        </p>
      </div>
    </div>
  );
}

/** Closing summary for a survey whose report has been published. */
export function SurveyCompleteNotice({
  responseCount,
  targetCount,
  responseRate,
}: {
  responseCount: number;
  targetCount: number;
  responseRate: number;
}) {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#E6F4EA] text-[#137333]">
          <i className="ri-check-double-line text-base"></i>
        </span>
        <div className="min-w-0">
          <p className="text-[14px] sm:text-[15px] font-semibold text-[#2B2B2B]">
            Survey complete
          </p>
          <p className="text-[13px] mt-0.5 text-[#6D6D6D]">
            {responseCount} of {targetCount} students responded ({responseRate}%).
          </p>
        </div>
      </div>
    </div>
  );
}

/** Amber banner explaining what students see while collection is paused. */
export function PausedNotice() {
  return (
    <div className="rounded-2xl p-4 flex items-start gap-3 bg-[#FFFBF0] border border-[#F5D8A0]">
      <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#92400E]">
        <i className="ri-pause-circle-line text-base"></i>
      </span>
      <div>
        <p className="text-[13px] font-semibold text-[#92400E]">
          Survey paused
        </p>
        <p className="text-[13px] font-normal text-[#92400E] leading-relaxed">
          Students see a neutral &quot;not available&quot; message. Resume to continue collecting responses.
        </p>
      </div>
    </div>
  );
}

/** Context banners shown while a survey is still open. */
export function LiveNotices({ responseRate, daysRemaining }: { responseRate: number; daysRemaining: number }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-4 flex items-start gap-3 bg-[#FAF8FC] border border-[#EDE3F5]">
        <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#5B3AA0]">
          <i className="ri-eye-line text-base"></i>
        </span>
        <p className="text-[13px] text-[#5B3AA0] font-medium leading-relaxed">
          You&apos;re seeing participation only. Scores, insights, and your report appear after the survey closes.
        </p>
      </div>

      <div className="rounded-2xl p-4 flex items-start gap-3 bg-[#FFFBF0] border border-[#F5D8A0]">
        <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#92400E]">
          <i className="ri-alert-line text-base"></i>
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[#92400E]">
            Participation below target
          </p>
          <p className="text-[13px] font-normal text-[#92400E] leading-relaxed">
            Only {responseRate}% with {daysRemaining} days left. A low-participation reminder has been sent to you.
          </p>
        </div>
      </div>
    </div>
  );
}
