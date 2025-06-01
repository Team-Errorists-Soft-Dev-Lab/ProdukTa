import type { ExportMSME } from "./index";

export const exportToCSV = (msmeDataToExport: ExportMSME[]) => {
  if (msmeDataToExport.length === 0) {
    return;
  }

  // Create CSV header row
  const headers = [
    "Company Name",
    "Contact Person",
    "Contact Number",
    "Email",
    "Location",
    "Sector",
  ];

  // Create CSV content
  let csvContent = headers.join(",") + "\n";

  // Add data rows
  msmeDataToExport.forEach((msme) => {
    // Properly escape fields that might contain commas
    const row = [
      `"${msme.companyName.replace(/"/g, '""')}"`,
      `"${msme.contactPerson.replace(/"/g, '""')}"`,
      `"+63 ${msme.contactNumber.replace(/"/g, '""')}"`,
      `"${msme.email.replace(/"/g, '""')}"`,
      `"${msme.cityMunicipalityAddress.replace(/"/g, '""')}"`,
      `"${msme.sectorName?.replace(/"/g, '""') || "Unknown"}"`,
    ].join(",");
    csvContent += row + "\n";
  });

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download link and trigger the download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "msme_data.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
