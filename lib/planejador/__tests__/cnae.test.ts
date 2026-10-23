import { describe, expect, it } from "vitest";

import base from "../data/cnae.json";
import { buscarCnae, classificarCnae, regraPara, type BaseCnae } from "../cnae";

const cnae = base as BaseCnae;

describe("base CNAE", () => {
  it("tem as 1.332 subclasses da CNAE 2.3", () => {
    expect(cnae.subclasses.length).toBe(1332);
    expect(cnae.subclasses[0].c).toMatch(/^\d{4}-\d\/\d{2}$/);
  });

  it("toda subclasse recebe uma regra de enquadramento", () => {
    const semRegra = cnae.subclasses.filter((s) => regraPara(s.c) === null);
    expect(semRegra.map((s) => s.c)).toEqual([]);
  });
});

describe("busca", () => {
  it("por código, ignorando pontuação", () => {
    const r = buscarCnae(cnae, "6201");
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((s) => s.c.startsWith("6201"))).toBe(true);
  });

  it("sinônimos do dia a dia levam à descrição oficial", () => {
    expect(buscarCnae(cnae, "dentista")[0].c).toBe("8630-5/04");
    expect(buscarCnae(cnae, "advogado").some((s) => s.c.startsWith("6911"))).toBe(true);
    expect(buscarCnae(cnae, "loja de roupas").some((s) => s.c.startsWith("4781"))).toBe(true);
  });

  it("por palavras, sem acento e em qualquer ordem", () => {
    const r = buscarCnae(cnae, "atividade odontológica");
    expect(r.some((s) => s.c.startsWith("8630-5/04"))).toBe(true);
    const r2 = buscarCnae(cnae, "programas computador");
    expect(r2.some((s) => s.c.startsWith("6201"))).toBe(true);
  });
});

describe("classificação", () => {
  const achar = (c: string) => cnae.subclasses.find((s) => s.c === c)!;

  it("comércio varejista → Anexo I", () => {
    const k = classificarCnae(achar("4781-4/00"));
    expect(k.atividade).toBe("comercio");
    expect(k.anexoBase).toBe("I");
  });

  it("desenvolvimento de software e consultoria em TI dependem do Fator R (§ 5º-M)", () => {
    expect(classificarCnae(achar("6201-5/01")).sujeitoFatorR).toBe(true);
    expect(classificarCnae(achar("6204-0/00")).sujeitoFatorR).toBe(true);
  });

  it("medicina e fisioterapia: Fator R decide, setor saúde", () => {
    const med = classificarCnae(achar("8630-5/03"));
    expect(med.sujeitoFatorR).toBe(true);
    expect(med.setorReforma).toBe("saude");
    expect(classificarCnae(achar("8650-0/04")).sujeitoFatorR).toBe(true);
    expect(classificarCnae(achar("6622-3/00")).sujeitoFatorR).toBe(false); // corretagem de seguros: III fixo
  });

  it("advocacia → Anexo IV, profissão regulamentada", () => {
    const adv = classificarCnae(achar("6911-7/01"));
    expect(adv.anexoBase).toBe("IV");
    expect(adv.profissaoRegulamentada).toBe(true);
  });

  it("representação comercial → Anexo V mesmo estando na seção de comércio", () => {
    expect(classificarCnae(achar("4619-2/00")).anexoBase).toBe("V");
  });

  it("transporte de cargas → Anexo III com presunção de comércio", () => {
    expect(classificarCnae(achar("4930-2/02")).atividade).toBe("transporte_cargas");
  });

  it("impeditivo marca o CNAE", () => {
    const k = classificarCnae(achar("6422-1/00"), [
      { cnae: "6422-1/00", descricao: "Bancos múltiplos", fonte: "teste" },
    ]);
    expect(k.impeditivo?.descricao).toBe("Bancos múltiplos");
  });
});
