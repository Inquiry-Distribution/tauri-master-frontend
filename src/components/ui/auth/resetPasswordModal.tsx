import { useState } from "react";

import { useTheme } from "@/src/contexts";
import { useResetPassword } from "@/src/hooks/auth/useResetPassword";
import { Modal } from "../modal";
import Input from "../form/input";
import Swal from "sweetalert2";

export default function ResetPasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  const { resetPassword, loading, error: resetError } = useResetPassword();

  const [form, setForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const err: any = {};

    if (!form.oldPassword) err.oldPassword = "Old password required";
    if (!form.password) err.password = "New password required";
    if (form.password.length < 6)
      err.password = "Minimum 6 characters required";
    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await resetPassword({
        oldPassword: form.oldPassword,
        password: form.password,
      });
      Swal.fire({
        icon: "success",
        title: "Password Updated.",
        text: "Your password has been updated successfully",
      });
      onClose();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Reset password failed",
        text: resetError || "Please try again later",
      });
      console.error("Reset password failed", err);
    }
  };

  return (
    <Modal title="Reset Password" onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Old Password"
          inputName="oldPassword"
          inputType="password"
          placeholder="Enter old password"
          inputValue={form.oldPassword}
          error={errors.oldPassword}
          onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
        />

        <Input
          label="New Password"
          inputName="password"
          inputType="password"
          placeholder="Enter new password"
          inputValue={form.password}
          error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Input
          label="Confirm Password"
          inputName="confirmPassword"
          inputType="password"
          placeholder="Confirm password"
          inputValue={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 rounded-lg text-sm font-medium transition"
          style={{
            background: tokens.accent,
            color: "#fff",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </Modal>
  );
}
