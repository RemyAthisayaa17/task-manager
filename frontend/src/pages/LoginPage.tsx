import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/auth.api";
import { Input, Button } from "../components/ui";
import { showToast } from "../utils/toast";

import { loginSchema, LoginFormValues } from "../validation/schemas";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginApi(data);

      if (!res.success) {
        showToast(res.message || "Invalid credentials", "error");
        return;
      }

      login(res.data.token, res.data.user);

      showToast("Welcome back 👋", "success");

      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Login failed", "error");
    }
  };

  // ✅ FIXED: stable focus handling
  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof LoginFormValues;

    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Login
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Access your task dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            <Input
              label="Email"
              type="email"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              required
              error={errors.password?.message}
              {...register("password")}
            />

            <Button loading={isSubmitting} className="w-full mt-2">
              Login
            </Button>

          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create one
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;