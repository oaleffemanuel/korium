import type { Anexo, TabelaAnexo } from "../types";

/**
 * Anexos I a V da LC 123/2006 (redação da LC 155/2016, vigente desde 2018).
 * Faixas de receita bruta em 12 meses (RBT12), alíquota nominal, parcela a
 * deduzir e repartição por tributo.
 *
 * Fonte: LC 123/2006, Anexos I a V — https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm
 * Conferido em 2026-10-23 contra a pesquisa em scratchpad/pesquisa/parametros_2026.md.
 *
 * Nota dos anexos III, IV e V: o percentual efetivo máximo devido ao ISS é 5 %;
 * a diferença é transferida, proporcionalmente, aos tributos federais. A regra
 * é aplicada em `simples.ts`, não aqui.
 */

export const LIMITES = {
  /** Teto do Simples Nacional (RBT12), em R$. */
  teto: 4_800_000,
  /** Sublimite: acima dele ICMS e ISS saem do DAS. */
  sublimite: 3_600_000,
  /** Fator R: folha ÷ receita (12 meses) a partir do qual a atividade vai ao Anexo III. */
  fatorR: 0.28,
  fonte:
    "LC 123/2006, art. 3º, II e art. 13-A (sublimite); art. 18, §§ 5º-J e 5º-M (Fator R)",
} as const;

const FAIXAS = [180_000, 360_000, 720_000, 1_800_000, 3_600_000, 4_800_000];

function faixas(
  nominal: number[],
  deduzir: number[],
  rep: Array<Record<string, number>>,
) {
  return FAIXAS.map((ate, i) => ({
    ate,
    aliquota: nominal[i] / 100,
    deduzir: deduzir[i],
    reparticao: Object.fromEntries(
      Object.entries(rep[i]).map(([k, v]) => [k, v / 100]),
    ),
  }));
}

export const ANEXO_I: TabelaAnexo = {
  anexo: "I",
  titulo: "Anexo I — Comércio",
  tributoLocal: "ICMS",
  cppForaDoDas: false,
  fonte: "LC 123/2006, Anexo I",
  faixas: faixas(
    [4.0, 7.3, 9.5, 10.7, 14.3, 19.0],
    [0, 5_940, 13_860, 22_500, 87_300, 378_000],
    [
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 41.5, ICMS: 34.0 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 41.5, ICMS: 34.0 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 42.0, ICMS: 33.5 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 42.0, ICMS: 33.5 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 42.0, ICMS: 33.5 },
      { IRPJ: 13.5, CSLL: 10.0, COFINS: 28.27, PIS: 6.13, CPP: 42.1 },
    ],
  ),
};

export const ANEXO_II: TabelaAnexo = {
  anexo: "II",
  titulo: "Anexo II — Indústria",
  tributoLocal: "ICMS",
  cppForaDoDas: false,
  fonte: "LC 123/2006, Anexo II",
  faixas: faixas(
    [4.5, 7.8, 10.0, 11.2, 14.7, 30.0],
    [0, 5_940, 13_860, 22_500, 85_500, 720_000],
    [
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, IPI: 7.5, ICMS: 32.0 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, IPI: 7.5, ICMS: 32.0 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, IPI: 7.5, ICMS: 32.0 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, IPI: 7.5, ICMS: 32.0 },
      { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, IPI: 7.5, ICMS: 32.0 },
      { IRPJ: 8.5, CSLL: 7.5, COFINS: 20.96, PIS: 4.54, CPP: 23.5, IPI: 35.0 },
    ],
  ),
};

