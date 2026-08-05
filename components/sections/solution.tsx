import { Bell, FolderCheck, MessageSquareText, ScrollText } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "@/components/site/section";

const PILLARS = [
  {
    icon: MessageSquareText,
    title: "Você pergunta, a gente responde",
    body: "Toda mensagem tem resposta em até 10 minutos durante o horário comercial. Isso não é um discurso de atendimento: está escrito no contrato, para você poder cobrar se um dia falharmos.",
  },
  {
    icon: FolderCheck,
    title: "Tudo num lugar só",
    body: "Documentos, guias, relatórios e histórico ficam organizados em um canal só, do jeito que você encontra quando precisa. Sem grupo de WhatsApp que virou bagunça, sem e-mail perdido, sem pedir a mesma coisa duas vezes.",
  },
  {
    icon: Bell,
    title: "A gente avisa antes",
    body: "Prazo chegando, mudança de regime, uma oportunidade que apareceu ou um risco que a gente enxergou de longe: você fica sabendo enquanto ainda dá para decidir, e não no dia em que o problema já virou multa.",
  },
  {
    icon: ScrollText,
    title: "Você entende o que está acontecendo",
    body: "Todo mês chega um resumo do que foi feito, do que já está entregue e do que vem pela frente — escrito em português, do jeito que se explica para um sócio, e não em linguagem de contador.",
  },
];

export function Solution() {
  return (
    <Section id="solucao" tone="navy">
      <div className="container-k">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-on-navy-3">
                <span className="rule-gold" aria-hidden />A Korium
              </span>
            </Reveal>

            <Reveal delay={0.06} className="mt-8">
              <h2 className="text-title max-w-[17ch] font-normal text-on-navy">
                Uma contabilidade que responde antes de você cobrar.
              </h2>
            </Reveal>

            <Reveal delay={0.12} className="mt-8">
              <p className="text-lede max-w-[46ch] text-on-navy-2">
                Entregar a obrigação em dia é o mínimo, e a gente entrega com
                rigor. Só que o que você está contratando aqui é outra coisa: o
                fim daquela preocupação que fica no fundo da cabeça o mês
                inteiro.
              </p>
            </Reveal>
          </div>

          <Stagger className="flex flex-col gap-px overflow-hidden rounded-xl border border-navy-line bg-navy-line">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title}>
                <article className="group flex h-full gap-6 bg-navy p-8 transition-colors duration-500 hover:bg-navy-2 md:gap-8 md:p-10">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-navy-line text-[rgb(var(--gold-bright))] transition-colors duration-500 group-hover:border-[rgb(var(--gold)/0.45)]">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-[1.1875rem] tracking-[-0.02em] text-on-navy">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-on-navy-2">
                      {body}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
