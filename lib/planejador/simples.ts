import { brl, pct, round2, sum } from "./money";
import { ANEXOS, LIMITES } from "./tabelas/simples";
import type {
  Anexo,
  Atividade,
  EntradaSimulacao,
  LinhaTributo,
  ResultadoRegime,
  TabelaAnexo,
  Tributo,
} from "./types";

const FEDERAIS: Tributo[] = ["IRPJ", "CSLL", "COFINS", "PIS", "CPP"];

/** Anexo "de partida" de cada atividade; o Fator R pode mover V → III. */
export function anexoBase(atividade: Atividade): Anexo {
  switch (atividade) {
    case "comercio":
      return "I";
    case "industria":
      return "II";
    case "servicos_anexo_iv":
      return "IV";
    case "servicos_fator_r":
    case "intelectual_regulamentada":
      return "V";
    case "servicos":
    case "locacao_bens_moveis":
    case "transporte_cargas":
      return "III";
  }
}

export function sujeitoAoFatorR(atividade: Atividade): boolean {
  return (
    atividade === "servicos_fator_r" ||
    atividade === "intelectual_regulamentada"
  );
}

/** Folha para o Fator R: salários + encargos + pró-labore (art. 18, § 24). */
export function folhaFatorR(e: EntradaSimulacao): number {
  return e.folhaAnual + e.proLaboreAnual;
}

export function fatorR(e: EntradaSimulacao): number | null {
  if (e.receitaAnual <= 0) return null;
  return folhaFatorR(e) / e.receitaAnual;
}

/** Índice (0-5) da faixa pela RBT12. */
export function indiceFaixa(tabela: TabelaAnexo, rbt12: number): number {
  const i = tabela.faixas.findIndex((f) => rbt12 <= f.ate);
  return i === -1 ? tabela.faixas.length - 1 : i;
}

/** Alíquota efetiva = (RBT12 × nominal − parcela a deduzir) ÷ RBT12. */
export function aliquotaEfetiva(tabela: TabelaAnexo, rbt12: number): {
  faixa: number;
  nominal: number;
  deduzir: number;
  efetiva: number;
} {
  const faixa = indiceFaixa(tabela, rbt12);
  const { aliquota: nominal, deduzir } = tabela.faixas[faixa];
  const base = Math.max(rbt12, 1);
  const efetiva = Math.max(0, (base * nominal - deduzir) / base);
  return { faixa, nominal, deduzir, efetiva };
}

/**
 * Repartição efetiva por tributo, já com a trava do ISS em 5 % (anexos III, IV e
 * V): o excedente é redistribuído proporcionalmente aos tributos federais.
 */
export function reparticaoEfetiva(
  tabela: TabelaAnexo,
  faixa: number,
  efetiva: number,
): Partial<Record<Tributo, number>> {
  const rep = tabela.faixas[faixa].reparticao;
  const out: Partial<Record<Tributo, number>> = {};
  for (const [k, v] of Object.entries(rep)) out[k as Tributo] = efetiva * v!;

  const iss = out.ISS ?? 0;
  if (tabela.tributoLocal === "ISS" && iss > 0.05) {
    const excesso = iss - 0.05;
    out.ISS = 0.05;
    const fed = FEDERAIS.filter((t) => (out[t] ?? 0) > 0);
    const totalFed = sum(fed.map((t) => out[t]!));
    for (const t of fed) out[t] = out[t]! + excesso * (out[t]! / totalFed);
  }
  return out;
}

export interface OpcoesSimples {
  /** Força um anexo (ignora atividade e Fator R). */
  anexoForcado?: Anexo;
}

