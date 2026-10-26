"use client";

import * as React from "react";
import { ArrowUpRight, Check, Download, Loader2 } from "lucide-react";

import { Botao } from "@/components/planejador/campos";
import type { DadosEmpresa } from "@/components/planejador/planejador";
import { Reforma, useProjecaoReforma } from "@/components/planejador/reforma";
import { NOME_ATIVIDADE } from "@/lib/planejador/cnae";
import { explicarVencedor } from "@/lib/planejador/explicar";
import { brl, pct } from "@/lib/planejador/money";
import { NOME_TRIBUTO } from "@/lib/planejador/nomes";
import { NOME_REGIME, type Comparativo } from "@/lib/planejador/simular";
import type { ResultadoRegime } from "@/lib/planejador/types";
import { mensagemWhatsApp } from "@/lib/planejador/whatsapp";
import { externalLinkProps, site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export { NOME_TRIBUTO } from "@/lib/planejador/nomes";

type Aba = "resumo" | "folha" | "reforma" | "memoria";

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
  const [aba, setAba] = React.useState<Aba>("resumo");
  const [gerando, setGerando] = React.useState(false);
  const [erroPdf, setErroPdf] = React.useState<string | null>(null);
  const porque = React.useMemo(() => explicarVencedor(comparativo), [comparativo]);

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
      a.download = `Planejador-CNPJ-${site.name.replace(/\s+/g, "-")}-${nome}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (e) {
      console.error(e);
      setErroPdf("Não foi possível gerar o PDF. Tente de novo ou fale com a gente pelo WhatsApp.");
    } finally {
      setGerando(false);
    }
  }

  const abas: Array<[Aba, string, string]> = [
    ["resumo", "Resumo", "Os quatro regimes e por que o indicado vence"],
    ["folha", "Folha e CNAE", "O Fator R e o enquadramento da atividade"],
    ["reforma", "Reforma 2027–2033", "O custo de cada caminho, ano a ano"],
    ["memoria", "Memória de cálculo", "Cada tributo, para conferir com o contador"],
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------------ veredito */}
      <section className="overflow-hidden rounded-2xl border border-pc-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.18)]">
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="p-6 md:p-8">
            <p className="text-[0.8125rem] font-medium text-pc-muted">
              Com {brl(entrada.receitaAnual / 12)} por mês
              {empresa.cnae ? ` em ${empresa.cnae.descricao.toLowerCase()}` : ` em ${NOME_ATIVIDADE[entrada.atividade].toLowerCase()}`}, sua empresa paga menos no
            </p>
            {recomendado ? (
              <>
                <h2 className="mt-2 text-[2rem] font-bold leading-[1.05] tracking-[-0.025em] text-pc-text md:text-[2.75rem]">
                  {NOME_REGIME[recomendado.regime]}
                  {recomendado.simples ? (
                    <span className="mt-1 block text-[0.55em] font-semibold tracking-normal text-pc-primary">Anexo {recomendado.simples.anexo}</span>
                  ) : null}
                </h2>
                <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-4">
                  <div>
                    <div className="text-[2.75rem] font-bold leading-none tabular-nums tracking-[-0.03em] text-pc-primary md:text-[3.25rem]">
                      {brl(recomendado.totalGeralAnual / 12)}
                    </div>
                    <div className="mt-1.5 text-[0.8125rem] font-medium text-pc-muted">por mês, impostos e encargos</div>
                  </div>
                  <div>
                    <div className="text-[1.5rem] font-semibold leading-none tabular-nums tracking-[-0.02em] text-pc-text">
                      {brl(recomendado.totalGeralAnual)}
                    </div>
                    <div className="mt-1.5 text-[0.8125rem] font-medium text-pc-muted">por ano · {pct(recomendado.cargaEfetiva, 1)} da receita</div>
                  </div>
                </div>
                {segundo ? (
                  <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-pc-success-soft px-3.5 py-1.5 text-[0.875rem] font-semibold text-pc-success">
                    <Check className="size-4" strokeWidth={3} /> Economia de {brl(economiaAnual)} por ano frente ao {NOME_REGIME[segundo.regime]}
                  </p>
                ) : null}
                {porque[1] ? <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-pc-text-2">{porque[1]}</p> : null}
              </>
            ) : (
              <p className="mt-4 text-pc-text-2">Nenhum regime elegível com os dados informados. Revise a receita e a atividade.</p>
            )}
          </div>
          <div className="border-t border-pc-border bg-pc-bg p-6 lg:border-l lg:border-t-0 md:p-8">
            <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-pc-muted">Custo por ano, lado a lado</h3>
            <Barras resultados={resultados} recomendado={recomendado} />
            <p className="mt-4 text-[0.75rem] leading-relaxed text-pc-muted">
              Tributos da empresa mais encargos sobre folha e pró-labore. Não entram INSS do sócio, FGTS e ICMS fora do Simples.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ abas */}
      <section className="rounded-2xl border border-pc-border bg-white">
        <div role="tablist" aria-label="Detalhes do resultado" className="flex gap-1 overflow-x-auto border-b border-pc-border p-1.5">
          {abas.map(([id, rotulo, desc]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={aba === id}
              onClick={() => setAba(id)}
              title={desc}
              className={cn(
                "whitespace-nowrap rounded-lg px-3.5 py-2 text-[0.875rem] font-semibold transition-colors",
                aba === id ? "bg-pc-text text-white" : "text-pc-text-2 hover:bg-pc-bg hover:text-pc-text",
              )}
            >
              {rotulo}
            </button>
          ))}
        </div>
        <div className="p-5 md:p-7">
          <p className="mb-5 text-[0.9375rem] text-pc-text-2">{abas.find(([id]) => id === aba)?.[2]}.</p>

          {aba === "resumo" ? (
            <div className="flex flex-col gap-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {resultados.map((r) => (
                  <CardRegime key={r.regime} r={r} recomendado={r === recomendado} />
                ))}
              </div>
              {porque.length ? (
                <div className="rounded-xl bg-pc-bg p-5">
                  <h3 className="text-[1rem] font-semibold text-pc-text">Por que o indicado vence</h3>
                  <ul className="mt-3 flex flex-col gap-2 text-[0.9375rem] leading-relaxed text-pc-text-2">
                    {porque.map((f, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-pc-primary" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {aba === "folha" ? (
            <div className="grid gap-5 md:grid-cols-2">
              {simples?.simples?.fatorR != null && simples.simples.fatorRAtingido !== null ? (
                <Bloco titulo="Fator R: a folha decide o anexo">
                  <div className="mb-3 flex items-end gap-3">
                    <span className="text-[2.25rem] font-bold leading-none tabular-nums tracking-[-0.03em] text-pc-text">
                      {pct(simples.simples.fatorR, 1)}
                    </span>
                    <span className="pb-1 text-[0.8125rem] text-pc-muted">da receita vai para folha e pró-labore · limite 28 %</span>
                  </div>
                  <Medidor valor={simples.simples.fatorR} limite={0.28} />
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-pc-text-2">
                    {simples.simples.fatorRAtingido ? (
                      <>Acima de 28 %, a atividade é tributada pelo <strong className="font-semibold text-pc-text">Anexo III</strong>, o mais barato dos dois.</>
                    ) : (
                      <>
                        Abaixo de 28 %, a atividade cai no <strong className="font-semibold text-pc-text">Anexo V</strong>. Com mais{" "}
                        <strong className="font-semibold text-pc-text">{brl((simples.simples.folhaParaFatorR ?? 0) / 12)} por mês</strong> de pró-labore ou folha ela migraria para o Anexo III. Às vezes pagar mais pró-labore reduz o imposto total.
                      </>
                    )}
                  </p>
                </Bloco>
              ) : (
                <Bloco titulo="Fator R">
                  <p className="text-[0.9375rem] leading-relaxed text-pc-text-2">
                    A atividade informada não depende do Fator R: o anexo do Simples é fixo para ela.
                  </p>
                </Bloco>
              )}
              <Bloco titulo={empresa.cnae ? "Sobre o CNAE escolhido" : "Sobre a atividade"}>
                <dl className="grid gap-x-6 gap-y-3 text-[0.9375rem] sm:grid-cols-2">
                  {empresa.cnae ? <Par rotulo="Código" valor={<span className="font-mono">{empresa.cnae.cnae}</span>} /> : null}
                  <Par rotulo="Natureza" valor={NOME_ATIVIDADE[entrada.atividade]} />
                  <Par
                    rotulo="Anexo do Simples"
                    valor={
                      simples?.simples
                        ? `Anexo ${simples.simples.anexo}${simples.simples.fatorRAtingido !== null ? ` (Fator R ${simples.simples.fatorRAtingido ? "atingido" : "abaixo de 28 %"})` : ""}`
                        : "—"
                    }
                  />
                  {empresa.cnae ? <Par rotulo="Base legal" valor={empresa.cnae.fonte} /> : null}
                </dl>
                {empresa.cnae?.impeditivo ? (
                  <Aviso tom="erro">Este CNAE consta da lista de atividades impeditivas ao Simples Nacional ({empresa.cnae.impeditivo.fonte}).</Aviso>
                ) : null}
                {empresa.cnae?.ambiguo ? (
                  <Aviso tom="alerta">Este CNAE pode ou não ser aceito no Simples, conforme a atividade exercida de fato ({empresa.cnae.ambiguo.fonte}). {empresa.cnae.ambiguo.condicao}</Aviso>
                ) : null}
                {empresa.cnae?.nota ? <Aviso>{empresa.cnae.nota}</Aviso> : null}
              </Bloco>
            </div>
          ) : null}

          {aba === "reforma" ? <Reforma comparativo={comparativo} projecao={projecao} onCenario={setCenarioId} embutido /> : null}

          {aba === "memoria" ? (
            <div className="flex flex-col gap-3">
              <p className="text-[0.8125rem] text-pc-muted">Receita constante ao longo do ano, com a receita anual como RBT12. Alíquotas e tabelas de 2026.</p>
              {resultados
                .filter((r) => r.elegivel)
                .map((r) => (
                  <details key={r.regime} className="group rounded-xl border border-pc-border" open={r === recomendado}>
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[0.9375rem] font-semibold text-pc-text [&::-webkit-details-marker]:hidden">
                      {NOME_REGIME[r.regime]}
                      {r.simples ? <span className="ml-1.5 text-[0.8125rem] font-medium text-pc-muted">Anexo {r.simples.anexo}, faixa {r.simples.faixa}</span> : null}
                      <span className="ml-auto text-[0.875rem] font-medium tabular-nums text-pc-text-2">{brl(r.totalGeralAnual)} / ano</span>
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
                              <td className="py-2 pr-3 text-right tabular-nums text-pc-muted">{l.sobreReceita > 0 ? pct(l.sobreReceita) : "—"}</td>
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
          ) : null}
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA */}
      <section className="rounded-2xl bg-pc-text p-7 text-white md:p-9">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-[1.375rem] font-bold tracking-[-0.015em] md:text-[1.625rem]">Leve isto para a conversa.</h3>
            <p className="mt-1.5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-white/75">
              O PDF traz tudo o que está aqui, com a sua marca. Se quiser que a {site.name} confirme o cenário com os seus números reais, é só mandar.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Botao type="button" onClick={baixarPdf} disabled={gerando} className="bg-white text-pc-text shadow-none hover:bg-pc-bg">
              {gerando ? <Loader2 className="animate-spin" /> : <Download />}
              {gerando ? "Gerando…" : "Baixar o PDF"}
            </Botao>
            <a
              href={whatsappLink(mensagemWhatsApp(comparativo, { empresa: empresa.nome || undefined, cnae: empresa.cnae?.cnae }))}
              {...externalLinkProps}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-pc-primary px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-pc-primary-hover [&_svg]:size-4"
            >
              {site.ctaLabel ?? "Falar com a Korium"} <ArrowUpRight />
            </a>
          </div>
        </div>
        {erroPdf ? <p className="mt-3 text-[0.8125rem] text-white/90">{erroPdf}</p> : null}
      </section>
    </div>
  );
}

function Barras({ resultados, recomendado }: { resultados: ResultadoRegime[]; recomendado: ResultadoRegime | null }) {
  const eleg = resultados.filter((r) => r.elegivel);
  const max = Math.max(...eleg.map((r) => r.totalGeralAnual), 1);
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {resultados.map((r) => {
        const rec = r === recomendado;
        const w = r.elegivel ? Math.max(3, (r.totalGeralAnual / max) * 100) : 0;
        return (
          <li key={r.regime}>
            <div className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
              <span className={cn("font-medium", rec ? "text-pc-text" : "text-pc-text-2")}>
                {NOME_REGIME[r.regime]}
                {r.simples ? <span className="text-pc-muted"> · Anexo {r.simples.anexo}</span> : null}
              </span>
              <span className={cn("tabular-nums", r.elegivel ? (rec ? "font-bold text-pc-success" : "font-medium text-pc-text") : "text-pc-muted")}>
                {r.elegivel ? brl(r.totalGeralAnual) : "não elegível"}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-pc-border">
              <div
                className={cn("h-full rounded-full transition-[width] duration-700", rec ? "bg-pc-success" : "bg-pc-primary/45")}
                style={{ width: `${w}%` }}
              />
            </div>
            {!r.elegivel && r.avisos[0] ? <p className="mt-1 text-[0.75rem] text-pc-muted">{r.avisos[0]}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}

function Medidor({ valor, limite }: { valor: number; limite: number }) {
  const max = Math.max(0.5, valor * 1.2);
  const v = Math.min(100, (valor / max) * 100);
  const l = (limite / max) * 100;
  return (
    <div className="relative h-3 w-full rounded-full bg-pc-bg ring-1 ring-pc-border">
      <div className={cn("h-full rounded-full", valor >= limite ? "bg-pc-success" : "bg-pc-warning")} style={{ width: `${v}%` }} />
      <div className="absolute -top-1 bottom-[-4px] w-0.5 bg-pc-text" style={{ left: `${l}%` }} aria-hidden />
      <span className="absolute top-4 -translate-x-1/2 text-[0.6875rem] font-semibold text-pc-text" style={{ left: `${l}%` }}>
        28 %
      </span>
    </div>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-pc-border p-5">
      <h3 className="text-[1rem] font-semibold text-pc-text">{titulo}</h3>
      <div className="mt-3">{children}</div>
    </div>
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
        recomendado && "border-pc-success ring-[3px] ring-pc-success/15",
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
          <div className="mt-4 text-[1.5rem] font-bold tabular-nums tracking-[-0.02em] text-pc-text">{brl(r.totalGeralAnual / 12)}<span className="text-[0.875rem] font-medium text-pc-muted"> /mês</span></div>
          <div className="mt-0.5 text-[0.8125rem] text-pc-muted">
            {brl(r.totalGeralAnual)} por ano · {pct(r.cargaEfetiva, 1)} da receita
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