export const ANEXO_III: TabelaAnexo = {
  anexo: "III",
  titulo: "Anexo III — Serviços em geral e locação de bens móveis",
  tributoLocal: "ISS",
  cppForaDoDas: false,
  fonte: "LC 123/2006, Anexo III",
  faixas: faixas(
    [6.0, 11.2, 13.5, 16.0, 21.0, 33.0],
    [0, 9_360, 17_640, 35_640, 125_640, 648_000],
    [
      { IRPJ: 4.0, CSLL: 3.5, COFINS: 12.82, PIS: 2.78, CPP: 43.4, ISS: 33.5 },
      { IRPJ: 4.0, CSLL: 3.5, COFINS: 14.05, PIS: 3.05, CPP: 43.4, ISS: 32.0 },
      { IRPJ: 4.0, CSLL: 3.5, COFINS: 13.64, PIS: 2.96, CPP: 43.4, ISS: 32.5 },
      { IRPJ: 4.0, CSLL: 3.5, COFINS: 13.64, PIS: 2.96, CPP: 43.4, ISS: 32.5 },
      { IRPJ: 4.0, CSLL: 3.5, COFINS: 12.82, PIS: 2.78, CPP: 43.4, ISS: 33.5 },
      { IRPJ: 35.0, CSLL: 15.0, COFINS: 16.03, PIS: 3.47, CPP: 30.5 },
    ],
  ),
};

export const ANEXO_IV: TabelaAnexo = {
  anexo: "IV",
  titulo: "Anexo IV — Construção, vigilância, limpeza, advocacia (CPP fora do DAS)",
  tributoLocal: "ISS",
  cppForaDoDas: true,
  fonte: "LC 123/2006, Anexo IV e art. 18, § 5º-C",
  faixas: faixas(
    [4.5, 9.0, 10.2, 14.0, 22.0, 33.0],
    [0, 8_100, 12_420, 39_780, 183_780, 828_000],
    [
      { IRPJ: 18.8, CSLL: 15.2, COFINS: 17.67, PIS: 3.83, ISS: 44.5 },
      { IRPJ: 19.8, CSLL: 15.2, COFINS: 20.55, PIS: 4.45, ISS: 40.0 },
      { IRPJ: 20.8, CSLL: 15.2, COFINS: 19.73, PIS: 4.27, ISS: 40.0 },
      { IRPJ: 17.8, CSLL: 19.2, COFINS: 18.9, PIS: 4.1, ISS: 40.0 },
      { IRPJ: 18.8, CSLL: 19.2, COFINS: 18.08, PIS: 3.92, ISS: 40.0 },
      { IRPJ: 53.5, CSLL: 21.5, COFINS: 20.55, PIS: 4.45 },
    ],
  ),
};

export const ANEXO_V: TabelaAnexo = {
  anexo: "V",
  titulo: "Anexo V — Serviços intelectuais (sujeitos ao Fator R)",
  tributoLocal: "ISS",
  cppForaDoDas: false,
  fonte: "LC 123/2006, Anexo V e art. 18, § 5º-I",
  faixas: faixas(
    [15.5, 18.0, 19.5, 20.5, 23.0, 30.5],
    [0, 4_500, 9_900, 17_100, 62_100, 540_000],
    [
      { IRPJ: 25.0, CSLL: 15.0, COFINS: 14.1, PIS: 3.05, CPP: 28.85, ISS: 14.0 },
      { IRPJ: 23.0, CSLL: 15.0, COFINS: 14.1, PIS: 3.05, CPP: 27.85, ISS: 17.0 },
      { IRPJ: 24.0, CSLL: 15.0, COFINS: 14.92, PIS: 3.23, CPP: 23.85, ISS: 19.0 },
      { IRPJ: 21.0, CSLL: 15.0, COFINS: 15.74, PIS: 3.41, CPP: 23.85, ISS: 21.0 },
      { IRPJ: 23.0, CSLL: 12.5, COFINS: 14.1, PIS: 3.05, CPP: 23.85, ISS: 23.5 },
      { IRPJ: 35.0, CSLL: 15.5, COFINS: 16.44, PIS: 3.56, CPP: 29.5 },
    ],
  ),
};

export const ANEXOS: Record<Anexo, TabelaAnexo> = {
  I: ANEXO_I,
  II: ANEXO_II,
  III: ANEXO_III,
  IV: ANEXO_IV,
  V: ANEXO_V,
};
