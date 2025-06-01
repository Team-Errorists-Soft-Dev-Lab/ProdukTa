export type SortDirection = "asc" | "desc" | "default";

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface FilterState {
  sectors: number[];
  cities: string[];
}
