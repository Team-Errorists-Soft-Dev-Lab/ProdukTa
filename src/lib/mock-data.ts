export interface MSME {
  id: number;
  name: string;
  email: string;
  contactNumber: number;
  address: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  sector: string;
  msmes: MSME[];
}

// Bamboo mock data
export const bambooMSMEs: MSME[] = [
  {
    id: 1,
    name: "Tita's Bamboo Handicrafts Manufacturing",
    email: "titas.bamboo@example.com",
    contactNumber: 9078088407,
    address: "San Rafael, Tigbauan, Iloilo",
  },
  {
    id: 2,
    name: "Trogani Bamboo Products Manufacturing",
    email: "trogani.bamboo@example.com",
    contactNumber: 9187014975,
    address: "Canabuan, Tigbauan, Iloilo",
  },
  {
    id: 3,
    name: "Candelaria Canata Bamboo Products Mftg.",
    email: "candelaria.bamboo@example.com",
    contactNumber: 9103994785,
    address: "Islan Norte, Leon, Iloilo",
  },
  {
    id: 4,
    name: "Association of Differently-abled Persons in Iloilo MPC",
    email: "adpi.mpc@example.com",
    contactNumber: 9085149216,
    address: "Lapayon, Leganes, Iloilo",
  },
  {
    id: 5,
    name: "L and J Native Products",
    email: "landjnative@example.com",
    contactNumber: 9127045676,
    address: "Malunang, Zarraga, Iloilo",
  },
  {
    id: 6,
    name: "Alimodian Bamboo Producers Association",
    email: "alimodian.bamboo@example.com",
    contactNumber: 9398248011,
    address: "Lapayon, Leganes, Iloilo",
  },
  {
    id: 7,
    name: "Maasin Kawayan MPC",
    email: "maasin.kawayan@example.com",
    contactNumber: 9108041709,
    address: "Poblacion, Maasin, Iloilo",
  },
  {
    id: 8,
    name: "Efren's Bamboo Crafts Manufacturing",
    email: "efrens.bamboo@example.com",
    contactNumber: 9486961815,
    address: "Jibolo, Janiuay, Iloilo",
  },
  {
    id: 9,
    name: "JVM Bamboo Furniture Manufacturing",
    email: "jvm.bamboo@example.com",
    contactNumber: 9309687456,
    address: "Bantayan, San Enrique, Iloilo",
  },
  {
    id: 10,
    name: "Mr. Hobby Pottery and Bamboo Shop",
    email: "mr.hobby@example.com",
    contactNumber: 9384238695,
    address: "Haguimitan, Passi City, Iloilo",
  },
  {
    id: 11,
    name: "Alegria Bamboo Craft Association",
    email: "alegria.bamboo@example.com",
    contactNumber: 9468665296,
    address: "Alegria, Dingle, Iloilo",
  },
  {
    id: 12,
    name: "CM Bamboo Craft",
    email: "cm.bamboo@example.com",
    contactNumber: 9499627174,
    address: "La Paz, Iloilo City",
  },
  {
    id: 13,
    name: "UP Visayas Community-Based Bamboo Enterprise",
    email: "upv.bamboo@example.com",
    contactNumber: 9550773719,
    address: "UPV Miagao Campus, Miagao, Iloilo",
  },
  {
    id: 14,
    name: "Skye Furniture Shop",
    email: "skye.furniture@example.com",
    contactNumber: 9757102268,
    address: "Nanga, Guimbal, Iloilo",
  },
  {
    id: 15,
    name: "Segundo's Bamboo Woven Products",
    email: "segundos.bamboo@example.com",
    contactNumber: 9263827208,
    address: "Dakong, Guimbal, Iloilo",
  },
];

// Coconut Sector MSME
export const coconutMSMEs: MSME[] = [
  {
    id: 1,
    name: "Miagao Farmers Agriculture Coop (MFAC)",
    email: "mfac@example.com",
    contactNumber: 9564799139,
    address: "Kirayan Tacas, Miagao",
  },
  {
    id: 2,
    name: "Net's VCO",
    email: "nets.vco@example.com",
    contactNumber: 9108502913,
    address: "Poblacion, Lemery",
  },
  {
    id: 3,
    name: "Teray's Virgin Coconut Oil",
    email: "terays.vco@example.com",
    contactNumber: 9487454371,
    address: "Nagba, Tigbauan",
  },
  {
    id: 4,
    name: "San Dionisio Iloilo Herbal Growers Economic Enterprise Association",
    email: "sandihgeea@example.com",
    contactNumber: 9306501148,
    address: "Bondulan, San Dionisio, Iloilo",
  },
  {
    id: 5,
    name: "San Dionisio Multi Sectoral Integrated Association",
    email: "sdmsia@example.com",
    contactNumber: 9307883043,
    address: "Pase, San Dionisio",
  },
];

