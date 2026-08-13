"use client";

import { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface UserDropdownProps {
  initials: string;
}

export function UserDropdown({ initials }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Each dashboard owns its own account screen under its route prefix.
  const isSchool = pathname?.startsWith("/school") ?? false;
  const accountHref = isSchool ? "/school/my-account" : "/district/my-account";
  // The menu item is "Notification preferences" — the school has a dedicated screen for it.
  const notificationsHref = isSchool ? "/school/notifications/preferences" : "/district/settings";
  const subscriptionHref = isSchool ? "/school/subscription" : "/subscription";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 bg-[#F4EEFF] rounded-full flex items-center justify-center text-[#5B2DA3] font-semibold text-sm">
          {initials}
        </div>
        <LucideIcons.ChevronDown className="w-4 h-4 text-slate-400 " />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-[#E8E6E1] overflow-hidden z-50 py-2">          
          <div className="flex flex-col">
            <Link href={accountHref} onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-[#1F1F1F] hover:bg-slate-50 transition-colors">
              My account
            </Link>
            <Link href={notificationsHref} onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-[#1F1F1F] hover:bg-slate-50 transition-colors">
              Notification preferences
            </Link>
            {!isSchool && (
              <Link href="/settings/district" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-[#1F1F1F] hover:bg-slate-50 transition-colors">
                District settings
              </Link>
            )}
            <Link href={subscriptionHref} onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-[#1F1F1F] hover:bg-slate-50 transition-colors">
              Subscription
            </Link>
            
            <div className="h-px bg-[#EFEDE8] my-2" />
            
            <button className="px-4 py-2 text-sm text-[#EF4444] hover:bg-red-50 text-left transition-colors cursor-pointer">
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
