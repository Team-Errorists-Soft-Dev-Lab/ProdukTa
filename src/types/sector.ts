export interface SignupSector {
  id: number;
  name: string;
}

export interface Sector {
  id: number;
  name: string;
  adminCount: number;
  msmeCount: number;
}

export interface SectorChartData {
  name: string;
  value: number;
}

export interface SectorPieChartProps {
  sectors: SectorChartData[];
  colors: string[];
}

export interface SmallSectorPieChartProps {
  totalMSMEs: number;
  sectorName: string;
}
