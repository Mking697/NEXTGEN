"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "@/components/site/lead-form";
import type { Product, Service } from "@/lib/types";

/**
 * Reads ?product= on the client so /contact can still be prerendered.
 *
 * Awaiting searchParams on the server opts the whole route out of the cache,
 * and /contact is the page paid ads land on — the one page that most needs to
 * be served from the CDN. Read here instead, behind a Suspense boundary, and
 * the page ships as static HTML with the dropdown preselected once hydrated.
 */
export function LeadFormFromQuery({
  products, services,
}: { products: Product[]; services: Service[] }) {
  const preselect = useSearchParams().get("product") ?? undefined;
  return <LeadForm products={products} services={services} preselect={preselect} />;
}
