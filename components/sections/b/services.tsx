import { Check } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";

const SERVICES = [
  "Contabilidade mensal",
  "Abertura de empresa",
  "Troca de contador",
  "Emissão de notas",
  "Obrigações fiscais",
  "Pró-labore",
  "Folha de pagamento",
  "Suporte contábil",
  "Consultoria",
];

export function ServicesB() {
  return (
    <Section id="servicos">
      <div className="container-k">
        <SectionHeading
          eyebrow="Serviços"
          title="O que a Korium faz por você"
          lede="Do registro da empresa ao imposto do fim do mês, tudo passa por aqui — e você só precisa acompanhar, sem virar especialista no assunto."
          align="center"
        />

        <Reveal delay={0.1} y={26} className="mt-20">
          <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-soft)] md:p-12">
            <Stagger className="grid gap-x-14 gap-y-1 sm:grid-cols-2" amount={0.1}>
              {SERVICES.map((item) => (
                // The rule sits on the stagger wrapper, the real grid sibling.
                // `last` covers the single column; `nth-last-child(-n+2)` covers
                // the bottom of both columns, including the odd final row.
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
          </div>
        </Reveal>

        <Reveal delay={0.16} className="mt-14 flex flex-col items-center gap-7">
          <p className="max-w-[54ch] text-center text-[1.0625rem] leading-relaxed text-ink-2">
            Se o que você precisa não está nesta lista, é bem provável que a
            gente resolva mesmo assim — o jeito mais rápido de saber é
            perguntando.
          </p>
          <WhatsAppCta context="dono" size="lg">
            Falar com a Korium
          </WhatsAppCta>
        </Reveal>
      </div>
    </Section>
  );
}
