import React from "react";
import { cn } from "@/utils/cn";

export interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full bg-[#F1EFEA] p-1 text-[#6D6D6D]",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-full px-4 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2DA3] focus-visible:ring-offset-2",
              isSelected
                ? "bg-white text-ink shadow-sm"
                : "hover:text-slate-900"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
