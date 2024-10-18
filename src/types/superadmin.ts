export interface MSME {
  id: number;
  name: string;
  email: string;
  contactNumber: number;
  address: string;
  businessType: string;
  registrationDate: string;
  logo: string | null;
  sector: string;
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
  sector: string;
}
