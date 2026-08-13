export type NavLink = {
  name: string;
  href: string;
  icon: string;
};

export type DashboardConfig = {
  title: string;
  links: NavLink[];
};

export const DASHBOARD_CONFIG: Record<string, DashboardConfig> = {
  admin: {
    title: "SFWG internal console", 
    links: [
      { name: "Operations", href: "/admin", icon: "LayoutDashboard" },
      { name: "Customers", href: "/admin/customers", icon: "Building2" },
      { name: "Users", href: "/admin/users", icon: "Users" },
      { name: "Surveys", href: "/admin/surveys", icon: "ClipboardList" },
      { name: "Reports", href: "/admin/reports", icon: "FileText" },
      { name: "Reopen requests", href: "/admin/reopen-requests", icon: "RotateCcw" },
      { name: "Benchmarks", href: "/admin/benchmarks", icon: "BarChart3" },
      { name: "Subscriptions", href: "/admin/subscriptions", icon: "CreditCard" },
      { name: "Support", href: "/admin/support", icon: "Headset" },
      { name: "Activity", href: "/admin/activity", icon: "History" },
      { name: "Platform", href: "/admin/platform", icon: "Settings" },
    ],
  },
  school: {
    title: "Hillside Middle", 
    links: [
      { name: "Home", href: "/school", icon: "Home" },
      { name: "Surveys", href: "/school/surveys", icon: "ClipboardList" },
      { name: "Reports", href: "/school/reports", icon: "FileText" },
      { name: "Activity", href: "/school/activity", icon: "History" },
      { name: "Help", href: "/school/help", icon: "Headset" },
    ],
  },
  district: {
    title: "North Hills School District",
    links: [
      { name: "Home", href: "/district", icon: "Home" },
      { name: "Schools", href: "/district/schools", icon: "School" },
      { name: "Reopen requests", href: "/district/reopen-requests", icon: "RotateCcw" },
      { name: "Reports & Analytics", href: "/district/reports-analytics", icon: "BarChart3" },
      { name: "People", href: "/district/people", icon: "Users" },
      { name: "Activity", href: "/district/activity", icon: "History" },
      { name: "Help", href: "/district/help", icon: "Headset" },
    ],
  },
};
