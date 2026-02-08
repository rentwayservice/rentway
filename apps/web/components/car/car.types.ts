import type { Car } from "@/actions/cars"

export interface CarWithDetails extends Car {
  model?: {
    id: string
    name: string
    slug: string
    fuelType: string | null
    transmissionType: string | null
    seats: number | null
    doors: number | null
    largeBags: number | null
    smallBags: number | null
    engineSizeCc: number | null
    horsepower: number | null
    brand?: {
      id: string
      name: string
      slug: string
    } | null
  } | null
  carFeatures?: {
    feature: {
      id: string
      name: string
      slug: string
    }
  }[]
}
