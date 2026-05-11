import { Button } from "@/src/components/ui/button";
import Input from "@/src/components/ui/form/input";
import Select from "@/src/components/ui/form/select";
import ButtonLoader from "@/src/components/ui/loader/buttonLoader";
import { useCreateAdmin } from "@/src/hooks/admin/useCreateAdmin";
import { useGetCompanies } from "@/src/hooks/company/useGetCompanies";
import { useCreateSalesPerson } from "@/src/hooks/salesPerson/useCreateSalesPerson";
import { CreateAdmin, CreateUser } from "@/src/types/users";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateAdminForm = ({ onSuccess }: { onSuccess: (res: any) => void }) => {
  const { createAdmin, loading } = useCreateAdmin();

  const [form, setForm] = useState<CreateAdmin>({
    name: "",
    email: "",
    password: "",
    role: "admin",
    // pin: "",
    // company: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const {
    data: companies,
    getCompanies,
    loading: companiesLoading,
  } = useGetCompanies();

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

  // useEffect(() => {
  //   getCompanies();
  // }, []);

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
    // if (!form.pin) {
    //   newErrors.pin = "Pin is required";
    // } else if (!/^\d+$/.test(form.pin)) {
    //   newErrors.pin = "Pin must be numeric";
    // } else if (form.pin.length < 4) {
    //   newErrors.pin = "Pin must be at least 4 digits";
    // }

    // if (!confirmPin) {
    //   newErrors.confirmPin = "Confirm pin is required";
    // } else if (form.pin !== confirmPin) {
    //   newErrors.confirmPin = "Pins do not match";
    // }

    setErrors(newErrors);
    console.log("newErrors", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await createAdmin(form);
      onSuccess?.(res.data);

      Swal.fire({
        icon: "success",
        title: "Admin Created.",
      });

      handleReset();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Creating Admin.",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "admin",
      // pin: "",
      // company: "",
    });
    setConfirmPassword("");
    setConfirmPin("");
    setErrors({});
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-1  gap-4">
          <Input
            label="Name"
            showLabel={false}
            inputName="name"
            inputValue={form.name}
            placeholder="Enter name"
            onChange={handleChange}
          />
          {/* <Input
            label="Employee ID"
            showLabel={false}
            inputName="employeeId"
            inputValue={form.employeeId}
            placeholder="Enter employee id"
            onChange={handleChange}
          /> */}
        </div>
        {/* <Select
          label="Company"
          showLabel={false}
          options={
            companies?.map((item) => ({
              label: item.name,
              value: item.id,
            })) || []
          }
          selectName="company"
          value={form.company}
          placeholder="Select company"
          onChange={(opt) => {
            setForm((prev) => ({
              ...prev,
              company: opt.value as string,
            }));
          }}
        /> */}
        <Input
          label="Email"
          showLabel={false}
          inputName="email"
          inputType="email"
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
        {/* <div className="rounded-2xl border border-border p-4 space-y-4">
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
        </div> */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <ButtonLoader /> : "Create Admin"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateAdminForm;
