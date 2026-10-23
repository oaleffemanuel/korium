import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, Zap } from "lucide-react";

import { Planejador } from "@/components/planejador/planejador";
import { Wordmark } from "@/components/site/logo";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { ANO_REFERENCIA } from "@/lib/planejador/tabelas/parametros";
import { externalLinkProps, site, whatsappLink } from "@/lib/site";

const TITLE = "Planejador de CNPJ — qual regime tributário paga menos";
const DESCRIPTION =
  "Compare MEI, Simples Nacional, Lucro Presumido e Lucro Real a partir do seu CNAE, faturamento e folha. Veja o anexo do Simples, o Fator R e a Reforma Tributária até 2033. PDF com a sua marca, grátis.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · Korium` },
  description: DESCRIPTION,
  alternates: { canonical: "/planejador/" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${site.url}/planejador/` },
};

/**
 * A calculadora usa uma identidade própria, mais próxima das ferramentas do
 * mercado (fundo claro, azul de ação, Inter). O wrapper `.pc` troca também as
 * variáveis que os componentes compartilhados do site leem (marca, botão
 * flutuante), sem alterar nada fora desta rota.
 */
const TEMA = {
  "--canvas": "246 248 251",
  "--surface": "255 255 255",
  "--surface-2": "238 242 247",
  "--ink": "15 23 42",
  "--ink-2": "71 85 105",
  "--ink-3": "100 116 139",
  "--ink-4": "148 163 184",
  "--gold": "37 99 235",
  "--gold-bright": "29 78 216",
  "--gold-tint": "239 244 255",
  "--line": "229 233 240",
  "--line-strong": "203 213 225",
  "--navy": "37 99 235",
  "--navy-2": "29 78 216",
  "--on-navy": "255 255 255",
} as React.CSSProperties;

const SELOS = [
  { Icone: Zap, texto: "Resultado em um minuto" },
  { Icone: Lock, texto: "Seus dados não saem do navegador" },
  { Icone: ShieldCheck, texto: `Tabelas oficiais de ${ANO_REFERENCIA}` },
];

export default function PlanejadorPage() {
  return (
    <div className="pc min-h-screen bg-pc-bg text-pc-text" style={TEMA}>
      <header className="border-b border-pc-border bg-white">
        <div className="container-k flex h-16 items-center justify-between">
          <Link href="/" aria-label="Voltar para a página inicial da Korium">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-pc-text-2 transition-colors hover:text-pc-text"
          >
            <ArrowLeft className="size-4" aria-hidden /> korium.co
          </Link>
        </div>
      </header>

      <main id="conteudo" className="pb-20 pt-10 md:pb-28 md:pt-14">
        <div className="container-k">
          <div className="mx-auto max-w-[44rem] text-center">
            <span className="inline-flex items-center rounded-full bg-pc-primary-soft px-3 py-1 text-[0.75rem] font-semibold text-pc-primary">
              Planejador de CNPJ · grátis
            </span>
            <h1 className="mt-5 text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] text-pc-text md:text-[2.75rem]">
              Qual regime faz a sua empresa pagar menos imposto?
            </h1>
            <p className="mx-auto mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-pc-text-2 md:text-[1.125rem]">
              Informe o que a empresa faz e quanto fatura. Você vê MEI, Simples Nacional, Lucro Presumido e Lucro Real lado a lado, com a memória de cálculo e um PDF com a sua marca.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.8125rem] font-medium text-pc-text-2">
              {SELOS.map(({ Icone, texto }) => (
                <li key={texto} className="inline-flex items-center gap-1.5">
                  <Icone className="size-4 text-pc-primary" aria-hidden /> {texto}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 md:mt-12">
            <Planejador />
          </div>
        </div>
      </main>

      <footer className="border-t border-pc-border bg-white py-8">
        <div className="container-k flex flex-col gap-4 text-[0.8125rem] leading-relaxed text-pc-muted md:flex-row md:items-start md:justify-between">
          <p className="max-w-[64ch]">
            Simulação educativa baseada na LC 123/2006, na legislação do IRPJ, CSLL, PIS e COFINS e na LC 214/2025, com as tabelas vigentes em {ANO_REFERENCIA}. Os valores são estimativas: a escolha do regime depende de elegibilidade, da atividade exercida de fato e da análise de um contador. Seus dados e a sua logo não saem do navegador.
          </p>
          <p className="shrink-0">
            {site.legalName} ·{" "}
            <a href={whatsappLink("default")} {...externalLinkProps} className="font-medium text-pc-text-2 underline-offset-4 hover:underline">
              WhatsApp
            </a>
          </p>
        </div>
      </footer>
      <WhatsAppFab />
    </div>
  );
}
