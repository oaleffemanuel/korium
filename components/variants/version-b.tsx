import { AudienceB } from "@/components/sections/b/audience";
import { Comparison } from "@/components/sections/b/comparison";
import { FaqB } from "@/components/sections/b/faq";
import { FinalCtaB } from "@/components/sections/b/final-cta";
import { HeroB } from "@/components/sections/b/hero";
import { HowItWorksB } from "@/components/sections/b/how-it-works";
import { OfferB } from "@/components/sections/b/offer";
import { ServicesB } from "@/components/sections/b/services";
import { Footer } from "@/components/site/footer";
import { Wordmark } from "@/components/site/logo";
import { type NavLink } from "@/components/site/nav";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { FAQ_ITEMS_B } from "@/lib/faq-b";
import { buildJsonLd } from "@/lib/structured-data";

/**
 * Version B — the service page. Where A argues a point of view, B answers the
 * question someone already looking for an accountant is asking: what do you
 * do, for whom, how does it work, and how do I start.
 *
 * Nothing here is shared with A except the design system and the shell, so
 * the two can diverge freely. See docs/experiments.md.
 */
/**
 * Quiet editorial close — the last thought, not a last pitch. Each sentence
 * gets its own block so the couplet holds on wide screens and still wraps
 * naturally when it cannot.
 */
const SIGN_OFF = (
  <p className="serif mt-7 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink-2">
    <span className="block">
      O problema começa quando você perde a confiança.
    </span>
    <span className="block">
      E termina quando você encontra um contador em quem pode confiar novamente.
    </span>
  </p>
);

const FOOTER_LINKS: NavLink[] = [
  { label: "Para quem", href: "#para-quem" },
  { label: "Serviços", href: "#servicos" },
  { label: "Comparação", href: "#comparacao" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "O que está incluído", href: "#incluido" },
  { label: "Perguntas", href: "#perguntas" },
];

export function VersionB() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(FAQ_ITEMS_B)),
        }}
      />

      {/* Landing page: no navigation at all. Just the mark, sitting inside
          the hero's existing top whitespace so nothing below shifts. */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="container-k">
          <div className="flex h-20 items-center md:h-24">
            <Wordmark />
          </div>
        </div>
      </header>

      <main id="conteudo">
        <HeroB />
        <AudienceB />
        <ServicesB />
        <Comparison />
        <HowItWorksB />
        <OfferB />
        <FaqB />
        <FinalCtaB />
      </main>

      <Footer links={FOOTER_LINKS} signOff={SIGN_OFF} />
      <WhatsAppFab />
    </>
  );
}
