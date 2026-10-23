import { brl, round2 } from "./money";
import { dasMensalMei, MEI, MEI_ATIVIDADES_VEDADAS, PREVIDENCIA } from "./tabelas/parametros";
import type { EntradaSimulacao, ResultadoRegime } from "./types";

export function simularMei(e: EntradaSimulacao): ResultadoRegime {
  const avisos: string[] = [];
  const memoria: string[] = [];
  let elegivel = true;

  if (e.receitaAnual > MEI.limiteReceitaAnual) {
    elegivel = false;
    avisos.push(
      `Receita anual de ${brl(e.receitaAnual)} acima do limite do MEI (${brl(MEI.limiteReceitaAnual)}).` +
        (e.receitaAnual <= MEI.limite2028
          ? ` A LC 238/2026 eleva o limite para ${brl(MEI.limite2027)} em 2027 e ${brl(MEI.limite2028)} em 2028: vale reavaliar.`
          : ""),
    );
  }
  if (e.socios > 1) {
    elegivel = false;
    avisos.push("O MEI não pode ter sócios.");
  }
  if (e.empregados > MEI.maxEmpregados) {
    elegivel = false;
    avisos.push("O MEI pode ter no máximo 1 empregado.");
  }
  if (MEI_ATIVIDADES_VEDADAS.includes(e.atividade)) {
    elegivel = false;
    avisos.push(
      "Atividades intelectuais e profissões regulamentadas não podem ser MEI.",
    );
  }
  if (elegivel) {
    avisos.push(
      "Confirme se a ocupação consta da lista de atividades permitidas ao MEI (Resolução CGSN 140/2018, Anexo XI).",
    );
  }

  const das = dasMensalMei(e.atividade);
  const anual = das * 12;
  memoria.push(
    `DAS fixo mensal = 5 % do salário mínimo (${brl(PREVIDENCIA.salarioMinimo)}) = ${brl(PREVIDENCIA.salarioMinimo * MEI.inssPercentual)}` +
      (e.atividade === "comercio" || e.atividade === "industria"
        ? ` + ICMS ${brl(MEI.icmsFixo)}`
        : ` + ISS ${brl(MEI.issFixo)}`) +
      ` = ${brl(das)}.`,
  );
  memoria.push(`Total anual = 12 × ${brl(das)} = ${brl(anual)}, independente do faturamento.`);

  let encargos = 0;
  if (e.empregados === 1 && e.folhaAnual > 0) {
    // CPP de 3 % sobre o salário do empregado do MEI (LC 123, art. 18-C).
    encargos = e.folhaAnual * 0.03;
    memoria.push(
      `Empregado: contribuição patronal de 3 % sobre a folha de ${brl(e.folhaAnual)} = ${brl(encargos)}.`,
    );
  }

  return {
    regime: "MEI",
    elegivel,
    avisos,
    totalAnual: round2(anual),
    encargosFolhaAnual: round2(encargos),
    totalGeralAnual: round2(anual + encargos),
    cargaEfetiva: e.receitaAnual > 0 ? (anual + encargos) / e.receitaAnual : 0,
    linhas: [
      {
        tributo: "INSS_PROLABORE",
        valorAnual: round2(PREVIDENCIA.salarioMinimo * MEI.inssPercentual * 12),
        sobreReceita: 0,
        nota: "Contribuição previdenciária do titular (5 % do salário mínimo)",
      },
      ...(e.atividade === "comercio" || e.atividade === "industria"
        ? [{ tributo: "ICMS" as const, valorAnual: MEI.icmsFixo * 12, sobreReceita: 0, nota: "Valor fixo" }]
        : [{ tributo: "ISS" as const, valorAnual: MEI.issFixo * 12, sobreReceita: 0, nota: "Valor fixo" }]),
    ],
    memoria,
  };
}
