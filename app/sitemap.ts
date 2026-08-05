import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { indexableVariants, VARIANTS } from "@/lib/variants";

/** Required by `output: export` — generated once at build time. */
export const dynamic = "force-static";

/** Only indexable variants are listed — experiment routes stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableVariants().map((id) => ({
    url: `${site.url}${VARIANTS[id].path}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  }));
}
