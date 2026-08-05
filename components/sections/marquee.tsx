const SEGMENTS = [
  "Clínicas e consultórios",
  "Médicos PJ",
  "Empresas de tecnologia",
  "Agências",
  "Prestadores de serviço",
  "Negócios digitais",
  "E-commerce",
  "Profissionais liberais",
  "Startups",
  "Consultorias",
];

export function Marquee() {
  return (
    <section
      aria-label="Segmentos atendidos pela Korium"
      className="relative overflow-hidden border-y border-line py-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(to_right,rgb(var(--canvas)),transparent)] md:w-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(to_left,rgb(var(--canvas)),transparent)] md:w-40"
      />

      <div className="animate-marquee flex w-max items-center gap-x-12">
        {[0, 1].map((pass) => (
          <div key={pass} className="flex items-center gap-x-12" aria-hidden={pass === 1}>
            {SEGMENTS.map((segment) => (
              <span
                key={segment}
                className="flex shrink-0 items-center gap-x-12 text-[0.8125rem] uppercase tracking-[0.16em] text-ink-3"
              >
                {segment}
                <span className="size-1 rounded-full bg-[rgb(var(--gold))]" aria-hidden />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
