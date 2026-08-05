import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { VARIANT_IDS, VARIANTS } from "@/lib/variants";

/** Required by `output: export` — generated once at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const hidden = VARIANT_IDS.filter((id) => !VARIANTS[id].indexable).map(
    (id) => VARIANTS[id].path,
  );

  return {
    rules: { userAgent: "*", allow: "/", disallow: hidden },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
