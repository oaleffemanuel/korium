import { FAQ_ITEMS } from "@/lib/faq";
import { site, WHATSAPP_NUMBER } from "@/lib/site";

/**
 * Shared across every variant — the business does not change between tests.
 * Only the FAQ differs, since each variant answers objections in its own way.
 */
export function buildJsonLd(faqItems: readonly { q: string; a: string }[] = FAQ_ITEMS) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AccountingService",
        "@id": `${site.url}#organizacao`,
        name: site.legalName,
        alternateName: site.name,
        url: site.url,
        email: site.email,
        telephone: `+${WHATSAPP_NUMBER}`,
        slogan: site.tagline,
        description: site.description,
        areaServed: { "@type": "Country", name: "Brasil" },
        knowsLanguage: "pt-BR",
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}#site`,
        url: site.url,
        name: site.name,
        inLanguage: "pt-BR",
        publisher: { "@id": `${site.url}#organizacao` },
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}#perguntas`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
