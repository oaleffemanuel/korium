import { brl, pct, round2 } from "./money";
import { ENCARGOS, PRESUMIDO, PRESUNCAO, REAL } from "./tabelas/parametros";
import type { EntradaSimulacao, LinhaTributo, ResultadoRegime } from "./types";

/** Encargos patronais sobre folha e pró-labore, fora do Simples. */
export function encargosFolha(e: EntradaSimulacao): {
  linhas: LinhaTributo[];
  total: number;
  memoria: string[];
} {
  const rec = Math.max(e.receitaAnual, 1);
  const linhas: LinhaTributo[] = [];
  const memoria: string[] = [];

  if (e.folhaAnual > 0) {
    const cpp = e.folhaAnual * ENCARGOS.cpp;
    const rat = e.folhaAnual * ENCARGOS.ratPadrao;
    const terceiros = e.folhaAnual * ENCARGOS.terceiros;
    linhas.push(
      { tributo: "CPP", valorAnual: round2(cpp), sobreReceita: cpp / rec, nota: "20 % sobre a folha" },
      { tributo: "RAT", valorAnual: round2(rat), sobreReceita: rat / rec, nota: "RAT 2 % (médio) sobre a folha" },
      { tributo: "TERCEIROS", valorAnual: round2(terceiros), sobreReceita: terceiros / rec, nota: "Terceiros 5,8 % sobre a folha" },
    );
    memoria.push(
      `Encargos sobre a folha de ${brl(e.folhaAnual)}: CPP 20 % + RAT 2 % + terceiros 5,8 % = ${brl(cpp + rat + terceiros)}.`,
    );
  }
  if (e.proLaboreAnual > 0) {
    const inss = e.proLaboreAnual * ENCARGOS.proLaborePatronal;
    linhas.push({
      tributo: "INSS_PROLABORE",
      valorAnual: round2(inss),
      sobreReceita: inss / rec,
      nota: "Parte patronal de 20 % sobre o pró-labore",
    });
    memoria.push(
      `INSS patronal sobre o pró-labore de ${brl(e.proLaboreAnual)}: 20 % = ${brl(inss)}.`,
    );
  }
  return { linhas, total: linhas.reduce((a, l) => a + l.valorAnual, 0), memoria };
}

/** IRPJ 15 % + adicional de 10 % sobre o que exceder R$ 240 mil/ano de base. */
function irpjComAdicional(base: number, aliq: number, adicional: number, limite: number) {
  const principal = base * aliq;
  const excedente = Math.max(0, base - limite);
  return { principal, adicional: excedente * adicional, excedente };
}

export function simularPresumido(e: EntradaSimulacao): ResultadoRegime {
  const rec = e.receitaAnual;
  const avisos: string[] = [];
  const memoria: string[] = [];

  if (rec > PRESUMIDO.limiteReceita) {
    return vazio("LUCRO_PRESUMIDO", [
      `Receita acima de ${brl(PRESUMIDO.limiteReceita)}: o Lucro Presumido não é permitido.`,
    ]);
  }

  const pres = { ...PRESUNCAO[e.atividade] };
  const servicoGeral =
    pres.irpj === 0.32 && e.atividade !== "transporte_cargas" && !e.profissaoRegulamentada;
  if (servicoGeral && rec <= PRESUMIDO.servicosReceitaReduzida) {
    pres.irpj = PRESUMIDO.servicosPresuncaoReduzida;
    memoria.push(
      `Serviços com receita anual até ${brl(PRESUMIDO.servicosReceitaReduzida)}: presunção do IRPJ reduzida a 16 % (Lei 9.250/1995, art. 40). A CSLL continua em 32 %.`,
    );
  }
  // LC 224/2025: +10 % na presunção sobre a parcela acima de R$ 5 milhões.
  const excedente5M = Math.max(0, rec - PRESUMIDO.acrescimoPresuncaoAPartirDe);
  const ate5M = rec - excedente5M;
  const baseIrpj =
    ate5M * pres.irpj + excedente5M * pres.irpj * (1 + PRESUMIDO.acrescimoPresuncao);
  const baseCsll =
    ate5M * pres.csll + excedente5M * pres.csll * (1 + PRESUMIDO.acrescimoPresuncao);

  memoria.push(
    `Base do IRPJ = ${pct(pres.irpj, 0)} de ${brl(rec)} = ${brl(baseIrpj)}; base da CSLL = ${pct(pres.csll, 0)} = ${brl(baseCsll)}.`,
  );
  if (excedente5M > 0) {
    memoria.push(
      `LC 224/2025: presunção acrescida em 10 % sobre os ${brl(excedente5M)} que excedem R$ 5 milhões.`,
    );
  }

  const irpj = irpjComAdicional(
    baseIrpj,
    PRESUMIDO.irpj,
    PRESUMIDO.irpjAdicional,
    PRESUMIDO.irpjAdicionalLimiteAnual,
  );
  memoria.push(
    `IRPJ = 15 % × ${brl(baseIrpj)} = ${brl(irpj.principal)}` +
      (irpj.excedente > 0
        ? ` + adicional 10 % sobre ${brl(irpj.excedente)} = ${brl(irpj.adicional)}`
        : "") +
      ".",
  );
  const csll = baseCsll * PRESUMIDO.csll;
  const pis = rec * PRESUMIDO.pis;
  const cofins = rec * PRESUMIDO.cofins;
  memoria.push(
    `CSLL = 9 % × ${brl(baseCsll)} = ${brl(csll)}; PIS 0,65 % = ${brl(pis)}; COFINS 3 % = ${brl(cofins)} (cumulativos, sem crédito).`,
  );

  const linhas: LinhaTributo[] = [
    { tributo: "IRPJ", valorAnual: round2(irpj.principal + irpj.adicional), sobreReceita: (irpj.principal + irpj.adicional) / Math.max(rec, 1) },
    { tributo: "CSLL", valorAnual: round2(csll), sobreReceita: csll / Math.max(rec, 1) },
    { tributo: "PIS", valorAnual: round2(pis), sobreReceita: PRESUMIDO.pis },
    { tributo: "COFINS", valorAnual: round2(cofins), sobreReceita: PRESUMIDO.cofins },
  ];

  const tributoLocal = tributoLocalNormal(e, linhas, memoria, avisos);
  const enc = encargosFolha(e);
  memoria.push(...enc.memoria);

  const totalAnual = round2(
    irpj.principal + irpj.adicional + csll + pis + cofins + tributoLocal,
  );
  const totalGeral = round2(totalAnual + enc.total);
  return {
    regime: "LUCRO_PRESUMIDO",
    elegivel: true,
    avisos,
    totalAnual,
    encargosFolhaAnual: round2(enc.total),
    totalGeralAnual: totalGeral,
    cargaEfetiva: rec > 0 ? totalGeral / rec : 0,
    linhas: [...linhas, ...enc.linhas],
    memoria,
  };
}

