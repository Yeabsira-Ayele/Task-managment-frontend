import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export default function InputField({ id, label, type, placeholder, register, error }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full rounded-lg border p-2 text-sm outline-none transition ${
          error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}