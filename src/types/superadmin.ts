export interface Admin {
  id: string;
  name: string;
  email: string;
  sectors: {
    sector: {
      name: string;
    };
  }[];
  createdAt: Date;
  isPending: boolean;
}

export interface PendingAdmin {
  id: string;
  name: string;
  email: string;
  sector: string;
  dateApplied: string;
  status: "pending";
}
