"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { NotificationRow } from "./NotificationRow";
import { NOTIFICATION_MOCK_DATA } from "./mockData";
import { NotificationGroup } from "./types";
import Link from "next/link";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { cn } from "@/utils/cn";

const FilterMenu = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 cursor-pointer bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50"
      >
        {label}: <span className="text-slate-900 font-semibold">{value.startsWith('All') ? 'All' : value}</span>
        <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50">
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5">
            {options.map((opt, idx) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-[13px] rounded-lg transition-colors border cursor-pointer",
                  value === opt 
                    ? "text-iris font-semibold border-transparent bg-transparent" 
                    : "text-slate-700 hover:bg-slate-50 border-transparent"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const NotificationCenter = () => {
  const [data, setData] = useState<NotificationGroup[]>(NOTIFICATION_MOCK_DATA);
  const [filterType, setFilterType] = useState<string>("All"); // 'All', 'Unread', 'Read'
  const [typeFilter, setTypeFilter] = useState("All types");
  const [schoolFilter, setSchoolFilter] = useState("All schools");

  const handleMarkRead = (id: string) => {
    setData((prev) => 
      prev.map(group => ({
        ...group,
        items: group.items.map(item => 
          item.id === id ? { ...item, isRead: true } : item
        )
      }))
    );
  };

  const handleMarkAllRead = () => {
    setData((prev) => 
      prev.map(group => ({
        ...group,
        items: group.items.map(item => ({ ...item, isRead: true }))
      }))
    );
  };

  return (
    <div className="">
      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-white rounded-full p-1 border border-slate-200 inline-flex shadow-sm">
            {["All", "Unread", "Read"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilterType(opt)}
                className={`px-4 py-1.5 text-xs cursor-pointer font-medium rounded-full transition-colors ${
                  filterType === opt 
                    ? "bg-slate-100 text-slate-800" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 relative z-10 ">
            <FilterMenu 
              label="Type" 
              options={[
                "All types", "Reopen requests", "Survey activity", "Participation", 
                "Reports", "Schools", "Subscription & access", "Benchmarks", 
                "Account & security", "Support", "Governance & settings", "Service notices"
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
            />
            <FilterMenu 
              label="Schools" 
              options={[
                "All schools", "Hillside Middle", "Northgate Middle", "Maple Elementary", 
                "Riverside Elementary", "Cedar Grove Elementary", "Westbrook High"
              ]}
              value={schoolFilter}
              onChange={setSchoolFilter}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllRead}
            className="px-4 py-1.5 text-xs font-medium text-muted bg-white border border-border rounded-full shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Mark all read
          </button>
          <Link
            href="/district/settings" 
            className="px-4 py-1.5 text-xs font-medium text-sage bg-sage-50 border border-[#D6E0D2] rounded-full shadow-sm hover:bg-slate-50 transition-colors"
          >
            Notification settings
          </Link>
        </div>
      </div>

      {/* Notifications List container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-12">
        {data.map((group, groupIdx) => {
          // Filter items
          const items = group.items.filter(item => {
            if (filterType === "Unread") return !item.isRead;
            if (filterType === "Read") return item.isRead;
            return true;
          });

          if (items.length === 0) return null;

          return (
            <div key={group.id} className={groupIdx > 0 ? "border-t border-slate-100" : ""}>
              <div className="px-5 py-4 bg-white border-b border-slate-100">
                <h3 className="text-xs font-medium text-slate-500">
                  {group.title}
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <NotificationRow 
                    key={item.id} 
                    item={item} 
                    onMarkRead={handleMarkRead} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
