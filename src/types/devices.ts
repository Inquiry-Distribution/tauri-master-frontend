export type Device = {
  id: string;
  deviceId: string;
  mobileNumber: string | null;
  salespersonId: string;
  isBlocked: boolean;
  blockedAt: string | null;
  blockedById: string | null;
  blockReason: string | null;
  lastSeen: string;
  lastLat: string;
  lastLng: string;
  lastAddress: null;
  lastLocatedAt: string;
  platform: string;
  appVersion: string;
  createdAt: string;
  updatedAt: string;
  salesperson: {
    id: string;
    name: string;
    email: string;
    phone: string;
    employeeId: string;
  };
  blockedBy: string | null;
};

export type DeviceLocation = {
  id: string;
  deviceId: string;
  isBlocked: boolean;
  lastLat: string;
  lastLng: string;
  lastAddress: null;
  lastLocatedAt: string;
  lastSeen: string;
  salesperson: {
    id: string;
    name: string;
  };
};
