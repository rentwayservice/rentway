export interface BookingOrder  {
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
      depositFee: number; // 10%
      totalPayableNow: number; // deposit for MVP
      total: number; // rental + deposit (for display)
      breakdown: string;
    };
  };
  
  export interface CheckoutPayload  {
    order: BookingOrder;
    customer: {
      fullName: string;
      email: string;
      phone: string;
    };
    driver: {
      age: number;
      licenseNumber: string;
      licenseExpiry: string; // ISO date
      notes?: string;
    };
    payment: {
      method: "cash_on_delivery" | "card";
    };
    consent: {
      termsAccepted: boolean;
    };
  };
  