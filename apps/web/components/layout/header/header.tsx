"use client";

import { Avatar, AvatarFallback } from "@rentway/ui/components/avatar";
import { Button } from "@rentway/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@rentway/ui/components/dropdown-menu";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About us" },
  { href: "/how-it-works", label: "How it works" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Link
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
          href="/"
        >
          <span className="rounded bg-primary px-2 py-1 text-primary-foreground">
            Rentway
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Button
            aria-label="Open menu"
            className="md:hidden"
            size="icon"
            variant="ghost"
          >
            <Menu className="size-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label="User menu"
                  className="rounded-full"
                  size="icon"
                  variant="ghost"
                >
                  <Avatar className="size-8">
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link className="block size-full" href="/login">
                  Log in
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="block size-full" href="/signup">
                  Sign up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
