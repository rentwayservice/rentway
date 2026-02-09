import type { Metadata } from "next";
import { StaticPageContent } from "@/components/static-page-content/static-page-content";

export const metadata: Metadata = {
  title: "Terms",
  description: "Review the Rentway terms and conditions.",
  openGraph: {
    title: "Rentway terms",
    description: "Review the Rentway terms and conditions.",
  },
};

export default function TermsPage() {
  return (
    <main className="pb-16">
      <StaticPageContent title="Terms & conditions">
        <p>
          By using Rentway, you agree to comply with our marketplace terms.
          Providers are responsible for vehicle availability and accurate
          listings.
        </p>
      </StaticPageContent>
    </main>
  );
}
