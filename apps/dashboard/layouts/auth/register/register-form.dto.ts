// registration-form.dto.ts
import * as z from "zod";
import { AuthErrorKeys } from "../auth.constants";

// Combined schema for full form
export const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: AuthErrorKeys.FULL_NAME_TOO_SHORT })
      .refine((val) => val === null || val.trim() !== "", {
        message: AuthErrorKeys.STORE_NAME_REQUIRED,
      })
      .transform((val) => (val === null ? "" : val.trim())),

    email: z.string().email({ message: AuthErrorKeys.EMAIL_INVALID }),
    password: z
      .string()
      .min(6, { message: AuthErrorKeys.PASSWORD_TOO_SHORT })
      .refine(
        (value) => {
          const hasUppercase = /[A-Z]/.test(value);
          const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
            value
          );
          if (!(hasUppercase || hasSpecialChar)) {
            return false;
          }
          if (!hasUppercase) {
            return false;
          }
          if (!hasSpecialChar) {
            return false;
          }
          return true;
        },
        { message: AuthErrorKeys.PASSWORD_TOO_WEAK }
      )
      .refine((val) => val === null || val.trim() !== "", {
        message: AuthErrorKeys.PASSWORD_TOO_WEAK,
      })
      .transform((val) => (val === null ? "" : val.trim())),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AuthErrorKeys.PASSWORDS_NOT_MATCHING,
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
