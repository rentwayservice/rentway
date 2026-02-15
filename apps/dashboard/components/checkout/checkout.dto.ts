import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(8, "Enter a valid phone number."),

  age: z.coerce.number().min(19, "Minimum age is 19.").max(80, "Invalid age."),
  licenseNumber: z.string().min(5, "License number is required."),
  licenseExpiry: z.string().min(1, "License expiry is required."), // keep as yyyy-mm-dd string

  notes: z.string().max(280, "Max 280 characters.").optional().or(z.literal("")),

  paymentMethod: z.enum(["cash_on_delivery", "card"]).default("cash_on_delivery"),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms." }) }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
