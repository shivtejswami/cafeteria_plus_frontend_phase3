'use client';

const DIETARY_OPTIONS_912 = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'no-restrictions', label: "I don't have any dietary restrictions" },
];

const OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'no-restrictions', label: "I don't have any dietary restrictions" },
];

interface DietaryQuestionProps {
  value: string;
  onSelect: (value: string) => void;
  question: string;
  isK5: boolean;
  is912?: boolean;
}

export default function DietaryQuestion({ value, onSelect, question, isK5, is912 }: DietaryQuestionProps) {
  if (is912) {
    return (
      <div
        className="rounded-[12px] p-4 bg-[#faf9f8] border border-line border-l-[3px] border-l-[#e0dbd3]"
        role="radiogroup"
        aria-label={question}
      >
        <div className="flex flex-col gap-2">
          {DIETARY_OPTIONS_912.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`w-full text-left rounded-[16px] transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.995] cursor-pointer ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border border-line'}`}
                role="radio"
                aria-checked={isSelected}
                aria-label={opt.label}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`text-[15px] font-medium leading-snug flex-1 break-words leading-[1.35] ${isSelected ? 'text-sage' : 'text-ink'}`}
                  >
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-sage">
                      <i className="ri-check-line text-[12px] text-white"></i>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!isK5) {
    return (
      <div
        className="rounded-2xl p-4 bg-[#faf8fe] border border-[#e9e0f5]"
        role="radiogroup"
        aria-label={question}
      >
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-b-[#d4d0c9]">
          <span className="w-5 h-5 flex items-center justify-center rounded-md bg-iris-50">
            <i className="ri-information-line text-[13px] text-iris"></i>
          </span>
          <span className="text-[13px] font-medium text-iris">
            This question is a bit different
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {OPTIONS.map((opt) => {
            const isSelected = value === opt.value;
            const isLong = opt.value === 'no-restrictions';

            return (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`w-full text-left rounded-2xl transition-all duration-[120ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'} ${isSelected ? 'shadow-[0_4px_16px_rgba(88,109,77,0.12)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.03)]'} ${isLong ? '' : 'min-h-[54px]'}`}
                role="radio"
                aria-checked={isSelected}
                aria-label={opt.label}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <span
                    className={`text-[18px] font-medium ${isLong ? 'flex-1' : ''} break-words leading-[1.4] ${isSelected ? 'text-sage' : 'text-ink'}`}
                  >
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-auto bg-sage">
                      <i className="ri-check-line text-[14px] text-white"></i>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label={question}>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const isLong = opt.value === 'no-restrictions';

          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left rounded-2xl p-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-2 border-line'} ${isSelected ? 'shadow-[0_4px_20px_rgba(88,109,77,0.15)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`font-bold text-[22px] ${isLong ? 'flex-1' : ''} break-words ${isSelected ? 'text-sage' : 'text-ink'}`}
                >
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-auto bg-sage">
                    <i className="ri-check-line text-[16px] text-white"></i>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}