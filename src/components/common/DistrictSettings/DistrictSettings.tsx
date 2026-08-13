"use client";

import React from "react";
import ReopenPermission from "./ReopenPermission";
import DistrictProfile from "./DistrictProfile";

export default function DistrictSettings() {
  return (
    <div className="w-full mx-auto flex flex-col pt-6 pb-12">
      <ReopenPermission />
      <DistrictProfile />
    </div>
  );
}
