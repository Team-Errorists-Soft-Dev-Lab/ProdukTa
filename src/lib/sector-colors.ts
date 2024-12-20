export const SECTOR_COLORS = {
  Coffee: "#4A2C2A", // Deep coffee brown
  Cacao: "#8B4513", // Saddle brown for chocolate
  Coconut: "#00A878", // Tropical green for coconut
  "Processed Foods": "#D35400", // Burnt orange for food processing
  "Wearables and Homestyles": "#2C3E50", // Dark blue for fashion/home
  Bamboo: "#7C9A3C", // Fresh bamboo green
  "IT - BPM": "#1F618D", // Strong blue for technology
} as const;

export type SectorColorKey = keyof typeof SECTOR_COLORS;