export function simularSimples(
  e: EntradaSimulacao,
  opcoes: OpcoesSimples = {},
): ResultadoRegime {
  const avisos: string[] = [];
  const memoria: string[] = [];
  const rbt12 = e.receitaAnual;

  if (rbt12 > LIMITES.teto) {
    return inelegivel(
      `Receita anual de ${brl(rbt12)} acima do teto do Simples Nacional (${brl(LIMITES.teto)}).`,
    );
  }

  // Anexo
  let anexo = opcoes.anexoForcado ?? anexoBase(e.atividade);
  const fr = fatorR(e);
  let fatorRAtingido: boolean | null = null;
  let folhaParaFatorR: number | null = null;

  if (!opcoes.anexoForcado && sujeitoAoFatorR(e.atividade) && fr !== null) {
    fatorRAtingido = fr >= LIMITES.fatorR;
    anexo = fatorRAtingido ? "III" : "V";
    const folhaNecessaria = LIMITES.fatorR * rbt12;
    folhaParaFatorR = Math.max(0, folhaNecessaria - folhaFatorR(e));
    memoria.push(
      `Fator R = folha + pró-labore ${brl(folhaFatorR(e))} ÷ receita ${brl(rbt12)} = ${pct(fr)} ` +
        `(${fatorRAtingido ? "≥" : "<"} 28 %) → Anexo ${anexo}.`,
    );
    if (!fatorRAtingido && folhaParaFatorR > 0) {
      avisos.push(
        `Faltam ${brl(folhaParaFatorR)} de folha e pró-labore no ano para atingir o Fator R e migrar ao Anexo III.`,
      );
    }
  }

  const tabela = ANEXOS[anexo];
  const { faixa, nominal, deduzir, efetiva } = aliquotaEfetiva(tabela, rbt12);
  memoria.push(
    `${tabela.titulo}: faixa ${faixa + 1} (até ${brl(tabela.faixas[faixa].ate)}), ` +
      `alíquota nominal ${pct(nominal)}, parcela a deduzir ${brl(deduzir)}.`,
  );
  memoria.push(
    `Alíquota efetiva = (${brl(rbt12)} × ${pct(nominal)} − ${brl(deduzir)}) ÷ ${brl(rbt12)} = ${pct(efetiva, 4)}.`,
  );
  if (e.inicioAtividade) {
    memoria.push(
      "Empresa em início de atividade: a RBT12 é proporcionalizada (receita do mês × 12). A projeção usa a receita anual informada como RBT12.",
    );
  }

  // Repartição
  const rep = reparticaoEfetiva(tabela, faixa, efetiva);
  const linhas: LinhaTributo[] = [];
  const acimaSublimite = rbt12 > LIMITES.sublimite;
  let totalDas = 0;

  for (const [t, aliq] of Object.entries(rep) as [Tributo, number][]) {
    if (acimaSublimite && (t === "ISS" || t === "ICMS")) continue;
    const valor = rbt12 * aliq;
    totalDas += valor;
    linhas.push({ tributo: t, valorAnual: round2(valor), sobreReceita: aliq });
  }

  if (tabela.tributoLocal === "ISS" && (rep.ISS ?? 0) === 0.05) {
    memoria.push(
      "ISS limitado a 5 % da receita; o excedente foi redistribuído aos tributos federais (nota dos Anexos III, IV e V).",
    );
  }

  // Sublimite: ISS/ICMS fora do DAS
  let localForaDas = 0;
  if (acimaSublimite) {
    if (tabela.tributoLocal === "ISS") {
      localForaDas = rbt12 * e.issMunicipal;
      linhas.push({
        tributo: "ISS",
        valorAnual: round2(localForaDas),
        sobreReceita: e.issMunicipal,
        nota: "Recolhido fora do DAS (acima do sublimite de R$ 3,6 milhões).",
      });
    } else {
      avisos.push(
        "Acima do sublimite de R$ 3,6 milhões o ICMS é apurado fora do DAS, pelas regras do estado. Não está estimado aqui.",
      );
    }
    memoria.push(
      `Receita acima do sublimite (${brl(LIMITES.sublimite)}): ${tabela.tributoLocal} sai do DAS e é apurado pelo regime normal.`,
    );
  }

  // Anexo IV: CPP fora do DAS
  let encargos = 0;
  if (tabela.cppForaDoDas) {
    const cpp = e.folhaAnual * 0.2;
    encargos += cpp;
    linhas.push({
      tributo: "CPP",
      valorAnual: round2(cpp),
      sobreReceita: rbt12 > 0 ? cpp / rbt12 : 0,
      nota: "Anexo IV: contribuição patronal de 20 % sobre a folha, fora do DAS.",
    });
    memoria.push(
      `Anexo IV: CPP de 20 % sobre a folha (${brl(e.folhaAnual)}) = ${brl(cpp)}, recolhida fora do DAS.`,
    );
  }

  // INSS patronal sobre pró-labore: no Simples (exceto Anexo IV) já está na CPP do DAS.
  if (tabela.cppForaDoDas && e.proLaboreAnual > 0) {
    const inssPl = e.proLaboreAnual * 0.2;
    encargos += inssPl;
    linhas.push({
      tributo: "INSS_PROLABORE",
      valorAnual: round2(inssPl),
      sobreReceita: rbt12 > 0 ? inssPl / rbt12 : 0,
      nota: "Parte patronal de 20 % sobre o pró-labore (Anexo IV).",
    });
  }

  const totalAnual = round2(totalDas + localForaDas);
  const totalGeral = round2(totalAnual + encargos);
  const dasMensal = round2(totalDas / 12);
  memoria.push(
    `DAS anual estimado: ${brl(totalDas)} (${brl(dasMensal)} por mês, receita constante).`,
  );

  return {
    regime: "SIMPLES",
    elegivel: true,
    avisos,
    totalAnual,
    encargosFolhaAnual: round2(encargos),
    totalGeralAnual: totalGeral,
    cargaEfetiva: rbt12 > 0 ? totalGeral / rbt12 : 0,
    linhas,
    memoria,
    simples: {
      anexo,
      faixa: faixa + 1,
      aliquotaNominal: nominal,
      parcelaDeduzir: deduzir,
      aliquotaEfetiva: efetiva,
      fatorR: fr,
      fatorRAtingido,
      folhaParaFatorR,
      dasMensal,
    },
  };
}

function inelegivel(motivo: string): ResultadoRegime {
  return {
    regime: "SIMPLES",
    elegivel: false,
    avisos: [motivo],
    totalAnual: 0,
    encargosFolhaAnual: 0,
    totalGeralAnual: 0,
    cargaEfetiva: 0,
    linhas: [],
    memoria: [],
  };
}
