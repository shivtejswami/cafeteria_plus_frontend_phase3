"use client";

import React from "react";
import SubscriptionStatus from "./SubscriptionStatus";
import AgreementDetails from "./AgreementDetails";
import RenewalSupport from "./RenewalSupport";

export default function Subscription() {
  return (
    <div className="w-full mx-auto flex flex-col pt-6">
      <SubscriptionStatus />
      <AgreementDetails />
      <RenewalSupport />
    </div>
  );
}
