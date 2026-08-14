"use client";

import { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

/** `href` is the district page each alert is about — see `dashboardHref` for other roles. */
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Reopen request from Hillside Middle",
    description: "Maria Torres has asked to reopen the 6-8 Spring 2026 survey.",
    location: "Hillside Middle",
    time: "25m ago",
    unread: true,
    iconColor: "text-orange-500",
    href: "/district/reopen-requests",
  },
  {
    id: 2,
    title: "Maple Elementary is below its participation target",
    description: "Participation is 38% (76 of 200), below the target the school set for...",
    location: "Maple Elementary",
    time: "55m ago",
    unread: true,
    iconColor: "text-orange-500",
    href: "/district/schools",
  },
  {
    id: 3,
    title: "Northgate Middle's report requires additional review",
    description: "The 6-8 Spring 2026 report is being reviewed by SFWG before it's...",
    location: "Northgate Middle",
    time: "2h ago",
    unread: true,
    iconColor: "text-orange-500",
    href: "/district/schools",
  },
  {
    id: 4,
    title: "Your subscription renews on 15 August 2026",
    description: "SFWG will be in touch about renewal. Billing is handled by SFWG...",
    location: "Today",
    time: "",
    unread: true,
    iconColor: "text-slate-400",
    href: "/district/settings",
  },
  {
    id: 5,
    title: "A benchmark is now available for 6-8",
    description: "",
    location: "",
    time: "",
    unread: false,
    iconColor: "text-slate-400",
    href: "/district/reports-analytics",
  },
];

export function NotificationBell({ count = 5 }: { count?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dashboard = pathname?.split('/')[1] || 'district';

  // The seed list is district-shaped. School and admin share this bell, so send
  // them to their own notifications page rather than a district route.
  const dashboardHref = (href: string) =>
    dashboard === 'district' ? href : `/${dashboard}/notifications`;

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
        className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100 focus:outline-none cursor-pointer"
      >
        <LucideIcons.Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#5B2DA3] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <>
        {/* Mobile backdrop: dims the page and swallows touch scrolling behind the panel. */}
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
        <div className="fixed top-[72px] left-3 right-3 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-[400px] bg-white rounded-xl shadow-lg border border-[#E8E6E1] overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E6E1]">
            <h3 className="font-semibold text-[#111827]">Notifications</h3>
            <button className="text-sm text-[#5B2DA3] hover:underline font-medium cursor-pointer">Mark all read</button>
          </div>
          
          <div className="max-h-[60dvh] sm:max-h-[400px] overflow-y-auto overscroll-contain">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <Link
                key={notification.id}
                href={dashboardHref(notification.href)}
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-4 border-b border-divider hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus-visible:bg-slate-50"
              >
                <div className="mt-1">
                  <div className={cn("w-2 h-2 rounded-full ring-2 ring-current", notification.iconColor)} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold text-[#111827] leading-tight">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-[#5B2DA3] shrink-0 mt-1" />
                    )}
                  </div>
                  {notification.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    {notification.location && (
                      <div className="flex items-center gap-1">
                        <LucideIcons.Building2 className="w-3 h-3" />
                        <span>{notification.location}</span>
                      </div>
                    )}
                    {notification.time && (
                      <span>{notification.time}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-3 bg-white text-center border-t border-[#E8E6E1]">
            <Link
              href={`/${dashboard}/notifications`}
              className="text-sm font-medium text-[#5B2DA3] hover:underline"
              onClick={() => setIsOpen(false)}
            >
              View all
            </Link>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
