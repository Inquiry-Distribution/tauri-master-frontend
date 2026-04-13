// src/features/user/api/useUser.ts

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/api/axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });
};
