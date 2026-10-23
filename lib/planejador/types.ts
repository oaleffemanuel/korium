/**
 * Planejador de CNPJ — tipos compartilhados pelo motor de cálculo.
 *
 * Convenções:
 *  - Valores monetários em reais (number), arredondados a centavos apenas na
 *    saída (`round2`). Percentuais como fração (0.28 = 28 %).
 *  - Tudo que vem de norma legal carrega `fonte` nas tabelas, não aqui.
 *  - O motor é puro: sem React, sem DOM, sem fetch. Roda no navegador e no
 *    vitest igualmente.
 */

export type Anexo = "I" | "II" | "III" | "IV" | "V";

/** Tributos que compõem o DAS ou os regimes normais. */
export type Tributo =
  | "IRPJ"
  | "CSLL"
  | "COFINS"
  | "PIS"
  | "CPP"
  | "ICMS"
  | "ISS"
  | "IPI"
  | "RAT"
  | "TERCEIROS"
  | "INSS_PROLABORE"
  | "CBS"
  | "IBS";

/** Natureza predominante da atividade, derivada do CNAE ou escolhida à mão. */
export type Atividade =
  | "comercio"
  | "industria"
  | "servicos"
  | "servicos_fator_r"
  | "servicos_anexo_iv"
  | "locacao_bens_moveis"
  | "transporte_cargas"
  | "intelectual_regulamentada";

export type Regime =
  | "MEI"
  | "SIMPLES"
  | "LUCRO_PRESUMIDO"
  | "LUCRO_REAL";

export interface Faixa {
  /** Limite superior da faixa de RBT12, em R$. */
  ate: number;
  /** Alíquota nominal (fração). */
  aliquota: number;
  /** Parcela a deduzir, em R$. */
  deduzir: number;
  /** Repartição do DAS por tributo (fração; soma = 1). */
  reparticao: Partial<Record<Tributo, number>>;
}

export interface TabelaAnexo {
  anexo: Anexo;
  titulo: string;
  faixas: Faixa[];
  /** Tributo municipal/estadual que entra no DAS deste anexo. */
  tributoLocal: "ICMS" | "ISS" | null;
  /** Anexo IV: a CPP fica fora do DAS. */
  cppForaDoDas: boolean;
  fonte: string;
}

export interface EntradaSimulacao {
  /** Receita bruta anual projetada (ou RBT12), em R$. */
  receitaAnual: number;
  /** Folha de salários anual (sem pró-labore), com encargos, em R$. */
  folhaAnual: number;
  /** Pró-labore anual total dos sócios, em R$. */
  proLaboreAnual: number;
  /** Número de sócios que recebem pró-labore. */
  socios: number;
  /** Empregados (para o MEI: máximo 1). */
  empregados: number;
  /** Alíquota de ISS do município (fração, 0.02 a 0.05). */
  issMunicipal: number;
  /** Margem de lucro antes de IRPJ/CSLL (fração) — Lucro Real. */
  margemLucro: number;
  /** Compras e despesas com crédito de PIS/COFINS, fração da receita — Lucro Real. */
  custosComCredito: number;
  /** Atividade predominante. */
  atividade: Atividade;
  /** CNAE principal (opcional, 0000-0/00). */
  cnae?: string;
  /** Empresa nova (início de atividade no ano). */
  inicioAtividade: boolean;
  /** Profissão regulamentada por conselho (LC 214/2025, art. 127; Lei 9.250/1995, art. 40). */
  profissaoRegulamentada?: boolean;
  /** Setor para as reduções da Reforma (LC 214/2025, arts. 127 a 130). */
  setorReforma?: "geral" | "saude" | "educacao" | "profissao_regulamentada";
  /** Fração das vendas feitas a empresas que tomam crédito de IBS/CBS (B2B). */
  vendasParaEmpresas?: number;
}

export interface LinhaTributo {
  tributo: Tributo;
  valorAnual: number;
  /** Alíquota efetiva sobre a receita (fração). */
  sobreReceita: number;
  nota?: string;
}

export interface ResultadoRegime {
  regime: Regime;
  elegivel: boolean;
  /** Motivos de inelegibilidade ou avisos relevantes. */
  avisos: string[];
  /** Total anual de tributos sobre a empresa (sem INSS do sócio). */
  totalAnual: number;
  /** Encargos de folha/pró-labore fora do total acima (mostrados à parte). */
  encargosFolhaAnual: number;
  /** Total geral = tributos + encargos. */
  totalGeralAnual: number;
  /** Carga efetiva = totalGeralAnual / receitaAnual. */
  cargaEfetiva: number;
  linhas: LinhaTributo[];
  /** Memória de cálculo em passos legíveis. */
  memoria: string[];
  /** Detalhes específicos do Simples. */
  simples?: {
    anexo: Anexo;
    faixa: number;
    aliquotaNominal: number;
    parcelaDeduzir: number;
    aliquotaEfetiva: number;
    fatorR: number | null;
    fatorRAtingido: boolean | null;
    /** Folha adicional anual necessária para atingir 28 % (se aplicável). */
    folhaParaFatorR: number | null;
    dasMensal: number;
  };
}
