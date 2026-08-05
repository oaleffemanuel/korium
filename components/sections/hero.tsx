"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LineReveal } from "@/components/motion/reveal";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";

const EASE = [0.16, 1, 0.3, 1] as const;

const REASSURANCES = [
  "A troca de contador é por nossa conta",
  "Você não precisa falar com o contador atual",
  "Resolvemos tudo à distância",
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-32 pt-36 md:pb-40 md:pt-44 lg:pb-48 lg:pt-52"
    >
      {/* Ambient light — a single soft warm pool, no gradients on the brand surfaces */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] opacity-[0.55]"
        style={{
          background:
            "radial-gradient(60rem 32rem at 50% -12%, rgb(var(--gold) / 0.14), transparent 65%)",
        }}
      />

      <div className="container-k">
        <div className="mx-auto max-w-5xl text-center">
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
              Para quem já tem contador — e já cansou
            </span>
          </motion.div>

          <h1 className="text-display mt-10 font-normal text-ink">
            <LineReveal
              delay={0.12}
              lines={[
                <>Nunca mais corra</>,
                <>
                  atrás do{" "}
                  <span className="serif-accent text-[rgb(var(--gold))]">
                    seu contador
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
            className="text-lede mx-auto mt-10 max-w-[52ch] text-ink-2"
          >
            Seu contador deveria responder quando você precisa, não quando ele
            consegue. Na Korium o compromisso é responder em até 10 minutos
            durante o horário comercial, para você seguir cuidando da empresa.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
            className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <WhatsAppCta
              context="dono"
              size="lg"
              className="w-full sm:w-auto"
            >
              Falar com a Korium
            </WhatsAppCta>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href="#como-funciona">Ver como funciona</a>
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
