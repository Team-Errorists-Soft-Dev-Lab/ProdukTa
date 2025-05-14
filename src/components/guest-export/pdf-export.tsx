import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ExportMSME } from "./index";

// Generate PDF content for a single MSME card
const generatePDFContent = (
  msme: ExportMSME,
  actualMsmeWidth: number,
  actualMsmeHeight: number,
) => {
  const msmeElement = document.createElement("div");
  msmeElement.style.padding = "15px";
  msmeElement.style.borderRadius = "5px";
  msmeElement.style.width = `${actualMsmeWidth}mm`;
  msmeElement.style.height = `${actualMsmeHeight}mm`;
  msmeElement.style.overflow = "hidden";
  msmeElement.style.position = "relative";
  msmeElement.style.zIndex = "1";

  // Add gradient background
  const backgroundDiv = document.createElement("div");
  backgroundDiv.style.position = "absolute";
  backgroundDiv.style.top = "0";
  backgroundDiv.style.left = "0";
  backgroundDiv.style.width = "100%";
  backgroundDiv.style.height = "100%";
  backgroundDiv.style.zIndex = "-1";
  msmeElement.appendChild(backgroundDiv);

  // Content container with relative positioning
  const contentDiv = document.createElement("div");
  contentDiv.style.position = "relative";
  contentDiv.style.zIndex = "2";
  contentDiv.innerHTML = `
    <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">${msme.companyName}</h2>
    <p style="font-size: 14px; margin: 6px 0;"><strong>Contact Person:</strong> ${msme.contactPerson}</p>
    <p style="font-size: 14px; margin: 6px 0;">📞 ${msme.contactNumber}</p>
    <p style="font-size: 14px; margin: 6px 0;">✉️ ${msme.email}</p>
    <p style="font-size: 14px; margin: 6px 0;">📍 ${msme.cityMunicipalityAddress}</p>
  `;
  msmeElement.appendChild(contentDiv);

  return msmeElement;
};

// Main PDF export function
export const exportToPDF = async (
  exportData: ExportMSME[],
  _contentRef: HTMLDivElement,
) => {
  if (exportData.length === 0) return;

  const pdf = new jsPDF("p", "mm", "a4");
  const margin = 10;
  const contentWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
  const contentHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
  const msmePerPage = 8;

  const msmeWidth = contentWidth / 2 - 5; // 2 columns with 5mm gap
  const msmeHeight = contentHeight / 4 - 5; // 4 rows with 5mm gap

  // Load the logo
  const logoImg = document.createElement("img");
  logoImg.src = "/DTI_logo.png";
  await new Promise<void>((resolve) => {
    logoImg.onload = () => resolve();
    logoImg.onerror = () => resolve(); // Continue even if logo fails to load
  });

  for (let i = 0; i < exportData.length; i += msmePerPage) {
    if (i > 0) pdf.addPage();

    const pageContent = document.createElement("div");
    pageContent.style.width = `${contentWidth}mm`;
    pageContent.style.height = `${contentHeight}mm`;
    pageContent.style.display = "flex";
    pageContent.style.flexDirection = "column";
    pageContent.style.gap = "5mm";
    pageContent.style.position = "relative";

    // Add logo and text to the top of each page
    const headerContainer = document.createElement("div");
    headerContainer.style.width = `${contentWidth}mm`;
    headerContainer.style.height = "20mm";
    headerContainer.style.display = "flex";
    headerContainer.style.alignItems = "center";
    headerContainer.style.justifyContent = "flex-start";
    headerContainer.style.gap = "10px";

    const logoContainer = document.createElement("div");
    logoContainer.style.width = "100px";
    logoContainer.style.height = "100px";
    const logo = logoImg.cloneNode(true) as HTMLImageElement;
    logo.style.width = "100%";
    logo.style.height = "100%";
    logo.style.objectFit = "contain";
    logoContainer.appendChild(logo);

    const textContainer = document.createElement("div");
    textContainer.style.display = "flex";
    textContainer.style.flexDirection = "column";
    textContainer.style.justifyContent = "center";

    const titleText = document.createElement("h2");
    titleText.textContent = "ILOILO MSMEs";
    titleText.style.fontSize = "16px";
    titleText.style.fontWeight = "bold";
    titleText.style.margin = "0";

    textContainer.appendChild(titleText);

    headerContainer.appendChild(logoContainer);
    headerContainer.appendChild(textContainer);
    pageContent.appendChild(headerContainer);

    // MSME content container
    const msmeContainer = document.createElement("div");
    msmeContainer.style.display = "grid";
    msmeContainer.style.gridTemplateColumns = `repeat(2, 1fr)`;
    msmeContainer.style.gap = "5mm";

    const msmesOnThisPage = Math.min(msmePerPage, exportData.length - i);

    for (let j = 0; j < msmesOnThisPage; j++) {
      const msme = exportData[i + j];
      if (!msme) continue;

      const msmeElement = generatePDFContent(msme, msmeWidth, msmeHeight);
      msmeContainer.appendChild(msmeElement);
    }

    pageContent.appendChild(msmeContainer);

    document.body.appendChild(pageContent);
    const canvas = await html2canvas(pageContent);
    document.body.removeChild(pageContent);

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
  }

  pdf.save("msme_data.pdf");
};
