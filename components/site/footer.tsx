import { ArrowUpRight } from "lucide-react";

import { KMark } from "@/components/site/logo";
import { externalLinkProps, site, whatsappLink } from "@/lib/site";

const NAV = [
  { label: "O problema", href: "#dor" },
  { label: "A Korium", href: "#solucao" },
  { label: "Serviços", href: "#servicos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para quem", href: "#para-quem" },
  { label: "O que está incluído", href: "#incluido" },
  { label: "Perguntas", href: "#perguntas" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="container-k">
        <div className="grid gap-12 py-20 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:py-24">
          <div>
            <KMark className="size-8 text-ink" />
            <p className="serif mt-7 max-w-[26ch] text-[1.375rem] leading-snug text-ink">
              Enquanto você cuida da empresa, a gente cuida da contabilidade.
            </p>
          </div>

          <nav aria-label="Rodapé">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-4">
              Navegação
            </p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[0.9375rem] text-ink-2 transition-colors duration-300 hover:text-[rgb(var(--gold))]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-4">
              Contato
            </p>
            <ul className="mt-6 flex flex-col gap-3.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.9375rem] text-ink-2 transition-colors duration-300 hover:text-[rgb(var(--gold))]"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("default")}
                  {...externalLinkProps}
                  className="group/link inline-flex items-center gap-1 text-[0.9375rem] text-ink-2 transition-colors duration-300 hover:text-[rgb(var(--gold))]"
                >
                  {site.phone}
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    aria-hidden
                  />
                </a>
              </li>
              <li className="text-[0.9375rem] text-ink-3">{site.serviceArea}</li>
            </ul>

            <a
              href={whatsappLink("dono")}
              {...externalLinkProps}
              className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] text-ink underline decoration-[rgb(var(--gold))] decoration-1 underline-offset-4 transition-colors duration-300 hover:text-[rgb(var(--gold))]"
            >
              Falar com o dono
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-8 text-[0.8125rem] text-ink-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Todos os direitos
            reservados.
          </p>
          <p>{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
