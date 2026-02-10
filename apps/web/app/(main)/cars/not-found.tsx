import { Button } from "@rentway/ui/components/button";
import Link from "next/link";

export default function CarNotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-bold text-2xl">Car not found</h1>
      <p className="text-muted-foreground">
        The car you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/">
        <Button variant="outline">Browse cars</Button>
      </Link>
    </div>
  );
}
