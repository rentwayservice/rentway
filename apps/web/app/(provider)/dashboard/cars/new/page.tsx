import type { Metadata } from "next";
import { CarFeaturePicker } from "@/components/car-feature-picker/car-feature-picker";
import { CarForm } from "@/components/car-form/car-form";
import { ImageUploader } from "@/components/image-uploader/image-uploader";

export const metadata: Metadata = {
  title: "Create car",
  description: "Create a new car listing.",
  robots: { index: false, follow: false },
};

export default function ProviderCarNewPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-16">
      <CarForm mode="create" />
      <CarFeaturePicker features={[]} />
      <ImageUploader label="Upload car images" />
    </main>
  );
}
