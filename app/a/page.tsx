import type { Metadata } from "next";

import { VersionA } from "@/components/variants/version-a";
import { variantMetadata } from "@/lib/variant-metadata";

// Canonical and robots come from the registry in lib/variants.ts.
export const metadata: Metadata = variantMetadata("a");

export default function VersionAPage() {
  return <VersionA />;
}
