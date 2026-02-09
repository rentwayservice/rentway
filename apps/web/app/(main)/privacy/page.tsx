import type { Metadata } from "next";
import { StaticPageContent } from "@/components/static-page-content/static-page-content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Understand how Rentway handles your data.",
  openGraph: {
    title: "Rentway privacy",
    description: "Understand how Rentway handles your data.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="pb-16">
      <StaticPageContent title="Privacy policy">
        <p>
          We only collect the data needed to manage rentals and bookings.
          Provider and customer data is protected using industry best practices.
        </p>
      </StaticPageContent>
    </main>
  );
}
