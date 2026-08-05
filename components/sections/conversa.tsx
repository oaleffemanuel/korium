import { Clock3, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { KMark } from "@/components/site/logo";
import { Eyebrow, Section } from "@/components/site/section";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";

export function Conversa() {
  return (
    <Section id="conversa">
      <div className="container-k">
        <div className="mx-auto max-w-4xl">
          <Reveal y={26}>
            <div className="shadow-soft relative overflow-hidden rounded-2xl border border-line bg-surface p-9 md:p-16">
              {/* Oversized mark, cropped — the letterhead of the block */}
              <KMark className="pointer-events-none absolute -right-8 -top-10 size-48 text-ink opacity-[0.04] md:-right-4 md:size-64" />

              <div className="relative">
                <Eyebrow>Como começa</Eyebrow>

                <h2 className="text-title mt-8 max-w-[16ch] font-normal text-ink">
                  Fale com o dono da Korium.
                </h2>

                <div className="mt-9 max-w-[60ch] space-y-5 text-[1.0625rem] leading-relaxed text-ink-2 md:text-[1.125rem]">
                  <p>
                    A Korium ainda é um escritório pequeno, e isso tem uma
                    vantagem que a gente não quer perder: quem conversa com você
                    é o dono, não um vendedor treinado para repetir um roteiro.
                  </p>
                  <p>
                    Na prática, é uma conversa entre duas pessoas que tocam
                    empresa. Você conta como o seu negócio funciona hoje e o que
                    está te incomodando, a gente diz com franqueza o que dá para
                    fazer — e se a Korium for a escolha errada para o seu caso,
                    também vamos dizer isso.
                  </p>
                </div>

                <div className="mt-12 flex flex-col items-start gap-6 border-t border-line pt-9 sm:flex-row sm:items-center sm:justify-between">
                  <p className="inline-flex items-center gap-2.5 text-[0.9375rem] text-ink-3">
                    <Clock3
                      className="size-4 shrink-0 text-[rgb(var(--gold))]"
                      aria-hidden
                    />
                    Costuma levar uns 20 minutos.
                  </p>

                  <WhatsAppCta
                    context="dono"
                    size="lg"
                    className="w-full sm:w-auto"
                    icon={
                      <MessageCircle
                        className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:scale-110"
                        aria-hidden
                      />
                    }
                  >
                    Conversar pelo WhatsApp
                  </WhatsAppCta>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
