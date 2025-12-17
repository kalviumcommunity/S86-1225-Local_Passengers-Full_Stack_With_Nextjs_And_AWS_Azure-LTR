import { z } from "zod";

/**
 * Schema for creating an alert
 */
export const createAlertSchema = z.object({
  trainId: z.string().min(1, "Train ID is required"),
  trainName: z
    .string()
    .min(1, "Train name is required")
    .max(200, "Train name must not exceed 200 characters"),
  source: z
    .string()
    .min(1, "Source station is required")
    .max(100, "Source must not exceed 100 characters"),
  destination: z
    .string()
    .min(1, "Destination station is required")
    .max(100, "Destination must not exceed 100 characters"),
  alertType: z
    .enum(["all", "delay", "cancellation", "platform_change", "reroute"])
    .default("all"),
});

/**
 * Schema for updating an alert
 */
export const updateAlertSchema = z.object({
  trainName: z
    .string()
    .min(1, "Train name is required")
    .max(200, "Train name must not exceed 200 characters")
    .optional(),
  source: z
    .string()
    .min(1, "Source station is required")
    .max(100, "Source must not exceed 100 characters")
    .optional(),
  destination: z
    .string()
    .min(1, "Destination station is required")
    .max(100, "Destination must not exceed 100 characters")
    .optional(),
  alertType: z
    .enum(["all", "delay", "cancellation", "platform_change", "reroute"])
    .optional(),
});

// Type exports for TypeScript inference
export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
