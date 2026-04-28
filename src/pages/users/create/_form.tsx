import { Button } from "@/src/components/ui/button";
import Input from "@/src/components/ui/form/input";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { useCreateSalesPerson } from "@/src/hooks/salesPerson/useCreateSalesPerson";
import { CreateUser } from "@/src/types/users";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateUserForm = () => {
  const { createUser, loading } = useCreateSalesPerson();

  const [form, setForm] = useState<CreateUser>({
    name: "",
    email: "",
    password: "",
    role: "salesperson",
    employeeId: "",
    pin: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    let newErrors: any = {};

    // PASSWORD
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (form.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // PIN
    if (!form.pin) {
      newErrors.pin = "Pin is required";
    } else if (!/^\d+$/.test(form.pin)) {
      newErrors.pin = "Pin must be numeric";
    } else if (form.pin.length < 4) {
      newErrors.pin = "Pin must be at least 4 digits";
    }

    if (!confirmPin) {
      newErrors.confirmPin = "Confirm pin is required";
    } else if (form.pin !== confirmPin) {
      newErrors.confirmPin = "Pins do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createUser(form);

      Swal.fire({
        icon: "success",
        title: "Sales Person Created.",
      });

      handleReset();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Creating Sales Person.",
      });
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "salesperson",
      employeeId: "",
      pin: "",
    });
    setConfirmPassword("");
    setConfirmPin("");
    setErrors({});
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
          <Input
            label="Name"
            showLabel={false}
            inputName="name"
            inputValue={form.name}
            placeholder="Enter name"
            onChange={handleChange}
          />
          <Input
            label="Employee ID"
            showLabel={false}
            inputName="employeeId"
            inputValue={form.employeeId}
            placeholder="Enter employee id"
            onChange={handleChange}
          />
        </div>
        <Input
          label="Email"
          showLabel={false}
          inputName="email"
          inputValue={form.email}
          placeholder="Enter email"
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <div className="rounded-2xl border border-border p-4 space-y-4">
          <h3 className="text-xs font-semibold">Set Password</h3>
          <Input
            inputType="password"
            inputName="password"
            inputValue={form.password}
            placeholder="Enter password"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs">{errors.password}</p>

          <Input
            inputType="password"
            inputName="confirmPassword"
            inputValue={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev: any) => ({ ...prev, confirmPassword: "" }));
            }}
          />
          <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
        </div>
        {/* PIN */}
        <div className="rounded-2xl border border-border p-4 space-y-4">
          <h3 className="text-xs font-semibold">Set Pin</h3>
          <Input
            inputType="password"
            inputName="pin"
            inputValue={form.pin}
            placeholder="Enter pin"
            onChange={handleChange}
          />
          <p className="text-red-500 text-xs">{errors.pin}</p>

          <Input
            inputType="password"
            inputName="confirmPin"
            inputValue={confirmPin}
            placeholder="Confirm pin"
            onChange={(e) => {
              setConfirmPin(e.target.value);
              setErrors((prev: any) => ({ ...prev, confirmPin: "" }));
            }}
          />
          <p className="text-red-500 text-xs">{errors.confirmPin}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <ButtonLoader /> : "Create User"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateUserForm;
