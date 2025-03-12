export interface MSME {
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