export function simularReal(e: EntradaSimulacao): ResultadoRegime {
  const rec = e.receitaAnual;
  const avisos: string[] = [];
  const memoria: string[] = [];

  const lucro = Math.max(0, rec * e.margemLucro);
  memoria.push(
    `Lucro antes do IRPJ/CSLL = margem ${pct(e.margemLucro, 0)} × ${brl(rec)} = ${brl(lucro)} (estimativa informada).`,
  );
  const irpj = irpjComAdicional(lucro, REAL.irpj, REAL.irpjAdicional, REAL.irpjAdicionalLimiteAnual);
  const csll = lucro * REAL.csll;
  memoria.push(
    `IRPJ = 15 % × ${brl(lucro)} = ${brl(irpj.principal)}` +
      (irpj.excedente > 0 ? ` + adicional ${brl(irpj.adicional)}` : "") +
      `; CSLL 9 % = ${brl(csll)}.`,
  );

  const creditos = rec * e.custosComCredito;
  const basePisCofins = Math.max(0, rec - creditos);
  const pis = basePisCofins * REAL.pis;
  const cofins = basePisCofins * REAL.cofins;
  memoria.push(
    `PIS 1,65 % e COFINS 7,6 % não cumulativos sobre ${brl(rec)} − créditos de ${brl(creditos)} (${pct(e.custosComCredito, 0)} da receita) = ${brl(pis + cofins)}.`,
  );
  if (e.margemLucro <= 0) {
    avisos.push("Com margem zero ou prejuízo, IRPJ e CSLL ficam em zero; o prejuízo fiscal é compensável depois.");
  }

  const linhas: LinhaTributo[] = [
    { tributo: "IRPJ", valorAnual: round2(irpj.principal + irpj.adicional), sobreReceita: (irpj.principal + irpj.adicional) / Math.max(rec, 1) },
    { tributo: "CSLL", valorAnual: round2(csll), sobreReceita: csll / Math.max(rec, 1) },
    { tributo: "PIS", valorAnual: round2(pis), sobreReceita: pis / Math.max(rec, 1) },
    { tributo: "COFINS", valorAnual: round2(cofins), sobreReceita: cofins / Math.max(rec, 1) },
  ];
  const tributoLocal = tributoLocalNormal(e, linhas, memoria, avisos);
  const enc = encargosFolha(e);
  memoria.push(...enc.memoria);

  const totalAnual = round2(irpj.principal + irpj.adicional + csll + pis + cofins + tributoLocal);
  const totalGeral = round2(totalAnual + enc.total);
  avisos.push(
    "Lucro Real exige contabilidade completa e apuração pelo lucro contábil; o resultado depende da margem real, não da presumida.",
  );
  return {
    regime: "LUCRO_REAL",
    elegivel: true,
    avisos,
    totalAnual,
    encargosFolhaAnual: round2(enc.total),
    totalGeralAnual: totalGeral,
    cargaEfetiva: rec > 0 ? totalGeral / rec : 0,
    linhas: [...linhas, ...enc.linhas],
    memoria,
  };
}

/** ISS municipal para serviços; ICMS fica fora do escopo (varia por estado e produto). */
function tributoLocalNormal(
  e: EntradaSimulacao,
  linhas: LinhaTributo[],
  memoria: string[],
  avisos: string[],
): number {
  const servico =
    e.atividade !== "comercio" &&
    e.atividade !== "industria" &&
    e.atividade !== "locacao_bens_moveis";
  if (servico) {
    const iss = e.receitaAnual * e.issMunicipal;
    linhas.push({ tributo: "ISS", valorAnual: round2(iss), sobreReceita: e.issMunicipal, nota: "Alíquota do município" });
    memoria.push(`ISS ${pct(e.issMunicipal)} × ${brl(e.receitaAnual)} = ${brl(iss)}.`);
    return iss;
  }
  if (e.atividade === "comercio" || e.atividade === "industria") {
    avisos.push(
      "ICMS (e IPI na indústria) não está estimado: depende do estado, do produto e dos créditos. Fora do Simples ele é apurado à parte.",
    );
  }
  return 0;
}

function vazio(regime: ResultadoRegime["regime"], avisos: string[]): ResultadoRegime {
  return {
    regime,
    elegivel: false,
    avisos,
    totalAnual: 0,
    encargosFolhaAnual: 0,
    totalGeralAnual: 0,
    cargaEfetiva: 0,
    linhas: [],
    memoria: [],
  };
}
