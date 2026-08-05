import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";

const QUOTES = [
  "Mandei mensagem semana passada e até hoje ninguém me respondeu.",
  "Não faço ideia se a minha empresa está em dia ou não.",
  "Já pedi o mesmo documento três vezes e continuo esperando.",
  "Só me procuram quando o problema já virou multa.",
  "Pago todo mês e até hoje não sei direito o que estou pagando.",
  "Abri uma empresa para tocar um negócio, não para ficar administrando contador.",
];

export function Pain() {
  return (
    <Section id="dor" tone="sand">
      <div className="container-k">
        <SectionHeading
          eyebrow="O que ninguém diz em voz alta"
          title="O problema quase nunca é a contabilidade. É o silêncio."
          lede="Se você já pensou alguma dessas coisas, não é implicância nem exagero seu. É só o que acontece quando o escritório entrega a obrigação e considera que o trabalho acabou ali."
        />

        <Stagger className="mt-20 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((quote) => (
            <StaggerItem key={quote}>
              <figure className="group relative h-full bg-surface p-9 transition-colors duration-500 hover:bg-canvas md:p-11">
                <span
                  aria-hidden
                  className="serif absolute left-7 top-5 text-5xl leading-none text-[rgb(var(--gold)/0.28)] transition-colors duration-500 group-hover:text-[rgb(var(--gold)/0.55)]"
                >
                  &ldquo;
                </span>
                <blockquote className="relative mt-7">
                  <p className="text-[1.1875rem] leading-[1.5] tracking-[-0.015em] text-ink">
                    {quote}
                  </p>
                </blockquote>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-16">
          <p className="text-lede max-w-[58ch] text-ink-2">
            Nada disso deveria ser normal, mas acabou virando. A gente se
            acostuma, arruma um jeito de contornar e segue tocando a empresa com
            aquele incômodo de fundo que nunca some —{" "}
            <span className="text-ink">
              até o dia em que alguma coisa estoura
            </span>
            .
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
