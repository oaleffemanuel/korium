import { Audience } from "@/components/sections/audience";
import { Conversa } from "@/components/sections/conversa";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Marquee } from "@/components/sections/marquee";
import { Offer } from "@/components/sections/offer";
import { Pain } from "@/components/sections/pain";
import { Perspective } from "@/components/sections/perspective";
import { Services } from "@/components/sections/services";
import { Solution } from "@/components/sections/solution";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { buildJsonLd } from "@/lib/structured-data";

/**
 * Version A — emotion first. The promise leads, the accounting supports it.
 * See docs/experiments.md.
 */
export function VersionA() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <Nav />

      <main id="conteudo">
        <Hero />
        <Marquee />
        <Pain />
        <Perspective />
        <Solution />
        <Services />
        <HowItWorks />
        <Audience />
        <Faq />
        <Offer />
        <Conversa />
        <FinalCta />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  );
}
