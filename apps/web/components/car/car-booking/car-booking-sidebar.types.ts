export interface CarApiResponse {
  id: string;
  slug: string;
  providerId: string;
  modelId: string;
  year: number;
  dailyRate: string; // "2500.00"
  weeklyRate: string; // "15500.00"
  monthlyRate: string; // "58000.00"
  currency: string; // "EGP"
  depositAmount?: string | null; // exists in schema but we will compute 10% deposit fee as requested
  availableFrom?: string | null; // "2026-02-08"
  availableUntil?: string | null; // "2026-06-08"
  model?: {
    name: string;
    brand?: { name: string; slug: string; logoUrl?: string | null };
  };
  primaryImageUrl?: string | null;
};

export interface CarBookingSidebarProps {
  car: CarApiResponse;
  className?: string;
}

export interface BookingOrder {
  carId: string;
  carSlug: string;
  providerId: string;
  modelId: string;
  title: string;
  currency: string;

  pickupDate: string; // ISO
  dropoffDate: string; // ISO
  pickupTime: string; // "10:00"
  dropoffTime: string; // "10:00"
  deliveryArea: string;
  samePlace: boolean;

  pricing: {
    days: number;
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    rentalSubtotal: number;
    depositFee: number; // 10% of rentalSubtotal
    totalPayableNow: number; // depositFee (MVP)
    total: number; // rentalSubtotal + depositFee (if you prefer showing total)
    breakdown: string;
  };
};
