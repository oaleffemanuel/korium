import type { Metadata } from "next";

import { VersionB } from "@/components/variants/version-b";
import { site } from "@/lib/site";
import { variantMetadata } from "@/lib/variant-metadata";

// Canonical and robots come from the registry in lib/variants.ts.
export const metadata: Metadata = variantMetadata("b", {
  title: `${site.name} — Contabilidade que responde em até 10 minutos`,
  description:
    "Contabilidade mensal, abertura de empresa, folha e obrigações fiscais para médicos, clínicas, empresas de tecnologia e pequenos negócios. A troca de contador é feita por nós.",
});

export default function VersionBPage() {
  return <VersionB />;
}
