import { Check } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";

const INCLUDED = [
  "Contabilidade mensal completa",
  "Escrita fiscal e apuração",
  "Obrigações acessórias no prazo",
  "Folha de pagamento e pró-labore",
  "Emissão e conferência de notas",
  "Organização dos documentos",
  "Canal direto para dúvidas",
  "Consultoria ao longo do ano",
];

export function OfferB() {
  return (
    <Section id="incluido" tone="sand">
      <div className="container-k">
        <SectionHeading
          eyebrow="O que está incluído"
          title="Tudo isso já vem junto"
          lede="Não existe pacote básico nem plano avançado por aqui. É um serviço só, com tudo o que uma empresa precisa para ficar em dia e bem acompanhada."
          align="center"
        />

        <Reveal delay={0.1} y={26} className="mt-20">
          <div className="shadow-lift mx-auto max-w-4xl rounded-2xl border border-line bg-surface p-2">
            <div className="rounded-[calc(var(--radius-2xl)-0.35rem)] border border-line bg-canvas px-7 py-10 md:px-14 md:py-14">
              <Stagger className="grid gap-x-14 gap-y-1 sm:grid-cols-2" amount={0.1}>
                {INCLUDED.map((item) => (
                  <StaggerItem
                    key={item}
                    className="border-b border-line last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <div className="group flex items-center gap-4 py-4">
                      <span
                        aria-hidden
                        className="grid size-6 shrink-0 place-items-center rounded-full border border-[rgb(var(--gold)/0.3)] text-[rgb(var(--gold))] transition-colors duration-500 group-hover:border-[rgb(var(--gold)/0.65)] group-hover:bg-[rgb(var(--gold)/0.08)]"
                      >
                        <Check className="size-3.5" />
                      </span>
                      <span className="text-[1.0625rem] leading-snug text-ink">
                        {item}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {/* Investment — withheld on purpose until we understand the company */}
              <div className="mt-14 border-t border-line pt-12 text-center">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-3">
                  Investimento
                </p>

                <p className="mt-6 flex items-center justify-center gap-3">
                  <span className="serif text-[clamp(2.25rem,1.6rem+2.4vw,3.25rem)] leading-none text-ink">
                    R$
                  </span>
                  {/* No real figure exists in the DOM — nothing to un-blur. */}
                  <span
                    aria-hidden
                    className="serif pointer-events-none select-none text-[clamp(2.25rem,1.6rem+2.4vw,3.25rem)] leading-none text-ink-3 opacity-60 blur-[10px]"
                  >
                    ██████
                  </span>
                  <span className="sr-only">
                    Valor definido depois da conversa.
                  </span>
                </p>

                <p className="mx-auto mt-9 max-w-[50ch] text-[1.0625rem] leading-relaxed text-ink-2">
                  Cada empresa é diferente, e por isso entendemos sua operação
                  antes de apresentar uma proposta — assim o valor que chega até
                  você faz sentido para os dois lados.
                </p>

                <div className="mt-10 flex justify-center">
                  <WhatsAppCta context="investimento" size="lg">
                    Falar com a Korium
                  </WhatsAppCta>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
