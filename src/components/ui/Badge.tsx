import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#5B2DA3] text-white hover:bg-[#4C2589]",
        secondary:
          "border-transparent bg-[#7C5CE6] text-white hover:bg-[#7C5CE6]/80",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        outline: "text-[#1F1F1F] border-[#E8E6E1]",
        success: "border-transparent bg-[#ECFDF3] text-[#22C55E]",
        warning: "border-transparent bg-[#FEF3C7] text-[#F59E0B]",
        info: "border-transparent bg-[#EFF6FF] text-[#3B82F6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
