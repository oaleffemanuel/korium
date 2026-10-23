"use client";

import * as React from "react";
import { ArrowRight, ChevronDown, ImagePlus, Lock, Sparkles, X } from "lucide-react";

import { Botao, Campo, Dinheiro, Entrada, Percentual, Selecao } from "@/components/planejador/campos";
import { carregar, CnaeBusca } from "@/components/planejador/cnae-busca";
import { Resultados } from "@/components/planejador/resultados";
import { classificarCnae, NOME_ATIVIDADE, type ClassificacaoCnae } from "@/lib/planejador/cnae";
import { simular, type Comparativo } from "@/lib/planejador/simular";
import type { Atividade, EntradaSimulacao } from "@/lib/planejador/types";
import { cn } from "@/lib/utils";

export interface DadosEmpresa {
  nome: string;
  /** Data URL da logo enviada pelo visitante. Nunca sai do navegador. */
  logo: string | null;
  cnae: ClassificacaoCnae | null;
}

type Form = {
  receitaMensal: number;
  folhaMensal: number;
  proLaboreMensal: number;
  socios: number;
  empregados: number;
  issMunicipal: number;
  margemLucro: number;
  custosComCredito: number;
  vendasParaEmpresas: number;
  atividade: Atividade;
  inicioAtividade: boolean;
};

const INICIAL: Form = {
  receitaMensal: 30_000,
  folhaMensal: 0,
  proLaboreMensal: 3_000,
  socios: 1,
  empregados: 0,
  issMunicipal: 0.05,
  margemLucro: 0.3,
  custosComCredito: 0.2,
  vendasParaEmpresas: 0,
  atividade: "servicos",
  inicioAtividade: false,
};

const ATIVIDADES_MANUAIS: Atividade[] = [
  "servicos",
  "servicos_fator_r",
  "comercio",
  "industria",
  "servicos_anexo_iv",
  "transporte_cargas",
  "locacao_bens_moveis",
];

function Passo({ n, titulo, extra }: { n: number; titulo: string; extra?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pc-primary text-[0.75rem] font-bold text-white">
        {n}
      </span>
      <span className="text-[0.9375rem] font-semibold text-pc-text">{titulo}</span>
      {extra ? <span className="text-[0.8125rem] font-normal text-pc-muted">{extra}</span> : null}
    </span>
  );
}

/** Seção opcional, fechada por padrão: o formulário fica curto para quem só quer o essencial. */
function SecaoOpcional({ n, titulo, extra, children }: { n: number; titulo: string; extra: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-pc-border pt-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <Passo n={n} titulo={titulo} extra={extra} />
        <ChevronDown className="size-4 shrink-0 text-pc-muted transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </details>
  );
}

