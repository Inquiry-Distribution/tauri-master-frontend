// src/hooks/useSalesPerson.ts

import { useState } from "react";
import type { SalesPerson } from "@/src/types/users";

import { UserService } from "@/src/services/user.service";

export const useSalesPerson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllSalesPerson = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.getAllSalesPerson();

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAllSalesPerson, loading, error };
};
