import { z } from "zod";

export const cairoAreas = [
  "New Cairo",
  "Nasr City",
  "Heliopolis",
  "Maadi",
  "Zamalek",
  "Downtown",
  "Mohandessin",
  "Sheikh Zayed",
  "6th of October",
  "Giza",
  "Dokki",
  "Rehab",
] as const;

export const timeOptions = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

export const bookingSidebarSchema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine((r) => !!r.from && !!r.to, { message: "Select rental dates." }),
  pickupTime: z.string().min(1),
  dropoffTime: z.string().min(1),
  deliveryArea: z.string().min(1, "Select a delivery area."),
  samePlace: z.boolean().default(true),
});

export type BookingSidebarFormValues = z.infer<typeof bookingSidebarSchema>;