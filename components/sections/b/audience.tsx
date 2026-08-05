import {
  Briefcase,
  Building2,
  Code2,
  HeartPulse,
  Stethoscope,
  Store,
} from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";

const AUDIENCE = [
  {
    icon: Stethoscope,
    title: "Médicos",
    body: "Pró-labore, PJ e a declaração pessoal organizados juntos, sem contradição entre eles.",
  },
  {
    icon: HeartPulse,
    title: "Clínicas",
    body: "Equiparação hospitalar, sócios e a rotina de quem atende paciente o dia inteiro.",
  },
  {
    icon: Code2,
    title: "Empresas de tecnologia",
    body: "Contratação PJ, receita recorrente e faturamento que às vezes vem de fora.",
  },
  {
    icon: Briefcase,
    title: "Prestadores de serviço",
    body: "Consultorias, agências e escritórios em que o faturamento muda todo mês.",
  },
  {
    icon: Building2,
    title: "Pequenas empresas",
    body: "Time enxuto, sócio metido em tudo e nenhum tempo sobrando para burocracia.",
  },
  {
    icon: Store,
    title: "Comércio local",
    body: "Estoque, substituição tributária e vendas conferidas uma a uma, de verdade.",
  },
];

export function AudienceB() {
  return (
    <Section id="para-quem" tone="sand">
      <div className="container-k">
        <SectionHeading
          eyebrow="Para quem"
          title="Para quem a Korium foi criada"
          lede="Hoje estamos focados em empresas que já faturam e já têm contador, e que chegaram àquele ponto em que o problema deixou de ser preço e passou a ser confiança."
          align="center"
        />

        <Stagger className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE.map(({ icon: Icon, title, body }) => (
            <StaggerItem key={title}>
              <article className="group h-full rounded-xl border border-line bg-surface p-8 transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-[rgb(var(--gold)/0.4)] hover:shadow-[var(--shadow-lift)] md:p-9">
                <span className="grid size-11 place-items-center rounded-full border border-line text-[rgb(var(--gold))] transition-colors duration-500 group-hover:border-[rgb(var(--gold)/0.45)] group-hover:bg-[rgb(var(--gold)/0.06)]">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <h3 className="mt-7 text-[1.1875rem] tracking-[-0.02em] text-ink">
                  {title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-3 transition-colors duration-500 group-hover:text-ink-2">
                  {body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
