"use server";

import type { CheckoutPayload } from "./checkout.types";

// Later: insert into a `bookings` table / create Stripe intent etc.
// For MVP: return success so the UI can redirect.
export async function createCheckout(
  payload: CheckoutPayload
): Promise<
  | { success: true; data: { checkoutId: string } }
  | { success: false; error: string }
> {
  try {
    // You can validate again on server if you want (recommended)
    // and persist to DB.
    const checkoutId = crypto.randomUUID();

    // TODO: persist payload/order to DB (future bookings table)
    // TODO: notify provider

    return { success: true, data: { checkoutId } };
  } catch (e) {
    return { success: false, error: "Could not create checkout." };
  }
}
