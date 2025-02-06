"use client";
import { useSearchParams } from "next/navigation";

export default function ExportData() {
  const searchParams = useSearchParams();
  const selectedId: string[] = JSON.parse(
    searchParams.get("selectedId") ?? "[]",
  ) as string[]; // Convert back to array

  return <div>Selected IDs: {selectedId.join(", ")}</div>;
}
