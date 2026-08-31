import type { UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export default function InputFieldPWD({ id, label, placeholder, register, error }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative w-full flex items-center">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register} // FIX: this was completely missing. Without spreading `register` here,
                         // React Hook Form never wires up onChange/onBlur/ref/name to this input,
                         // so whatever you typed was never captured into form state at all —
                         // the field was permanently empty as far as validation was concerned.
          className={`w-full rounded-lg border p-2 pr-10 text-sm outline-none transition ${
            error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
          }`}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none flex items-center justify-center"
        >
          {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}