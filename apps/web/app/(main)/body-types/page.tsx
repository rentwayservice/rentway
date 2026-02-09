import type { Metadata } from "next";
import { listBodyTypes } from "@/actions/body-types";
import { BodyTypeGrid } from "@/components/body-type-grid/body-type-grid";

export const metadata: Metadata = {
  title: "Body types",
  description: "Explore cars by body type.",
  openGraph: {
    title: "Body types",
    description: "Explore cars by body type.",
  },
};

export default async function BodyTypesPage() {
  const result = await listBodyTypes();
  const bodyTypes = result.success ? result.data : [];

  return (
    <main className="space-y-6 pb-16">
      <BodyTypeGrid title="Browse body types" bodyTypes={bodyTypes} />
    </main>
  );
}
