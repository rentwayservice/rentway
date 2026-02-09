import type { Metadata } from "next";
import { CarFeaturePicker } from "@/components/car-feature-picker/car-feature-picker";
import { CarForm } from "@/components/car-form/car-form";
import { ImageUploader } from "@/components/image-uploader/image-uploader";

export const metadata: Metadata = {
  title: "Edit car",
  description: "Edit car listing.",
  robots: { index: false, follow: false },
};

export default function ProviderCarEditPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-16">
      <CarForm mode="edit" />
      <CarFeaturePicker features={[]} />
      <ImageUploader label="Update car images" />
    </main>
  );
}
