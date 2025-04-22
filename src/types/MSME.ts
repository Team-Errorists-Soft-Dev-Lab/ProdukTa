import type { Sector } from "@/types/sector";
import type { FilterState, SortState } from "@/types/table";

export type MSME = {
  id: number;
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  productGallery: string[];
  majorProductLines: string[];
  contactPerson: string;
  contactNumber: string;
  email: string;
  facebookPage?: string | null;
  instagramPage?: string | null;
  provinceAddress: string;
  cityMunicipalityAddress: string;
  barangayAddress: string;
  longitude: number;
  latitude: number;
  yearEstablished: number;
  dti_number: number;
  sectorId: number;
  createdAt: Date;
};

export interface ExportMSME {
  id: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  cityMunicipalityAddress: string;
  companyName: string;
  products: string[];
  sectorId?: number;
  dti_number?: string;
}

export interface MSMEWithSectorName extends MSME {
  sectorName: string;
}

export interface MSMECardViewProps {
  msmes: MSME[];
  isLoading: boolean;
  onEdit: (msme: MSME) => void;
  onDelete: (id: number) => void;
  getSectorName: (id: number) => string;
}

export interface MSMECardViewPropsWithEditDelete extends MSMECardViewProps {
  selectedMSMEs: number[];
  onSelectMSME: (id: number, checked: boolean) => void;
}

export interface MSMEFiltersProps {
  sectors: Sector[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export interface MSMETableViewProps {
  msmes: MSME[];
  isLoading: boolean;
  onEdit?: (msme: MSME) => void;
  onDelete?: (id: number) => void;
  getSectorName: (id: number) => string;
  sortState?: SortState;
  onSort?: (column: string) => void;
  isExportMode?: boolean;
  selectedMSMEs?: number[];
  onSelectMSME?: (id: number, isSelected: boolean) => void;
  selectAll?: boolean;
  onSelectAll?: (isSelected: boolean) => void;
}

export interface AddMSMEModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditMSMEModalProps {
  isOpen: boolean;
  onClose: () => void;
  msme: MSME | null;
}

export interface MSMEModalProps {
  MSME: MSME;
  sectorName: string;
}

export interface MSMEFiltersProps {
  sectors: Sector[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}
