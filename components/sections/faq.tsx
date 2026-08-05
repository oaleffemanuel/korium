"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Section } from "@/components/site/section";
import { FAQ_ITEMS } from "@/lib/faq";
import { externalLinkProps, whatsappLink } from "@/lib/site";

export function Faq() {
  return (
    <Section id="perguntas">
      <div className="container-k">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Eyebrow>Perguntas</Eyebrow>
            </Reveal>
            <Reveal delay={0.06} className="mt-8">
              <h2 className="text-title max-w-[15ch] font-normal text-ink">
                As dúvidas que costumam travar a decisão.
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="mt-8">
              <p className="max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-3">
                Se ficou alguma coisa de fora,{" "}
                <a
                  href={whatsappLink("duvida")}
                  {...externalLinkProps}
                  className="text-ink underline decoration-[rgb(var(--gold))] decoration-1 underline-offset-4 transition-colors duration-300 hover:text-[rgb(var(--gold))]"
                >
                  pergunte direto para a gente
                </a>{" "}
                — a gente responde mesmo que você não vire cliente.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <Accordion type="single" collapsible className="border-t border-line">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
