import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import { useTheme } from "@/src/contexts";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Modal } from "@/src/components/ui/modal";
import Input from "@/src/components/ui/form/input";
import BaseLoader from "@/src/components/ui/loader/baseLoader";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { useHolidays } from "@/src/hooks/holiday/useHolidays";
import type { Holiday } from "@/src/types/holiday";

function parseYmd(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

function toYmd(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSunday(dateStr: string) {
  const dt = parseYmd(dateStr);
  return !!dt && dt.getDay() === 0;
}

function formatLong(dateStr: string) {
  const dt = parseYmd(dateStr);
  if (!dt) return dateStr;
  return dt.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function monthShort(dateStr: string) {
  const dt = parseYmd(dateStr);
  if (!dt) return "";
  return dt.toLocaleDateString("en-IN", { month: "short" });
}

function dayNum(dateStr: string) {
  const dt = parseYmd(dateStr);
  if (!dt) return "";
  return String(dt.getDate()).padStart(2, "0");
}

export default function HolidaysPage() {
  const { tokens } = useTheme();
  const {
    listHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    loading,
    saving,
  } = useHolidays();

  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [date, setDate] = useState(toYmd());
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<{ date?: string; name?: string }>(
    {},
  );

  const fetchData = async () => {
    try {
      const rows = await listHolidays(year);
      setHolidays(rows);
    } catch {
      // hook sets error
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return [current - 1, current, current + 1];
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDate(toYmd());
    setName("");
    setFormError({});
    setModalOpen(true);
  };

  const openEdit = (item: Holiday) => {
    setEditing(item);
    setDate(item.date);
    setName(item.name);
    setFormError({});
    setModalOpen(true);
  };

  const validate = () => {
    const next: { date?: string; name?: string } = {};
    if (!date) next.date = "Date is required";
    else if (!parseYmd(date)) next.date = "Invalid date";
    else if (isSunday(date)) next.date = "Sunday is already week-off";
    if (!name.trim()) next.name = "Name is required";
    setFormError(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (editing) {
        await updateHoliday(editing.id, { date, name: name.trim() });
        Swal.fire({
          icon: "success",
          title: "Holiday updated",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createHoliday({ date, name: name.trim() });
        Swal.fire({
          icon: "success",
          title: "Holiday added",
          timer: 1400,
          showConfirmButton: false,
        });
      }
      setModalOpen(false);
      const dateYear = parseYmd(date)?.getFullYear();
      if (dateYear && dateYear !== year) {
        setYear(dateYear);
      } else {
        await fetchData();
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Save failed",
        text: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleToggleActive = async (item: Holiday) => {
    try {
      const updated = await updateHoliday(item.id, {
        isActive: !item.isActive,
      });
      setHolidays((prev) =>
        prev.map((h) => (h.id === item.id ? updated : h)),
      );
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async (item: Holiday) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete holiday?",
      text: `${item.name} (${item.date})`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#DC2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteHoliday(item.id);
      setHolidays((prev) => prev.filter((h) => h.id !== item.id));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Holidays
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            Public / company holidays used for salesperson attendance. Sundays
            are week-off automatically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 rounded-xl text-sm border outline-none"
            style={{
              backgroundColor: tokens.bg,
              color: tokens.text,
              borderColor: tokens.border,
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} />
            Add Holiday
          </Button>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center">
            <BaseLoader />
          </div>
        ) : holidays.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CalendarDays
              size={36}
              className="mx-auto opacity-40"
              style={{ color: tokens.textSec }}
            />
            <p className="font-semibold" style={{ color: tokens.text }}>
              No holidays for {year}
            </p>
            <p className="text-sm" style={{ color: tokens.textSec }}>
              Tap Add Holiday to create one.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: tokens.border }}>
            {holidays.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                    style={{
                      backgroundColor: item.isActive
                        ? "#7C3AED18"
                        : `${tokens.border}80`,
                    }}
                  >
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{
                        color: item.isActive ? "#7C3AED" : tokens.textSec,
                      }}
                    >
                      {monthShort(item.date)}
                    </span>
                    <span
                      className="text-lg font-bold leading-none"
                      style={{
                        color: item.isActive ? "#7C3AED" : tokens.text,
                      }}
                    >
                      {dayNum(item.date)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-semibold truncate"
                      style={{ color: tokens.text }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: tokens.textSec }}>
                      {formatLong(item.date)}
                      {!item.isActive ? " · Inactive" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                    style={{
                      borderColor: tokens.border,
                      color: item.isActive ? "#065F46" : tokens.textSec,
                      backgroundColor: item.isActive ? "#D1FAE5" : tokens.bg,
                    }}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg border"
                    style={{ borderColor: tokens.border, color: tokens.text }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-lg border"
                    style={{ borderColor: tokens.border, color: "#DC2626" }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {modalOpen ? (
        <Modal
          title={editing ? "Edit Holiday" : "Add Holiday"}
          onClose={() => setModalOpen(false)}
        >
          <div className="space-y-4">
            <Input
              label="Date"
              inputName="date"
              inputType="date"
              inputValue={date}
              required
              error={formError.date}
              onChange={(e) => {
                setDate(e.target.value);
                setFormError((prev) => ({ ...prev, date: undefined }));
              }}
            />
            {isSunday(date) ? (
              <p className="text-xs text-amber-600">
                Sundays are automatic week-off. Choose another day.
              </p>
            ) : null}
            <Input
              label="Holiday name"
              inputName="name"
              inputType="text"
              inputValue={name}
              placeholder="e.g. Diwali, Independence Day"
              required
              error={formError.name}
              onChange={(e) => {
                setName(e.target.value);
                setFormError((prev) => ({ ...prev, name: undefined }));
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || isSunday(date)}
                className="min-w-28"
              >
                {saving ? <ButtonLoader /> : editing ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
