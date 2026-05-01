import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Input from "@/src/components/ui/form/input";
import { Toggle } from "@/src/components/ui/form/toggle";
import BaseLoader from "@/src/components/ui/loader/baseLoader";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { useGetConfigLoginLimit } from "@/src/hooks/config/useGetConfigLoginLimit";
import { useUpdateConfigLoginLimit } from "@/src/hooks/config/useUpdateConfigLoginLimit";
import { ConfigLoginLimit } from "@/src/types/config";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
type ToggleStatus = "idle" | "loading" | "success";
export default function LoginLimitForm() {
  const { data, getConfigLoginLimit } = useGetConfigLoginLimit();
  const { updateConfigLoginLimit, loading } = useUpdateConfigLoginLimit();
  const [toggleStatus, setToggleStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const [form, setForm] = useState<ConfigLoginLimit>({
    enabled: false,
    maxAttempts: 0,
    lockoutMinutes: 0,
  });

  const [errors, setErrors] = useState<any>({});

  // ✅ Fetch initial config
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getConfigLoginLimit();
        if (res?.data) {
          setForm(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [getConfigLoginLimit]);

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

    if (form.enabled) {
      if (!form.maxAttempts || form.maxAttempts <= 0) {
        newErrors.maxAttempts = "Max attempts must be greater than 0";
      }

      if (!form.lockoutMinutes || form.lockoutMinutes <= 0) {
        newErrors.lockoutMinutes = "Lockout minutes must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await updateConfigLoginLimit(form);

      Swal.fire({
        icon: "success",
        title: "Login limit updated successfully",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: err?.message || "Failed to update",
      });
    }
  };

  // ✅ Reset (optional)
  const handleReset = () => {
    setForm({
      enabled: false,
      maxAttempts: 0,
      lockoutMinutes: 0,
    });
    setErrors({});
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Toggle
              checked={form.enabled}
              name="enabled"
              label="Enable Login Limit"
              disabled={toggleStatus === "loading"}
              onChange={async (value) => {
                const updatedForm = {
                  ...form,
                  enabled: value,
                };

                setForm(updatedForm);
                setToggleStatus("loading");

                try {
                  await updateConfigLoginLimit(updatedForm);

                  setToggleStatus("success");

                  // show check for 1.5s
                  setTimeout(() => {
                    setToggleStatus("idle");
                  }, 1500);
                } catch (err: any) {
                  // rollback
                  setForm((prev) => ({
                    ...prev,
                    enabled: !value,
                  }));

                  setToggleStatus("idle");

                  Swal.fire({
                    icon: "error",
                    title: err?.message || "Failed to update",
                  });
                }
              }}
            />{" "}
            {toggleStatus === "loading" && <BaseLoader size={18} />}
            {toggleStatus === "success" && (
              <span className="text-success text-lg">
                <Check size={20} />
              </span>
            )}
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
            <Input
              inputName="maxAttempts"
              label="Max Attempts"
              inputType="number"
              placeholder="Enter max attempts"
              inputValue={form.maxAttempts}
              onChange={handleChange}
              error={errors.maxAttempts}
              disabled={!form.enabled}
            />

            <Input
              inputName="lockoutMinutes"
              label="Lockout Minutes"
              inputType="number"
              placeholder="Enter lockout minutes"
              inputValue={form.lockoutMinutes}
              onChange={handleChange}
              error={errors.lockoutMinutes}
              disabled={!form.enabled}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !form.enabled || toggleStatus === "loading"}
            >
              {loading ? <ButtonLoader /> : "Save"}
            </Button>

            <Button
              type="button"
              onClick={handleReset}
              disabled={!form.enabled || toggleStatus === "loading"}
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
