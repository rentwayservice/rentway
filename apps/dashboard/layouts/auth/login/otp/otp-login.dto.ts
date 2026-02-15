import { z } from "zod";

export const otpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  otp: z.string({ required_error: "OTP is required" }),
});

export type OtpValues = z.infer<typeof otpSchema>;
