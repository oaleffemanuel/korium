import { brl, pct, round2 } from "./money";
import { aliquotaEfetiva, reparticaoEfetiva } from "./simples";
import type { Comparativo } from "./simular";
import {
  CENARIO_PADRAO,
  FONTE_REFORMA,
  REDUCAO_SETOR,
  TRANSICAO,
  type AnoTransicao,
  type CenarioReforma,
} from "./tabelas/reforma";
import { ANEXOS } from "./tabelas/simples";
import type { ResultadoRegime } from "./types";

export type RegimeReforma = "SIMPLES" | "SIMPLES_HIBRIDO" | "LUCRO_PRESUMIDO" | "LUCRO_REAL";

export const NOME_REGIME_REFORMA: Record<RegimeReforma, string> = {
  SIMPLES: "Simples unificado",
  SIMPLES_HIBRIDO: "Simples híbrido",
  LUCRO_PRESUMIDO: "Lucro Presumido",
  LUCRO_REAL: "Lucro Real",
};

export interface LinhaAno {
  ano: number;
  status: AnoTransicao["status"];
  nota: string;
  /** Custo total anual por regime; null quando o regime não está disponível. */
  custos: Record<RegimeReforma, number | null>;
  /** Alíquota combinada CBS + IBS aplicada à atividade (já com redução setorial). */
  aliquotaIbsCbs: number;
  melhor: RegimeReforma | null;
}

export interface ProjecaoReforma {
  cenario: CenarioReforma;
  setor: keyof typeof REDUCAO_SETOR;
  reducao: (typeof REDUCAO_SETOR)[keyof typeof REDUCAO_SETOR];
  anos: LinhaAno[];
  /** Soma 2027–2033 por regime (para comparar caminhos). */
  acumulado: Record<RegimeReforma, number | null>;
  melhorAcumulado: RegimeReforma | null;
  /** Crédito anual que os clientes PJ recuperam em 2033, por variante do Simples. */
  creditoClientes2033: { unificado: number; hibrido: number } | null;
  notas: string[];
  fonte: string;
}

function porTributo(r: ResultadoRegime, t: string): number {
  return r.linhas.filter((l) => l.tributo === t).reduce((a, l) => a + l.valorAnual, 0);
}

/** CBS + IBS devidos no ano, como fração da receita, antes da redução setorial. */
export function aliquotaAno(a: AnoTransicao, c: CenarioReforma): { cbs: number; ibs: number } {
  const cbs = Math.max(0, c.cbs * a.cbsFator - a.cbsReducaoPp);
  const ibs = a.ibsAbsoluto !== null ? a.ibsAbsoluto : c.ibs * a.ibsFator;
  return { cbs, ibs };
}

