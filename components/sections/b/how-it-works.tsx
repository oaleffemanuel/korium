"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";

const STEPS = [
  {
    n: "01",
    title: "Você fala com a Korium",
    body: "Manda uma mensagem no WhatsApp e cai direto na conversa com quem vai cuidar da sua contabilidade, sem formulário, sem fila de atendimento e sem robô perguntando o seu CNPJ três vezes.",
  },
  {
    n: "02",
    title: "Entendemos sua empresa",
    body: "A gente escuta como o seu negócio funciona hoje, em que regime você está e o que anda te consumindo tempo, e aí sim aparece uma proposta com escopo e valor escritos.",
  },
  {
    n: "03",
    title: "Assumimos toda a burocracia",
    body: "Falamos com o contador anterior, buscamos a documentação, conferimos o que chegou e arrumamos o que veio pendente. Sua parte é assinar o necessário, e nada além.",
  },
  {
    n: "04",
    title: "Você volta a focar no crescimento",
    body: "Daí em diante a rotina se inverte: prazos, guias e obrigações passam a ser problema nosso, e você recebe um resumo do que foi feito sem precisar cobrar nada.",
  },
];

export function HowItWorksB() {
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
          title="Quatro passos, e a maior parte do trabalho é nossa"
          lede="Do primeiro contato até a operação rodando, a sua participação se resume a uma conversa e algumas assinaturas."
        />

        <ol ref={ref} className="relative mt-20 md:mt-24">
          <div
            aria-hidden
            className="absolute bottom-8 left-[0.4375rem] top-2 w-px bg-line-strong md:left-[calc(4rem+0.4375rem)]"
          />
          <motion.div
            aria-hidden
            style={{ scaleY, opacity: lineOpacity }}
            className="absolute bottom-8 left-[0.4375rem] top-2 w-px origin-top bg-[rgb(var(--gold))] md:left-[calc(4rem+0.4375rem)]"
          />

          {STEPS.map((step) => (
            <li key={step.n} className="relative">
              <Reveal
                delay={0.04}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-y-4 pb-16 md:grid-cols-[4rem_2rem_minmax(0,1fr)] md:pb-20"
              >
                <span
                  aria-hidden
                  className="tabular hidden pt-0.5 text-[0.8125rem] text-[rgb(var(--gold))] md:block"
                >
                  {step.n}
                </span>

                <span className="relative pt-1">
                  <span className="relative z-10 grid size-3.5 place-items-center rounded-full border border-line-strong bg-surface-2">
                    <span className="size-1.5 rounded-full bg-[rgb(var(--gold))]" />
                  </span>
                </span>

                <div className="max-w-[56ch] pl-1 md:pl-0">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      aria-hidden
                      className="tabular text-[0.8125rem] text-[rgb(var(--gold))] md:hidden"
                    >
                      {step.n}
                    </span>
                    <h3 className="text-[1.5rem] tracking-[-0.028em] text-ink md:text-[1.75rem]">
                      {step.title}
                    </h3>
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
