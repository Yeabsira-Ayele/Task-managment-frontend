import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address",
    }),

  password: z
    .string({ message: "Please enter a valid Password." })
    .min(8, {
      message: "Please enter a valid Password.",
    }),
});

export type LoginFormData = z.infer<typeof loginSchema>;