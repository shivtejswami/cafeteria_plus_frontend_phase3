"use client";

import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { cn } from "@/utils/cn";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { Checkbox } from "@/components/ui/Checkbox";
import { NotificationPreferencesData, FrequencyOption } from "./types";

interface NotificationPreferencesProps {
  data: NotificationPreferencesData;
  onSave?: (data: NotificationPreferencesData) => void;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  data: initialData,
  onSave,
}) => {
  const [data, setData] = useState<NotificationPreferencesData>(initialData);

  const handleFrequencyChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      emailDelivery: {
        ...prev.emailDelivery,
        frequency: value as FrequencyOption,
      },
    }));
  };

  const handleSettingChange = (
    categoryId: string,
    settingId: string,
    field: "email" | "inApp",
    checked: boolean
  ) => {
    setData((prev) => {
      const newCategories = prev.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;

        const newSettings = cat.settings.map((setting) => {
          if (setting.id !== settingId) return setting;
          return { ...setting, [field]: checked };
        });

        return { ...cat, settings: newSettings };
      });

      return { ...prev, categories: newCategories };
    });
  };

  const handleToggleAll = (categoryId: string, field: "email" | "inApp", checked: boolean) => {
    setData((prev) => {
      const newCategories = prev.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;

        const newSettings = cat.settings.map((setting) => {
          if (setting.alwaysOn) return setting; // Don't toggle always on
          return { ...setting, [field]: checked };
        });

        return { ...cat, settings: newSettings };
      });

      return { ...prev, categories: newCategories };
    });
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Notification preferences</h1>
        <p className="mt-1 text-sm text-muted">
          Choose how you want to be notified about your district.
        </p>
      </div>

      {/* Email Delivery Card */}
      <div className="mb-6 rounded-xl border border-[#E8E6E1] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Email delivery</h2>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-900">Sent to</span>
                <span className="text-slate-500">{data.emailDelivery.email}</span>
              </div>
            </div>
          </div>
          <button className="text-sm cursor-pointer font-medium text-iris hover:underline">
            Change in My account
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900">Frequency</div>
            <div className="mt-1 text-xs text-slate-500">
              Digests bundle non-urgent emails. Action-required and always-on alerts send immediately regardless.
            </div>
          </div>
          <ToggleGroup
            options={[
              { label: "Immediately", value: "Immediately" },
              { label: "Daily digest", value: "Daily digest" },
              { label: "Weekly digest", value: "Weekly digest" },
            ]}
            value={data.emailDelivery.frequency}
            onChange={handleFrequencyChange}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {data.categories.map((category) => {
          const Icon = category.icon;
          
          // Determine if all togglable items are checked
          const togglableSettings = category.settings.filter((s) => !s.alwaysOn);
          const allEmailChecked = togglableSettings.length > 0 && togglableSettings.every((s) => s.email);
          const allInAppChecked = togglableSettings.length > 0 && togglableSettings.every((s) => s.inApp);

          return (
            <div key={category.id} className={cn(
              "rounded-xl border border-[#E8E6E1] bg-white overflow-hidden",
              category.alwaysOn ? "shadow-[0px_1px_2px_0px_#0000000A,0px_8px_24px_0px_#0000000F]" : "shadow-sm"
            )}>
              {/* Category Header */}
              <div className={cn(
                "flex items-center justify-between border-b border-[#E8E6E1] px-6 py-4",
                category.alwaysOn ? "bg-white" : "bg-slate-50/50"
              )}>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5 text-slate-500" />}
                  <h3 className="font-semibold text-ink">{category.title}</h3>
                </div>
                {category.alwaysOn ? (
                  <span className="inline-flex items-center rounded-full border border-border bg-canvas px-3 py-1 text-[11px] font-medium text-stone">
                    Always on
                  </span>
                ) : (
                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">All email</span>
                      <Checkbox
                        checked={allEmailChecked}
                        onCheckedChange={(checked) => handleToggleAll(category.id, "email", checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">All in-app</span>
                      <Checkbox
                        checked={allInAppChecked}
                        onCheckedChange={(checked) => handleToggleAll(category.id, "inApp", checked)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Settings List */}
              <div className="divide-y divide-[#E8E6E1]">
                {category.settings.map((setting) => (
                  <div key={setting.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-[75%]">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-ink">{setting.title}</h4>
                        {setting.alwaysOn && (
                          <span className="inline-flex items-center rounded-full border border-border bg-canvas px-2 py-0.5 text-[10px] font-medium text-stone">
                            Always on
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-slate-500 leading-relaxed">
                        {setting.description}
                      </div>
                      {setting.alwaysOn && setting.alwaysOnReason && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                          <Lock className="h-3 w-3" />
                          <span>{setting.alwaysOnReason}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={setting.alwaysOn ? true : setting.email}
                          disabled={setting.alwaysOn}
                          onCheckedChange={(checked) => handleSettingChange(category.id, setting.id, "email", checked)}
                        />
                        <span className={cn("text-sm", category.alwaysOn ? "text-slate-400" : "text-slate-500 sm:sr-only")}>Email</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={setting.alwaysOn ? true : setting.inApp}
                          disabled={setting.alwaysOn}
                          onCheckedChange={(checked) => handleSettingChange(category.id, setting.id, "inApp", checked)}
                        />
                        <span className={cn("text-sm", category.alwaysOn ? "text-slate-400" : "text-slate-500 sm:sr-only")}>In-app</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
