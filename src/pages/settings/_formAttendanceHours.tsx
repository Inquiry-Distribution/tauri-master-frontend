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
  const { updateConfigAttendanceHours, loading } =
    useUpdateConfigAttendanceHours();
  const [toggleStatus, setToggleStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const [form, setForm] = useState<ConfigAttendanceHours>({
    workStartHour: 0,
    workEndHour: 0,
    lateGraceMinute: 0,
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
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ✅ Validation
  const validate = () => {
    let newErrors: any = {};

    if (!form.workStartHour || form.workStartHour <= 0) {
      newErrors.workStartHour = "Work start hour must be greater than 0";
    }

    if (!form.workEndHour || form.workEndHour <= 0) {
      newErrors.workEndHour = "Work end hour must be greater than 0";
    }

    if (!form.lateGraceMinute || form.lateGraceMinute <= 0) {
      newErrors.lateGraceMinute = "Late grace minute must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await updateConfigAttendanceHours(form);

      Swal.fire({
        icon: "success",
        title: "Attendance hours updated successfully",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: err?.response?.data?.message || "Failed to update",
      });
    }
  };

  // ✅ Reset (optional)
  const handleReset = () => {
    setForm({
      workStartHour: 0,
      workEndHour: 0,
      lateGraceMinute: 0,
    });
    setErrors({});
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
            <Input
              inputName="attendance_work_start_hour"
              label="Work Start Hour"
              inputType="number"
              placeholder="Enter work start hour"
              inputValue={form.workStartHour}
              onChange={handleChange}
              error={errors.workStartHour}
            />

            <Input
              inputName="attendance_work_end_hour"
              label="Work End Hour"
              inputType="number"
              placeholder="Enter work end hour"
              inputValue={form.workEndHour}
              onChange={handleChange}
              error={errors.workEndHour}
            />
            <Input
              inputName="attendance_late_grace_minute"
              label="Late Grace Minute"
              inputType="number"
              placeholder="Enter late grace minute"
              inputValue={form.lateGraceMinute}
              onChange={handleChange}
              error={errors.lateGraceMinute}
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
        </div>
      </form>
    </Card>
  );
}
