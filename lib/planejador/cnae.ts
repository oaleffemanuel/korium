import { anexoBase, sujeitoAoFatorR } from "./simples";
import { REGRAS_CNAE, type RegraCnae, type SetorReforma } from "./tabelas/cnae-regras";
import type { Anexo, Atividade } from "./types";

export interface CnaeSubclasse {
  /** 0000-0/00 */
  c: string;
  /** Descrição em caixa normal. */
  d: string;
  cl: string;
  g: string;
  dv: string;
  s: string;
}

export interface BaseCnae {
  versao: string;
  secoes: Record<string, string>;
  divisoes: Record<string, string>;
  subclasses: CnaeSubclasse[];
}

export interface Impeditivo {
  cnae: string;
  descricao: string;
  fonte: string;
  condicao?: string;
}

export interface ClassificacaoCnae {
  cnae: string;
  descricao: string;
  secao: string;
  atividade: Atividade;
  anexoBase: Anexo;
  sujeitoFatorR: boolean;
  profissaoRegulamentada: boolean;
  setorReforma: SetorReforma;
  /** Preenchido quando o CNAE consta do Anexo VI da Res. CGSN 140 (vedado ao Simples). */
  impeditivo?: Impeditivo;
  /** Preenchido quando o CNAE consta do Anexo VII (pode ou não ser vedado, conforme a atividade exercida). */
  ambiguo?: Impeditivo;
  nota?: string;
  fonte: string;
}

export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function somenteDigitos(cnae: string): string {
  return cnae.replace(/\D/g, "");
}

/**
 * Palavras do dia a dia → termo usado na descrição oficial da CNAE. A busca
 * substitui o token inteiro, então "dentista" acha "Atividade odontológica".
 */
export const SINONIMOS: Record<string, string> = {
  dentista: "odontologica",
  dentistas: "odontologica",
  odontologia: "odontologica",
  clinica: "atividade",
  consultorio: "atividade",
  medico: "medica",
  medicos: "medica",
  medicina: "medica",
  psicologo: "psicologia",
  psicologa: "psicologia",
  nutricionista: "nutricao",
  fisioterapeuta: "fisioterapia",
  advogado: "advocaticios",
  advogada: "advocaticios",
  advocacia: "advocaticios",
  contador: "contabilidade",
  contadora: "contabilidade",
  contabil: "contabilidade",
  programador: "programas",
  software: "programas",
  sistemas: "programas",
  ti: "informatica",
  loja: "varejista",
  lojas: "varejista",
  mercado: "mercearias",
  mercadinho: "mercearias",
  restaurante: "restaurantes",
  lanchonete: "lanchonetes",
  padaria: "padaria",
  salao: "cabeleireiros",
  cabeleireiro: "cabeleireiros",
  barbearia: "cabeleireiros",
  manicure: "manicure",
  estetica: "estetica",
  academia: "condicionamento",
  personal: "condicionamento",
  escola: "ensino",
  professor: "ensino",
  curso: "cursos",
  cursos: "cursos",
  marketing: "publicidade",
  agencia: "agencias",
  designer: "design",
  arquiteto: "arquitetura",
  arquiteta: "arquitetura",
  engenheiro: "engenharia",
  engenheira: "engenharia",
  consultor: "consultoria",
  consultora: "consultoria",
  freteiro: "cargas",
  frete: "cargas",
  motorista: "transporte",
  uber: "transporte",
  oficina: "manutencao",
  mecanico: "manutencao",
  pedreiro: "obras",
  construtora: "construcao",
  eletricista: "eletricas",
  encanador: "hidraulicas",
  faxina: "limpeza",
  diarista: "limpeza",
  veterinario: "veterinarias",
  veterinaria: "veterinarias",
  petshop: "animais",
  pet: "animais",
  fotografo: "fotograficas",
  fotografa: "fotograficas",
  fotografia: "fotograficas",
  influenciador: "publicidade",
  youtuber: "audiovisual",
  ecommerce: "internet",
  online: "internet",
  dropshipping: "internet",
  representante: "representantes",
  corretor: "corretagem",
  imobiliaria: "imoveis",
  aluguel: "aluguel",
  locacao: "aluguel",
  hotel: "hoteis",
  pousada: "pousadas",
  confeitaria: "confeitaria",
  doceria: "confeitaria",
  bar: "bares",
  cafeteria: "lanchonetes",
  farmacia: "farmaceuticos",
  otica: "oticos",
  roupas: "vestuario",
  roupa: "vestuario",
  calcados: "calcados",
  joalheria: "joias",
  celular: "telefonia",
  informatica: "informatica",
  grafica: "impressao",
  costureira: "confeccao",
  costura: "confeccao",
  artesanato: "artesanato",
  musico: "musicais",
  musica: "musicais",
  tatuagem: "tatuagem",
  tradutor: "traducao",
  despachante: "despachantes",
  seguranca: "vigilancia",
  jardineiro: "paisagisticas",
  jardinagem: "paisagisticas",
  dedetizadora: "imunizacao",
  lavanderia: "lavanderias",
  transportadora: "cargas",
  entregador: "entrega",
  motoboy: "entrega",
  delivery: "entrega",
  holding: "holdings",
  startup: "programas",
  saas: "programas",
  app: "programas",
  aplicativo: "programas",
  site: "web",
  sites: "web",
};