export function Planejador() {
  const [form, setForm] = React.useState<Form>(INICIAL);
  const [empresa, setEmpresa] = React.useState<DadosEmpresa>({ nome: "", logo: null, cnae: null });
  const [comparativo, setComparativo] = React.useState<Comparativo | null>(null);
  const [erroLogo, setErroLogo] = React.useState<string | null>(null);
  const [carregandoExemplo, setCarregandoExemplo] = React.useState(false);
  const resultadosRef = React.useRef<HTMLDivElement>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function escolherCnae(c: ClassificacaoCnae | null) {
    setEmpresa((e) => ({ ...e, cnae: c }));
    if (c) set("atividade", c.atividade);
  }

  function entrada(f: Form, e: DadosEmpresa): EntradaSimulacao {
    return {
      receitaAnual: f.receitaMensal * 12,
      folhaAnual: f.folhaMensal * 12,
      proLaboreAnual: f.proLaboreMensal * 12,
      socios: f.socios,
      empregados: f.empregados,
      issMunicipal: f.issMunicipal,
      margemLucro: f.margemLucro,
      custosComCredito: f.custosComCredito,
      atividade: f.atividade,
      cnae: e.cnae?.cnae,
      inicioAtividade: f.inicioAtividade,
      profissaoRegulamentada: e.cnae?.profissaoRegulamentada ?? false,
      setorReforma: e.cnae?.setorReforma ?? "geral",
      vendasParaEmpresas: f.vendasParaEmpresas,
    };
  }

  function rolarParaResultados() {
    requestAnimationFrame(() =>
      resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setComparativo(simular(entrada(form, empresa)));
    rolarParaResultados();
  }

  /** Preenche um caso típico (clínica odontológica) e já mostra o resultado. */
  async function exemplo() {
    setCarregandoExemplo(true);
    try {
      const dados = await carregar();
      const sub = dados.base.subclasses.find((s) => s.c === "8630-5/04");
      const cnae = sub ? classificarCnae(sub, dados.impeditivos, dados.ambiguos) : null;
      const f: Form = { ...INICIAL, receitaMensal: 30_000, proLaboreMensal: 6_000, atividade: cnae?.atividade ?? "servicos_fator_r" };
      const e: DadosEmpresa = { nome: "Clínica Exemplo", logo: null, cnae };
      setForm(f);
      setEmpresa(e);
      setComparativo(simular(entrada(f, e)));
      rolarParaResultados();
    } finally {
      setCarregandoExemplo(false);
    }
  }

  function onLogo(file: File | undefined) {
    setErroLogo(null);
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) {
      setErroLogo("Envie PNG, JPG, WEBP ou SVG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErroLogo("A imagem precisa ter até 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setEmpresa((e) => ({ ...e, logo: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  const servico =
    form.atividade !== "comercio" &&
    form.atividade !== "industria" &&
    form.atividade !== "locacao_bens_moveis";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-pc-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] md:p-6 lg:sticky lg:top-24"
      >
        <div className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4">
              <Passo n={1} titulo="O que a empresa faz" />
            </legend>
            <Campo label="Atividade principal (CNAE)" hint="Busque por palavra ou código. Define o anexo do Simples e a presunção do Presumido.">
              <CnaeBusca valor={empresa.cnae} onChange={escolherCnae} />
            </Campo>
            {!empresa.cnae ? (
              <Campo label="Ou escolha a natureza da atividade">
                <Selecao value={form.atividade} onChange={(e) => set("atividade", e.target.value as Atividade)}>
                  {ATIVIDADES_MANUAIS.map((a) => (
                    <option key={a} value={a}>
                      {NOME_ATIVIDADE[a]}
                    </option>
                  ))}
                </Selecao>
              </Campo>
            ) : empresa.cnae.nota ? (
              <p className="rounded-[10px] bg-pc-bg px-3.5 py-3 text-[0.8125rem] leading-relaxed text-pc-text-2">{empresa.cnae.nota}</p>
            ) : null}
            <label className="flex items-center gap-2.5 text-[0.875rem] text-pc-text-2">
              <input
                type="checkbox"
                checked={form.inicioAtividade}
                onChange={(e) => set("inicioAtividade", e.target.checked)}
                className="size-4 rounded accent-pc-primary"
              />
              Empresa nova (ainda vou abrir ou abri este ano)
            </label>
          </fieldset>

          <fieldset className="flex flex-col gap-4 border-t border-pc-border pt-5">
            <legend className="mb-4">
              <Passo n={2} titulo="Números por mês" />
            </legend>
            <Campo label="Faturamento mensal" hint="Receita bruta média. Usamos 12 × este valor no ano.">
              <Dinheiro value={form.receitaMensal} onChange={(v) => set("receitaMensal", v)} />
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Pró-labore (sócios)">
                <Dinheiro value={form.proLaboreMensal} onChange={(v) => set("proLaboreMensal", v)} />
              </Campo>
              <Campo label="Folha de empregados" hint="Com encargos, sem pró-labore.">
                <Dinheiro value={form.folhaMensal} onChange={(v) => set("folhaMensal", v)} />
              </Campo>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Sócios">
                <Entrada type="number" min={1} max={50} value={form.socios} onChange={(e) => set("socios", Math.max(1, Number(e.target.value) || 1))} />
              </Campo>
              <Campo label="Empregados">
                <Entrada type="number" min={0} max={500} value={form.empregados} onChange={(e) => set("empregados", Math.max(0, Number(e.target.value) || 0))} />
              </Campo>
            </div>
          </fieldset>

          <SecaoOpcional n={3} titulo="Ajustes finos" extra="opcional">
            <div className="grid grid-cols-2 gap-3">
              {servico ? (
                <Campo label="ISS do município" hint="2 % a 5 %. Em dúvida, 5 %.">
                  <Percentual value={form.issMunicipal} onChange={(v) => set("issMunicipal", Math.min(0.05, Math.max(0, v)))} />
                </Campo>
              ) : null}
              <Campo label="Margem de lucro" hint="Só muda o Lucro Real.">
                <Percentual value={form.margemLucro} onChange={(v) => set("margemLucro", Math.min(1, Math.max(0, v)))} />
              </Campo>
              <Campo label="Compras com crédito" hint="Insumos de empresas, % da receita.">
                <Percentual value={form.custosComCredito} onChange={(v) => set("custosComCredito", Math.min(1, Math.max(0, v)))} />
              </Campo>
              <Campo label="Vendas para empresas" hint="Clientes PJ, % da receita. Pesa na Reforma.">
                <Percentual value={form.vendasParaEmpresas} onChange={(v) => set("vendasParaEmpresas", Math.min(1, Math.max(0, v)))} />
              </Campo>
            </div>
          </SecaoOpcional>

          <SecaoOpcional n={4} titulo="Para o PDF" extra="nome e logo, opcional">
            <Campo label="Nome da empresa">
              <Entrada
                type="text"
                maxLength={80}
                placeholder="Como deve aparecer no relatório"
                value={empresa.nome}
                onChange={(e) => setEmpresa((em) => ({ ...em, nome: e.target.value }))}
              />
            </Campo>
            <Campo
              label="Logo da empresa"
              hint={
                <span className="inline-flex items-center gap-1">
                  <Lock className="size-3" aria-hidden /> Fica só no seu navegador. Nada é enviado.
                </span>
              }
            >
              {empresa.logo ? (
                <div className="flex items-center gap-4 rounded-[10px] border border-pc-border bg-pc-bg p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={empresa.logo} alt="" className="h-12 max-w-[9rem] object-contain" />
                  <button
                    type="button"
                    onClick={() => setEmpresa((e) => ({ ...e, logo: null }))}
                    className="ml-auto inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-pc-muted hover:text-pc-text"
                  >
                    <X className="size-3.5" /> Remover
                  </button>
                </div>
              ) : (
                <span
                  className={cn(
                    "flex h-16 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-dashed border-pc-border-strong bg-pc-bg text-[0.875rem] font-medium text-pc-text-2",
                    "transition-colors hover:border-pc-primary hover:bg-pc-primary-soft hover:text-pc-primary",
                  )}
                >
                  <ImagePlus className="size-4" /> Enviar imagem
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="sr-only"
                    onChange={(e) => onLogo(e.target.files?.[0])}
                  />
                </span>
              )}
              {erroLogo ? <span className="text-[0.75rem] text-pc-danger">{erroLogo}</span> : null}
            </Campo>
          </SecaoOpcional>

          <div className="flex flex-col gap-2.5 border-t border-pc-border pt-5">
            <Botao type="submit" className="w-full">
              Comparar os regimes <ArrowRight />
            </Botao>
            <p className="text-center text-[0.75rem] leading-relaxed text-pc-muted">
              Estimativa com as tabelas de 2026. Não substitui a análise de um contador.
            </p>
          </div>
        </div>
      </form>

      <div ref={resultadosRef} className="min-w-0 scroll-mt-24">
        {comparativo ? (
          <Resultados comparativo={comparativo} empresa={empresa} />
        ) : (
          <Vazio onExemplo={exemplo} carregando={carregandoExemplo} />
        )}
      </div>
    </div>
  );
}

function Vazio({ onExemplo, carregando }: { onExemplo: () => void; carregando: boolean }) {
  const itens = [
    ["MEI, Simples, Presumido e Real", "Quanto cada um custa por ano, com os encargos de folha incluídos."],
    ["Anexo e Fator R", "Em qual anexo o seu CNAE cai e quanto de folha mudaria o jogo."],
    ["Reforma Tributária", "O custo de cada caminho de 2027 a 2033, ano a ano."],
    ["PDF com a sua marca", "Para guardar ou levar ao seu contador."],
  ];
  return (
    <div className="flex min-h-[28rem] flex-col justify-center rounded-2xl border border-dashed border-pc-border-strong bg-white/60 p-7 md:p-10">
      <h2 className="text-[1.375rem] font-semibold tracking-[-0.01em] text-pc-text md:text-[1.625rem]">
        Preencha ao lado. O resultado aparece aqui.
      </h2>
      <p className="mt-2 text-[0.9375rem] text-pc-text-2">
        Leva um minuto. Se preferir ver antes como fica, carregue um exemplo.
      </p>
      <div className="mt-5">
        <Botao type="button" variante="secundario" onClick={onExemplo} disabled={carregando} className="h-11">
          <Sparkles className="text-pc-primary" /> {carregando ? "Carregando…" : "Ver um exemplo: clínica odontológica"}
        </Botao>
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {itens.map(([t, d]) => (
          <li key={t} className="rounded-xl border border-pc-border bg-white p-4">
            <div className="text-[0.9375rem] font-semibold text-pc-text">{t}</div>
            <div className="mt-1 text-[0.875rem] leading-relaxed text-pc-text-2">{d}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
