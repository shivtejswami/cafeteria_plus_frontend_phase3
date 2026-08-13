import React from 'react';
import { cn } from '@/utils/tailwind';

interface AlertBoxProps {
  icon?: React.ReactNode;
  title?: string;
  
  children: React.ReactNode;
  variant?: 'warning' | 'info' | 'error' | 'success';
  className?: string;
}

export function AlertBox({ icon, title, children, variant = 'warning', className }: AlertBoxProps) {
  const variants = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };

  const iconColors = {
    warning: 'text-amber-600',
    info: 'text-blue-600',
    error: 'text-red-600',
    success: 'text-emerald-600',
  };

  return (
    <div className={cn("p-4 rounded-xl border flex gap-3", variants[variant], className)}>
      {icon && (
        <div className={cn("shrink-0 mt-0.5", iconColors[variant])}>
          {icon}
        </div>
      )}
      <div>
        {title && <h4 className="text-sm font-semibold mb-1">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
