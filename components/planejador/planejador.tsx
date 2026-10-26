"use client";

import * as React from "react";
import { ArrowRight, ChevronDown, ImagePlus, Lock, Sparkles, X } from "lucide-react";

import { Botao, Campo, Dinheiro, Entrada, Percentual, Selecao } from "@/components/planejador/campos";
import { carregar, CnaeBusca } from "@/components/planejador/cnae-busca";
import { Resultados } from "@/components/planejador/resultados";
import { classificarCnae, NOME_ATIVIDADE, type ClassificacaoCnae } from "@/lib/planejador/cnae";
import { brl } from "@/lib/planejador/money";
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
  receitaMensal: 0,
  folhaMensal: 0,
  proLaboreMensal: 0,
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

const CHIPS_RECEITA = [10_000, 20_000, 30_000, 50_000, 100_000];
const CHIPS_PRO_LABORE = [1_621, 3_000, 5_000, 10_000];

function Chips({
  valores,
  atual,
  onPick,
}: {
  valores: number[];
  atual: number;
  onPick: (v: number) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {valores.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onPick(v)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[0.75rem] font-medium transition-colors",
            atual === v
              ? "border-pc-primary bg-pc-primary-soft text-pc-primary"
              : "border-pc-border bg-white text-pc-text-2 hover:border-pc-border-strong hover:text-pc-text",
          )}
        >
          {v >= 1000 ? `${Math.round(v / 1000)} mil` : brl(v)}
        </button>
      ))}
    </div>
  );
}

