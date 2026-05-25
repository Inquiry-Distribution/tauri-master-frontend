import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Input from "@/src/components/ui/form/input";
import { Toggle } from "@/src/components/ui/form/toggle";
import BaseLoader from "@/src/components/ui/loader/baseLoader";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { useGetConfigAttendanceHours } from "@/src/hooks/config/useGetConfigAttendanceHours";
import { useGetConfigLoginLimit } from "@/src/hooks/config/useGetConfigLoginLimit";
import { useUpdateConfigAttendanceHours } from "@/src/hooks/config/useUpdateConfigAttendanceConfigHours";
import { useUpdateConfigLoginLimit } from "@/src/hooks/config/useUpdateConfigLoginLimit";
import { ConfigAttendanceHours, ConfigLoginLimit } from "@/src/types/config";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
type ToggleStatus = "idle" | "loading" | "success";
export default function AttendanceHoursForm() {
  const { data, getConfigAttendanceHours } = useGetConfigAttendanceHours();
  const {
    updateConfigAttendanceHours,
    loading,
    error: updateError,
  } = useUpdateConfigAttendanceHours();
  const [toggleStatus, setToggleStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const [form, setForm] = useState<ConfigAttendanceHours>({
    workStartHour: 0,
    workEndHour: 0,
    workStartMinute: 0,
    workEndMinute: 0,
    lateGraceMinute: 0,
    workStart: "",
    workEnd: "",
  });

  const [errors, setErrors] = useState<any>({});

  // ✅ Fetch initial config
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getConfigAttendanceHours();
        if (res?.data) {
          setForm(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [getConfigAttendanceHours]);

  // ✅ Handle input + toggle properly
  const handleChange = (e: any) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };
  // ✅ Validation
  const validate = () => {
    let newErrors: any = {};

    // HH:mm format validation
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!form.workStart) {
      newErrors.workStart = "Work start time is required";
    } else if (!timeRegex.test(form.workStart)) {
      newErrors.workStart = "Invalid time format";
    }

    if (!form.workEnd) {
      newErrors.workEnd = "Work end time is required";
    } else if (!timeRegex.test(form.workEnd)) {
      newErrors.workEnd = "Invalid time format";
    }

    // Compare times
    if (timeRegex.test(form.workStart) && timeRegex.test(form.workEnd)) {
      const start = new Date(`1970-01-01T${form.workStart}:00`);
      const end = new Date(`1970-01-01T${form.workEnd}:00`);

      if (end <= start) {
        newErrors.workEnd = "Work end time must be after start time";
      }
    }

    // Grace minute validation
    if (form.lateGraceMinute === undefined || form.lateGraceMinute === null) {
      newErrors.lateGraceMinute = "Late grace minute is required";
    } else if (form.lateGraceMinute < 0) {
      newErrors.lateGraceMinute = "Late grace minute cannot be negative";
    } else if (form.lateGraceMinute > 120) {
      newErrors.lateGraceMinute = "Late grace minute cannot exceed 120";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // ✅ Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = await updateConfigAttendanceHours(form);
      console.log("data", data);
      Swal.fire({
        icon: "success",
        title: "Attendance hours updated successfully",
        ...(data?.data?.notice ? { text: data.data.notice } : {}),
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: updateError || "Something went wrong",
      });
    }
  };

  // ✅ Reset (optional)
  const handleReset = () => {
    setForm({
      workStartHour: 0,
      workEndHour: 0,
      workStartMinute: 0,
      workEndMinute: 0,
      lateGraceMinute: 0,
      workStart: "",
      workEnd: "",
    });
    setErrors({});
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
            <Input
              inputName="workStart"
              label="Work Start Time"
              inputType="time"
              placeholder="Enter work start time"
              inputValue={form.workStart}
              onChange={handleChange}
              error={errors.workStart}
            />

            <Input
              inputName="workEnd"
              label="Work End Time"
              inputType="time"
              placeholder="Enter work end time"
              inputValue={form.workEnd}
              onChange={handleChange}
              error={errors.workEnd}
            />
            <Input
              inputName="lateGraceMinute"
              label="Late Grace Minute"
              inputType="number"
              placeholder="Enter late grace minute"
              inputValue={form.lateGraceMinute}
              onChange={handleChange}
              error={errors.lateGraceMinute}
              min={0}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? <ButtonLoader /> : "Save"}
            </Button>

            <Button
              type="button"
              onClick={handleReset}
              disabled={loading}
              variant="danger"
            >
              Reset
            </Button>
          </div>
          {data?.notice && (
            <p className="text-sm text-yellow-600">{data.notice}</p>
          )}
        </div>
      </form>
    </Card>
  );
}
