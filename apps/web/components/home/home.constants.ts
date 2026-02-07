/**
 * Demo data simulating backend API responses for homepage
 * Structure mimics typical JSON API response for cars and brands
 */

export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  rating: number;
  tripCount: number;
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
  savings?: number;
  location: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface CarsApiResponse {
  data: CarListing[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface BrandsApiResponse {
  data: Brand[];
}

/** Demo cars data - simulates API response */
export const DEMO_CARS: CarsApiResponse = {
  data: [
    {
      id: "7",
      make: "Audi",
      model: "A4",
      year: 2024,
      image: "/audi.jpeg",
      rating: 4.88,
      tripCount: 42,
      priceDaily: 780,
      priceWeekly: 4200,
      priceMonthly: 15_000,
      savings: 12,
      location: "San Francisco",
    },
    {
      id: "8",
      make: "Audi",
      model: "A6",
      year: 2024,
      image: "/audi2.jpeg",
      rating: 4.95,
      tripCount: 28,
      priceDaily: 950,
      priceWeekly: 5100,
      priceMonthly: 18_000,
      location: "San Francisco",
    },
    {
      id: "9",
      make: "MG",
      model: "ZS",
      year: 2024,
      image: "/mg.jpeg",
      rating: 4.82,
      tripCount: 19,
      priceDaily: 450,
      priceWeekly: 2400,
      priceMonthly: 8500,
      savings: 6,
      location: "San Francisco",
    },
    {
      id: "10",
      make: "Ford",
      model: "Mustang",
      year: 2024,
      image: "/ford.png",
      rating: 4.9,
      tripCount: 67,
      priceDaily: 850,
      priceWeekly: 4600,
      priceMonthly: 16_000,
      savings: 10,
      location: "San Francisco",
    },
    {
      id: "1",
      make: "Nissan",
      model: "Pathfinder",
      year: 2025,
      image:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400",
      rating: 5.0,
      tripCount: 15,
      priceDaily: 580,
      priceWeekly: 3200,
      priceMonthly: 11_000,
      savings: 9,
      location: "San Francisco",
    },
    {
      id: "2",
      make: "Tesla",
      model: "Model X",
      year: 2018,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
      rating: 4.95,
      tripCount: 122,
      priceDaily: 890,
      priceWeekly: 4800,
      priceMonthly: 17_000,
      savings: 15,
      location: "San Francisco",
    },
    {
      id: "3",
      make: "Subaru",
      model: "Outback",
      year: 2024,
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400",
      rating: 4.9,
      tripCount: 47,
      priceDaily: 520,
      priceWeekly: 2800,
      priceMonthly: 9500,
      location: "San Francisco",
    },
    {
      id: "4",
      make: "Nissan",
      model: "ARIYA",
      year: 2025,
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400",
      rating: 5.0,
      tripCount: 8,
      priceDaily: 720,
      priceWeekly: 3900,
      priceMonthly: 13_500,
      savings: 12,
      location: "San Francisco",
    },
    {
      id: "5",
      make: "Honda",
      model: "CR-V",
      year: 2024,
      image:
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400",
      rating: 4.85,
      tripCount: 31,
      priceDaily: 480,
      priceWeekly: 2600,
      priceMonthly: 9000,
      location: "San Francisco",
    },
    {
      id: "6",
      make: "Toyota",
      model: "RAV4",
      year: 2023,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
      rating: 4.92,
      tripCount: 89,
      priceDaily: 550,
      priceWeekly: 3000,
      priceMonthly: 10_500,
      savings: 8,
      location: "San Francisco",
    },

    {
      id: "11",
      make: "Mercedes-Benz",
      model: "C-Class",
      year: 2024,
      image:
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400",
      rating: 4.96,
      tripCount: 94,
      priceDaily: 990,
      priceWeekly: 5400,
      priceMonthly: 19_000,
      location: "San Francisco",
    },
    {
      id: "12",
      make: "BMW",
      model: "3 Series",
      year: 2024,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
      rating: 4.88,
      tripCount: 56,
      priceDaily: 920,
      priceWeekly: 5000,
      priceMonthly: 17_500,
      savings: 14,
      location: "San Francisco",
    },
  ],
  meta: {
    total: 12,
    page: 1,
    perPage: 12,
  },
};

/** Demo brands data - simulates API response */
export const DEMO_BRANDS: BrandsApiResponse = {
  data: [
    { id: "1", name: "Tesla", logo: "", slug: "tesla" },
    { id: "2", name: "BMW", logo: "", slug: "bmw" },
    { id: "3", name: "Mercedes-Benz", logo: "", slug: "mercedes-benz" },
    { id: "4", name: "Toyota", logo: "", slug: "toyota" },
    { id: "5", name: "Honda", logo: "", slug: "honda" },
    { id: "6", name: "Nissan", logo: "", slug: "nissan" },
    { id: "7", name: "Subaru", logo: "", slug: "subaru" },
    { id: "8", name: "Audi", logo: "", slug: "audi" },
    { id: "9", name: "Ford", logo: "", slug: "ford" },
    { id: "10", name: "Chevrolet", logo: "", slug: "chevrolet" },
    { id: "11", name: "Volkswagen", logo: "", slug: "volkswagen" },
    { id: "12", name: "Hyundai", logo: "", slug: "hyundai" },
    { id: "13", name: "Kia", logo: "", slug: "kia" },
    { id: "14", name: "Lexus", logo: "", slug: "lexus" },
    { id: "15", name: "Mazda", logo: "", slug: "mazda" },
    { id: "16", name: "Jeep", logo: "", slug: "jeep" },
    { id: "17", name: "Volvo", logo: "", slug: "volvo" },
    { id: "18", name: "Porsche", logo: "", slug: "porsche" },
  ],
};

/** Hero section config */
export const HERO_CONFIG = {
  title: "Skip the rental car counter",
  subtitle: "Rent just about any car, just about anywhere",
  searchPlaceholder: "City, airport, address or hotel",
  ctaLabel: "Get to know Rentway",
  backgroundImage:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920",
};
