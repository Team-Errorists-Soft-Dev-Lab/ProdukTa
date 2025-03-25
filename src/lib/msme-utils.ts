import type { MSME } from "@/types/MSME";
import type { SortState } from "@/types/table";

export interface MSMEWithProducts extends MSME {
  products: string[];
}

export const csvHeaders = [
  { label: "Company Name", key: "companyName" },
  { label: "Contact Person", key: "contactPerson" },
  { label: "Contact Number", key: "contactNumber" },
  { label: "Email", key: "email" },
  { label: "Address", key: "cityMunicipalityAddress" },
  { label: "Sector", key: "sector" },
];

export function getSectorName(
  sectors: Array<{ id: number; name: string }>,
  sectorId: number,
) {
  return sectors.find((s) => s.id === sectorId)?.name ?? "Unknown";
}

export function handleSort(prevState: SortState, column: string): SortState {
  return {
    column,
    direction:
      prevState.column === column
        ? prevState.direction === "default"
          ? "asc"
          : prevState.direction === "asc"
            ? "desc"
            : "default"
        : "asc",
  };
}

export function getCsvData(
  msmes: MSME[],
  selectedMSMEs: number[],
  getSectorNameFn: (sectorId: number) => string,
) {
  return msmes
    .filter((msme) => selectedMSMEs.includes(msme.id))
    .map((msme) => ({
      ...msme,
      sector: getSectorNameFn(msme.sectorId),
      products: (msme as MSMEWithProducts).products?.join(", ") || "",
    }));
}

export function filterMSMEs(
  msmes: MSME[],
  searchTerm: string,
  filters: { sectors: number[]; cities: string[] },
) {
  return msmes.filter((msme) => {
    if (filters.sectors.length > 0 && !filters.sectors.includes(msme.sectorId))
      return false;
    if (
      filters.cities.length > 0 &&
      !filters.cities.includes(msme.cityMunicipalityAddress)
    )
      return false;
    return (
      msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msme.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msme.companyDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      msme.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
}

export function sortMSMEs(
  msmes: MSME[],
  sortState: SortState,
  getSectorNameFn: (sectorId: number) => string,
) {
  if (sortState.direction === "default") return msmes;

  return [...msmes].sort((a, b) => {
    const direction = sortState.direction === "asc" ? 1 : -1;
    const column = sortState.column;

    switch (column) {
      case "companyName":
        return direction * a.companyName.localeCompare(b.companyName);
      case "sector":
        return (
          direction *
          getSectorNameFn(a.sectorId).localeCompare(getSectorNameFn(b.sectorId))
        );
      case "contact":
        return (
          direction *
          (a.contactPerson || "").localeCompare(b.contactPerson || "")
        );
      case "location":
        return (
          direction *
          (a.cityMunicipalityAddress || "").localeCompare(
            b.cityMunicipalityAddress || "",
          )
        );
      case "dti":
        return direction * ((a.dti_number || 0) - (b.dti_number || 0));
      default:
        return 0;
    }
  });
}
