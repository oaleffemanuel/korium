import { simularMei } from "./mei";
import { simularPresumido, simularReal } from "./regimes-normais";
import { simularSimples } from "./simples";
import type { EntradaSimulacao, Regime, ResultadoRegime } from "./types";

export interface Comparativo {
  entrada: EntradaSimulacao;
  resultados: ResultadoRegime[];
  /** Regime elegível de menor custo total. */
  recomendado: ResultadoRegime | null;
  /** Economia anual do recomendado frente ao segundo melhor elegível. */
  economiaAnual: number;
  segundo: ResultadoRegime | null;
}

export const ORDEM: Regime[] = ["MEI", "SIMPLES", "LUCRO_PRESUMIDO", "LUCRO_REAL"];

export const NOME_REGIME: Record<Regime, string> = {
  MEI: "MEI",
  SIMPLES: "Simples Nacional",
  LUCRO_PRESUMIDO: "Lucro Presumido",
  LUCRO_REAL: "Lucro Real",
};

export function simular(entrada: EntradaSimulacao): Comparativo {
  const resultados = [
    simularMei(entrada),
    simularSimples(entrada),
    simularPresumido(entrada),
    simularReal(entrada),
  ];
  const elegiveis = resultados
    .filter((r) => r.elegivel)
    .sort((a, b) => a.totalGeralAnual - b.totalGeralAnual);
  const recomendado = elegiveis[0] ?? null;
  const segundo = elegiveis[1] ?? null;
  return {
    entrada,
    resultados,
    recomendado,
    segundo,
    economiaAnual:
      recomendado && segundo ? segundo.totalGeralAnual - recomendado.totalGeralAnual : 0,
  };
}
