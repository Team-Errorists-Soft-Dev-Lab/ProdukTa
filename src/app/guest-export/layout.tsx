"use client";
import React from "react";
import { MSMEProvider } from "@/contexts/MSMEContext";
import Export from "./page";

export default function ExportLayout() {
  return (
    <MSMEProvider>
      <Export />
    </MSMEProvider>
  );
}
