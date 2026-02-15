import Link from "next/link";

const FOOTER_LINKS = {
  explore: [
    { href: "/explore", label: "Explore cars" },
    { href: "/brands", label: "Browse by brand" },
    { href: "/cities", label: "Browse by city" },
  ],
  company: [
    { href: "/about", label: "About us" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/careers", label: "Careers" },
  ],
  support: [
    { href: "/help", label: "Help center" },
    { href: "/contact", label: "Contact us" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of service" },
  ],
} as const;

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              className="inline-flex items-center font-semibold text-lg tracking-tight"
              href="/"
            >
              <span className="rounded bg-primary px-2 py-1 text-primary-foreground">
                Rentway
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground text-sm">
              Skip the rental car counter. Rent just about any car, just about
              anywhere.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-sm">Explore</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-sm">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-sm">Support</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                className="text-muted-foreground text-xs transition-colors hover:text-foreground"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Rentway. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