export function projetarReforma(
  c: Comparativo,
  cenario: CenarioReforma = CENARIO_PADRAO,
): ProjecaoReforma {
  const e = c.entrada;
  const rec = e.receitaAnual;
  const setor = e.setorReforma ?? "geral";
  const reducao = REDUCAO_SETOR[setor];
  const notas: string[] = [];

  const simples = c.resultados.find((r) => r.regime === "SIMPLES")!;
  const presumido = c.resultados.find((r) => r.regime === "LUCRO_PRESUMIDO")!;
  const real = c.resultados.find((r) => r.regime === "LUCRO_REAL")!;

  // Parcelas de 2026 que a Reforma substitui, por regime normal.
  const base = (r: ResultadoRegime) => ({
    fixo: r.totalGeralAnual - porTributo(r, "PIS") - porTributo(r, "COFINS") - porTributo(r, "ISS"),
    pisCofins: porTributo(r, "PIS") + porTributo(r, "COFINS"),
    iss: porTributo(r, "ISS"),
  });
  const bPres = presumido.elegivel ? base(presumido) : null;
  const bReal = real.elegivel ? base(real) : null;

  // Simples: repartição efetiva para separar o que vira CBS/IBS.
  let simplesInfo: {
    das: number;
    shareCbs: number;
    shareLocal: number;
    foraDas: number;
  } | null = null;
  if (simples.elegivel && simples.simples) {
    const tabela = ANEXOS[simples.simples.anexo];
    const { faixa, efetiva } = aliquotaEfetiva(tabela, rec);
    const rep = reparticaoEfetiva(tabela, faixa, efetiva);
    const shareCbs = ((rep.PIS ?? 0) + (rep.COFINS ?? 0)) / efetiva;
    const shareLocal = ((rep.ISS ?? 0) + (rep.ICMS ?? 0)) / efetiva;
    const das = simples.simples.dasMensal * 12;
    simplesInfo = {
      das,
      shareCbs,
      shareLocal,
      foraDas: simples.totalGeralAnual - das,
    };
  }

  const creditoInsumos = Math.min(1, Math.max(0, e.custosComCredito));

  const anos: LinhaAno[] = TRANSICAO.map((a) => {
    const { cbs, ibs } = aliquotaAno(a, cenario);
    const aliq = (cbs + ibs) * reducao.fator;
    // Débito sobre vendas menos crédito sobre compras de fornecedores do regime regular (alíquota padrão).
    const consumoRegular = Math.max(0, rec * aliq - rec * creditoInsumos * (cbs + ibs));
    const issAno = (r: { iss: number }) => r.iss * a.localFator;

    const custos: Record<RegimeReforma, number | null> = {
      SIMPLES: simples.elegivel ? simples.totalGeralAnual : null,
      SIMPLES_HIBRIDO: null,
      LUCRO_PRESUMIDO: null,
      LUCRO_REAL: null,
    };
    if (bPres) {
      custos.LUCRO_PRESUMIDO = round2(
        bPres.fixo + (a.pisCofins ? bPres.pisCofins : consumoRegular) + issAno(bPres),
      );
    }
    if (bReal) {
      custos.LUCRO_REAL = round2(
        bReal.fixo + (a.pisCofins ? bReal.pisCofins : consumoRegular) + issAno(bReal),
      );
    }
    if (simplesInfo && a.hibridoDisponivel) {
      // No híbrido, CBS e IBS saem do DAS; o restante do ICMS/ISS continua dentro até 2033.
      const parcelaIbs = simplesInfo.shareLocal * a.ibsNoDasFator;
      const dasHibrido = simplesInfo.das * (1 - simplesInfo.shareCbs - parcelaIbs);
      custos.SIMPLES_HIBRIDO = round2(simplesInfo.foraDas + dasHibrido + consumoRegular);
    } else if (simplesInfo) {
      custos.SIMPLES_HIBRIDO = custos.SIMPLES;
    }

    const disponiveis = (Object.entries(custos) as [RegimeReforma, number | null][]).filter(
      (x): x is [RegimeReforma, number] => x[1] !== null,
    );
    const melhor = disponiveis.length
      ? disponiveis.reduce((m, x) => (x[1] < m[1] ? x : m))[0]
      : null;

    return { ano: a.ano, status: a.status, nota: a.nota, custos, aliquotaIbsCbs: aliq, melhor };
  });

  const acumulado = {} as Record<RegimeReforma, number | null>;
  for (const r of ["SIMPLES", "SIMPLES_HIBRIDO", "LUCRO_PRESUMIDO", "LUCRO_REAL"] as RegimeReforma[]) {
    const vals = anos.filter((x) => x.ano >= 2027).map((x) => x.custos[r]);
    acumulado[r] = vals.every((v) => v !== null) ? round2(vals.reduce((s, v) => s + (v ?? 0), 0)) : null;
  }
  const dispAc = (Object.entries(acumulado) as [RegimeReforma, number | null][]).filter(
    (x): x is [RegimeReforma, number] => x[1] !== null,
  );
  const melhorAcumulado = dispAc.length ? dispAc.reduce((m, x) => (x[1] < m[1] ? x : m))[0] : null;

  // Crédito que os clientes PJ recuperam em 2033 (LC 214, art. 47, §§ 3º e 9º).
  let creditoClientes2033: ProjecaoReforma["creditoClientes2033"] = null;
  const b2b = Math.min(1, Math.max(0, e.vendasParaEmpresas ?? 0));
  if (simplesInfo) {
    const full = aliquotaAno(TRANSICAO[TRANSICAO.length - 1], cenario);
    const aliq2033 = (full.cbs + full.ibs) * reducao.fator;
    creditoClientes2033 = {
      unificado: round2(simplesInfo.das * (simplesInfo.shareCbs + simplesInfo.shareLocal) * b2b),
      hibrido: round2(rec * aliq2033 * b2b),
    };
    if (b2b >= 0.5) {
      notas.push(
        `Com ${pct(b2b, 0)} das vendas para empresas, o híbrido transfere aos clientes ${brl(creditoClientes2033.hibrido)} de crédito por ano em 2033, contra ${brl(creditoClientes2033.unificado)} no unificado. Isso pode valer mais que a diferença de custo.`,
      );
    } else if (b2b > 0) {
      notas.push(
        `Vendas para empresas são ${pct(b2b, 0)} da receita: o crédito que o cliente recupera pesa pouco; o custo direto decide.`,
      );
    }
  }

  notas.push(
    `Setor: ${reducao.rotulo} (${reducao.fonte}). Alíquota cheia de CBS + IBS no cenário: ${pct(cenario.cbs + cenario.ibs, 2)}, aplicada ${reducao.fator < 1 ? `com fator ${reducao.fator}` : "integralmente"}.`,
  );
  notas.push(
    "IBS e CBS são calculados 'por fora' do preço e não cumulativos. A projeção mostra a carga sobre a receita de hoje, sem repasse a preços, com crédito sobre as compras informadas em 'Compras com crédito'. IRPJ, CSLL e encargos de folha ficam como em 2026.",
  );
  if (simples.elegivel) {
    notas.push(
      "No Simples unificado, as alíquotas nominais dos anexos não mudam: só a repartição interna ganha colunas de CBS e IBS (LC 214, Anexo XVIII). Por isso o custo fica constante. A opção pelo híbrido é semestral (LC 123, art. 13, §§ 9º a 11).",
    );
  }
  notas.push(
    "O MEI fica fora da projeção: a partir de 2027 recolhe IBS e CBS em valores fixos ainda não transcritos aqui, e a LC 238/2026 eleva seu limite para R$ 110 mil (2027) e R$ 140 mil (2028).",
  );

  return {
    cenario,
    setor,
    reducao,
    anos,
    acumulado,
    melhorAcumulado,
    creditoClientes2033,
    notas,
    fonte: FONTE_REFORMA,
  };
}
