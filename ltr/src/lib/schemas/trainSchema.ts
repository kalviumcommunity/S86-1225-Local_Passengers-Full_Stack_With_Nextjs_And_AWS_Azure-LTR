import { z } from "zod";

/**
 * Schema for train query parameters (GET requests)
 */
export const trainQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be greater than 0"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
  source: z
    .string()
    .max(100, "Source must not exceed 100 characters")
    .optional(),
  destination: z
    .string()
    .max(100, "Destination must not exceed 100 characters")
    .optional(),
});

/**
 * Schema for getting a single train by ID
 */
export const trainIdSchema = z.object({
  id: z.string().min(1, "Train ID is required"),
});

// Type exports for TypeScript inference
export type TrainQueryInput = z.infer<typeof trainQuerySchema>;
export type TrainIdInput = z.infer<typeof trainIdSchema>;
