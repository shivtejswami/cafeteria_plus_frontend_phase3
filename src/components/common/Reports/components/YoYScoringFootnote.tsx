'use client';

interface YoYScoringFootnoteProps {
  gradeBand: string;
  methodologyVersionA?: string;
  methodologyVersionB?: string;
}

export default function YoYScoringFootnote({ gradeBand, methodologyVersionA, methodologyVersionB }: YoYScoringFootnoteProps) {
  const methodologyDiffers = methodologyVersionA && methodologyVersionB && methodologyVersionA !== methodologyVersionB;

  return (
    <div className="rounded-2xl p-4 sm:p-5 mt-6 bg-white border border-line shadow-[0_1px_2px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3">
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-muted">
          <i className="ri-information-line text-[16px]"></i>
        </span>
        <div>
          <p className="text-[13px] font-semibold text-ink">
            3-point scale · {gradeBand} students
          </p>
          <p className="text-[13px] mt-0.5 leading-relaxed text-muted">
            Score = Yes% + &frac12; &times; Sometimes% (0&ndash;100). Green &ge; 65, Amber 50&ndash;64, Red &lt; 50.
          </p>
          {methodologyVersionA && (
            <p className="text-[12px] mt-2 text-subtle">
              Scoring/analysis methodology: {methodologyVersionA}
              {methodologyDiffers && ` (Period A used ${methodologyVersionA}, Period B used ${methodologyVersionB})`}
            </p>
          )}
          {methodologyDiffers && (
            <p className="text-[12px] mt-1 text-gold">
              <span className="inline-flex items-center gap-1">
                <i className="ri-error-warning-line text-[12px]"></i>
                The scoring methodology differs between these periods. Methodology changes can affect how scores are calculated and compared.
              </span>
            </p>
          )}
          <p className="text-[12px] mt-2 text-subtle">
            Figures on this page match the downloadable PDF report and are derived from the same stored results. All data is anonymised and aggregated — no individual student records are shown.
          </p>
        </div>
      </div>
    </div>
  );
}