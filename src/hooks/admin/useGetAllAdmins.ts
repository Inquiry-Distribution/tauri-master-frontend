// useGetAllAdmins.ts

import { UserService } from "@/src/services/user.service";
import { useState } from "react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  employeeId: string | null;
  assignedArea: string | null;
  profileImage: string | null;
  companyId: string | null;
  isActive: boolean;
  allowRemote: boolean;
  createdAt: string;
  updatedAt: string;
  pin: boolean;

  createdBy?: {
    id: string;
    name: string;
  };

  company?: any;
}

export interface GetAllAdminsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    users: AdminUser[];
  };
}

export const useGetAllAdmins = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getAllAdmins = async (query: string): Promise<GetAllAdminsResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.getAllAdmin(query);

      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllAdmins,
    loading,
    error,
  };
};
