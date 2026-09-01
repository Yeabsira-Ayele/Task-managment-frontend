import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

import { loginSchema, type LoginFormData } from "../validation";

import InputFieldPWD from "../../components/forms/PasswordInput";
import InputField from "../../components/forms/InputField";
import Btn from "../../components/common/Btn";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../authStore"; // FIX: new import — adjust path to wherever you place authStore.ts

function Login() {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login); // FIX: pull the real login action

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // FIX: this used to skip the API entirely and just navigate.
    // Now it actually authenticates against the backend.
    try {
      await login(data.email, data.password);
      toast.success("You are logged in");
      navigate("/dashboard");
    } catch (error) {
      console.log("final stage")
      toast.error("Invalid email or password"); // FIX: was no failure path at all before
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/signup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="mb-5 mt-1 text-gray-500">Sign in to continue</p>

        
        

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col items-center gap-5">
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="you@gmail.com"
            register={register("email")}
            error={errors.email?.message}
          />

          <InputFieldPWD
            id="password"
            label="Password"
            placeholder="Password"
            register={register("password")}
            error={errors.password?.message}
          />

          <Btn variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Btn>
          
        </form>
         <button onClick={() => navigate("/forgot-password")} type="button" className="text-sm text-blue-600 hover:underline">
          Forgot password?
         </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={handleNavigateToRegister}
            type="button"
            className="cursor-pointer font-semibold text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;