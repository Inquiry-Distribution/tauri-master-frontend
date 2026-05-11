import { useState } from "react";

import { useTheme } from "@/src/contexts";
import { useResetPassword } from "@/src/hooks/auth/useResetPassword";

import Swal from "sweetalert2";
import { useChangeAdminPassword } from "@/src/hooks/admin/useChangeAdminPassword";
import { Modal } from "@/src/components/ui/modal";
import { AdminUser } from "@/src/hooks/admin/useGetAllAdmins";
import Input from "@/src/components/ui/form/input";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { Button } from "@/src/components/ui/button";

export default function ChangePasswordModal({
  onClose,
  adminUser,
}: {
  onClose: () => void;
  adminUser: AdminUser;
}) {
  const { tokens } = useTheme();
  const { resetPassword, loading, error } = useChangeAdminPassword();

  const [form, setForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const err: any = {};

    // if (!form.oldPassword) err.oldPassword = "Old password required";
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
      await resetPassword(adminUser.id, {
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
        text: err?.response?.data?.message || "Please try again later",
      });
      console.error("Reset password failed", err);
    }
  };

  return (
    <Modal title="Reset Password" onClose={onClose}>
      <div className="space-y-4">
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
        <div className="flex justify-end w-full">
          <Button onClick={handleSubmit} disabled={loading} variant="primary">
            {loading ? <ButtonLoader /> : "Update Password"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
