import type { Metadata } from "next";
import { ImageUploader } from "@/components/image-uploader/image-uploader";
import { ProfileForm } from "@/components/profile-form/profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your Rentway profile.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-16">
      <ProfileForm />
      <ImageUploader label="Update avatar" />
    </main>
  );
}
