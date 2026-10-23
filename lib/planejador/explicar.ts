import { brl, pct } from "./money";
import { NOME_REGIME, type Comparativo } from "./simular";
import type { ResultadoRegime, Tributo } from "./types";

/** Famílias de tributos comparáveis entre regimes. */
const FAMILIA: Record<Tributo, string> = {
  IRPJ: "IRPJ e CSLL",
  CSLL: "IRPJ e CSLL",
  PIS: "PIS e COFINS",
  COFINS: "PIS e COFINS",
  CPP: "INSS e encargos patronais",
  RAT: "INSS e encargos patronais",
  TERCEIROS: "INSS e encargos patronais",
  INSS_PROLABORE: "INSS e encargos patronais",
  ISS: "ISS",
  ICMS: "ICMS",
  IPI: "IPI",
  CBS: "CBS e IBS",
  IBS: "CBS e IBS",
};

function porFamilia(r: ResultadoRegime): Map<string, number> {
  const m = new Map<string, number>();
  for (const l of r.linhas) m.set(FAMILIA[l.tributo], (m.get(FAMILIA[l.tributo]) ?? 0) + l.valorAnual);
  return m;
}

/**
 * Explica, em frases curtas, por que o regime indicado custa menos que a
 * segunda opção: as maiores diferenças linha a linha e o que pesa contra.
 */
export function explicarVencedor(c: Comparativo): string[] {
  const r = c.recomendado;
  const s = c.segundo;
  if (!r || !s) return [];

  const vr = porFamilia(r);
  const vs = porFamilia(s);
  const tributos = new Set<string>([...vr.keys(), ...vs.keys()]);
  const difs = [...tributos]
    .map((t) => ({ t, dif: (vs.get(t) ?? 0) - (vr.get(t) ?? 0), r: vr.get(t) ?? 0, s: vs.get(t) ?? 0 }))
    .sort((a, b) => b.dif - a.dif);

  const frases: string[] = [];
  const total = c.economiaAnual;
  frases.push(
    `${NOME_REGIME[r.regime]} custa ${brl(total)} a menos por ano que ${NOME_REGIME[s.regime]} (${pct(r.cargaEfetiva, 1)} contra ${pct(s.cargaEfetiva, 1)} da receita).`,
  );

  if (r.regime === "SIMPLES" && r.simples) {
    frases.push(
      `No Simples, um único DAS de ${pct(r.simples.aliquotaEfetiva)} sobre a receita cobre IRPJ, CSLL, PIS, COFINS, INSS patronal${r.simples.anexo === "IV" ? "" : " (inclusive sobre o pró-labore)"} e ${r.simples.anexo === "I" || r.simples.anexo === "II" ? "ICMS" : "ISS"}.`,
    );
  }

  const favor = difs.filter((d) => d.dif > Math.max(1, total * 0.08)).slice(0, 3);
  for (const d of favor) {
    const nome = d.t;
    if (d.r === 0) {
      frases.push(
        `${nome}: ${brl(d.s)} no ${NOME_REGIME[s.regime]}, ${r.regime === "SIMPLES" ? "já embutido no DAS do Simples" : "zero no " + NOME_REGIME[r.regime]}.`,
      );
    } else {
      frases.push(`${nome}: ${brl(d.s)} no ${NOME_REGIME[s.regime]} contra ${brl(d.r)} no ${NOME_REGIME[r.regime]}.`);
    }
  }

  const contra = difs.filter((d) => d.dif < 0 && -d.dif > Math.max(1, total * 0.1)).sort((a, b) => a.dif - b.dif)[0];
  if (contra) {
    frases.push(
      `Em compensação, ${contra.t} pesa mais no ${NOME_REGIME[r.regime]}: ${brl(contra.r)} contra ${brl(contra.s)}.`,
    );
  }
  return frases;
}
