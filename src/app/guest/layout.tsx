"use client";
import React from "react";
import { MSMEProvider } from "@/contexts/MSMEContext";
import GuestPage from "./page";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MSMEProvider>
      <GuestPage />
    </MSMEProvider>
  );
}
