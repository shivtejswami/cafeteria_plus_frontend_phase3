'use client';

/** Cumulative response curve over the collection window. Participation counts only — no scores. */
export default function ParticipationTrendCard() {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#9A9A9A]">
              Participation trend
            </label>
            <p className="text-[13px] font-normal text-[#6D6D6D] mt-0.5">
              Cumulative responses over the collection window
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#E6F4EA] flex items-center justify-center flex-shrink-0">
            <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.4243 6V16.6667H14.0843V18H2.0918V6H3.4243ZM13.6179 8.2L14.564 9.13333L10.753 12.9467L8.7543 10.9467L5.90275 13.8L4.95667 12.8667L8.7543 9.05333L10.753 11.0533L13.6179 8.2Z" fill="#586D4D"/>
            </svg>
          </div>
        </div>
    
        {/* SVG Area Chart with Y-Axis */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 sm:gap-4 items-stretch min-w-[540px] pt-2 pb-2">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[11px] text-[#9A9A9A] font-medium py-1 select-none pr-1">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
    
            {/* Chart Area */}
            <div className="flex-1 relative">
              <div className="relative h-44 sm:h-48 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#586D4D" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#586D4D" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
    
                  {/* Area Fill */}
                  <polygon
                    points="0,150 70,140 140,130 210,115 280,105 350,90 420,80 490,72 560,65 630,58 700,50 700,180 0,180"
                    fill="url(#trendGradient)"
                  />
    
                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#586D4D"
                    strokeWidth="2.2"
                    points="0,150 70,140 140,130 210,115 280,105 350,90 420,80 490,72 560,65 630,58 700,50"
                  />
    
                  {/* Active Data Point (10 Jul) */}
                  <circle cx="350" cy="90" r="4.5" fill="#586D4D" stroke="#ffffff" strokeWidth="2" />
                  <line x1="350" y1="0" x2="350" y2="180" stroke="#E8E6E1" strokeDasharray="2 2" />
                </svg>
    
                {/* Floating Tooltip Card */}
                <div className="absolute top-[35px] left-[52%] -translate-x-1/2 bg-white rounded-xl p-2.5 sm:p-3 shadow-lg border border-[#E8E6E1] text-[12px] whitespace-nowrap">
                  <p className="font-semibold text-[#2B2B2B] mb-0.5">10 Jul</p>
                  <p className="text-[#9A9A9A]">Cumulative : <span className="text-[#586D4D] font-semibold">42 responses</span></p>
                </div>
              </div>
    
              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] text-[#9A9A9A] mt-3 px-1">
                <span>7 Jul</span>
                <span>8 Jul</span>
                <span>9 Jul</span>
                <span>10 Jul</span>
                <span>11 Jul</span>
                <span>12 Jul</span>
                <span>13 Jul</span>
                <span>14 Jul</span>
                <span>15 Jul</span>
                <span>16 Jul</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div className="bg-[#FAF9F6] border-t border-[#E8E6E1] px-5 sm:px-6 py-3.5">
        <p className="text-[12px] text-[#9A9A9A]">
          Participation counts only &mdash; no scores or sentiment.
        </p>
      </div>
    </div>
  );
}
