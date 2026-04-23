import { api } from "../api/axios";

export const DeviceService = {
  getAllDevices: async () => {
    const { data } = await api.get(`/devices`);
    return data;
  },
  getAllDevicesLocations: async () => {
    const { data } = await api.get(`/devices/locations`);
    return data;
  },
  getAllDeviceById: async (id: string) => {
    const { data } = await api.get(`/devices/${id}`);
    return data;
  },
  blockDevice: async (id: string) => {
    const { data } = await api.patch(`/devices/${id}/block`);
    return data;
  },
  unblockDevice: async (id: string) => {
    const { data } = await api.patch(`/devices/${id}/unblock`);
    return data;
  },
  resetDeviceBySalesPerson: async (id: string) => {
    const { data } = await api.delete(`/devices/salesperson/${id}/reset`);
    return data;
  },
};
