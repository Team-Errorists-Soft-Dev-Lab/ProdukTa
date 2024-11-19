export interface MSME {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  businessType: string;
  sector: string;
  contactPerson: string;
  registrationDate: string;
  status: string;
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
  dateAdded: string;
}
