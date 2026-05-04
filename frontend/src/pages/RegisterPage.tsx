import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { registerApi } from "../api/auth.api";
import { Input, Select, Button } from "../components/ui";
import { showToast } from "../utils/toast";

import { registerSchema, RegisterFormValues } from "../validation/schemas";

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await registerApi(data);

      if (!res.success) {
        showToast(res.message || "Registration failed", "error");
        return;
      }

      showToast("Account created 🎉", "success");
      navigate("/login");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    }
  };

  const firstError = Object.keys(errors)[0] as keyof RegisterFormValues;
  if (firstError) setTimeout(() => setFocus(firstError), 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col gap-5">

          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              Create account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Start managing your tasks
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <Input label="Name" required error={errors.name?.message} {...register("name")} />

            <Input label="Email" required error={errors.email?.message} {...register("email")} />

            <Input label="Phone" required error={errors.phone?.message} {...register("phone")} />

            <Input label="Address" required error={errors.address?.message} {...register("address")} />

            {/* Gender FIXED */}
            <Select
              label="Gender"
              required
              error={errors.gender?.message}
              {...register("gender")}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              
            </Select>

            <Input
              label="Password"
              type="password"
              required
              error={errors.password?.message}
              {...register("password")}
            />

            <Button loading={isSubmitting} className="w-full mt-2">
              Create Account
            </Button>

          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-500 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;