const STOPWORDS = new Set(["de", "da", "do", "das", "dos", "em", "para", "com", "por", "um", "uma", "ou"]);

/** Busca por código (prefixo) ou por palavras na descrição. */
export function buscarCnae(
  base: BaseCnae,
  termo: string,
  limite = 12,
): CnaeSubclasse[] {
  const t = termo.trim();
  if (t.length < 2) return [];
  const digitos = somenteDigitos(t);
  if (digitos.length >= 2 && digitos.length === t.replace(/[\s\-\/.]/g, "").length) {
    return base.subclasses
      .filter((s) => somenteDigitos(s.c).startsWith(digitos))
      .slice(0, limite);
  }
  const palavras = normalizar(t)
    .split(/\s+/)
    .filter((p) => p.length > 1 && !STOPWORDS.has(p))
    .map((p) => SINONIMOS[p] ?? p);
  if (palavras.length === 0) return [];
  const pontuados: Array<{ s: CnaeSubclasse; score: number }> = [];
  for (const s of base.subclasses) {
    const d = normalizar(s.d);
    let score = 0;
    let todas = true;
    for (const p of palavras) {
      const idx = d.indexOf(p);
      if (idx === -1) {
        todas = false;
        break;
      }
      score += idx === 0 ? 3 : d[idx - 1] === " " ? 2 : 1;
    }
    if (todas) pontuados.push({ s, score: score - d.length / 200 });
  }
  return pontuados
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map((p) => p.s);
}

export function regraPara(cnae: string): RegraCnae | null {
  const d = somenteDigitos(cnae);
  let melhor: RegraCnae | null = null;
  for (const r of REGRAS_CNAE) {
    // Empate de comprimento: a regra declarada por último vence (refinamentos no fim da lista).
    if (d.startsWith(r.prefixo) && (!melhor || r.prefixo.length >= melhor.prefixo.length)) {
      melhor = r;
    }
  }
  return melhor;
}

export function classificarCnae(
  sub: CnaeSubclasse,
  impeditivos: Impeditivo[] = [],
  ambiguos: Impeditivo[] = [],
): ClassificacaoCnae {
  const regra = regraPara(sub.c);
  const atividade: Atividade = regra?.atividade ?? "servicos";
  const d = somenteDigitos(sub.c);
  const impeditivo = impeditivos.find((i) => somenteDigitos(i.cnae) === d);
  const ambiguo = ambiguos.find((i) => somenteDigitos(i.cnae) === d);
  return {
    cnae: sub.c,
    descricao: sub.d,
    secao: sub.s,
    atividade,
    anexoBase: anexoBase(atividade),
    sujeitoFatorR: sujeitoAoFatorR(atividade),
    profissaoRegulamentada: regra?.regulamentada ?? false,
    setorReforma: regra?.setor ?? "geral",
    impeditivo,
    ambiguo,
    nota: regra?.nota,
    fonte: regra?.fonte ?? "Regra residual: serviços não listados — Anexo III (LC 123/2006, art. 18, § 5º-F)",
  };
}

export const NOME_ATIVIDADE: Record<Atividade, string> = {
  comercio: "Comércio",
  industria: "Indústria",
  servicos: "Serviços em geral",
  servicos_fator_r: "Serviços intelectuais (Fator R)",
  servicos_anexo_iv: "Construção, vigilância, limpeza ou advocacia",
  locacao_bens_moveis: "Locação de bens móveis",
  transporte_cargas: "Transporte de cargas",
  intelectual_regulamentada: "Profissão regulamentada (Fator R)",
};
