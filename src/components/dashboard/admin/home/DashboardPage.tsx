import React from "react";
import { GreetingHeader } from "./GreetingHeader";
import { StatsSection } from "./StatsSection";
import { ReportsTable } from "./ReportsTable";
import { SubscriptionCard } from "./SubscriptionCard";
import { ParticipationCard } from "./ParticipationCard";
import { SupportCard } from "./SupportCard";
import { FooterStatusBar } from "./FooterStatusBar";

export function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full">
      <GreetingHeader />
      <StatsSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - Left Column */}
        <div className="lg:col-span-2">
          <ReportsTable />
        </div>

        {/* Sidebar Cards Stack - Right Column */}
        <div className="lg:col-span-1 space-y-6">
          <SubscriptionCard />
          <ParticipationCard />
          <SupportCard />
        </div>
      </div>

      <FooterStatusBar />
    </div>
  );
}
