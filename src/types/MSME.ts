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
  // Additional properties used in modal
  name: string;
  description: string;
  category: string;
  address: string;
  productGallery: string[];
  majorProductLines: string[];
};
