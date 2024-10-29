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

export interface Admin {
  id: number;
  name: string;
  email: string;
  sector: string;
  msmes: MSME[];
  isAuthenticated: boolean;
  searchQuery?: string;
}
