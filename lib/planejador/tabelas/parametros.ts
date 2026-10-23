import type { Atividade } from "../types";

/**
 * Parâmetros de 2026 fora do Simples Nacional.
 *
 * Cada bloco traz a norma de origem. Valores conferidos em 2026-10-23 contra
 * scratchpad/pesquisa/parametros_2026.md; ao atualizar, mude aqui e nos testes.
 */

export const ANO_REFERENCIA = 2026;

/** Salário mínimo e teto do INSS vigentes (Decreto de reajuste 2026 / Portaria MPS). */
export const PREVIDENCIA = {
  salarioMinimo: 1_621.0,
  tetoInss: 8_475.55,
  fonte:
    "Decreto nº 12.797/2025 (salário mínimo 2026) e Portaria Interministerial MPS/MF de janeiro de 2026 (teto)",
} as const;

/** Encargos patronais sobre folha fora do Simples (Lei 8.212/1991, arts. 22 e 23). */
export const ENCARGOS = {
  /** Contribuição previdenciária patronal. */
  cpp: 0.2,
  /** RAT médio adotado quando a empresa não informa o grau de risco (1 % a 3 %). */
  ratPadrao: 0.02,
  /** Terceiros (Sistema S, salário-educação, INCRA) — média para serviços/comércio. */
  terceiros: 0.058,
  /** Parte patronal sobre o pró-labore. */
  proLaborePatronal: 0.2,
  fonte: "Lei 8.212/1991, art. 22, I a III; Lei 9.424/1996 (salário-educação); Decreto 3.048/1999",
} as const;

/** Lucro Presumido (Lei 9.249/1995, art. 15 e 20; Lei 9.430/1996; LC 224/2025). */
export const PRESUMIDO = {
  limiteReceita: 78_000_000,
  irpj: 0.15,
  /** Adicional de 10 % sobre a parcela do lucro presumido que exceder R$ 20 mil/mês. */
  irpjAdicional: 0.1,
  irpjAdicionalLimiteAnual: 240_000,
  csll: 0.09,
  pis: 0.0065,
  cofins: 0.03,
  /**
   * LC 224/2025 (vigência 1º/1/2026): os percentuais de presunção do IRPJ e da
   * CSLL são acrescidos de 10 % sobre a parcela da receita bruta anual que
   * exceder R$ 5 milhões.
   */
  acrescimoPresuncao: 0.1,
  acrescimoPresuncaoAPartirDe: 5_000_000,
  /** Serviços em geral com receita bruta anual até R$ 120 mil: IRPJ sobre 16 % (Lei 9.250/1995, art. 40; não vale para profissões regulamentadas, hospitais e transporte). */
  servicosReceitaReduzida: 120_000,
  servicosPresuncaoReduzida: 0.16,
  fonte:
    "Lei 9.249/1995, arts. 3º, 15 e 20; Lei 9.250/1995, art. 40; Lei 9.430/1996, art. 25; Lei 9.715/1998, art. 8º; Lei 9.718/1998, arts. 8º e 13; LC 224/2025, art. 4º, §§ 4º e 5º",
} as const;

/** Percentuais de presunção por atividade. */
export const PRESUNCAO: Record<Atividade, { irpj: number; csll: number }> = {
  comercio: { irpj: 0.08, csll: 0.12 },
  industria: { irpj: 0.08, csll: 0.12 },
  transporte_cargas: { irpj: 0.08, csll: 0.12 },
  servicos: { irpj: 0.32, csll: 0.32 },
  servicos_fator_r: { irpj: 0.32, csll: 0.32 },
  servicos_anexo_iv: { irpj: 0.32, csll: 0.32 },
  intelectual_regulamentada: { irpj: 0.32, csll: 0.32 },
  locacao_bens_moveis: { irpj: 0.32, csll: 0.32 },
};

/** Lucro Real (Lei 9.249/1995; Leis 10.637/2002 e 10.833/2003). */
export const REAL = {
  irpj: 0.15,
  irpjAdicional: 0.1,
  irpjAdicionalLimiteAnual: 240_000,
  csll: 0.09,
  pis: 0.0165,
  cofins: 0.076,
  fonte:
    "Lei 9.249/1995, art. 3º; Lei 10.637/2002, art. 2º; Lei 10.833/2003, art. 2º",
} as const;

/** MEI (LC 123/2006, arts. 18-A a 18-C; Resolução CGSN 140/2018). */
export const MEI = {
  limiteReceitaAnual: 81_000,
  /** LC 238/2026 (21/10/2026): limite sobe para R$ 110 mil em 2027 e R$ 140 mil em 2028; 2 empregados a partir de 2027. */
  limite2027: 110_000,
  limite2028: 140_000,
  limiteMensalProporcional: 6_750,
  maxEmpregados: 1,
  /** Contribuição previdenciária do MEI: 5 % do salário mínimo. */
  inssPercentual: 0.05,
  icmsFixo: 1.0,
  issFixo: 5.0,
  fonte: "LC 123/2006, art. 18-A, §§ 1º, 3º e 4º; LC 238/2026; Resolução CGSN 140/2018, art. 100 e Anexo XI",
} as const;

export function dasMensalMei(atividade: Atividade): number {
  const inss = PREVIDENCIA.salarioMinimo * MEI.inssPercentual;
  const comercioOuIndustria = atividade === "comercio" || atividade === "industria";
  const servico = !comercioOuIndustria;
  return (
    inss + (comercioOuIndustria ? MEI.icmsFixo : 0) + (servico ? MEI.issFixo : 0)
  );
}

/** Atividades que o MEI não pode exercer (profissões regulamentadas, intelectuais). */
export const MEI_ATIVIDADES_VEDADAS: Atividade[] = [
  "intelectual_regulamentada",
  "servicos_fator_r",
];
