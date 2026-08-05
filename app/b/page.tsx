import type { Metadata } from "next";

import { VersionB } from "@/components/variants/version-b";
import { VARIANTS } from "@/lib/variants";

export const metadata: Metadata = {
  alternates: { canonical: `${VARIANTS.a.path}/` },
  // Kept out of the index while it duplicates A, so the two never compete.
  robots: { index: false, follow: true },
};

export default function VersionBPage() {
  return <VersionB />;
}
