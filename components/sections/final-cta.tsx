import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { KMark } from "@/components/site/logo";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";

const PROMISES = [
  "Cerca de 20 minutos, sem apresentação de vendas",
  "Você sai com um retrato claro da sua situação",
  "Nada chega ao seu contador atual sem o seu aval",
  "Proposta só depois de entender o seu caso",
];

export function FinalCta() {
  return (
    <section
      id="contato"
      className="grain relative bg-navy py-28 text-on-navy md:py-36 lg:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-60"
        style={{
          background:
            "radial-gradient(48rem 26rem at 50% 0%, rgb(var(--gold) / 0.16), transparent 70%)",
        }}
      />

      <div className="container-k relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="flex justify-center">
            <KMark className="size-9 text-on-navy" />
          </Reveal>

          <Reveal delay={0.06} className="mt-12">
            <h2 className="text-title mx-auto max-w-[16ch] font-normal text-on-navy">
              Vamos entender{" "}
              <span className="serif-accent text-[rgb(var(--gold-bright))]">
                sua empresa
              </span>
              .
            </h2>
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <p className="text-lede mx-auto max-w-[48ch] text-on-navy-2">
              Uma conversa rápida costuma ser suficiente para a gente entender
              como a sua operação funciona e te mostrar, sem enrolação, o que a
              Korium faria diferente do que você tem hoje.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-12 flex justify-center">
            <WhatsAppCta context="dono" variant="gold" size="xl">
              Falar com a Korium
            </WhatsAppCta>
          </Reveal>

          <Reveal delay={0.24} className="mt-16">
            <ul className="mx-auto grid max-w-2xl gap-4 text-left sm:grid-cols-2">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex items-start gap-3.5">
                  <Check
                    className="mt-1 size-4 shrink-0 text-[rgb(var(--gold-bright))]"
                    aria-hidden
                  />
                  <span className="text-[0.9375rem] leading-relaxed text-on-navy-2">
                    {promise}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
