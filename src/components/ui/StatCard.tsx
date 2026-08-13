import React from 'react';
import { cn } from '@/utils/tailwind';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: React.ReactNode;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  valueColor?: string;
  className?: string;
  href?: string;
}

import Link from 'next/link';

export function StatCard({
  title,
  value,
  subtext,
  icon,
  iconBgColor = 'bg-[#F1EFEA]',
  iconTextColor = 'text-[#6D6D6D]',
  valueColor = 'text-slate-900',
  className,
  href,
}: StatCardProps) {
  const CardContent = (
    <div className={cn("bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between h-full hover:shadow-lg transition-shadow", className)}>
      <div className="flex justify-between items-center gap-2 mb-2">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#9A9A9A] tracking-wide min-w-0">{title}</h3>
        {icon && (
          <div className={cn("p-2 sm:p-2.5 rounded-full flex items-center justify-center shrink-0", iconBgColor, iconTextColor)}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-end grow">
        <div className={cn("text-2xl sm:text-3xl font-bold", valueColor)}>{value}</div>
        <div className="text-xs sm:text-sm text-[#9A9A9A] mt-1 min-h-5">
          {subtext}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}
