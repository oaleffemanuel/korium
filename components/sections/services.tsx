import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";

const SERVICES = [
  {
    title: "Contabilidade completa",
    body: "Escrituração, balancetes e demonstrações fechados no prazo e explicados de um jeito que dá para entender sem precisar de tradutor.",
  },
  {
    title: "Fiscal e tributário",
    body: "Apuração, guias e obrigações acessórias passam por conferência antes de sair daqui, porque errar imposto sai caro e a conta é sempre sua.",
  },
  {
    title: "Folha e pró-labore",
    body: "Admissões, rescisões, férias e eSocial em dia, e a retirada dos sócios organizada da forma mais eficiente que a lei permite.",
  },
  {
    title: "Planejamento tributário",
    body: "Simples, Presumido ou Real: revisamos o regime todo ano e colocamos o cálculo na sua mesa antes de você precisar decidir qualquer coisa.",
  },
  {
    title: "Abertura e regularização",
    body: "Constituição, alterações contratuais, licenças e também a limpeza daquelas pendências que você herdou do escritório anterior.",
  },
  {
    title: "Societário e sucessão",
    body: "Entrada e saída de sócios, holding patrimonial e a separação clara entre o que é da empresa e o que é seu — de preferência antes de precisar.",
  },
  {
    title: "Clínicas e profissionais da saúde",
    body: "Equiparação hospitalar, CNES e as particularidades de quem atende paciente, que quase nenhum escritório generalista conhece de perto.",
  },
  {
    title: "Imposto de renda dos sócios",
    body: "A declaração da pessoa física conversando com a da empresa, sem contradição entre as duas e sem sustos com a malha fina.",
  },
];

export function Services() {
  return (
    <Section id="servicos">
      <div className="container-k">
        <SectionHeading
          eyebrow="Serviços"
          title="Tudo o que se espera de uma contabilidade — e o que quase nenhuma entrega."
          lede="Esta lista não é o motivo para trocar de contador. É só o mínimo que você já deveria estar recebendo hoje, e vale conferir quanto dela você realmente recebe."
        />

        <Stagger className="mt-20 border-t border-line" amount={0.05}>
          {SERVICES.map((service, i) => (
            <StaggerItem key={service.title}>
              <article className="group relative grid items-baseline gap-x-10 gap-y-3 border-b border-line py-8 transition-colors duration-500 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.15fr)] md:py-9">
                <span
                  aria-hidden
                  className="tabular text-[0.8125rem] text-ink-4 transition-colors duration-500 group-hover:text-[rgb(var(--gold))]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[1.375rem] tracking-[-0.025em] text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] md:text-[1.5rem] md:group-hover:translate-x-1">
                  {service.title}
                </h3>
                <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-3 transition-colors duration-500 group-hover:text-ink-2">
                  {service.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-14">
          <p className="max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-3">
            Se o seu contador atual faz tudo isso e ainda responde em poucos
            minutos, fique com ele — falo sério.{" "}
            <span className="text-ink">
              Só que, se fosse esse o caso, você provavelmente não teria chegado
              até aqui
            </span>
            .
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
