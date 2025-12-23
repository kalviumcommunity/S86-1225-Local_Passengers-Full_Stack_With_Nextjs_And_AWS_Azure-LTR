import { UseFormRegister, FieldValues } from "react-hook-form";

interface FormTextareaProps {
  label: string;
  register: UseFormRegister<FieldValues>;
  name: string;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export default function FormTextarea({
  label,
  register,
  name,
  error,
  placeholder,
  rows = 4,
  required = false,
}: FormTextareaProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 transition resize-none ${
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
