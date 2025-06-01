"use client";
import React from "react";
import { MSMEProvider } from "@/contexts/MSMEContext";
import GuestPage from "./page";

export default function GuestLayout() {
  return (
    <MSMEProvider>
      <GuestPage />
    </MSMEProvider>
  );
}
