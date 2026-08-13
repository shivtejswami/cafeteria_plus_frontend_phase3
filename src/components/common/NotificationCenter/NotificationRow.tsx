"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { AlertTriangle, Info, Check } from "lucide-react";
import { NotificationItem } from "./types";

interface NotificationRowProps {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
}

export const NotificationRow: React.FC<NotificationRowProps> = ({ item, onMarkRead }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine styles and icons based on type
  const isActionRequired = item.type === "action_required";
  const isAttention = item.type === "attention";
  
  let Icon = Info;
  let iconBg = "bg-slate-100";
  let iconColor = "text-slate-500";
  let badge = null;

  if (isActionRequired) {
    Icon = AlertTriangle;
    iconBg = "bg-orange-100";
    iconColor = "text-orange-600";
    badge = (
      <span className="inline-block px-2 py-0.5 rounded-full bg-[#FFECD1] text-gold text-[10px] font-semibold tracking-wider mb-1">
        Action required
      </span>
    );
  } else if (isAttention) {
    Icon = Info;
    iconBg = "bg-[#FFFBEB]";
    iconColor = "text-[#B45309]";
    badge = (
      <span className="inline-block px-2 py-0.5 rounded-full bg-gold-50 text-[#B45309] text-[10px] font-semibold tracking-wider mb-1">
        Attention
      </span>
    );
  } else if (item.type === "info") {
    Icon = Info;
    iconBg = "bg-[#F2F5F0]";
    iconColor = "text-[#586D4D]";
  }

  return (
    <div 
      className={cn(
        "group flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors relative",
        !item.isRead ? "bg-[#F6F3FC]" : "bg-white"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Unread Indicator */}
      <div className="flex shrink-0 items-center justify-center w-4 h-6 mt-1">
        {!item.isRead && (
          <div className="w-2 h-2 rounded-full bg-iris" />
        )}
      </div>

      {/* Icon */}
      <div className={cn("flex shrink-0 items-center justify-center w-8 h-8 rounded-full mt-0.5", iconBg)}>
        <Icon className={cn("w-4 h-4", iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {badge}
        <h4 className={cn("text-sm font-semibold truncate", !item.isRead ? "text-ink" : "text-slate-700")}>
          {item.title}
        </h4>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="text-[11px] text-slate-400 mt-2">
          {item.meta}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 shrink-0 self-center">
        {item.actionLabel && (
          <a 
            href={item.actionHref}
            className="text-xs font-medium text-iris hover:underline"
          >
            {item.actionLabel}
          </a>
        )}
        
        {/* Checkmark action (mark as read) */}
        <button
          onClick={() => onMarkRead(item.id)}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-all",
            !item.isRead && isHovered 
              ? "bg-iris-50 text-iris opacity-100 visible" 
              : item.isRead 
                ? "bg-transparent text-slate-300 border border-slate-200" 
                : "opacity-0 invisible"
          )}
          title="Mark as read"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
