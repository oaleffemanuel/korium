import type { Metadata } from "next";

import { VersionA } from "@/components/variants/version-a";
import { site } from "@/lib/site";
import { VARIANTS } from "@/lib/variants";

export const metadata: Metadata = {
  alternates: { canonical: `${VARIANTS.a.path}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    url: `${site.url}${VARIANTS.a.path}/`,
  },
};

export default function VersionAPage() {
  return <VersionA />;
}
