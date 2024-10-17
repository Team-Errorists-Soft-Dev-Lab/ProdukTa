"use client";

// the very home page

//temporarily home page ko ang superadmin dashboard
import React from "react";
import SuperAdminDashboard from "./superadmin/layout";

import { SuperAdminProvider } from "@/contexts/SuperAdminContext";

const HomePage: React.FC = () => {
  return (
    <SuperAdminProvider>
      <SuperAdminDashboard />
    </SuperAdminProvider>
  );
};

export default HomePage;
