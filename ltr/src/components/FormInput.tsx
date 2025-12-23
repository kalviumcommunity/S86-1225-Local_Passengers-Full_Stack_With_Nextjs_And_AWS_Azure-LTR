import { UseFormRegister, FieldValues } from "react-hook-form";

interface FormInputProps {
  label: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  name: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  type = "text",
  register,
  name,
  error,
  placeholder,
  required = false,
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
