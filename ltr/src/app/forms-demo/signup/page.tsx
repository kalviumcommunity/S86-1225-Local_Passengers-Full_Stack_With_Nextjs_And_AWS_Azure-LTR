"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Validation schema for signup
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Invalid phone number"
    )
    .optional()
    .or(z.literal("")),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupFormPage() {
  const router = useRouter();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setSubmitError("");
      setSubmitSuccess(false);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSubmitSuccess(true);
      reset();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/routing-demo/login");
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">
            🚄 LocalPassengers
          </h1>
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
            Create Account
          </h2>

          {/* Success Message */}
          {submitSuccess && (
            <div
              className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
              role="alert"
            >
              <strong>Success!</strong> Account created. Redirecting to login...
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
              role="alert"
            >
              <strong>Error:</strong> {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <FormInput
              label="Full Name"
              name="name"
              register={register}
              error={errors.name?.message}
              placeholder="Enter your full name"
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
              placeholder="your.email@example.com"
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password?.message}
              placeholder="Minimum 8 characters"
              required
            />

            <FormInput
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              register={register}
              error={errors.phone?.message}
              placeholder="+91 98765 43210"
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/routing-demo/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Log in
            </a>
          </div>

          {/* Form Validation Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
            <h3 className="font-semibold mb-2">Password Requirements:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase letter (A-Z)</li>
              <li>Contains lowercase letter (a-z)</li>
              <li>Contains number (0-9)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
