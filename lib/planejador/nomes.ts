import type { Tributo } from "./types";

export const NOME_TRIBUTO: Record<Tributo, string> = {
  IRPJ: "IRPJ",
  CSLL: "CSLL",
  COFINS: "COFINS",
  PIS: "PIS",
  CPP: "INSS patronal (CPP)",
  ICMS: "ICMS",
  ISS: "ISS",
  IPI: "IPI",
  RAT: "RAT",
  TERCEIROS: "Terceiros (Sistema S etc.)",
  INSS_PROLABORE: "INSS sobre pró-labore",
  CBS: "CBS",
  IBS: "IBS",
};

/** Glossário curto, na linguagem do dono da empresa. */
export const GLOSSARIO: Array<[string, string]> = [
  ["DAS", "A guia única do Simples Nacional. Um boleto por mês que já inclui IRPJ, CSLL, PIS, COFINS, INSS patronal e ISS ou ICMS."],
  ["RBT12", "Receita bruta dos últimos 12 meses. É ela que define a faixa e a alíquota do Simples, não o faturamento do mês."],
  ["Anexo", "As cinco tabelas do Simples. Comércio (I), indústria (II), serviços (III, IV ou V). O anexo vem da atividade, não da escolha."],
  ["Fator R", "Folha de salários mais pró-labore dividido pela receita, nos 12 meses. Em várias atividades de serviço, 28 % ou mais leva ao Anexo III, mais barato."],
  ["Pró-labore", "O salário do sócio que trabalha na empresa. Paga INSS e conta no Fator R; a distribuição de lucros não."],
  ["Presunção", "No Lucro Presumido, a Receita presume que o lucro é uma fração da receita (8 % no comércio, 32 % nos serviços) e cobra IRPJ e CSLL sobre ela."],
  ["CBS e IBS", "Os dois tributos da Reforma que substituem PIS, COFINS, ICMS e ISS entre 2027 e 2033, com crédito sobre o que a empresa compra."],
  ["Simples híbrido", "A partir de 2027, a opção de ficar no Simples para IRPJ, CSLL e INSS, mas apurar CBS e IBS por fora, com crédito para os clientes."],
];
