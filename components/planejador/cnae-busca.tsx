"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { inputBase } from "@/components/planejador/campos";
import {
  buscarCnae,
  classificarCnae,
  type BaseCnae,
  type ClassificacaoCnae,
  type Impeditivo,
} from "@/lib/planejador/cnae";
import { cn } from "@/lib/utils";

type Dados = { base: BaseCnae; impeditivos: Impeditivo[]; ambiguos: Impeditivo[] };

let cache: Promise<Dados> | null = null;
function carregar(): Promise<Dados> {
  if (!cache) {
    cache = Promise.all([
      import("@/lib/planejador/data/cnae.json"),
      import("@/lib/planejador/data/cnae-impeditivos.json"),
      import("@/lib/planejador/data/cnae-ambiguos.json"),
    ]).then(([b, i, a]) => ({
      base: b.default as BaseCnae,
      impeditivos: i.default as Impeditivo[],
      ambiguos: a.default as Impeditivo[],
    }));
  }
  return cache;
}

export function CnaeBusca({
  valor,
  onChange,
}: {
  valor: ClassificacaoCnae | null;
  onChange: (c: ClassificacaoCnae | null) => void;
}) {
  const [termo, setTermo] = React.useState("");
  const [dados, setDados] = React.useState<Dados | null>(null);
  const [aberto, setAberto] = React.useState(false);
  const [ativo, setAtivo] = React.useState(0);

  const resultados = React.useMemo(
    () => (dados ? buscarCnae(dados.base, termo, 10) : []),
    [dados, termo],
  );

  React.useEffect(() => {
    if (termo.length >= 2 && !dados) void carregar().then(setDados);
  }, [termo, dados]);

  function escolher(i: number) {
    const s = resultados[i];
    if (!s || !dados) return;
    onChange(classificarCnae(s, dados.impeditivos, dados.ambiguos));
    setTermo("");
    setAberto(false);
  }

  if (valor) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-[10px] border border-pc-primary/40 bg-pc-primary-soft px-3.5 py-3">
        <div className="min-w-0">
          <div className="font-mono text-[0.75rem] font-medium text-pc-primary">{valor.cnae}</div>
          <div className="mt-0.5 text-[0.9375rem] leading-snug text-pc-text">{valor.descricao}</div>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="shrink-0 rounded-full p-1 text-pc-muted transition-colors hover:bg-white hover:text-pc-text"
          aria-label="Trocar CNAE"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <span className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3.5 size-4 text-pc-muted" aria-hidden />
        <input
          type="text"
          value={termo}
          onChange={(e) => {
            setTermo(e.target.value);
            setAberto(true);
            setAtivo(0);
          }}
          onFocus={() => {
            setAberto(true);
            void carregar().then(setDados);
          }}
          onBlur={() => setTimeout(() => setAberto(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setAtivo((a) => Math.min(a + 1, resultados.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setAtivo((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              escolher(ativo);
            }
          }}
          placeholder="Ex.: dentista, programador, loja de roupas, 6201…"
          autoComplete="off"
          role="combobox"
          aria-expanded={aberto && resultados.length > 0}
          aria-controls="cnae-lista"
          className={cn(inputBase, "pl-10")}
        />
      </span>
      {aberto && termo.length >= 2 ? (
        <ul
          id="cnae-lista"
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-80 w-full overflow-auto rounded-xl border border-pc-border bg-white p-1 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)]"
        >
          {!dados ? (
            <li className="px-3 py-2.5 text-[0.875rem] text-pc-muted">Carregando a tabela CNAE…</li>
          ) : resultados.length === 0 ? (
            <li className="px-3 py-2.5 text-[0.875rem] text-pc-muted">
              Nada encontrado. Tente outra palavra ou o código numérico.
            </li>
          ) : (
            resultados.map((s, i) => (
              <li
                key={s.c}
                role="option"
                aria-selected={i === ativo}
                onMouseDown={(e) => {
                  e.preventDefault();
                  escolher(i);
                }}
                onMouseEnter={() => setAtivo(i)}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg px-3 py-2.5",
                  i === ativo ? "bg-pc-primary-soft text-pc-text" : "text-pc-text-2",
                )}
              >
                <span className="shrink-0 font-mono text-[0.75rem] leading-6 text-pc-muted">{s.c}</span>
                <span className="text-[0.875rem] leading-6">{s.d}</span>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
