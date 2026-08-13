'use client';
import React, { useState } from 'react';
import { cn } from '@/utils/tailwind';

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : internalActiveTab;

  const handleTabClick = (id: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(id);
    }
    onChange?.(id);
  };

  return (
    <div className={cn("flex border-b border-slate-200 overflow-x-auto overscroll-x-contain scrollbar-none [&::-webkit-scrollbar]:hidden", className)}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            className={cn(
              "shrink-0 whitespace-nowrap px-3 sm:px-4 py-3 text-[13px] sm:text-sm font-medium transition-colors relative cursor-pointer",
              isActive ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"
            )}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-700" />
            )}
          </button>
        );
      })}
    </div>
  );
}
