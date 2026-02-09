import type { StaticPageContentProps } from "./static-page-content.types";

export const StaticPageContent = ({
  className,
  title,
  children,
}: StaticPageContentProps) => {
  return (
    <section className={`rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="prose prose-sm mt-4 max-w-none text-muted-foreground">
        {children}
      </div>
    </section>
  );
};
