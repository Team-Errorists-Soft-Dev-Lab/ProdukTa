import type { SignupSector } from "@/types/sector";

export interface ApiResponse {
  sectors: SignupSector[];
  error?: string;
}
