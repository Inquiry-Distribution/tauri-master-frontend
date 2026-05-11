import { api } from "../api/axios";

export const CompanyService = {
  getCompanies: async () => {
    const { data } = await api.get("/companies");
    return data;
  },
};
