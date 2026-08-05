"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LineReveal } from "@/components/motion/reveal";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";

const EASE = [0.16, 1, 0.3, 1] as const;

const REASSURANCES = [
  "Resposta em até 10 minutos",
  "A troca de contador é por nossa conta",
  "Atendimento em todo o Brasil",
];

export function HeroB() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-28 pt-32 md:pb-36 md:pt-40 lg:pb-44 lg:pt-48"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] opacity-[0.55]"
        style={{
          background:
            "radial-gradient(60rem 32rem at 50% -12%, rgb(var(--gold) / 0.14), transparent 65%)",
        }}
      />

      <div className="container-k">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-[rgb(var(--surface)/0.6)] py-2 pl-3 pr-4 text-[0.75rem] tracking-[-0.005em] text-ink-2 backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="animate-k-pulse absolute inline-flex size-1.5 rounded-full bg-[rgb(var(--gold))]" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[rgb(var(--gold))]" />
              </span>
              Contabilidade para quem cansou de esperar resposta
            </span>
          </motion.div>

          <h1 className="text-display mt-10 font-normal text-ink md:text-[clamp(4rem,2rem+2.6vw,4.5rem)] md:leading-[0.92]">
            <LineReveal
              delay={0.12}
              lines={[
                // Trailing space so the two masked lines read as separate words
                // when the text is copied or extracted, not "respostado".
                <>Se você precisa cobrar a resposta </>,
                <>
                  do seu contador,{" "}
                  <span className="serif-accent text-[rgb(var(--gold))]">
                    alguma coisa já deu errado
                  </span>
                  .
                </>,
              ]}
            />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="text-lede mx-auto mt-10 max-w-[54ch] text-ink-2"
          >
            O nosso compromisso é responder em até 10 minutos durante o horário
            comercial, para que você foque na expansão do seu negócio.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
            className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <WhatsAppCta context="dono" size="lg" className="w-full sm:w-auto">
              Falar com a Korium
            </WhatsAppCta>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href="#servicos">Ver o que fazemos</a>
            </Button>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.78, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[0.8125rem] text-ink-3"
          >
            {REASSURANCES.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-[rgb(var(--gold))]" aria-hidden />
                {item}
              </span>
            ))}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
