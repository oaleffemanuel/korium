import type { Atividade } from "../types";

/**
 * Regras de enquadramento CNAE → atividade/anexo do Simples Nacional.
 *
 * Casamento por prefixo do código sem pontuação (7 dígitos). A regra mais
 * específica (prefixo mais longo) vence. Prefixos de 2 dígitos = divisão,
 * 3 = grupo, 5 = classe, 7 = subclasse.
 *
 * Fonte principal: LC 123/2006, art. 18, §§ 4º, 5º-B, 5º-C, 5º-D, 5º-E, 5º-I.
 * Conferir contra scratchpad/pesquisa/cnae_anexos.md (pesquisa de 2026-10-23).
 * Quando um CNAE comporta mais de um anexo (Res. CGSN 140/2018, Anexo VII),
 * a regra traz `nota` e a interface pede confirmação.
 */

export type SetorReforma = "geral" | "saude" | "educacao" | "profissao_regulamentada";

export interface RegraCnae {
  prefixo: string;
  atividade: Atividade;
  /** Profissão regulamentada por conselho (LC 214/2025, art. 127: redução de 30 %). */
  regulamentada?: boolean;
  setor?: SetorReforma;
  nota?: string;
  fonte: string;
}

const LC123 = "LC 123/2006, art. 18";

