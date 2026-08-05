import type { Metadata } from "next";

import { VersionB } from "@/components/variants/version-b";
import { site } from "@/lib/site";
import { VARIANTS } from "@/lib/variants";

const title = `${site.name} — Contabilidade que responde em até 10 minutos`;
const description =
  "Contabilidade mensal, abertura de empresa, folha e obrigações fiscais para médicos, clínicas, empresas de tecnologia e pequenos negócios. A troca de contador é feita por nós.";

export const metadata: Metadata = {
  // Absolute: the layout template would otherwise append "· Korium" twice.
  title: { absolute: title },
  description,
  // Its own canonical now that the content differs from A. Still out of the
  // index: only the active variant competes in organic search.
  alternates: { canonical: `${VARIANTS.b.path}/` },
  robots: { index: false, follow: true },
  openGraph: {
    title,
    description,
    url: `${site.url}${VARIANTS.b.path}/`,
  },
};

export default function VersionBPage() {
  return <VersionB />;
}
