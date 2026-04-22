import { api } from "../api/axios";

export const DeviceService = {
  resetDeviceBySalesPerson: async (id: string) => {
    const { data } = await api.delete(`/devices/salesperson/${id}/reset`);
    return data;
  },
};
