import { z } from "zod";

export const registerSchema = z
  .object({
    fname: z
      .string()
      .min(3, {
        message: "First name must be at least 3 characters long",
      })
      .max(20, {
        message: "First name cannot exceed 20 characters",
      }),

    lname: z
      .string()
      .min(3, {
        message: "Last name must be at least 3 characters long",
      })
      .max(20, {
        message: "Last name cannot exceed 20 characters",
      }),

    email: z
      .string()
      .email({
        message: "Please enter a valid email address",
      }),

    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      }),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address",
    }),

  password: z
    .string( 
     {  message: "Please enter a valid Password.",}
    )
    .min(8, {
      message: "Please enter a valid Password.",
      
      
    }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
