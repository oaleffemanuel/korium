import { describe, expect, it } from "vitest";

import { aliquotaAno, projetarReforma } from "../reforma";
import { simular } from "../simular";
import { CENARIOS, TRANSICAO } from "../tabelas/reforma";
import type { EntradaSimulacao } from "../types";

const servicos: EntradaSimulacao = {
  receitaAnual: 1_200_000,
  folhaAnual: 200_000,
  proLaboreAnual: 60_000,
  socios: 2,
  empregados: 4,
  issMunicipal: 0.05,
  margemLucro: 0.3,
  custosComCredito: 0.2,
  atividade: "servicos",
  inicioAtividade: false,
  setorReforma: "geral",
  vendasParaEmpresas: 0.8,
};

describe("cronograma", () => {
  it("cobre 2026 a 2033 e as alíquotas seguem a lei", () => {
    expect(TRANSICAO.map((a) => a.ano)).toEqual([2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033]);
    const c = CENARIOS[0];
    expect(aliquotaAno(TRANSICAO[0], c)).toEqual({ cbs: 0, ibs: 0 });
    expect(aliquotaAno(TRANSICAO[1], c).cbs).toBeCloseTo(0.087, 9); // 8,8 % − 0,1 p.p.
    expect(aliquotaAno(TRANSICAO[1], c).ibs).toBeCloseTo(0.001, 9);
    expect(aliquotaAno(TRANSICAO[7], c)).toEqual({ cbs: 0.088, ibs: 0.177 });
    expect(TRANSICAO.map((a) => a.localFator)).toEqual([1, 1, 1, 0.9, 0.8, 0.7, 0.6, 0]);
  });
});

describe("projeção", () => {
  const c = simular(servicos);
  const p = projetarReforma(c);

  it("2026 repete os custos de hoje", () => {
    const a2026 = p.anos[0];
    const pres = c.resultados.find((r) => r.regime === "LUCRO_PRESUMIDO")!;
    expect(a2026.custos.LUCRO_PRESUMIDO).toBeCloseTo(pres.totalGeralAnual, 2);
    expect(a2026.custos.SIMPLES_HIBRIDO).toBe(a2026.custos.SIMPLES);
  });

  it("2027 troca PIS/COFINS do Presumido pela CBS com crédito", () => {
    const pres = c.resultados.find((r) => r.regime === "LUCRO_PRESUMIDO")!;
    const pisCofins = 1_200_000 * 0.0365;
    const cbs = 1_200_000 * (0.087 + 0.001) - 1_200_000 * 0.2 * (0.087 + 0.001);
    expect(p.anos[1].custos.LUCRO_PRESUMIDO).toBeCloseTo(pres.totalGeralAnual - pisCofins + cbs, 2);
  });

  it("ISS cai 10 % ao ano de 2029 a 2032 e some em 2033", () => {
    const iss = 1_200_000 * 0.05;
    const custos = p.anos.map((a) => a.custos.LUCRO_PRESUMIDO!);
    // diferença entre 2028 e 2029 = 10 % do ISS + aumento do IBS
    // CBS volta a 8,8 % (sem o −0,1 p.p.) e o IBS passa de 0,1 % para 10 % da cheia, ambos com 20 % de crédito.
    const delta = 1_200_000 * 0.8 * (0.088 + 0.0177 - (0.087 + 0.001));
    expect(custos[3] - custos[2]).toBeCloseTo(-0.1 * iss + delta, 0);
    expect(p.anos[7].custos.LUCRO_PRESUMIDO).toBeGreaterThan(0);
  });

  it("Simples unificado é constante; híbrido difere a partir de 2027", () => {
    const s = p.anos.map((a) => a.custos.SIMPLES);
    expect(new Set(s).size).toBe(1);
    expect(p.anos[2].custos.SIMPLES_HIBRIDO).not.toBe(p.anos[2].custos.SIMPLES);
  });

  it("acumulado e crédito aos clientes existem", () => {
    expect(p.acumulado.SIMPLES).not.toBeNull();
    expect(p.melhorAcumulado).not.toBeNull();
    expect(p.creditoClientes2033?.hibrido).toBeGreaterThan(p.creditoClientes2033?.unificado ?? 0);
  });

  it("setor saúde paga 40 % da alíquota", () => {
    const ps = projetarReforma(simular({ ...servicos, setorReforma: "saude" }));
    expect(ps.anos[7].aliquotaIbsCbs).toBeCloseTo(0.265 * 0.4, 9);
  });
});
