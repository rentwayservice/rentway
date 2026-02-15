/**
 * Car detail page constants and labels
 */

export const CAR_PAGE_LABELS = {
  perDay: "per day",
  bookNow: "Book Now",
  noDeposit: "No deposit",
  freeDelivery: "Free Delivery",
  minDays: "Min 1 Day",
  conditions: "Conditions",
  minimumAge: "Minimum age",
  minimumDays: "Minimum Days",
  requiredDocuments: "Required documents",
  seeTheList: "See the list",
  chooseRentalDates: "Choose rental dates",
  description: "Description",
  carFeatures: "Car Features",
  carSpecifications: "Car specifications",
  rentalDurationPricing: "Rental Duration and Pricing",
  day: "day",
  week: "week",
  month: "month",
  year: "Year",
  color: "Color",
  luggage: "Luggage",
  doors: "Doors",
  horsepower: "Horsepower",
  fuelType: "Fuel Type",
  seats: "Seats",
  engine: "Engine",
  transmission: "Transmission",
  includedWithBooking: "Included with your booking",
  mileage: "Mileage",
  perDayMileage: "Km / day",
  perWeekMileage: "Km / week",
  perMonthMileage: "Km / month",
  extraMileageFee: "For every extra Km fee",
} as const

export const FUEL_TYPE_LABELS: Record<string, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
  plug_in_hybrid: "Plug-in Hybrid",
}

export const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: "Automatic",
  manual: "Manual",
  cvt: "CVT",
  semi_automatic: "Semi-automatic",
}

export const INCLUDED_BENEFITS = [
  {
    title: "Pay at delivery",
    description: "No upfront payment. Pay only when the car is delivered.",
  },
  {
    title: "No deposit option",
    description: "Avoid security deposits. No amount blocked on your card.",
  },
  {
    title: "Exact car or equivalent",
    description:
      "The listed car is delivered. Any alternative is approved by you before delivery.",
  },
  {
    title: "Support before signing",
    description: "Our team assists you before you sign the rental contract.",
  },
  {
    title: "No obligation if not compliant",
    description:
      "You can refuse the car before signing if it doesn't match the listing.",
  },
] as const
