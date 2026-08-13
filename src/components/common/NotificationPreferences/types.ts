import React from "react";

export type FrequencyOption = "Immediately" | "Daily digest" | "Weekly digest";

export interface NotificationSetting {
  id: string;
  title: string;
  description: string | React.ReactNode;
  email: boolean;
  inApp: boolean;
  alwaysOn?: boolean;
  alwaysOnReason?: string;
}

export interface NotificationCategory {
  id: string;
  title: string;
  icon?: React.ElementType; // Accept Lucide icon components directly
  settings: NotificationSetting[];
  alwaysOn?: boolean; // If category level has an always on badge
}

export interface NotificationPreferencesData {
  emailDelivery: {
    email: string;
    frequency: FrequencyOption;
  };
  categories: NotificationCategory[];
}
