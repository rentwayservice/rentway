"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@zaher/ui/components/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/supabase/client";
import { logoutUser } from "./signout.server";

export function SignOut() {
  const t = useTranslations("auth");
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
      await logoutUser();
      router.push("/auth");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  return (
    <Button
      className="flex w-full justify-start px-2 items-center gap-3"
      disabled={isPending}
      onClick={() => logout()}
      variant="ghost"
    >
      <LogOut />
      {t("signout")}
    </Button>
  );
}
