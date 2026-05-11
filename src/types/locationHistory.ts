export type LocationHistory = {
  id: string;
  salespersonId: string;
  lat: string;
  lng: string;
  address: string | null;
  accuracy: number;
  recordedAt: string;
};

export type Location = {
  salespersonId: string;
  salespersonName: string;
  lat: number;
  lng: number;
  address: string | null;
  accuracy: number;
  recordedAt: string;
  isOnline: boolean;
};
