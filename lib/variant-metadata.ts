import type { Metadata } from "next";

import { site } from "@/lib/site";
import { VARIANTS, type VariantId } from "@/lib/variants";

/**
 * Builds a variant route's metadata from the registry.
 *
 * Canonical and robots are derived, never hand-written per route. Before this
 * existed the two pages hardcoded their own index/noindex, so promoting a
 * variant meant remembering to edit three files; forgetting one left the new
 * default page marked noindex while robots.txt disallowed it.
 *
 * Lives outside lib/variants.ts on purpose: next.config.ts imports that file,
 * and keeping it free of framework imports keeps the config load trivial.
 */
export function variantMetadata(
  id: VariantId,
  overrides: { title?: string; description?: string } = {},
): Metadata {
  const variant = VARIANTS[id];
  const path = `${variant.path}/`;
  const { title, description } = overrides;

  return {
    // Absolute: the layout template would otherwise append "· Korium" twice.
    ...(title ? { title: { absolute: title } } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    robots: variant.indexable
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        }
      : { index: false, follow: true },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: `${site.url}${path}`,
    },
  };
}
