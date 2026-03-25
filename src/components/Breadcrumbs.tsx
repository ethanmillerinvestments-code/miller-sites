import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

type BreadcrumbItem = {
  label: string;
  href: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: `${siteConfig.siteUrl}${item.href === "/" ? "" : item.href}`,
  }));

  const breadcrumbSchema = buildBreadcrumbSchema(schemaItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="section-shell mb-6">
        <ol className="flex items-center gap-1.5">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight
                    className="h-3 w-3 text-stone-600"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span className="mini-label" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="mini-label transition-colors hover:text-stone-300"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
