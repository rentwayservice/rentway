import { z } from "zod";
import { AuthErrorKeys } from "../../auth.constants";

export const signinEmailSchema = z.object({
  email: z
    .string({ required_error: AuthErrorKeys.EMAIL_REQUIRED })
    .email({ message: AuthErrorKeys.EMAIL_INVALID }),
  password: z.string({ required_error: AuthErrorKeys.PASSWORD_REQUIRED }),
});

export type SigninEmailValues = z.infer<typeof signinEmailSchema>;
