/** Arredonda a centavos sem viés de ponto flutuante. */
export function round2(v: number): number {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

export function brl(v: number): string {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** 0.0612 → "6,12 %". */
export function pct(v: number, digits = 2): string {
  return `${(v * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} %`;
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
