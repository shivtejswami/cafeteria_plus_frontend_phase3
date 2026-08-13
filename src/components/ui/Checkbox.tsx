import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, onChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        ref={ref}
        onClick={(e) => {
          if (disabled) return;
          // React event synthetic event mock if onChange is needed
          onChange?.(e as any);
          onCheckedChange?.(!checked);
        }}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2DA3] focus-visible:ring-offset-2",
          disabled ? "cursor-not-allowed bg-slate-100 opacity-50 border-[#E8E6E1]" : "cursor-pointer",
          checked && !disabled ? "border-[#4B7A5C] bg-sage text-white" : "border-[#E8E6E1] bg-white",
          className
        )}
        {...props as any}
      >
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";
