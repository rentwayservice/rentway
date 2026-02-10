export interface Car {
  id: string;
  slug: string;
  providerId: string;
  modelId: string;
  createdAt: string;
  updatedAt: string;
  vin: string | null;
  fleetNumber: string | null;
  year: number;
  color: string | null;
  colorHex: string | null;
  interiorColor: string | null;
  currentMileage: number | null;
  fuelLevelPercent: number | null;
  status: "active" | "inactive" | string;
  approvalStatus: "approved" | "pending" | "rejected" | string;
  availability: "available" | "unavailable" | string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  currency: string;
  depositAmount: string;
  dailyMileageLimit: number | null;
  extraMileageRate: string;
  insurance: {
    provider: string | null;
    expiry_date: string | null;
    policy_number: string | null;
  };
  registrationExpiryDate: string | null;
  primaryImageUrl: string | null;
  images: string[] | null;
  availableFrom: string | null;
  availableUntil: string | null;
  stats: {
    total_revenue: number;
    average_rating: number;
    total_bookings: number;
  };
  description: string | null;
  internalNotes: string | null;
  metadata: {
    [key: string]: string;
  };
}

export interface Brand {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  countryOfOrigin: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Model {
  id: string;
  brandId: string;
  bodyTypeId: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  fuelType: string | null;
  transmissionType: string | null;
  seats: number | null;
  doors: number | null;
  luggageCapacityLiters: number | null;
  largeBags: number | null;
  smallBags: number | null;
  engineSizeCc: number | null;
  horsepower: number | null;
  fuelEfficiencyKmpl: number | null;
  yearStart: number | null;
  yearEnd: number | null;
  images: string[];
  isActive: boolean;
  sortOrder: number;
  brand: Brand;
}

export interface CarFeature {
  feature: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CarWithDetails extends Car {
  model: Model;
  carFeatures?: CarFeature[];
}