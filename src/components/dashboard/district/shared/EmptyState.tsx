import React from 'react';
import { cn } from '@/utils/tailwind';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="max-w-md text-sm text-slate-500">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
 