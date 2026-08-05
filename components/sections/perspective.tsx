import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Eyebrow, Section } from "@/components/site/section";

const SOLD = [
  "Guias emitidas",
  "Balancetes fechados",
  "Obrigações entregues no prazo",
  "Um sistema com login e senha",
  "A palavra “consultoria” no contrato",
];

const WANTED = [
  "Saber que está tudo certo sem precisar perguntar",
  "Resposta em até 10 minutos no horário comercial",
  "Não precisar lembrar de nada sozinho",
  "Ser avisado antes, e não depois da multa",
  "Fim de mês sem nenhuma surpresa",
];

export function Perspective() {
  return (
    <Section id="metodo">
      <div className="container-k">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>Uma nova perspectiva</Eyebrow>
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <p className="text-[clamp(1.5rem,1.1rem+1.5vw,2.125rem)] font-normal leading-[1.35] tracking-[-0.028em] text-ink">
              Nenhuma lei é exclusiva do seu escritório de contabilidade. Todo
              mundo entrega a mesma obrigação, no mesmo prazo, para o mesmo
              governo — então o que realmente separa um escritório do outro é{" "}
              <span className="serif-accent-lg text-[rgb(var(--gold))]">
                o que acontece no meio do caminho
              </span>
              .
            </p>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:mt-28 lg:grid-cols-2">
          <Panel label="O que todo escritório vende" items={SOLD} muted />
          <Panel label="O que você realmente quer" items={WANTED} />
        </div>

        <Reveal delay={0.1} className="mt-16 flex justify-center">
          <p className="text-lede max-w-[56ch] text-center text-ink-2">
            A parte técnica virou o mínimo que se espera de qualquer um.{" "}
            <span className="text-ink">
              O que ninguém está entregando é o resto
            </span>{" "}
            — e é justamente o resto que faz você dormir tranquilo.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function Panel({
  label,
  items,
  muted = false,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className={muted ? "bg-surface-2 p-9 md:p-14" : "bg-surface p-9 md:p-14"}>
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-3">
        {label}
      </p>
      <Stagger className="mt-9 flex flex-col" amount={0.15}>
        {items.map((item) => (
          // Rule sits on the stagger wrapper — the real sibling in the column.
          <StaggerItem key={item} className="border-b border-line last:border-b-0">
            <div className="flex items-start gap-4 py-5">
              <span
                aria-hidden
                className={
                  muted
                    ? "mt-[0.6rem] size-1 shrink-0 rounded-full bg-ink-4"
                    : "mt-[0.6rem] size-1 shrink-0 rounded-full bg-[rgb(var(--gold))]"
                }
              />
              <span
                className={
                  muted
                    ? "text-[1.0625rem] leading-snug text-ink-3"
                    : "text-[1.0625rem] leading-snug text-ink"
                }
              >
                {item}
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
