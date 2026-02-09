import type { Metadata } from "next";
import { StaticPageContent } from "@/components/static-page-content/static-page-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Rentway team for support or partnerships.",
  openGraph: {
    title: "Contact Rentway",
    description: "Reach the Rentway team for support or partnerships.",
  },
};

export default function ContactPage() {
  return (
    <main className="pb-16">
      <StaticPageContent title="Contact us">
        <p>
          Need help? Email support@rentway.app or chat with the Rentway team from
          your dashboard.
        </p>
      </StaticPageContent>
    </main>
  );
}
