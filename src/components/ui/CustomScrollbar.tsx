import React from 'react';
import { cn } from '@/utils/tailwind';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string | number;
}

export const CustomScrollbar: React.FC<Props> = ({ children, className, maxHeight, ...rest }) => {
  const style: React.CSSProperties = {
    maxHeight: maxHeight ?? undefined,
  };

  return (
    <div
      {...rest}
      className={cn('custom-scrollbar overflow-auto', className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default CustomScrollbar;
