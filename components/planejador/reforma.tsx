"use client";

import * as React from "react";

import { brl, pct } from "@/lib/planejador/money";
import {
  NOME_REGIME_REFORMA,
  projetarReforma,
  type ProjecaoReforma,
  type RegimeReforma,
} from "@/lib/planejador/reforma";
import type { Comparativo } from "@/lib/planejador/simular";
import { CENARIOS } from "@/lib/planejador/tabelas/reforma";
import { cn } from "@/lib/utils";

const REGIMES: RegimeReforma[] = ["SIMPLES", "SIMPLES_HIBRIDO", "LUCRO_PRESUMIDO", "LUCRO_REAL"];

export function Reforma({
  comparativo,
  projecao,
  onCenario,
  embutido = false,
}: {
  comparativo: Comparativo;
  projecao: ProjecaoReforma;
  onCenario: (id: (typeof CENARIOS)[number]["id"]) => void;
  /** Dentro de uma aba: sem o cartão externo. */
  embutido?: boolean;
}) {
  const disponiveis = REGIMES.filter((r) => projecao.anos.some((a) => a.custos[r] !== null));
  const hoje = comparativo.recomendado;

  return (
    <section className={cn(!embutido && "rounded-2xl border border-pc-border bg-white p-6 md:p-7")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[1.125rem] font-semibold tracking-[-0.01em] text-pc-text">Reforma Tributária: 2026 a 2033</h2>
          <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-pc-text-2">
            PIS, COFINS, ICMS e ISS dão lugar à CBS e ao IBS. O custo anual estimado de cada caminho, ano a ano, com a alíquota cheia do cenário escolhido e {projecao.reducao.rotulo}.
          </p>
        </div>
        <label className="flex shrink-0 flex-col gap-1.5 text-[0.75rem] font-medium text-pc-muted">
          Cenário de alíquota (estimativa)
          <select
            value={projecao.cenario.id}
            onChange={(e) => onCenario(e.target.value as (typeof CENARIOS)[number]["id"])}
            className="h-10 rounded-[10px] border border-pc-border bg-white px-3 text-[0.875rem] font-normal text-pc-text focus:border-pc-primary focus:outline-none focus:ring-[3px] focus:ring-pc-primary/20"
          >
            {CENARIOS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-pc-border">
        <table className="w-full min-w-[36rem] text-[0.8125rem]">
          <thead className="bg-pc-bg">
            <tr className="text-left text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-pc-muted">
              <th className="px-3 py-2.5">Ano</th>
              {disponiveis.map((r) => (
                <th key={r} className="px-3 py-2.5 text-right">
                  {NOME_REGIME_REFORMA[r]}
                </th>
              ))}
              <th className="px-3 py-2.5 text-right">CBS + IBS</th>
            </tr>
          </thead>
          <tbody>
            {projecao.anos.map((a, i) => (
              <tr key={a.ano} className={cn("border-t border-pc-border", i % 2 === 1 && "bg-pc-bg/60")}>
                <td className="px-3 py-2.5 font-medium text-pc-text">
                  {a.ano}
                  {a.status !== "LEI" ? <span className="ml-0.5 text-pc-muted" title="IBS crescente por premissa">*</span> : null}
                </td>
                {disponiveis.map((r) => (
                  <td
                    key={r}
                    className={cn(
                      "px-3 py-2.5 text-right tabular-nums",
                      a.melhor === r ? "font-semibold text-pc-success" : "text-pc-text-2",
                    )}
                  >
                    {a.custos[r] === null ? "—" : brl(a.custos[r]!)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-pc-muted">{pct(a.aliquotaIbsCbs, 1)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-pc-border bg-pc-bg">
              <td className="px-3 py-2.5 font-semibold text-pc-text">2027–2033</td>
              {disponiveis.map((r) => (
                <td
                  key={r}
                  className={cn(
                    "px-3 py-2.5 text-right tabular-nums",
                    projecao.melhorAcumulado === r ? "font-bold text-pc-success" : "font-medium text-pc-text",
                  )}
                >
                  {projecao.acumulado[r] === null ? "—" : brl(projecao.acumulado[r]!)}
                </td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {projecao.melhorAcumulado && hoje ? (
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-pc-text-2">
          Somando 2027 a 2033, o caminho mais barato é{" "}
          <strong className="font-semibold text-pc-text">{NOME_REGIME_REFORMA[projecao.melhorAcumulado]}</strong>
          {projecao.melhorAcumulado.startsWith("SIMPLES") === (hoje.regime === "SIMPLES")
            ? ", o mesmo rumo indicado para hoje."
            : ". Diferente do indicado para hoje: a troca pode valer a pena no meio do caminho, com a opção anual."}
        </p>
      ) : null}

      <ul className="mt-4 flex flex-col gap-2 text-[0.8125rem] leading-relaxed text-pc-muted">
        {projecao.notas.map((n) => (
          <li key={n}>• {n}</li>
        ))}
        <li>• * 2029–2032: ICMS/ISS reduzidos por lei (90 %, 80 %, 70 %, 60 %); a alíquota do IBS nesses anos será fixada pelo Senado, aqui estimada na mesma proporção. Fonte: {projecao.fonte}.</li>
      </ul>
    </section>
  );
}

export function useProjecaoReforma(comparativo: Comparativo) {
  const [cenarioId, setCenarioId] = React.useState<(typeof CENARIOS)[number]["id"]>(CENARIOS[0].id);
  const projecao = React.useMemo(
    () => projetarReforma(comparativo, CENARIOS.find((c) => c.id === cenarioId) ?? CENARIOS[0]),
    [comparativo, cenarioId],
  );
  return { projecao, setCenarioId };
}
