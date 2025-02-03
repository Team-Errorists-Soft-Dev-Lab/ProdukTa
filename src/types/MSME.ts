export type MSME = {
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
  createdAt: Date;
  // Additional properties used in modal
  name: string;
  description: string;
  category: string;
  address: string;
  productGallery: string[];
  majorProductLines: string[];
};
