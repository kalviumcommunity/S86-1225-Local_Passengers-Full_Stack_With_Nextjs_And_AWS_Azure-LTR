import { z } from "zod";

/**
 * Schema for user registration
 */
export const userRegistrationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format")
    .optional(),
  profilePicture: z.string().url("Invalid URL format").optional(),
});

/**
 * Schema for user login
 */
export const userLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Schema for user update
 */
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format")
    .optional(),
  profilePicture: z.string().url("Invalid URL format").optional(),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "USER"]).optional(),
});

// Type exports for TypeScript inference
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
