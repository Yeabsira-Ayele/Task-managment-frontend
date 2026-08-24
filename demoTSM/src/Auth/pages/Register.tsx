import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "../validation.tsx";
import { useNavigate } from "react-router";
import InputField from "../../components/forms/InputField.tsx";
import Btn from "../../components/common/Btn.tsx";
import { FcGoogle } from "react-icons/fc";
import Logo from "../../components/common/Logo.tsx";
import ThemeToggle from "../../components/common/ThemeToggle.tsx";

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();

  const handleBacktoLogin = () => {
    navigate("/login");
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RegisterFormData) => {
    
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your account 
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Join thousands of productive teams.
          </p>
        </div>

        <Btn variant="secondary" type="button">
          <FcGoogle className="text-lg" /> Continue with Google
        </Btn>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or continue with email</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="fname"
              label="First Name"
              type="text"
              placeholder="Alex"
              register={register("fname")}
              error={errors.fname?.message}
            />
            <InputField
              id="lname"
              label="Last Name"
              type="text"
              placeholder="Chen"
              register={register("lname")}
              error={errors.lname?.message}
            />
          </div>

          <InputField
            id="email"
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            register={register("email")}
            error={errors.email?.message}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register("password")}
            error={errors.password?.message}
          />

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Btn variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Btn>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={handleBacktoLogin}
            type="button"
            className="font-semibold text-blue-600 hover:underline  cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
