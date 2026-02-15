"use client";

import { Button } from "@rentway/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@rentway/ui/components/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function handleLocaleChange(newLocale: string) {
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `locale=${newLocale}; path=/; max-age=${oneYear};`;
    router.refresh();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className="gap-1.5" size="sm" variant="ghost">
            <span className="hidden sm:inline">
              {LOCALES.find((l) => l.code === locale)?.label ?? "English"}
            </span>
            <ChevronDown className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
          >
            {loc.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
