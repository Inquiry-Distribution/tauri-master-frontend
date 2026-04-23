import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { InquiryReportByStatus } from "../types/dashboard";
import { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const formatTimeHM = (date: string | number | Date) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));

export function formatDateTime(iso: string) {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

export function transformInquiryData(data: InquiryReportByStatus[]) {
  return data.map((item) => ({
    name: item.status.replace("_", " ").toUpperCase(),
    value: item._count.id,
  }));
}

export function useDebounce(value: any, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup if value changes before delay finishes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const formatLat = (lat: number) =>
  `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}`;

export const formatLng = (lng: number) =>
  `${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? "E" : "W"}`;
