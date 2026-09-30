import { useState, useCallback } from "react";
import { HolidayService } from "@/src/services/holiday.service";
import type { Holiday, HolidayPayload } from "@/src/types/holiday";

export const useHolidays = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listHolidays = useCallback(async (year?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await HolidayService.getAll({
        year,
        activeOnly: false,
      });
      return (response?.data || []) as Holiday[];
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load holidays");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createHoliday = useCallback(async (payload: HolidayPayload) => {
    try {
      setSaving(true);
      setError(null);
      const response = await HolidayService.create(payload);
      return response?.data as Holiday;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create holiday");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateHoliday = useCallback(
    async (id: string, payload: Partial<HolidayPayload>) => {
      try {
        setSaving(true);
        setError(null);
        const response = await HolidayService.update(id, payload);
        return response?.data as Holiday;
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to update holiday");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const deleteHoliday = useCallback(async (id: string) => {
    try {
      setSaving(true);
      setError(null);
      await HolidayService.remove(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete holiday");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    listHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    loading,
    saving,
    error,
  };
};
