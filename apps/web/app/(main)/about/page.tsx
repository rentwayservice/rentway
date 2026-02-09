import type { Metadata } from "next";
import { StaticPageContent } from "@/components/static-page-content/static-page-content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Rentway and our marketplace values.",
  openGraph: {
    title: "About Rentway",
    description: "Learn about Rentway and our marketplace values.",
  },
};

export default function AboutPage() {
  return (
    <main className="pb-16">
      <StaticPageContent title="About Rentway">
        <p>
          Rentway connects drivers with trusted rental providers. Our mission is
          to make car rentals transparent, flexible, and fast.
        </p>
      </StaticPageContent>
    </main>
  );
}
