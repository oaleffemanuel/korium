import os from "node:os";
import path from "node:path";
import { it, expect } from "vitest";
import { renderToFile } from "@react-pdf/renderer";
import { statSync } from "node:fs";

import { documentoPdf } from "@/components/planejador/pdf/gerar";
import { classificarCnae, type BaseCnae } from "../cnae";
import base from "../data/cnae.json";
import { projetarReforma } from "../reforma";
import { simular } from "../simular";

/**
 * Renderiza o relatório no Node, sem navegador. Garante que o documento
 * compila e serve para inspeção visual: defina PDF_AMOSTRA_OUT para gravar
 * em outro lugar e abra o arquivo.
 */
it("o PDF de amostra renderiza no Node", async () => {
  const sub = (base as BaseCnae).subclasses.find((s) => s.c === "6201-5/01")!;
  const cnae = classificarCnae(sub);
  const comparativo = simular({
    receitaAnual: 360_000,
    folhaAnual: 0,
    proLaboreAnual: 120_000,
    socios: 1,
    empregados: 0,
    issMunicipal: 0.05,
    margemLucro: 0.3,
    custosComCredito: 0.2,
    atividade: cnae.atividade,
    cnae: cnae.cnae,
    inicioAtividade: false,
    profissaoRegulamentada: false,
    setorReforma: "geral",
    vendasParaEmpresas: 0.8,
  });
  const projecao = projetarReforma(comparativo);
  const doc = documentoPdf(
    { comparativo, projecao, empresa: { nome: "Nexa Sistemas", logo: null, cnae } },
    path.resolve("public/planejador"),
  );
  const out = process.env.PDF_AMOSTRA_OUT ?? path.join(os.tmpdir(), "planejador-amostra.pdf");
  await renderToFile(doc, out);
  expect(statSync(out).size).toBeGreaterThan(20_000);
}, 60_000);