export function Planejador() {
  const [form, setForm] = React.useState<Form>(INICIAL);
  const [empresa, setEmpresa] = React.useState<DadosEmpresa>({ nome: "", logo: null, cnae: null });
  const [comparativo, setComparativo] = React.useState<Comparativo | null>(null);
  const [erroLogo, setErroLogo] = React.useState<string | null>(null);
  const [carregandoExemplo, setCarregandoExemplo] = React.useState(false);
  const [tentou, setTentou] = React.useState(false);
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

  const faltaReceita = form.receitaMensal <= 0;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTentou(true);
    if (faltaReceita) return;
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

  const passoAtividade = Boolean(empresa.cnae);
  const passoNumeros = form.receitaMensal > 0;

  return (
    <>
      {/* ------------------------------------------------------------ formulário essencial */}
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-pc-border bg-white p-5 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] md:p-7"
      >
        <ol className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] font-medium">
          {[
            ["Atividade", passoAtividade],
            ["Números do mês", passoNumeros],
            ["Resultado", Boolean(comparativo)],
          ].map(([t, ok], i) => (
            <li key={String(t)} className="inline-flex items-center gap-2">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[0.6875rem] font-bold",
                  ok ? "bg-pc-success text-white" : "bg-pc-bg text-pc-muted ring-1 ring-pc-border",
                )}
              >
                {ok ? "✓" : i + 1}
              </span>
              <span className={ok ? "text-pc-text" : "text-pc-muted"}>{t}</span>
            </li>
          ))}
        </ol>

        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-12 lg:col-span-5">
            <Campo
              label="O que a empresa faz"
              hint={
                empresa.cnae
                  ? undefined
                  : "Digite como você diria: dentista, loja de roupas, programador. Ou o código CNAE."
              }
            >
              <CnaeBusca valor={empresa.cnae} onChange={escolherCnae} />
            </Campo>
            {!empresa.cnae ? (
              <div className="mt-2">
                <Selecao
                  value={form.atividade}
                  onChange={(e) => set("atividade", e.target.value as Atividade)}
                  aria-label="Ou escolha a natureza da atividade"
                  className="h-9 text-[0.8125rem] md:text-[0.8125rem]"
                >
                  {ATIVIDADES_MANUAIS.map((a) => (
                    <option key={a} value={a}>
                      {NOME_ATIVIDADE[a]}
                    </option>
                  ))}
                </Selecao>
              </div>
            ) : empresa.cnae.nota ? (
              <p className="mt-2 text-[0.75rem] leading-relaxed text-pc-muted">{empresa.cnae.nota}</p>
            ) : null}
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <Campo label="Faturamento por mês">
              <Dinheiro
                value={form.receitaMensal}
                onChange={(v) => set("receitaMensal", v)}
                placeholder="30.000"
                aria-invalid={tentou && faltaReceita}
                className={cn(tentou && faltaReceita && "border-pc-danger ring-[3px] ring-pc-danger/15")}
              />
            </Campo>
            <Chips valores={CHIPS_RECEITA} atual={form.receitaMensal} onPick={(v) => set("receitaMensal", v)} />
            {tentou && faltaReceita ? (
              <p className="mt-1.5 text-[0.75rem] font-medium text-pc-danger">Informe o faturamento para calcular.</p>
            ) : null}
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <Campo label="Pró-labore por mês" hint="O que os sócios retiram.">
              <Dinheiro value={form.proLaboreMensal} onChange={(v) => set("proLaboreMensal", v)} placeholder="3.000" />
            </Campo>
            <Chips valores={CHIPS_PRO_LABORE} atual={form.proLaboreMensal} onPick={(v) => set("proLaboreMensal", v)} />
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <Campo label="Folha por mês" hint="Salários com encargos. Zero se não tem.">
              <Dinheiro value={form.folhaMensal} onChange={(v) => set("folhaMensal", v)} placeholder="0" />
            </Campo>
          </div>
        </div>

        <details className="group mt-5 rounded-xl border border-pc-border bg-pc-bg/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[0.875rem] font-semibold text-pc-text [&::-webkit-details-marker]:hidden">
            <span>
              Mais opções{" "}
              <span className="font-normal text-pc-muted">sócios, empregados, ISS, margem, nome e logo para o PDF</span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-pc-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="grid gap-4 border-t border-pc-border px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
            <Campo label="Sócios">
              <Entrada type="number" min={1} max={50} value={form.socios} onChange={(e) => set("socios", Math.max(1, Number(e.target.value) || 1))} />
            </Campo>
            <Campo label="Empregados">
              <Entrada type="number" min={0} max={500} value={form.empregados} onChange={(e) => set("empregados", Math.max(0, Number(e.target.value) || 0))} />
            </Campo>
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
            <label className="flex items-center gap-2.5 self-end pb-2 text-[0.875rem] text-pc-text-2">
              <input
                type="checkbox"
                checked={form.inicioAtividade}
                onChange={(e) => set("inicioAtividade", e.target.checked)}
                className="size-4 rounded accent-pc-primary"
              />
              Empresa nova (abri ou vou abrir este ano)
            </label>
            <Campo label="Nome da empresa (para o PDF)">
              <Entrada
                type="text"
                maxLength={80}
                placeholder="Como deve aparecer"
                value={empresa.nome}
                onChange={(e) => setEmpresa((em) => ({ ...em, nome: e.target.value }))}
              />
            </Campo>
            <Campo
              label="Logo (para o PDF)"
              className="sm:col-span-2 lg:col-span-4"
              hint={
                <span className="inline-flex items-center gap-1">
                  <Lock className="size-3" aria-hidden /> Fica só no seu navegador. Nada é enviado.
                </span>
              }
            >
              {empresa.logo ? (
                <div className="flex items-center gap-4 rounded-[10px] border border-pc-border bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={empresa.logo} alt="" className="h-10 max-w-[9rem] object-contain" />
                  <button
                    type="button"
                    onClick={() => setEmpresa((e) => ({ ...e, logo: null }))}
                    className="ml-auto inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-pc-muted hover:text-pc-text"
                  >
                    <X className="size-3.5" /> Remover
                  </button>
                </div>
              ) : (
                <span className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-dashed border-pc-border-strong bg-white text-[0.875rem] font-medium text-pc-text-2 transition-colors hover:border-pc-primary hover:text-pc-primary">
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
          </div>
        </details>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] leading-relaxed text-pc-muted">
            Tabelas de 2026. Estimativa educativa: não substitui a análise de um contador.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {!comparativo ? (
              <Botao type="button" variante="secundario" onClick={exemplo} disabled={carregandoExemplo} className="h-12">
                <Sparkles className="text-pc-primary" /> {carregandoExemplo ? "Carregando…" : "Ver um exemplo"}
              </Botao>
            ) : null}
            <Botao type="submit" className="h-12 px-7">
              {comparativo ? "Recalcular" : "Comparar os regimes"} <ArrowRight />
            </Botao>
          </div>
        </div>
      </form>

      {/* ------------------------------------------------------------ resultado */}
      <div ref={resultadosRef} className="mt-10 scroll-mt-24 md:mt-14">
        {comparativo ? <Resultados comparativo={comparativo} empresa={empresa} /> : <Guia />}
      </div>
    </>
  );
}

function Guia() {
  const passos = [
    ["1", "Diga o que a empresa faz", "A atividade define o anexo do Simples e a presunção do Lucro Presumido. É a pergunta que mais muda o imposto."],
    ["2", "Informe faturamento, pró-labore e folha", "Três números por mês bastam. Pró-labore e folha decidem o Fator R, que pode cortar o imposto quase pela metade."],
    ["3", "Compare e leve o resultado", "MEI, Simples, Presumido e Real lado a lado, com o porquê. Baixe o PDF com a sua marca ou mande para a gente conferir."],
  ];
  return (
    <section aria-label="Como funciona" className="grid gap-4 md:grid-cols-3">
      {passos.map(([n, t, d]) => (
        <div key={n} className="rounded-2xl border border-pc-border bg-white p-6">
          <span className="text-[2rem] font-bold leading-none tracking-[-0.03em] text-pc-primary/30">{n}</span>
          <h2 className="mt-3 text-[1.0625rem] font-semibold text-pc-text">{t}</h2>
          <p className="mt-1.5 text-[0.9rem] leading-relaxed text-pc-text-2">{d}</p>
        </div>
      ))}
    </section>
  );
}
