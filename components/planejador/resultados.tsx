"use client";

import * as React from "react";
import { ArrowUpRight, Check, Download, Info, Loader2, TrendingDown } from "lucide-react";

import { Botao } from "@/components/planejador/campos";
import type { DadosEmpresa } from "@/components/planejador/planejador";
import { Reforma, useProjecaoReforma } from "@/components/planejador/reforma";
import { NOME_ATIVIDADE } from "@/lib/planejador/cnae";
import { brl, pct } from "@/lib/planejador/money";
import { NOME_REGIME, type Comparativo } from "@/lib/planejador/simular";
import { NOME_TRIBUTO } from "@/lib/planejador/nomes";
import type { ResultadoRegime } from "@/lib/planejador/types";
import { mensagemWhatsApp } from "@/lib/planejador/whatsapp";
import { externalLinkProps, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export { NOME_TRIBUTO } from "@/lib/planejador/nomes";

export function Resultados({
  comparativo,
  empresa,
}: {
  comparativo: Comparativo;
  empresa: DadosEmpresa;
}) {
  const { resultados, recomendado, segundo, economiaAnual, entrada } = comparativo;
  const simples = resultados.find((r) => r.regime === "SIMPLES");
  const { projecao, setCenarioId } = useProjecaoReforma(comparativo);
  const [gerando, setGerando] = React.useState(false);
  const [erroPdf, setErroPdf] = React.useState<string | null>(null);

  async function baixarPdf() {
    setGerando(true);
    setErroPdf(null);
    try {
      const { gerarPdf } = await import("@/components/planejador/pdf/gerar");
      const blob = await gerarPdf({ comparativo, empresa, projecao });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const nome = (empresa.nome || "empresa").normalize("NFD").replace(/[^\w-]+/g, "-");
      a.download = `Planejador-CNPJ-Korium-${nome}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (e) {
      console.error(e);
      setErroPdf("Não foi possível gerar o PDF. Tente de novo ou fale com a gente pelo WhatsApp.");
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Veredito */}
      <section className="overflow-hidden rounded-2xl border border-pc-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]">
        <div className="h-1.5 bg-pc-primary" />
        <div className="p-6 md:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pc-success-soft px-2.5 py-1 text-[0.75rem] font-semibold text-pc-success">
            <Check className="size-3.5" strokeWidth={3} /> Regime indicado
          </span>
          {recomendado ? (
            <>
              <h2 className="mt-4 text-[1.75rem] font-bold tracking-[-0.02em] text-pc-text md:text-[2.25rem]">
                {NOME_REGIME[recomendado.regime]}
                {recomendado.simples ? (
                  <span className="text-pc-primary"> · Anexo {recomendado.simples.anexo}</span>
                ) : null}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Metrica rotulo="Por ano" valor={brl(recomendado.totalGeralAnual)} destaque />
                <Metrica rotulo="Por mês" valor={brl(recomendado.totalGeralAnual / 12)} />
                <Metrica rotulo="Da receita" valor={pct(recomendado.cargaEfetiva, 1)} />
              </div>
              {segundo ? (
                <div className="mt-6 flex flex-col gap-3 rounded-xl bg-pc-success-soft px-4 py-3.5 sm:flex-row sm:items-center">
                  <span className="inline-flex items-center gap-2 text-[1rem] font-bold text-pc-success">
                    <TrendingDown className="size-5" /> Economia de {brl(economiaAnual)} por ano
                  </span>
                  <span className="text-[0.875rem] text-pc-text-2">
                    frente ao {NOME_REGIME[segundo.regime]}, a segunda opção.
                  </span>
                </div>
              ) : null}
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-pc-muted">
                Receita de {brl(entrada.receitaAnual)} por ano, folha de {brl(entrada.folhaAnual)} e pró-labore de{" "}
                {brl(entrada.proLaboreAnual)}.
              </p>
            </>
          ) : (
            <p className="mt-4 text-pc-text-2">
              Nenhum regime elegível com os dados informados. Revise a receita e a atividade.
            </p>
          )}
        </div>
      </section>

      {/* Cards */}
      <section>
        <Titulo>Os quatro regimes, lado a lado</Titulo>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {resultados.map((r) => (
            <CardRegime key={r.regime} r={r} recomendado={r === recomendado} />
          ))}
        </div>
        <p className="mt-3 flex gap-2 text-[0.8125rem] leading-relaxed text-pc-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Os totais somam os tributos da empresa e os encargos patronais sobre folha e pró-labore, que mudam de regime para regime. INSS do sócio, FGTS e ICMS fora do Simples não entram.
        </p>
      </section>

      {/* Fator R */}
      {simples?.simples?.fatorR != null && simples.simples.fatorRAtingido !== null ? (
        <Painel titulo="Fator R: a folha decide o anexo">
          <p className="text-[0.9375rem] leading-relaxed text-pc-text-2">
            Sua folha mais pró-labore representa{" "}
            <strong className="font-semibold text-pc-text">{pct(simples.simples.fatorR, 1)}</strong> da receita.{" "}
            {simples.simples.fatorRAtingido ? (
              <>Como está acima de 28 %, a atividade é tributada pelo <strong className="font-semibold text-pc-text">Anexo III</strong>, o mais barato dos dois.</>
            ) : (
              <>
                Abaixo de 28 %, a atividade cai no <strong className="font-semibold text-pc-text">Anexo V</strong>. Com mais{" "}
                <strong className="font-semibold text-pc-text">{brl(simples.simples.folhaParaFatorR ?? 0)}</strong> por ano de folha ou pró-labore ela migraria para o Anexo III. Vale a conta: às vezes aumentar o pró-labore reduz o imposto total.
              </>
            )}
          </p>
        </Painel>
      ) : null}

      {/* CNAE */}
      {empresa.cnae ? (
        <Painel titulo="Sobre o CNAE escolhido">
          <dl className="grid gap-x-8 gap-y-3 text-[0.9375rem] sm:grid-cols-2">
            <Par rotulo="Código" valor={<span className="font-mono">{empresa.cnae.cnae}</span>} />
            <Par rotulo="Natureza" valor={NOME_ATIVIDADE[empresa.cnae.atividade]} />
            <Par
              rotulo="Anexo do Simples"
              valor={
                empresa.cnae.sujeitoFatorR && simples?.simples
                  ? `Anexo ${simples.simples.anexo} (Fator R ${simples.simples.fatorRAtingido ? "atingido" : "abaixo de 28 %"})`
                  : `Anexo ${empresa.cnae.anexoBase}`
              }
            />
            <Par rotulo="Base legal" valor={empresa.cnae.fonte} />
          </dl>
          {empresa.cnae.impeditivo ? (
            <Aviso tom="erro">
              Este CNAE consta da lista de atividades impeditivas ao Simples Nacional ({empresa.cnae.impeditivo.fonte}). O Simples não está disponível para ele.
            </Aviso>
          ) : null}
          {empresa.cnae.ambiguo ? (
            <Aviso tom="alerta">
              Este CNAE pode ou não ser aceito no Simples, dependendo da atividade exercida de fato ({empresa.cnae.ambiguo.fonte}). {empresa.cnae.ambiguo.condicao}
            </Aviso>
          ) : null}
          {empresa.cnae.nota ? <Aviso>{empresa.cnae.nota}</Aviso> : null}
        </Painel>
      ) : null}

      {/* Reforma */}
      <Reforma comparativo={comparativo} projecao={projecao} onCenario={setCenarioId} />

      {/* Memória */}
      <section>
        <Titulo>Memória de cálculo</Titulo>
        <div className="mt-4 flex flex-col gap-3">
          {resultados
            .filter((r) => r.elegivel)
            .map((r) => (
              <details key={r.regime} className="group rounded-xl border border-pc-border bg-white">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[0.9375rem] font-semibold text-pc-text [&::-webkit-details-marker]:hidden">
                  {NOME_REGIME[r.regime]}
                  <span className="text-[0.875rem] font-medium tabular-nums text-pc-text-2">{brl(r.totalGeralAnual)} / ano</span>
                </summary>
                <div className="border-t border-pc-border px-5 py-4">
                  <table className="w-full text-[0.875rem]">
                    <tbody>
                      {r.linhas.map((l, i) => (
                        <tr key={`${l.tributo}-${i}`} className="border-b border-pc-border/70 last:border-0">
                          <td className="py-2 pr-3 text-pc-text-2">
                            {NOME_TRIBUTO[l.tributo]}
                            {l.nota ? <span className="block text-[0.75rem] text-pc-muted">{l.nota}</span> : null}
                          </td>
                          <td className="py-2 pr-3 text-right tabular-nums text-pc-muted">
                            {l.sobreReceita > 0 ? pct(l.sobreReceita) : "—"}
                          </td>
                          <td className="py-2 text-right font-medium tabular-nums text-pc-text">{brl(l.valorAnual)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <ol className="mt-4 flex flex-col gap-2 text-[0.8125rem] leading-relaxed text-pc-text-2">
                    {r.memoria.map((m, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="shrink-0 tabular-nums text-pc-muted">{i + 1}.</span>
                        {m}
                      </li>
                    ))}
                  </ol>
                  {r.avisos.length ? (
                    <ul className="mt-4 flex flex-col gap-2">
                      {r.avisos.map((a) => (
                        <li key={a} className="text-[0.8125rem] leading-relaxed text-pc-muted">• {a}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </details>
            ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-pc-primary p-7 text-white md:p-9">
        <h3 className="text-[1.5rem] font-bold tracking-[-0.015em] md:text-[1.75rem]">
          Leve isto para a conversa. Com a sua marca.
        </h3>
        <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-white/85">
          O PDF traz o comparativo, a memória de cálculo, a Reforma e os próximos passos. Se quiser que a Korium confirme o cenário com os seus números reais, é só mandar no WhatsApp.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Botao type="button" onClick={baixarPdf} disabled={gerando} className="bg-white text-pc-primary shadow-none hover:bg-pc-primary-soft">
            {gerando ? <Loader2 className="animate-spin" /> : <Download />}
            {gerando ? "Gerando o PDF…" : "Baixar o relatório em PDF"}
          </Botao>
          <a
            href={whatsappLink(mensagemWhatsApp(comparativo, { empresa: empresa.nome || undefined, cnae: empresa.cnae?.cnae }))}
            {...externalLinkProps}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/40 px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white/10 [&_svg]:size-4"
          >
            Falar com a Korium <ArrowUpRight />
          </a>
        </div>
        {erroPdf ? <p className="mt-3 text-[0.8125rem] text-white/90">{erroPdf}</p> : null}
      </section>
    </div>
  );
}

function Metrica({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className={cn("rounded-xl px-4 py-3.5", destaque ? "bg-pc-primary-soft" : "bg-pc-bg")}>
      <div className="text-[0.75rem] font-medium text-pc-muted">{rotulo}</div>
      <div className={cn("mt-1 text-[1.5rem] font-bold tabular-nums tracking-[-0.02em]", destaque ? "text-pc-primary" : "text-pc-text")}>
        {valor}
      </div>
    </div>
  );
}

export function Titulo({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[1.125rem] font-semibold tracking-[-0.01em] text-pc-text">{children}</h2>;
}

export function Painel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-pc-border bg-white p-6 md:p-7">
      <Titulo>{titulo}</Titulo>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Par({ rotulo, valor }: { rotulo: string; valor: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.75rem] font-medium text-pc-muted">{rotulo}</dt>
      <dd className="text-pc-text">{valor}</dd>
    </div>
  );
}

function Aviso({ children, tom = "neutro" }: { children: React.ReactNode; tom?: "neutro" | "alerta" | "erro" }) {
  return (
    <p
      className={cn(
        "mt-4 rounded-[10px] px-3.5 py-3 text-[0.8125rem] leading-relaxed",
        tom === "erro" && "bg-pc-danger-soft text-pc-danger",
        tom === "alerta" && "bg-pc-warning-soft text-pc-warning",
        tom === "neutro" && "bg-pc-bg text-pc-text-2",
      )}
    >
      {children}
    </p>
  );
}

function CardRegime({ r, recomendado }: { r: ResultadoRegime; recomendado: boolean }) {
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl border p-5",
        r.elegivel ? "border-pc-border bg-white" : "border-dashed border-pc-border bg-transparent",
        recomendado && "border-pc-primary ring-[3px] ring-pc-primary/15",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1rem] font-semibold text-pc-text">
          {NOME_REGIME[r.regime]}
          {r.simples ? <span className="ml-1.5 text-[0.8125rem] font-medium text-pc-muted">Anexo {r.simples.anexo}</span> : null}
        </h3>
        {recomendado ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-pc-success-soft px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-pc-success">
            <Check className="size-3" strokeWidth={3} /> Indicado
          </span>
        ) : null}
      </div>
      {r.elegivel ? (
        <>
          <div className="mt-4 text-[1.625rem] font-bold tabular-nums tracking-[-0.02em] text-pc-text">{brl(r.totalGeralAnual)}</div>
          <div className="mt-0.5 text-[0.8125rem] text-pc-muted">
            por ano · {brl(r.totalGeralAnual / 12)}/mês · {pct(r.cargaEfetiva, 1)} da receita
          </div>
          {r.simples ? (
            <div className="mt-3 text-[0.8125rem] leading-relaxed text-pc-text-2">
              Alíquota efetiva de <strong className="font-semibold text-pc-text">{pct(r.simples.aliquotaEfetiva)}</strong> na faixa {r.simples.faixa}
              {r.encargosFolhaAnual > 0 ? <> + {brl(r.encargosFolhaAnual)} de encargos fora do DAS</> : null}.
            </div>
          ) : r.encargosFolhaAnual > 0 ? (
            <div className="mt-3 text-[0.8125rem] leading-relaxed text-pc-text-2">
              Tributos {brl(r.totalAnual)} + encargos sobre folha {brl(r.encargosFolhaAnual)}.
            </div>
          ) : null}
        </>
      ) : (
        <ul className="mt-4 flex flex-col gap-1.5 text-[0.8125rem] leading-relaxed text-pc-muted">
          {r.avisos.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
