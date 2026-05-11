import { api } from "../api/axios";

export const LocationService = {
  getAllLocations: async () => {
    const { data } = await api.get(`/locations/live`);
    return data;
  },
  getLocationHistoryBySalesPersonId: async (id: string, query: string) => {
    const { data } = await api.get(`/locations/salesperson/${id}?${query}`);
    return data;
  },
};
