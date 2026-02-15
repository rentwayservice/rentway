"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@zaher/ui/components/button";
import { toast } from "sonner";
import { supabase } from "supabase/client";
import { getWindowUrl } from "@/lib/utils";
import { providers } from "./oauth.constants";

export function OAuth({ disable }: { disable?: boolean }) {
  const { mutate, isPending } = useMutation({
    mutationKey: ["oauth"],
    mutationFn: async (provider: "google" | "twitter" | "facebook") => {
      const redirectUrl = `${getWindowUrl()}/auth/callback?next=/`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    },
    onError: (error) => {
      toast.error("فشل تسجيل الدخول باستخدام موفر خارجي");
    },
  });

  return (
    <div className="grid grid-cols-3 gap-x-3">
      {providers.map((provider) => (
        <Button
          className="h-10 flex items-center justify-center"
          disabled={disable || isPending}
          key={provider.name}
          onClick={() =>
            mutate(provider.name as "google" | "twitter" | "facebook")
          }
          variant="outline"
        >
          {provider.icon}
        </Button>
      ))}
    </div>
  );
}
