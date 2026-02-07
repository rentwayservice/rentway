import { Button } from "@rentway/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@rentway/ui/components/carousel";
import { Input } from "@rentway/ui/components/input";
import { Car, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ProductCard } from "@/components/shared/product-card";
import { DEMO_BRANDS, DEMO_CARS, HERO_CONFIG } from "./home.constants";

export function HeroSection() {
  return (
    <section className="container relative mx-auto mt-4 w-full md:mt-6 lg:mt-8">
      <div className="relative min-h-[380px] overflow-hidden rounded-2xl md:min-h-[360px] lg:min-h-[420px]">
        <Image
          alt="Car rental"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          src={HERO_CONFIG.backgroundImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="space-y-2">
            <h1 className="font-bold text-3xl text-white drop-shadow-lg md:text-4xl lg:text-5xl">
              {HERO_CONFIG.title}
            </h1>
            <p className="text-base text-white/90 md:text-lg">
              {HERO_CONFIG.subtitle}
            </p>
          </div>

          <div className="w-full max-w-3xl rounded-xl bg-white p-2 shadow-xl md:p-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <Input
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                placeholder={HERO_CONFIG.searchPlaceholder}
              />
              <div className="flex gap-2">
                <Input
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 md:min-w-[140px]"
                  defaultValue="2/10/2026 8:30 PM"
                  placeholder="From"
                  type="text"
                />
                <Input
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 md:min-w-[140px]"
                  defaultValue="2/14/2026 8:30 PM"
                  placeholder="Until"
                  type="text"
                />
              </div>
              <Button className="shrink-0 gap-2" size="lg">
                <Search className="size-4" />
                Search
              </Button>
            </div>
          </div>

          <Button
            className="bg-black text-white hover:bg-black/90"
            size="lg"
            variant="secondary"
          >
            {HERO_CONFIG.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function BrandsSection() {
  const brands = DEMO_BRANDS.data;
  return (
    <section className="container mx-auto">
      <h2 className="mb-6 font-semibold text-xl">Browse by brand</h2>
      <Carousel
        className="w-full"
        opts={{ loop: true, align: "start", dragFree: true }}
      >
        <CarouselContent className="cursor-grab">
          {brands.map((brand) => (
            <CarouselItem className="basis-auto" key={brand.id}>
              <Link
                className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                href={`/brands/${brand.slug}`}
              >
                <Car className="size-5 shrink-0 text-muted-foreground" />
                <span className="whitespace-nowrap font-medium text-sm">
                  {brand.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export async function CarsSection() {
  const cars = DEMO_CARS.data;
  const locale = await getLocale();
  const sectionTitle = "SUV rental at San Francisco (SFO) airport";

  return (
    <section className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-xl md:text-2xl">{sectionTitle}</h2>
        <div className="flex gap-2">
          <Button aria-label="Previous" size="icon" variant="outline">
            <ChevronLeft className="size-4" />
          </Button>
          <Button aria-label="Next" size="icon" variant="outline">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((car) => (
          <ProductCard car={car} key={car.id} locale={locale} />
        ))}
      </div>
    </section>
  );
}
