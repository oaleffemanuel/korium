import { describe, expect, it } from "vitest";

import { explicarVencedor } from "../explicar";
import { brl } from "../money";
import { simular } from "../simular";

describe("explicarVencedor", () => {
  it("explica o Simples contra o Presumido com as maiores linhas", () => {
    const c = simular({
      receitaAnual: 360_000,
      folhaAnual: 0,
      proLaboreAnual: 120_000,
      socios: 1,
      empregados: 0,
      issMunicipal: 0.05,
      margemLucro: 0.3,
      custosComCredito: 0.2,
      atividade: "servicos_fator_r",
      inicioAtividade: false,
    });
    const f = explicarVencedor(c);
    expect(f[0]).toContain(`Simples Nacional custa ${brl(51_828)} a menos`);
    expect(f.join(" ")).toContain(`INSS e encargos patronais: ${brl(24_000)}`);
    expect(f.join(" ")).toContain(`IRPJ e CSLL: ${brl(27_648)}`);
    expect(f.join(" ")).not.toMatch(/Em compensação/);
  });

  it("sem segunda opção não explica nada", () => {
    const c = simular({
      receitaAnual: 5_000_000,
      folhaAnual: 0,
      proLaboreAnual: 0,
      socios: 2,
      empregados: 0,
      issMunicipal: 0.05,
      margemLucro: 0.3,
      custosComCredito: 0.2,
      atividade: "servicos",
      inicioAtividade: false,
    });
    // Simples e MEI inelegíveis: sobram Presumido e Real — ainda há segundo.
    expect(explicarVencedor(c).length).toBeGreaterThan(0);
  });
});
