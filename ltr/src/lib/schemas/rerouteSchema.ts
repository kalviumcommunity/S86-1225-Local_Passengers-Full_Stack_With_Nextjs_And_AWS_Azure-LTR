import { z } from "zod";

/**
 * Schema for generating reroute suggestions
 */
export const createRerouteSchema = z.object({
  trainId: z.string().min(1, "Train ID is required"),
  source: z
    .string()
    .min(1, "Source station is required")
    .max(100, "Source must not exceed 100 characters"),
  destination: z
    .string()
    .min(1, "Destination station is required")
    .max(100, "Destination must not exceed 100 characters"),
  reason: z
    .string()
    .max(500, "Reason must not exceed 500 characters")
    .optional(),
});

/**
 * Schema for getting reroutes by train ID (query params)
 */
export const getRerouteQuerySchema = z.object({
  trainId: z.string().min(1, "Train ID is required"),
});

// Type exports for TypeScript inference
export type CreateRerouteInput = z.infer<typeof createRerouteSchema>;
export type GetRerouteQuery = z.infer<typeof getRerouteQuerySchema>;
