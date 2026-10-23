import { describe, expect, it } from "vitest";

import { simularMei } from "../mei";
import { simularPresumido, simularReal } from "../regimes-normais";
import { simular } from "../simular";
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
};

describe("Lucro Presumido", () => {
  it("serviços 1,2 mi: IRPJ 15 % + adicional sobre a base acima de 240 mil", () => {
    const r = simularPresumido(servicos);
    const baseIrpj = 1_200_000 * 0.32; // 384.000
    const irpj = baseIrpj * 0.15 + (baseIrpj - 240_000) * 0.1; // 57.600 + 14.400
    expect(r.linhas.find((l) => l.tributo === "IRPJ")?.valorAnual).toBeCloseTo(irpj, 2);
    expect(r.linhas.find((l) => l.tributo === "CSLL")?.valorAnual).toBeCloseTo(baseIrpj * 0.09, 2);
    expect(r.linhas.find((l) => l.tributo === "PIS")?.valorAnual).toBeCloseTo(7_800, 2);
    expect(r.linhas.find((l) => l.tributo === "COFINS")?.valorAnual).toBeCloseTo(36_000, 2);
    expect(r.linhas.find((l) => l.tributo === "ISS")?.valorAnual).toBeCloseTo(60_000, 2);
    // encargos: folha 200k × 27,8 % + pró-labore 60k × 20 %
    expect(r.encargosFolhaAnual).toBeCloseTo(200_000 * 0.278 + 12_000, 2);
    expect(r.totalGeralAnual).toBeCloseTo(r.totalAnual + r.encargosFolhaAnual, 2);
  });

  it("LC 224/2025: presunção +10 % só sobre a parcela acima de 5 milhões", () => {
    const r = simularPresumido({ ...servicos, receitaAnual: 6_000_000 });
    const base = 5_000_000 * 0.32 + 1_000_000 * 0.32 * 1.1; // 1.600.000 + 352.000
    const csll = r.linhas.find((l) => l.tributo === "CSLL")!.valorAnual;
    expect(csll).toBeCloseTo(base * 0.09, 2);
  });

  it("comércio não estima ICMS e avisa", () => {
    const r = simularPresumido({ ...servicos, atividade: "comercio" });
    expect(r.linhas.find((l) => l.tributo === "ISS")).toBeUndefined();
    expect(r.avisos.join(" ")).toMatch(/ICMS/);
  });
});

describe("Lucro Real", () => {
  it("usa a margem e os créditos informados", () => {
    const r = simularReal(servicos);
    const lucro = 360_000;
    const irpj = lucro * 0.15 + (lucro - 240_000) * 0.1;
    expect(r.linhas.find((l) => l.tributo === "IRPJ")?.valorAnual).toBeCloseTo(irpj, 2);
    const base = 1_200_000 * 0.8;
    expect(r.linhas.find((l) => l.tributo === "COFINS")?.valorAnual).toBeCloseTo(base * 0.076, 2);
  });
});

describe("MEI", () => {
  it("elegível só até 81 mil, 1 empregado, sem sócios", () => {
    const ok = simularMei({ ...servicos, receitaAnual: 70_000, socios: 1, empregados: 0, folhaAnual: 0, proLaboreAnual: 0 });
    expect(ok.elegivel).toBe(true);
    expect(ok.totalAnual).toBeCloseTo((1_621 * 0.05 + 5) * 12, 2);
    expect(simularMei({ ...servicos, receitaAnual: 70_000, socios: 2 }).elegivel).toBe(false);
    expect(simularMei({ ...servicos, receitaAnual: 90_000, socios: 1, empregados: 0 }).elegivel).toBe(false);
    expect(simularMei({ ...servicos, receitaAnual: 70_000, socios: 1, empregados: 0, atividade: "intelectual_regulamentada" }).elegivel).toBe(false);
  });
});

describe("comparativo", () => {
  it("recomenda o elegível mais barato e calcula a economia", () => {
    const c = simular(servicos);
    expect(c.resultados).toHaveLength(4);
    expect(c.resultados[0].regime).toBe("MEI");
    expect(c.resultados[0].elegivel).toBe(false);
    expect(c.recomendado).not.toBeNull();
    const elegiveis = c.resultados.filter((r) => r.elegivel);
    const min = Math.min(...elegiveis.map((r) => r.totalGeralAnual));
    expect(c.recomendado!.totalGeralAnual).toBe(min);
    expect(c.economiaAnual).toBeGreaterThanOrEqual(0);
  });

  it("serviços de 600 mil sem folha: Simples vence o Presumido", () => {
    const c = simular({ ...servicos, receitaAnual: 600_000, folhaAnual: 0, proLaboreAnual: 30_000, empregados: 0 });
    expect(c.recomendado?.regime).toBe("SIMPLES");
  });
});
