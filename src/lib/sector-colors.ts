export const SECTOR_COLORS = {
  Coffee: "#000000", // Deep coffee brown
  Cacao: "#8B4513", // Saddle brown for chocolate
  Coconut: "#FF0000", // Tropical green for coconut
  "Processed Foods": "#FFA500", // Burnt orange for food processing
  "Wearables and Homestyles": "#8A2BE2", // Dark blue for fashion/home
  Bamboo: "#6B8E23", // Fresh bamboo green
  "IT - BPM": "#0077BE", // Strong blue for technology
} as const;

export type SectorColorKey = keyof typeof SECTOR_COLORS;
