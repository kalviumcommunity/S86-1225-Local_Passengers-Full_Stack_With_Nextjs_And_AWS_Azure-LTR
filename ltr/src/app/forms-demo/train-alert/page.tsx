"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import { useState } from "react";

// Validation schema for train alert subscription
const trainAlertSchema = z.object({
  trainNumber: z
    .string()
    .min(4, "Train number must be at least 4 characters")
    .max(10, "Train number too long"),
  trainName: z.string().min(3, "Train name is required"),
  source: z.string().min(2, "Source station is required"),
  destination: z.string().min(2, "Destination station is required"),
  preferredTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  email: z.string().email("Invalid email address"),
  alertTypes: z
    .object({
      delay: z.boolean(),
      cancellation: z.boolean(),
      platformChange: z.boolean(),
      reroute: z.boolean(),
    })
    .refine(
      (data) =>
        data.delay || data.cancellation || data.platformChange || data.reroute,
      { message: "Select at least one alert type" }
    ),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

type TrainAlertFormData = z.infer<typeof trainAlertSchema>;

export default function TrainAlertFormPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TrainAlertFormData>({
    resolver: zodResolver(trainAlertSchema),
    defaultValues: {
      alertTypes: {
        delay: true,
        cancellation: true,
        platformChange: false,
        reroute: false,
      },
    },
  });

  const onSubmit = async (data: TrainAlertFormData) => {
    try {
      setSubmitError("");
      setSubmitSuccess(false);

      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create alert");
      }

      setSubmitSuccess(true);
      reset({
        alertTypes: {
          delay: true,
          cancellation: true,
          platformChange: false,
          reroute: false,
        },
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              🔔 Train Alert Subscription
            </h1>
            <p className="text-gray-600">
              Get real-time notifications for train delays, cancellations, and
              platform changes
            </p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div
              className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
              role="alert"
            >
              <strong className="font-semibold">✓ Success!</strong> Alert
              subscription created. You&apos;ll receive notifications for your
              selected train.
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              role="alert"
            >
              <strong className="font-semibold">✗ Error:</strong> {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Train Details Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Train Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Train Number"
                  name="trainNumber"
                  register={register}
                  error={errors.trainNumber?.message}
                  placeholder="e.g., 12345"
                  required
                />

                <FormInput
                  label="Train Name"
                  name="trainName"
                  register={register}
                  error={errors.trainName?.message}
                  placeholder="e.g., Mumbai Express"
                  required
                />

                <FormInput
                  label="Source Station"
                  name="source"
                  register={register}
                  error={errors.source?.message}
                  placeholder="e.g., Mumbai Central"
                  required
                />

                <FormInput
                  label="Destination Station"
                  name="destination"
                  register={register}
                  error={errors.destination?.message}
                  placeholder="e.g., Pune Junction"
                  required
                />

                <FormInput
                  label="Preferred Departure Time"
                  name="preferredTime"
                  type="time"
                  register={register}
                  error={errors.preferredTime?.message}
                  required
                />

                <FormInput
                  label="Email for Alerts"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email?.message}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Alert Types Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Alert Preferences
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the types of alerts you want to receive:
              </p>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("alertTypes.delay")}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">
                      Train Delays
                    </span>
                    <p className="text-sm text-gray-600">
                      Get notified when train is delayed by 10+ minutes
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("alertTypes.cancellation")}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">
                      Train Cancellations
                    </span>
                    <p className="text-sm text-gray-600">
                      Get notified if train is cancelled
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("alertTypes.platformChange")}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">
                      Platform Changes
                    </span>
                    <p className="text-sm text-gray-600">
                      Get notified about platform changes
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("alertTypes.reroute")}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">
                      Reroute Suggestions
                    </span>
                    <p className="text-sm text-gray-600">
                      Get alternative train suggestions during delays
                    </p>
                  </div>
                </label>
              </div>

              {errors.alertTypes && (
                <p className="text-red-500 text-sm mt-2" role="alert">
                  {errors.alertTypes.message}
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <FormTextarea
                label="Additional Notes (Optional)"
                name="notes"
                register={register}
                error={errors.notes?.message}
                placeholder="Any specific preferences or requirements..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
              >
                {isSubmitting ? "Creating Alert..." : "🔔 Subscribe to Alerts"}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
            <h3 className="font-semibold mb-2">📱 How It Works:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Instant email notifications for your selected train</li>
              <li>Real-time updates on delays and cancellations</li>
              <li>Smart reroute suggestions when needed</li>
              <li>Unsubscribe anytime from notification emails</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
