export interface MSME {
  id: number;
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  provinceAddress: string;
  cityMunicipalityAddress: string;
  barangayAddress: string;
  yearEstablished: number;
  dti_number: number;
  sectorId: number;
}

export interface Sector {
  id: number;
  name: string;
  adminCount: number;
  msmeCount: number;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  sectors: {
    sector: {
      name: string;
    };
  }[];
  createdAt: Date;
  isPending: boolean;
}

export interface PendingAdmin {
  id: number;
  name: string;
  email: string;
  sector: string;
  dateApplied: string;
  status: "pending";
}
