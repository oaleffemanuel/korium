import {
  AlarmClock,
  CalendarCheck,
  FileQuestion,
  FolderCheck,
  FolderSearch,
  ListChecks,
  MessageSquareText,
  MessagesSquare,
  Shuffle,
  TriangleAlert,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";

const ROWS = [
  {
    beforeIcon: AlarmClock,
    before: "A resposta demora dias para chegar",
    afterIcon: MessageSquareText,
    after: "Resposta em até 10 minutos no horário comercial",
  },
  {
    beforeIcon: FileQuestion,
    before: "Explicações em linguagem de contador",
    afterIcon: MessagesSquare,
    after: "Explicação em português, do jeito que se fala",
  },
  {
    beforeIcon: Shuffle,
    before: "Processo bagunçado, cada mês de um jeito",
    afterIcon: ListChecks,
    after: "Processo claro, sempre o mesmo",
  },
  {
    beforeIcon: FolderSearch,
    before: "Você corre atrás dos documentos",
    afterIcon: FolderCheck,
    after: "A gente organiza junto com você",
  },
  {
    beforeIcon: TriangleAlert,
    before: "Notícia só quando o problema aparece",
    afterIcon: CalendarCheck,
    after: "Presença o ano inteiro, antes do prazo",
  },
];

export function Comparison() {
  return (
    <Section id="comparacao">
      <div className="container-k">
        <SectionHeading
          eyebrow="Na prática"
          title="A diferença aparece no dia a dia"
          lede="Não é sobre ser melhor do que ninguém, e muito menos sobre saber mais imposto que os outros. É sobre como as coisas funcionam depois que o contrato está assinado."
          align="center"
        />

        <Reveal delay={0.1} y={26} className="mt-20">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-line">
            {/* Column headers only exist where there are columns. Below sm the
                pairs stack, and each cell carries its own label instead. */}
            <div className="hidden border-b border-line sm:grid sm:grid-cols-2">
              <p className="bg-surface-2 px-6 py-5 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-3 md:px-9">
                Outras contabilidades
              </p>
              <p className="bg-surface px-6 py-5 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-[rgb(var(--gold))] md:px-9">
                Korium
              </p>
            </div>

            <Stagger amount={0.08}>
              {ROWS.map((row) => (
                <StaggerItem
                  key={row.before}
                  className="grid grid-cols-1 border-b border-line last:border-b-0 sm:grid-cols-2"
                >
                  <div className="flex h-full items-start gap-3.5 bg-surface-2 px-6 py-6 md:px-9 lg:items-center">
                    <row.beforeIcon
                      className="mt-0.5 size-[18px] shrink-0 text-ink-4 lg:mt-0"
                      aria-hidden
                    />
                    <div>
                      <p className="mb-1.5 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-ink-4 sm:hidden">
                        Outras contabilidades
                      </p>
                      <span className="text-[0.9375rem] leading-snug text-ink-3">
                        {row.before}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3.5 border-t border-line bg-surface px-6 py-6 sm:border-t-0 md:px-9 lg:items-center">
                    <row.afterIcon
                      className="mt-0.5 size-[18px] shrink-0 text-[rgb(var(--gold))] lg:mt-0"
                      aria-hidden
                    />
                    <div>
                      <p className="mb-1.5 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-[rgb(var(--gold))] sm:hidden">
                        Korium
                      </p>
                      <span className="text-[0.9375rem] leading-snug text-ink">
                        {row.after}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
