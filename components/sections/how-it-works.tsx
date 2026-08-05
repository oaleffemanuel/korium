"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";

const STEPS = [
  {
    n: "01",
    tag: "Cerca de 20 minutos",
    title: "A conversa",
    body: "É uma conversa, não uma apresentação de vendas. A gente entende como o seu negócio funciona, em que regime você está, o que está travando hoje e o que isso já te custou. No fim você sai com um retrato claro da sua situação, mesmo que decida não seguir com a gente.",
  },
  {
    n: "02",
    tag: "Em até 2 dias",
    title: "Plano e proposta",
    body: "Só depois de entender é que a gente fala de proposta, e ela vem com tudo escrito: o que entra, quem cuida de cada coisa, em quanto tempo você recebe resposta e o que a gente espera de você. Sem letra miúda e sem serviço empurrado que você nunca vai usar.",
  },
  {
    n: "03",
    tag: "Por nossa conta",
    title: "Migração",
    body: "Daqui em diante a parte chata é nossa: falamos com o seu contador atual, pedimos a documentação, conferimos o que chegou e arrumamos o que veio pendente. Você só assina o que for necessário e não precisa brigar nem cobrar ninguém.",
  },
  {
    n: "04",
    tag: "Todo mês",
    title: "O dia a dia",
    body: "Canal direto aberto, o calendário do ano na mesa e um resumo chegando todo mês no seu e-mail. A partir daqui a lógica se inverte: quem procura você somos nós.",
  },
];

export function HowItWorks() {
  const ref = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });
  const lineOpacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <Section id="como-funciona" tone="sand">
      <div className="container-k">
        <SectionHeading
          eyebrow="Como funciona"
          title="Trocar de contador leva uma assinatura, não um trimestre."
          lede="Muita gente adia a troca imaginando meses de dor de cabeça. Na prática, o trabalho pesado é todo nosso — a sua parte é uma conversa de vinte minutos e algumas assinaturas."
        />

        <ol ref={ref} className="relative mt-20 md:mt-24">
          {/* Rail */}
          <div
            aria-hidden
            className="absolute bottom-8 left-[0.4375rem] top-2 w-px bg-line-strong md:left-[calc(9rem+0.4375rem)]"
          />
          <motion.div
            aria-hidden
            style={{ scaleY, opacity: lineOpacity }}
            className="absolute bottom-8 left-[0.4375rem] top-2 w-px origin-top bg-[rgb(var(--gold))] md:left-[calc(9rem+0.4375rem)]"
          />

          {STEPS.map((step) => (
            <li key={step.n} className="relative">
              <Reveal
                delay={0.04}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-y-4 pb-16 md:grid-cols-[9rem_2rem_minmax(0,1fr)] md:pb-20"
              >
                <span className="hidden pt-0.5 text-[0.75rem] uppercase tracking-[0.18em] text-ink-3 md:block">
                  {step.tag}
                </span>

                <span className="relative pt-1">
                  <span className="relative z-10 grid size-3.5 place-items-center rounded-full border border-line-strong bg-surface-2">
                    <span className="size-1.5 rounded-full bg-[rgb(var(--gold))]" />
                  </span>
                </span>

                <div className="max-w-[54ch] pl-1 md:pl-0">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      aria-hidden
                      className="tabular text-[0.8125rem] text-[rgb(var(--gold))]"
                    >
                      {step.n}
                    </span>
                    <h3 className="text-[1.5rem] tracking-[-0.028em] text-ink md:text-[1.75rem]">
                      {step.title}
                    </h3>
                    <span className="text-[0.75rem] uppercase tracking-[0.18em] text-ink-3 md:hidden">
                      · {step.tag}
                    </span>
                  </div>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-2">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
