import { brl, pct } from "./money";
import { NOME_REGIME, type Comparativo } from "./simular";

/** Mensagem pré-preenchida para o WhatsApp com o resumo do cenário. */
export function mensagemWhatsApp(
  c: Comparativo,
  extras: { empresa?: string; cnae?: string } = {},
): string {
  const linhas = [
    "Olá! Fiz uma simulação no Planejador de CNPJ da Korium e quero conversar sobre o meu caso.",
    "",
    extras.empresa ? `Empresa: ${extras.empresa}` : null,
    extras.cnae ? `CNAE: ${extras.cnae}` : null,
    `Receita anual: ${brl(c.entrada.receitaAnual)}`,
    `Folha + pró-labore: ${brl(c.entrada.folhaAnual + c.entrada.proLaboreAnual)}`,
    "",
    ...c.resultados
      .filter((r) => r.elegivel)
      .map(
        (r) =>
          `• ${NOME_REGIME[r.regime]}: ${brl(r.totalGeralAnual)}/ano (${pct(r.cargaEfetiva, 1)})`,
      ),
    "",
    c.recomendado
      ? `Regime indicado pela simulação: ${NOME_REGIME[c.recomendado.regime]}.`
      : null,
  ];
  return linhas.filter((l) => l !== null).join("\n");
}