export const REGRAS_CNAE: RegraCnae[] = [
  // ---------------------------------------------------------------- seções inteiras (residuais)
  { prefixo: "01", atividade: "industria", nota: "Atividade rural: o produtor pessoa física costuma não ter CNPJ; para a PJ, Anexo I/II conforme venda ou beneficiamento.", fonte: `${LC123}, § 4º, I e II` },
  { prefixo: "02", atividade: "industria", fonte: `${LC123}, § 4º, II` },
  { prefixo: "03", atividade: "industria", fonte: `${LC123}, § 4º, II` },
  { prefixo: "05", atividade: "industria", fonte: `${LC123}, § 4º, II` },
  { prefixo: "06", atividade: "industria", fonte: `${LC123}, § 4º, II` },
  { prefixo: "07", atividade: "industria", fonte: `${LC123}, § 4º, II` },
  { prefixo: "08", atividade: "industria", fonte: `${LC123}, § 4º, II` },
  { prefixo: "09", atividade: "industria", fonte: `${LC123}, § 4º, II` },
  ...Array.from({ length: 24 }, (_, i) => String(10 + i)).map((p) => ({
    prefixo: p,
    atividade: "industria" as Atividade,
    fonte: `${LC123}, § 4º, II (Anexo II — indústria)`,
  })),
  { prefixo: "35", atividade: "servicos", nota: "Geração e distribuição de energia: verifique vedações (art. 17).", fonte: `${LC123}, § 5º-F` },
  { prefixo: "36", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "37", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "38", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "39", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  // Construção (F) → Anexo IV
  { prefixo: "41", atividade: "servicos_anexo_iv", fonte: `${LC123}, § 5º-C, I (construção de imóveis e obras de engenharia)` },
  { prefixo: "42", atividade: "servicos_anexo_iv", fonte: `${LC123}, § 5º-C, I` },
  { prefixo: "43", atividade: "servicos_anexo_iv", fonte: `${LC123}, § 5º-C, I (inclusive subempreitada)` },
  // Comércio (G) → Anexo I; representação comercial → Anexo V
  { prefixo: "45", atividade: "comercio", fonte: `${LC123}, § 4º, I (Anexo I — comércio)` },
  { prefixo: "4520", atividade: "servicos", nota: "Manutenção e reparação de veículos: serviço (Anexo III); a venda de peças é Anexo I.", fonte: `${LC123}, § 5º-B, IX` },
  { prefixo: "46", atividade: "comercio", fonte: `${LC123}, § 4º, I` },
  { prefixo: "461", atividade: "servicos_fator_r", nota: "Representação comercial e intermediação de negócios: Anexo V, sujeito ao Fator R.", fonte: `${LC123}, § 5º-I, VIII` },
  { prefixo: "47", atividade: "comercio", fonte: `${LC123}, § 4º, I` },
  // Transporte (H)
  { prefixo: "49", atividade: "servicos", fonte: `${LC123}, § 5º-E (transporte: Anexo III)` },
  { prefixo: "4930", atividade: "transporte_cargas", fonte: `${LC123}, § 5º-E (transporte de cargas: Anexo III, presunção de 8 % no Lucro Presumido)` },
  { prefixo: "50", atividade: "servicos", fonte: `${LC123}, § 5º-E` },
  { prefixo: "51", atividade: "servicos", fonte: `${LC123}, § 5º-E` },
  { prefixo: "52", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "5250802", atividade: "servicos_fator_r", nota: "Despachantes aduaneiros: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, V` },
  { prefixo: "53", atividade: "servicos", fonte: `${LC123}, § 5º-B, II (agência de correios)` },
  // Alojamento e alimentação (I)
  { prefixo: "55", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "56", atividade: "servicos", nota: "Bares e restaurantes: a venda de alimentos preparados é serviço (Anexo III); confira a tributação do ICMS se houver revenda.", fonte: `${LC123}, § 5º-F` },
  // Informação e comunicação (J)
  { prefixo: "58", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "59", atividade: "servicos", fonte: `${LC123}, § 5º-B, XVI (produção audiovisual)` },
  { prefixo: "60", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "61", atividade: "servicos", nota: "Telecomunicações: verifique a vedação do art. 17 para alguns serviços.", fonte: `${LC123}, § 5º-F` },
  { prefixo: "62", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-I, XII (serviços técnicos sem previsão expressa: Anexo V)` },
  { prefixo: "6201", atividade: "servicos_fator_r", nota: "Desenvolvimento de programas: Anexo III com Fator R ≥ 28 %; abaixo disso, Anexo V.", fonte: `${LC123}, § 5º-D, V e § 5º-M, II` },
  { prefixo: "6202", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-D, V e § 5º-M, II` },
  { prefixo: "6203", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-D, VI (licenciamento de programas) e § 5º-M, II` },
  { prefixo: "6204", atividade: "servicos_fator_r", nota: "Consultoria em TI: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, XII` },
  { prefixo: "6209", atividade: "servicos_fator_r", nota: "Suporte técnico em TI: Anexo III com Fator R ≥ 28 %; abaixo, Anexo V.", fonte: `${LC123}, § 5º-D, VII e § 5º-M, II` },
  { prefixo: "63", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-D, VII (páginas eletrônicas) e § 5º-M, II` },
  { prefixo: "6391", atividade: "servicos_fator_r", nota: "Agências de notícias: jornalismo, Anexo V.", fonte: `${LC123}, § 5º-I, XI` },
  // Financeiro (K) — majoritariamente vedado
  { prefixo: "64", atividade: "servicos", nota: "Atividade financeira: em regra vedada ao Simples (art. 17, I).", fonte: `${LC123}, art. 17, I` },
  { prefixo: "65", atividade: "servicos", nota: "Seguros e previdência: vedados ao Simples, salvo corretagem.", fonte: `${LC123}, art. 17, I` },
  { prefixo: "66", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "6622", atividade: "servicos", fonte: `${LC123}, § 5º-B, XIX (corretagem de seguros: Anexo III)` },
  // Imobiliário (L)
  { prefixo: "68", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-D, I (administração e locação de imóveis de terceiros) e § 5º-M, II` },
  { prefixo: "6810", atividade: "servicos", nota: "Compra, venda e aluguel de imóveis próprios: a locação de imóveis próprios é vedada ao Simples (art. 17, XV).", fonte: `${LC123}, art. 17, XV` },
  // Profissionais, científicas e técnicas (M)
  { prefixo: "69", atividade: "servicos_fator_r", regulamentada: true, setor: "profissao_regulamentada", fonte: `${LC123}, § 5º-I` },
  { prefixo: "6911", atividade: "servicos_anexo_iv", regulamentada: true, setor: "profissao_regulamentada", nota: "Advocacia: Anexo IV (CPP fora do DAS).", fonte: `${LC123}, § 5º-C, VII` },
  { prefixo: "6912", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-I, XII (cartórios: verificar natureza jurídica)` },
  { prefixo: "6920601", atividade: "servicos", regulamentada: true, setor: "profissao_regulamentada", nota: "Serviços contábeis: Anexo III, sem Fator R.", fonte: `${LC123}, § 5º-B, XIV` },
  { prefixo: "6920602", atividade: "servicos_fator_r", regulamentada: true, setor: "profissao_regulamentada", nota: "Auditoria e consultoria contábil: Anexo V.", fonte: `${LC123}, § 5º-I, X` },
  { prefixo: "70", atividade: "servicos_fator_r", regulamentada: true, setor: "profissao_regulamentada", nota: "Consultoria em gestão: Anexo V (Fator R); administração é profissão regulamentada (CRA).", fonte: `${LC123}, § 5º-I, X` },
  { prefixo: "71", atividade: "servicos_fator_r", regulamentada: true, setor: "profissao_regulamentada", nota: "Arquitetura (§ 5º-B, XVIII) e engenharia (§ 5º-I, VI): Anexo III com Fator R ≥ 28 %; abaixo, Anexo V.", fonte: `${LC123}, § 5º-B, XVIII; § 5º-I, VI; § 5º-M` },
  { prefixo: "72", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-I, VI (pesquisa)` },
  { prefixo: "73", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-I, XI (publicidade)` },
  { prefixo: "74", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-I, VI e XII (design, fotografia, tradução)` },
  { prefixo: "7410202", atividade: "servicos_anexo_iv", nota: "Decoração de interiores: Anexo IV.", fonte: `${LC123}, § 5º-C, I` },
  { prefixo: "75", atividade: "servicos_fator_r", regulamentada: true, setor: "profissao_regulamentada", nota: "Medicina veterinária: Anexo V.", fonte: `${LC123}, § 5º-I, II` },
  // Administrativas (N)
  { prefixo: "77", atividade: "locacao_bens_moveis", fonte: `${LC123}, § 5º-A (locação de bens móveis: Anexo III sem ISS)` },
  { prefixo: "78", atividade: "servicos", nota: "Agenciamento e locação de mão de obra: verifique a vedação do art. 17, XII (cessão de mão de obra).", fonte: `${LC123}, art. 17, XII` },
  { prefixo: "79", atividade: "servicos", fonte: `${LC123}, § 5º-B, III (agência de viagens)` },
  { prefixo: "80", atividade: "servicos_anexo_iv", fonte: `${LC123}, § 5º-C, VI (vigilância)` },
  { prefixo: "81", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "811", atividade: "servicos_anexo_iv", nota: "Serviços combinados para apoio a edifícios (inclui limpeza).", fonte: `${LC123}, § 5º-C, VI` },
  { prefixo: "812", atividade: "servicos_anexo_iv", fonte: `${LC123}, § 5º-C, VI (limpeza e conservação)` },
  { prefixo: "8130", atividade: "servicos_anexo_iv", fonte: `${LC123}, § 5º-C, I (paisagismo)` },
  { prefixo: "82", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  // Educação (P)
  { prefixo: "85", atividade: "servicos", setor: "educacao", fonte: `${LC123}, § 5º-B, I (ensino: Anexo III)` },
  // Saúde (Q)
  { prefixo: "86", atividade: "servicos_fator_r", setor: "saude", fonte: `${LC123}, § 5º-B, XIX a XXI e § 5º-M, I (medicina, odontologia, psicologia e afins: Anexo III com Fator R ≥ 28 %; abaixo, Anexo V)` },
  { prefixo: "8640", atividade: "servicos_fator_r", setor: "saude", nota: "Laboratórios e diagnóstico por imagem: Anexo III com Fator R ≥ 28 %; abaixo, Anexo V.", fonte: `${LC123}, § 5º-D, IX e X e § 5º-M, II` },
  { prefixo: "8650004", atividade: "servicos_fator_r", setor: "saude", nota: "Fisioterapia: Anexo III com Fator R ≥ 28 %; abaixo, Anexo V.", fonte: `${LC123}, § 5º-B, XVI e § 5º-M, I` },
  { prefixo: "87", atividade: "servicos", setor: "saude", fonte: `${LC123}, § 5º-F` },
  { prefixo: "88", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  // Artes e esportes (R)
  { prefixo: "91", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "92", atividade: "servicos", nota: "Jogos e loterias: em regra vedados; a agência lotérica é Anexo III.", fonte: `${LC123}, § 5º-B, VII` },
  { prefixo: "93", atividade: "servicos", fonte: `${LC123}, § 5º-F` },
  { prefixo: "9313", atividade: "servicos_fator_r", fonte: `${LC123}, § 5º-D, III e IV (academias de ginástica, dança, lutas e escolas de esportes) e § 5º-M, II` },
  // Administração pública (O) e demais seções fora do alcance de uma empresa privada
  { prefixo: "84", atividade: "servicos", nota: "Administração pública, defesa e seguridade social: não se aplica a empresas privadas.", fonte: "CNAE 2.3, seção O" },
  { prefixo: "97", atividade: "servicos", nota: "Serviços domésticos: não constituem empresa.", fonte: "CNAE 2.3, seção T" },
  { prefixo: "99", atividade: "servicos", nota: "Organismos internacionais: fora do alcance.", fonte: "CNAE 2.3, seção U" },
  // Outros serviços (S)
  { prefixo: "94", atividade: "servicos", nota: "Associações e organizações sem fins lucrativos não optam pelo Simples.", fonte: `${LC123}, art. 3º` },
  { prefixo: "95", atividade: "servicos", fonte: `${LC123}, § 5º-B, IX (reparos e manutenção)` },
  { prefixo: "96", atividade: "servicos", fonte: `${LC123}, § 5º-F (serviços pessoais: Anexo III)` },
];

/* ------------------------------------------------------------------
   Refinamentos conferidos contra a pesquisa de 2026-10-23
   (Res. CGSN 140/2018, art. 25, § 1º; LC 123/2006, art. 18).
------------------------------------------------------------------- */
REGRAS_CNAE.push(
  // Serviços dentro de divisões industriais (§ 5º-B, IX)
  { prefixo: "016", atividade: "servicos", fonte: `${LC123}, § 5º-F (apoio à agricultura: serviço não intelectual, Anexo III)` },
  { prefixo: "2539", atividade: "servicos", nota: "Usinagem, solda, tratamento e revestimento de metais: Anexo III.", fonte: `${LC123}, § 5º-B, IX` },
  { prefixo: "33", atividade: "servicos", nota: "Manutenção, reparação e instalação de máquinas e equipamentos: Anexo III.", fonte: `${LC123}, § 5º-B, IX` },
  { prefixo: "3250706", atividade: "servicos_fator_r", nota: "Serviços de prótese dentária: Anexo III com Fator R ≥ 28 %; abaixo, Anexo V.", fonte: `${LC123}, § 5º-D, XI e § 5º-M, II` },
  // Representação comercial dentro da divisão 45 (§ 5º-I, VII)
  { prefixo: "4512901", atividade: "servicos_fator_r", nota: "Representação comercial: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, VII` },
  { prefixo: "4512902", atividade: "servicos_fator_r", nota: "Comércio sob consignação: tratado como intermediação, Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, VII` },
  { prefixo: "4530706", atividade: "servicos_fator_r", nota: "Representação comercial: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, VII` },
  { prefixo: "4542101", atividade: "servicos_fator_r", nota: "Representação comercial: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, VII` },
  { prefixo: "4543", atividade: "servicos", nota: "Manutenção e reparação de motocicletas: Anexo III.", fonte: `${LC123}, § 5º-B, IX` },
  { prefixo: "4771702", atividade: "servicos", nota: "Farmácia de manipulação: a venda de produtos manipulados sob encomenda é Anexo III.", fonte: `${LC123}, § 4º, VII` },
  // Transporte/logística intelectual (§ 5º-I)
  { prefixo: "5250801", atividade: "servicos_fator_r", nota: "Comissaria de despachos: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, V` },
  { prefixo: "5250803", atividade: "servicos_fator_r", nota: "Agenciamento de cargas: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, XI` },
  { prefixo: "5829", atividade: "servicos_fator_r", nota: "Edição de software: licenciamento de programas, Fator R.", fonte: `${LC123}, § 5º-D, VI e § 5º-M, II` },
  { prefixo: "6621", atividade: "servicos_fator_r", nota: "Perícia, avaliação e consultoria atuarial: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, VIII e IX` },
  // Imóveis
  { prefixo: "6821", atividade: "servicos", nota: "Corretagem de imóveis de terceiros: Anexo III, sem Fator R.", fonte: "Res. CGSN 140/2018, art. 25, § 1º, III, j" },
  { prefixo: "6822", atividade: "servicos_fator_r", nota: "Administração de imóveis de terceiros: Anexo III com Fator R ≥ 28 %; abaixo, Anexo V.", fonte: `${LC123}, § 5º-D, I e § 5º-M, II` },
  // Propriedade industrial, publicidade, fotografia, artes
  { prefixo: "6911703", atividade: "servicos_fator_r", nota: "Agente de propriedade industrial: atividade intelectual, Anexo V (Fator R); não é advocacia.", fonte: `${LC123}, § 5º-I, XII` },
  { prefixo: "7319", atividade: "servicos_fator_r", nota: "Publicidade, promoção de vendas e criação de estandes: Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, X; § 5º-D, VIII` },
  { prefixo: "7420", atividade: "servicos", nota: "Fotografia e filmagem: produção audiovisual, Anexo III. Fotografia técnica pode ser tratada como atividade intelectual (Fator R).", fonte: `${LC123}, § 5º-B, XV` },
  { prefixo: "8230", atividade: "servicos", nota: "Organização de feiras e eventos: Anexo III (a montagem de estandes é Fator R).", fonte: `${LC123}, § 5º-F` },
  { prefixo: "8591", atividade: "servicos_fator_r", nota: "Ensino de esportes: escolas de esportes, Fator R.", fonte: `${LC123}, § 5º-D, IV e § 5º-M, II` },
  { prefixo: "4542102", atividade: "servicos_fator_r", nota: "Comércio sob consignação: intermediação, Anexo V (Fator R).", fonte: `${LC123}, § 5º-I, VII` },
  { prefixo: "8592901", atividade: "servicos_fator_r", nota: "Ensino de dança: academias de dança, Fator R.", fonte: `${LC123}, § 5º-D, II e § 5º-M, II` },
  { prefixo: "90", atividade: "servicos", nota: "Artes cênicas, música, produção artística e cultural: Anexo III.", fonte: `${LC123}, § 5º-B, XV` },
);