// Coffee Sector MSMEs
export const coffeeMSMEs: MSME[] = [
  {
    id: 1,
    name: "3rd Gen Glory's Café",
    email: "3rdgen.glory@example.com",
    contactNumber: 9176209188,
    address: "Quezon St., Brgy. Quezon Arevalo, Iloilo City",
  },
  {
    id: 2,
    name: "Mountain Brew- Coffee Trading",
    email: "mountain.brew@example.com",
    contactNumber: 9176247077,
    address: "Lopez Jaena Norte, La Paz Iloilo City",
  },
  {
    id: 3,
    name: "Mountain Joe Coffee Trading",
    email: "mountain.joe@example.com",
    contactNumber: 9955251676,
    address: "Brgy. Burak, Maasin, Iloilo",
  },
  {
    id: 4,
    name: "Kape Irong Irong",
    email: "kape.irong@example.com",
    contactNumber: 9207433240,
    address: "Brgy. Rizal, Barotac Viejo, Iloilo",
  },
  {
    id: 5,
    name: "La Roasteria Kape Atbp.",
    email: "laroasteria@example.com",
    contactNumber: 9887879880,
    address: "Corner Compania - Avancena St., Fundidor Molo, Iloilo City",
  },
];

// Weaving Sector MSMEs
export const weavingMSMEs: MSME[] = [
  {
    id: 1,
    name: "Arevalo Handwoven Products",
    email: "arevalohandwovenproducts@yahoo.com",
    contactNumber: 9203178871,
    address: "No. 58 Sta. Cruz, Arevalo, Iloilo City",
  },
  {
    id: 2,
    name: "Baraclayan Weavers Association",
    email: "baraclayanweaversassn@gmail.com",
    contactNumber: 9278925142,
    address: "Baraclayan, Miagao, Iloilo",
  },
  {
    id: 3,
    name: "Bugtongan Loomweavers Association",
    email: "bugtongan.weavers@example.com",
    contactNumber: 9505175563,
    address: "Bugtongan, Dueñas, Iloilo",
  },
  {
    id: 4,
    name: "Cabayogan Women's Loom Weavers Association",
    email: "cwlwa@example.com",
    contactNumber: 9395499803,
    address: "Cabayogan, Badiangan, Iloilo",
  },
  {
    id: 5,
    name: "Indag-an Primary Multi Purpose Cooperative",
    email: "ind.ipmpc@gmail.com",
    contactNumber: 9094369139,
    address: "Indag-an, Miagao, Iloilo",
  },
];

// Food Processing Sector MSMEs
export const foodMSMEs: MSME[] = [
  {
    id: 1,
    name: "ABBY'S CHICHARON",
    email: "abbys.chicharon@example.com",
    contactNumber: 9288273266,
    address: "Calumpang,Molo,Iloilo City",
  },
  {
    id: 2,
    name: "AL DI FOODS",
    email: "aldi.foods@example.com",
    contactNumber: 9171490663,
    address: "Magsaysay Rd., Magsaysay Vill., Lapaz, Iloilo City",
  },
  {
    id: 3,
    name: "LLOYD'S FOOD PRODUCTS",
    email: "lloyds.foods@example.com",
    contactNumber: 9100046060,
    address: "Brgy. Guihaman, Leganes,Iloilo",
  },
  {
    id: 4,
    name: "MIDWAY'S PASSI TRINITY LEISURE FARM INC.",
    email: "midways.passi@example.com",
    contactNumber: 9778559779,
    address: "Calumpang,Molo,Iloilo City",
  },
  {
    id: 5,
    name: "RGIES - RJGM Pacific Corp.",
    email: "rgies.rjgm@example.com",
    contactNumber: 9209295368,
    address: "Alta Tierra Village, Jaro,Iloilo City",
  },
];

// Admin data with their respective sectors
export const adminData: Admin[] = [
  {
    id: 1,
    name: "Bamboo Admin",
    email: "bamboo.admin@example.com",
    sector: "Bamboo",
    msmes: bambooMSMEs,
  },
  {
    id: 2,
    name: "Coconut Admin",
    email: "coconut.admin@example.com",
    sector: "Coconut",
    msmes: coconutMSMEs,
  },
  {
    id: 3,
    name: "Coffee Admin",
    email: "coffee.admin@example.com",
    sector: "Coffee",
    msmes: coffeeMSMEs,
  },
  {
    id: 4,
    name: "Weaving Admin",
    email: "weaving.admin@example.com",
    sector: "Weaving",
    msmes: weavingMSMEs,
  },
  {
    id: 5,
    name: "Food Processing Admin",
    email: "food.admin@example.com",
    sector: "Food Processing",
    msmes: foodMSMEs,
  },
];
