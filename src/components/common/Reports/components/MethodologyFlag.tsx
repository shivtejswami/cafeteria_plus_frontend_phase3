'use client';

interface MethodologyFlagProps {
  sameVersion: boolean;
  versionA: string;
  versionB: string;
}

export default function MethodologyFlag({ sameVersion, versionA, versionB }: MethodologyFlagProps) {
  if (sameVersion) {
    return (
      <div className="rounded-2xl p-4 flex items-start gap-3 bg-sage-100 border border-[#c5dbc1]">
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
          <i className="ri-checkbox-circle-fill text-[18px]"></i>
        </span>
        <div>
          <p className="text-[14px] font-medium text-ink">
            Same survey version — directly comparable
          </p>
          <p className="text-[13px] mt-0.5 text-muted">
            Both periods used instrument {versionA}. Scores and changes can be compared like-for-like.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 flex items-start gap-3 bg-gold-100 border border-[#f5d89a]">
      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
        <i className="ri-error-warning-line text-[18px]"></i>
      </span>
      <div>
        <p className="text-[14px] font-medium text-ink">
          These periods used different survey versions
        </p>
        <p className="text-[13px] mt-0.5 text-muted">
          The earlier period used instrument {versionA} and the later period used {versionB}. Because the questions or scoring may have changed, comparisons are shown for context but aren&apos;t an exact like-for-like.
        </p>
      </div>
    </div>
  );
}