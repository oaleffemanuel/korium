"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** "12.000,50" → 12000.5; aceita também "12000.50". */
export function parseNumero(s: string): number {
  const t = s.trim().replace(/\s|R\$|%/g, "");
  if (!t) return 0;
  const brasileiro = /,\d{1,2}$/.test(t) || (t.includes(",") && !t.includes("."));
  const limpo = brasileiro ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  const n = Number(limpo);
  return Number.isFinite(n) ? n : 0;
}

export function formatarNumero(n: number, casas = 2): string {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

export function Campo({
  label,
  hint,
  children,
  className,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.8125rem] font-semibold text-pc-text">{label}</span>
      {children}
      {hint ? <span className="text-[0.75rem] leading-relaxed text-pc-muted">{hint}</span> : null}
    </label>
  );
}

export const inputBase = cn(
  "h-11 w-full rounded-[10px] border border-pc-border bg-white px-3.5 text-base text-pc-text md:text-[0.9375rem]",
  "placeholder:text-pc-muted transition-[border-color,box-shadow] duration-150",
  "hover:border-pc-border-strong",
  "focus:border-pc-primary focus:outline-none focus:ring-[3px] focus:ring-pc-primary/20",
);

export function Entrada(
  props: React.InputHTMLAttributes<HTMLInputElement> & { prefixo?: string; sufixo?: string },
) {
  const { prefixo, sufixo, className, ...rest } = props;
  return (
    <span className="relative flex items-center">
      {prefixo ? (
        <span className="pointer-events-none absolute left-3.5 text-[0.875rem] font-medium text-pc-muted">
          {prefixo}
        </span>
      ) : null}
      <input {...rest} className={cn(inputBase, prefixo && "pl-10", sufixo && "pr-9", className)} />
      {sufixo ? (
        <span className="pointer-events-none absolute right-3.5 text-[0.875rem] font-medium text-pc-muted">
          {sufixo}
        </span>
      ) : null}
    </span>
  );
}

export function Selecao(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;
  return (
    <span className="relative flex items-center">
      <select {...rest} className={cn(inputBase, "appearance-none pr-9", className)} />
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-3.5 size-4 text-pc-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Campo monetário em reais: mostra formatado, devolve número. */
export function Dinheiro({
  value,
  onChange,
  ...rest
}: {
  value: number;
  onChange: (v: number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const [texto, setTexto] = React.useState(value ? formatarNumero(value) : "");
  const [foco, setFoco] = React.useState(false);
  React.useEffect(() => {
    if (!foco) setTexto(value ? formatarNumero(value) : "");
  }, [value, foco]);
  return (
    <Entrada
      {...rest}
      prefixo="R$"
      inputMode="decimal"
      value={texto}
      onFocus={() => setFoco(true)}
      onBlur={() => {
        setFoco(false);
        onChange(parseNumero(texto));
      }}
      onChange={(e) => {
        setTexto(e.target.value);
        onChange(parseNumero(e.target.value));
      }}
    />
  );
}

/** Percentual: mostra "5" para 0,05. */
export function Percentual({
  value,
  onChange,
  ...rest
}: {
  value: number;
  onChange: (v: number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const [texto, setTexto] = React.useState(formatarNumero(value * 100, 2).replace(/,00$/, ""));
  const [foco, setFoco] = React.useState(false);
  React.useEffect(() => {
    if (!foco) setTexto(formatarNumero(value * 100, 2).replace(/,00$/, ""));
  }, [value, foco]);
  return (
    <Entrada
      {...rest}
      sufixo="%"
      inputMode="decimal"
      value={texto}
      onFocus={() => setFoco(true)}
      onBlur={() => setFoco(false)}
      onChange={(e) => {
        setTexto(e.target.value);
        onChange(parseNumero(e.target.value) / 100);
      }}
    />
  );
}

/** Botão primário da calculadora: azul sólido, cantos 12px. */
export function Botao({
  variante = "primario",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: "primario" | "secundario" }) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-[0.9375rem] font-semibold",
        "transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        variante === "primario"
          ? "bg-pc-primary text-white shadow-[0_1px_2px_rgba(37,99,235,0.3)] hover:bg-pc-primary-hover"
          : "border border-pc-border bg-white text-pc-text hover:border-pc-border-strong hover:bg-pc-bg",
        className,
      )}
    />
  );
}
