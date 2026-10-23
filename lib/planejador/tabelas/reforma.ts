/**
 * Reforma Tributária do consumo — EC 132/2023, LC 214/2025 (com LC 227/2026).
 *
 * O que é LEI está no cronograma; as alíquotas "cheias" de CBS e IBS ainda não
 * foram fixadas pelo Senado (LC 214, art. 349), então os cenários abaixo são
 * ESTIMATIVAS oficiais, rotuladas como tal. Pesquisa de 2026-10-23
 * (scratchpad/pesquisa/reforma_2026_2033.md).
 */

export interface CenarioReforma {
  id: "fazenda2024" | "cgibs2026";
  nome: string;
  /** Alíquota de referência cheia da CBS (fração). */
  cbs: number;
  /** Alíquota de referência cheia do IBS, estadual + municipal (fração). */
  ibs: number;
  fonte: string;
}

export const CENARIOS: CenarioReforma[] = [
  {
    id: "fazenda2024",
    nome: "26,5 % (Fazenda, 2024 — valor da trava legal)",
    cbs: 0.088,
    ibs: 0.177,
    fonte:
      "ESTIMATIVA — Ministério da Fazenda, PLP 68/2024 (CBS 8,8 % + IBS 17,7 %); 26,5 % é também o gatilho de revisão da LC 214/2025, art. 475, § 11",
  },
  {
    id: "cgibs2026",
    nome: "27,91 % (Comitê Gestor do IBS, 2026)",
    cbs: 0.0921,
    ibs: 0.187,
    fonte:
      "ESTIMATIVA — Resolução CGIBS 14/2026 (premissa de arrecadação para 2027: IBS 18,70 % + CBS 9,21 %)",
  },
];

export const CENARIO_PADRAO = CENARIOS[0];

export interface AnoTransicao {
  ano: number;
  /** CBS devida: fração da alíquota cheia (1 = cheia) ou valor absoluto quando `cbsAbsoluta`. */
  cbsFator: number;
  /** Redução em pontos percentuais da CBS (2027–2028: −0,1 p.p., LC 214 art. 347). */
  cbsReducaoPp: number;
  /** IBS devido: fração da alíquota cheia; ou valor absoluto quando `ibsAbsoluto` (0,1 % em 2027–2028). */
  ibsFator: number;
  ibsAbsoluto: number | null;
  /** Fração das alíquotas de ICMS/ISS vigentes em 2028 (ADCT art. 128; LC 116 art. 8º-B). */
  localFator: number;
  /** PIS e COFINS ainda devidos? (extintos em 2027, ADCT art. 126). */
  pisCofins: boolean;
  /** Parcela do ICMS/ISS do DAS que vira IBS nas tabelas do Simples (LC 214, Anexo XVIII). */
  ibsNoDasFator: number;
  /** Simples pode optar pelo regime regular de IBS/CBS neste ano? (LC 123 art. 13 §§ 9º–11). */
  hibridoDisponivel: boolean;
  status: "LEI" | "LEI + premissa";
  nota: string;
}

/**
 * Cronograma. O IBS de 2029–2032 cresce por resolução do Senado para repor a
 * receita de ICMS/ISS retirada; aqui a premissa é proporcional à redução
 * (10 %, 20 %, 30 %, 40 %), com salto para 100 % em 2033.
 */
export const TRANSICAO: AnoTransicao[] = [
  { ano: 2026, cbsFator: 0, cbsReducaoPp: 0, ibsFator: 0, ibsAbsoluto: 0, localFator: 1, pisCofins: true, ibsNoDasFator: 0, hibridoDisponivel: false, status: "LEI", nota: "Ano-teste: CBS 0,9 % e IBS 0,1 % compensados com PIS/COFINS ou dispensados. Carga igual à de 2025. Simples não paga as alíquotas-teste (LC 214, art. 348)." },
  { ano: 2027, cbsFator: 1, cbsReducaoPp: 0.001, ibsFator: 0, ibsAbsoluto: 0.001, localFator: 1, pisCofins: false, ibsNoDasFator: 0.1, hibridoDisponivel: true, status: "LEI", nota: "CBS integral (menos 0,1 p.p.), PIS e COFINS extintos, IPI zerado salvo ZFM, IBS 0,1 %. Simples ganha a opção semestral pelo regime regular de IBS/CBS (LC 214, arts. 344 e 347; LC 123, art. 13)." },
  { ano: 2028, cbsFator: 1, cbsReducaoPp: 0.001, ibsFator: 0, ibsAbsoluto: 0.001, localFator: 1, pisCofins: false, ibsNoDasFator: 0.1, hibridoDisponivel: true, status: "LEI", nota: "Igual a 2027." },
  { ano: 2029, cbsFator: 1, cbsReducaoPp: 0, ibsFator: 0.1, ibsAbsoluto: null, localFator: 0.9, pisCofins: false, ibsNoDasFator: 0.1, hibridoDisponivel: true, status: "LEI + premissa", nota: "ICMS e ISS a 90 %; IBS com alíquota própria crescente (premissa: 10 % da cheia)." },
  { ano: 2030, cbsFator: 1, cbsReducaoPp: 0, ibsFator: 0.2, ibsAbsoluto: null, localFator: 0.8, pisCofins: false, ibsNoDasFator: 0.2, hibridoDisponivel: true, status: "LEI + premissa", nota: "ICMS e ISS a 80 %." },
  { ano: 2031, cbsFator: 1, cbsReducaoPp: 0, ibsFator: 0.3, ibsAbsoluto: null, localFator: 0.7, pisCofins: false, ibsNoDasFator: 0.3, hibridoDisponivel: true, status: "LEI + premissa", nota: "ICMS e ISS a 70 %." },
  { ano: 2032, cbsFator: 1, cbsReducaoPp: 0, ibsFator: 0.4, ibsAbsoluto: null, localFator: 0.6, pisCofins: false, ibsNoDasFator: 0.4, hibridoDisponivel: true, status: "LEI + premissa", nota: "ICMS e ISS a 60 %." },
  { ano: 2033, cbsFator: 1, cbsReducaoPp: 0, ibsFator: 1, ibsAbsoluto: null, localFator: 0, pisCofins: false, ibsNoDasFator: 1, hibridoDisponivel: true, status: "LEI", nota: "Regime pleno: ICMS e ISS extintos; só IBS e CBS (ADCT, art. 129)." },
];

/** Reduções de alíquota por setor (LC 214/2025, arts. 127 a 130). Multiplicador sobre a alíquota padrão. */
export const REDUCAO_SETOR = {
  geral: { fator: 1, rotulo: "alíquota padrão", fonte: "LC 214/2025, art. 14" },
  saude: { fator: 0.4, rotulo: "redução de 60 % (saúde)", fonte: "LC 214/2025, art. 130 e Anexo III" },
  educacao: { fator: 0.4, rotulo: "redução de 60 % (educação)", fonte: "LC 214/2025, art. 129 e Anexo II" },
  profissao_regulamentada: { fator: 0.7, rotulo: "redução de 30 % (profissão regulamentada)", fonte: "LC 214/2025, art. 127" },
} as const;

export const FONTE_REFORMA =
  "EC 132/2023 (ADCT arts. 125–130); LC 214/2025 arts. 41, 47, 127–130, 343–349, 475 e 517 (Anexo XVIII); LC 227/2026; LC 116/2003 art. 8º-B";
