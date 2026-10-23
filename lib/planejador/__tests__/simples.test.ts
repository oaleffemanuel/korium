import { describe, expect, it } from "vitest";

import {
  aliquotaEfetiva,
  reparticaoEfetiva,
  simularSimples,
} from "../simples";
import { ANEXOS } from "../tabelas/simples";
import type { EntradaSimulacao } from "../types";

const base: EntradaSimulacao = {
  receitaAnual: 600_000,
  folhaAnual: 0,
  proLaboreAnual: 0,
  socios: 1,
  empregados: 0,
  issMunicipal: 0.05,
  margemLucro: 0.3,
  custosComCredito: 0.2,
  atividade: "servicos",
  inicioAtividade: false,
};

describe("tabelas dos anexos", () => {
  it("toda faixa reparte 100 % do DAS", () => {
    for (const t of Object.values(ANEXOS)) {
      for (const f of t.faixas) {
        const total = Object.values(f.reparticao).reduce((a, b) => a + b!, 0);
        expect(total, `${t.anexo} faixa até ${f.ate}`).toBeCloseTo(1, 4);
      }
    }
  });
});

describe("alíquota efetiva", () => {
  it("Anexo III, RBT12 600 mil: (600000×13,5 % − 17640) ÷ 600000 = 10,56 %", () => {
    const r = aliquotaEfetiva(ANEXOS.III, 600_000);
    expect(r.faixa).toBe(2);
    expect(r.efetiva).toBeCloseTo(0.1056, 6);
  });

  it("primeira faixa não tem dedução", () => {
    expect(aliquotaEfetiva(ANEXOS.I, 120_000).efetiva).toBeCloseTo(0.04, 6);
  });

  it("limite exato da faixa fica na faixa inferior", () => {
    expect(aliquotaEfetiva(ANEXOS.I, 180_000).faixa).toBe(0);
    expect(aliquotaEfetiva(ANEXOS.I, 180_000.01).faixa).toBe(1);
  });
});

describe("trava do ISS em 5 %", () => {
  it("Anexo III faixa 5 redistribui o excedente aos federais", () => {
    const rbt12 = 3_000_000;
    const { faixa, efetiva } = aliquotaEfetiva(ANEXOS.III, rbt12);
    expect(efetiva * 0.335).toBeGreaterThan(0.05); // sem trava passaria de 5 %
    const rep = reparticaoEfetiva(ANEXOS.III, faixa, efetiva);
    expect(rep.ISS).toBeCloseTo(0.05, 9);
    const total = Object.values(rep).reduce((a, b) => a + b!, 0);
    expect(total).toBeCloseTo(efetiva, 9);
  });
});

describe("Fator R", () => {
  it("abaixo de 28 % fica no Anexo V; acima vai ao III", () => {
    const e = { ...base, atividade: "servicos_fator_r" as const };
    const v = simularSimples({ ...e, folhaAnual: 60_000, proLaboreAnual: 60_000 });
    expect(v.simples?.anexo).toBe("V");
    expect(v.simples?.folhaParaFatorR).toBeCloseTo(0.28 * 600_000 - 120_000, 2);

    const iii = simularSimples({ ...e, folhaAnual: 100_000, proLaboreAnual: 80_000 });
    expect(iii.simples?.anexo).toBe("III");
    expect(iii.totalGeralAnual).toBeLessThan(v.totalGeralAnual);
  });
});

describe("simulação completa", () => {
  it("serviços, 600 mil, Anexo III: DAS = 63.360 no ano", () => {
    const r = simularSimples(base);
    expect(r.elegivel).toBe(true);
    expect(r.totalAnual).toBeCloseTo(63_360, 2);
    expect(r.simples?.dasMensal).toBeCloseTo(5_280, 2);
    expect(r.encargosFolhaAnual).toBe(0);
  });

  it("Anexo IV: CPP de 20 % sobre a folha entra fora do DAS", () => {
    const r = simularSimples({
      ...base,
      atividade: "servicos_anexo_iv",
      folhaAnual: 100_000,
    });
    expect(r.simples?.anexo).toBe("IV");
    expect(r.encargosFolhaAnual).toBeCloseTo(20_000, 2);
  });

  it("acima do teto é inelegível", () => {
    const r = simularSimples({ ...base, receitaAnual: 5_000_000 });
    expect(r.elegivel).toBe(false);
  });

  it("acima do sublimite o ISS sai do DAS e é cobrado pela alíquota municipal", () => {
    const r = simularSimples({ ...base, receitaAnual: 4_000_000, issMunicipal: 0.03 });
    const iss = r.linhas.find((l) => l.tributo === "ISS");
    expect(iss?.valorAnual).toBeCloseTo(120_000, 2);
    expect(iss?.nota).toMatch(/fora do DAS/);
  });
});
