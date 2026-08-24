import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

import {
  loginSchema,
  type LoginFormData,
} from "../validation";

import InputFieldPWD from "../../components/forms/PasswordInput";
import InputField from "../../components/forms/InputField";
import Btn from "../../components/common/Btn";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const navigate = useNavigate();

  
   const {register , handleSubmit , formState: {errors , isSubmitting}} = useForm<LoginFormData>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema)
   })
  const onSubmit =  (data: LoginFormData) => {
    
    toast.success("You are logged in");

    navigate("/dashboard");
  }
  const handleNavigateToRegister = () => {
    navigate("/signup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back
        </h1>

        <p className="mb-5 mt-1 text-gray-500">
          Sign in to continue
        </p>

        <Btn variant="secondary" type="button">
          <FcGoogle className="text-lg" />
          Continue with Google
        </Btn>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-300" />

          <span className="mx-4 text-sm text-gray-500">
            or continue with email
          </span>

          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col items-center gap-5"
        >
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

          <Btn
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign In"}
          </Btn>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
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