import { Suspense } from "react";
import { RegisterForm } from "@/layouts/auth";

export default function page() {
  return (
    <div>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
