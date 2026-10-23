/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

import type { DadosEmpresa } from "@/components/planejador/planejador";
import { NOME_ATIVIDADE } from "@/lib/planejador/cnae";
import { explicarVencedor } from "@/lib/planejador/explicar";
import { GLOSSARIO, NOME_TRIBUTO } from "@/lib/planejador/nomes";
import { brl, pct } from "@/lib/planejador/money";
import { NOME_REGIME_REFORMA, type ProjecaoReforma, type RegimeReforma } from "@/lib/planejador/reforma";
import { NOME_REGIME, type Comparativo } from "@/lib/planejador/simular";
import { ANO_REFERENCIA } from "@/lib/planejador/tabelas/parametros";
import type { ResultadoRegime } from "@/lib/planejador/types";
import { mensagemWhatsApp } from "@/lib/planejador/whatsapp";
import { site, whatsappLink } from "@/lib/site";

/* ------------------------------------------------------------------
   Identidade da calculadora (fintech clara): mesma paleta da tela.
------------------------------------------------------------------- */
const C = {
  bg: "#F6F8FB",
  white: "#FFFFFF",
  text: "#0F172A",
  text2: "#475569",
  muted: "#64748B",
  muted2: "#94A3B8",
  primary: "#2563EB",
  primarySoft: "#EFF4FF",
  success: "#15803D",
  successSoft: "#ECFDF3",
  warning: "#B45309",
  warningSoft: "#FFF7E6",
  danger: "#B91C1C",
  dangerSoft: "#FEF2F2",
  border: "#E5E9F0",
};

let fontesRegistradas = false;
function registrarFontes(assets: string) {
  if (fontesRegistradas) return;
  const base = `${assets}/fonts`;
  Font.register({
    family: "Inter",
    fonts: [
      { src: `${base}/Inter-400.ttf`, fontWeight: 400 },
      { src: `${base}/Inter-500.ttf`, fontWeight: 500 },
      { src: `${base}/Inter-600.ttf`, fontWeight: 600 },
      { src: `${base}/Inter-700.ttf`, fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((w) => [w]);
  fontesRegistradas = true;
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    color: C.text,
    backgroundColor: C.white,
    paddingTop: 44,
    paddingBottom: 54,
    paddingHorizontal: 44,
    lineHeight: 1.45,
  },
  eyebrow: { fontSize: 8, fontWeight: 600, color: C.primary, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
  h1: { fontSize: 26, fontWeight: 700, lineHeight: 1.15, color: C.text, letterSpacing: -0.4 },
  h2: { fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: C.text, letterSpacing: -0.2, marginBottom: 6 },
  h3: { fontSize: 10.5, fontWeight: 600, color: C.text, marginBottom: 6 },
  p: { color: C.text2, marginBottom: 6 },
  small: { fontSize: 8, color: C.muted, lineHeight: 1.4 },
  card: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14 },
  panel: { backgroundColor: C.bg, borderRadius: 10, padding: 14 },
  row: { flexDirection: "row" },
  th: {
    fontSize: 7.5,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: C.muted,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  td: { paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: C.border, color: C.text2 },
  tdStrong: { color: C.text, fontWeight: 600 },
  right: { textAlign: "right" },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: C.successSoft,
    color: C.success,
    fontSize: 7.5,
    fontWeight: 700,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 999,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footer: {
    position: "absolute",
    left: 44,
    right: 44,
    bottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: C.muted2,
  },
});

function Rodape() {
  return (
    <View style={s.footer} fixed>
      <Link src={`${site.url}/planejador/`} style={{ color: C.muted2, textDecoration: "none" }}>
        Planejador de CNPJ · Korium Contabilidade · korium.co/planejador
      </Link>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Estimativa educativa, tabelas de ${ANO_REFERENCIA} · página ${pageNumber} de ${totalPages}`
        }
      />
    </View>
  );
}

/** A marca K do site, com o braço ascendente em azul. */
function Marca({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path d="M10.5 5.5V26.5" stroke={C.text} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M23.5 5.5L12.6 16.1" stroke={C.primary} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M15.9 15.1L24 26.5" stroke={C.text} strokeWidth={2.6} strokeLinecap="round" />
    </Svg>
  );
}

function Cabecalho({ direita }: { direita: string }) {
  return (
    <View style={[s.row, { justifyContent: "space-between", alignItems: "center", marginBottom: 22 }]} fixed>
      <View style={[s.row, { alignItems: "center", gap: 6 }]}>
        <Marca />
        <Text style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: -0.2 }}>Korium</Text>
      </View>
      <Text style={{ fontSize: 8, color: C.muted }}>{direita}</Text>
    </View>
  );
}

/** Barras horizontais com o custo total de cada regime elegível. */
function GraficoBarras({ c }: { c: Comparativo }) {
  const eleg = c.resultados.filter((r) => r.elegivel);
  const max = Math.max(...eleg.map((r) => r.totalGeralAnual), 1);
  return (
    <View style={{ gap: 6 }}>
      {eleg.map((r) => {
        const rec = r === c.recomendado;
        const w = Math.max(2, (r.totalGeralAnual / max) * 100);
        return (
          <View key={r.regime} style={[s.row, { alignItems: "center", gap: 8 }]}>
            <Text style={{ width: 96, fontSize: 8.5, color: rec ? C.text : C.text2, fontWeight: rec ? 600 : 400 }}>
              {NOME_REGIME[r.regime]}
            </Text>
            <View style={{ flex: 1, height: 10, backgroundColor: C.bg, borderRadius: 5 }}>
              <View style={{ width: `${w}%`, height: 10, borderRadius: 5, backgroundColor: rec ? C.success : C.primary, opacity: rec ? 1 : 0.55 }} />
            </View>
            <Text style={{ width: 70, textAlign: "right", fontSize: 8.5, fontWeight: 600, color: rec ? C.success : C.text }}>
              {brl(r.totalGeralAnual)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const COL = [2.4, 1, 1, 1.1, 0.9, 0.7];

function TabelaComparativo({ c }: { c: Comparativo }) {
  const cab = ["Regime", "Tributos", "Encargos", "Total / ano", "Por mês", "% rec."];
  return (
    <View>
      <View style={s.row}>
        {cab.map((h, i) => (
          <Text key={h} style={[s.th, { flex: COL[i] }, i > 0 ? s.right : {}]}>
            {h}
          </Text>
        ))}
      </View>
      {c.resultados.map((r) => {
        const rec = r === c.recomendado;
        return (
          <View key={r.regime} style={[s.row, { alignItems: "center" }, rec ? { backgroundColor: C.successSoft } : {}]}>
            <View style={[s.td, { flex: COL[0], paddingLeft: rec ? 6 : 0 }]}>
              <Text style={rec ? [s.tdStrong, { color: C.success }] : {}}>
                {rec ? "✓ " : ""}
                {NOME_REGIME[r.regime]}
                {r.simples ? ` · Anexo ${r.simples.anexo}` : ""}
              </Text>
              {!r.elegivel ? <Text style={[s.small, { marginTop: 2 }]}>{r.avisos[0]}</Text> : null}
            </View>
            {r.elegivel ? (
              <>
                <Text style={[s.td, s.right, { flex: COL[1] }]}>{brl(r.totalAnual)}</Text>
                <Text style={[s.td, s.right, { flex: COL[2] }]}>{brl(r.encargosFolhaAnual)}</Text>
                <Text style={[s.td, s.right, s.tdStrong, { flex: COL[3] }]}>{brl(r.totalGeralAnual)}</Text>
                <Text style={[s.td, s.right, { flex: COL[4] }]}>{brl(r.totalGeralAnual / 12)}</Text>
                <Text style={[s.td, s.right, { flex: COL[5], paddingRight: rec ? 6 : 0 }]}>{pct(r.cargaEfetiva, 1)}</Text>
              </>
            ) : (
              <Text style={[s.td, s.right, { flex: COL[1] + COL[2] + COL[3] + COL[4] + COL[5], color: C.muted2 }]}>
                não elegível
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function Memoria({ r }: { r: ResultadoRegime }) {
  return (
    <View style={[s.card, { marginBottom: 12 }]}>
      <View style={[s.row, { justifyContent: "space-between", marginBottom: 6 }]}>
        <Text style={s.h3}>
          {NOME_REGIME[r.regime]}
          {r.simples ? ` · Anexo ${r.simples.anexo}, faixa ${r.simples.faixa}` : ""}
        </Text>
        <Text style={[s.h3, { color: C.primary }]}>{brl(r.totalGeralAnual)} / ano</Text>
      </View>
      {r.linhas.map((l, i) => (
        <View key={`${l.tributo}-${i}`} style={[s.row, { paddingVertical: 2.5, alignItems: "center" }]}>
          <View style={{ flex: 3 }}>
            <Text style={{ color: C.text2 }}>{NOME_TRIBUTO[l.tributo]}</Text>
            {l.nota ? <Text style={{ color: C.muted2, fontSize: 7.5 }}>{l.nota}</Text> : null}
          </View>
          <Text style={{ flex: 1, textAlign: "right", color: C.muted }}>
            {l.sobreReceita > 0 ? pct(l.sobreReceita) : "—"}
          </Text>
          <Text style={{ flex: 1.2, textAlign: "right", color: C.text, fontWeight: 500 }}>{brl(l.valorAnual)}</Text>
        </View>
      ))}
      <View style={{ marginTop: 8, borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 8 }}>
        {r.memoria.map((m, i) => (
          <Text key={i} style={[s.small, { marginBottom: 3 }]}>
            {i + 1}. {m}
          </Text>
        ))}
        {r.avisos.map((a) => (
          <Text key={a} style={[s.small, { marginBottom: 3, color: C.text2 }]}>
            • {a}
          </Text>
        ))}
      </View>
    </View>
  );
}

export interface DadosPdf {
  comparativo: Comparativo;
  empresa: DadosEmpresa;
  projecao: ProjecaoReforma;
}

const REGIMES_REFORMA: RegimeReforma[] = ["SIMPLES", "SIMPLES_HIBRIDO", "LUCRO_PRESUMIDO", "LUCRO_REAL"];

function TabelaReforma({ p }: { p: ProjecaoReforma }) {
  const disp = REGIMES_REFORMA.filter((r) => p.anos.some((a) => a.custos[r] !== null));
  return (
    <View>
      <View style={s.row}>
        <Text style={[s.th, { flex: 0.6 }]}>Ano</Text>
        {disp.map((r) => (
          <Text key={r} style={[s.th, s.right, { flex: 1.2 }]}>
            {NOME_REGIME_REFORMA[r]}
          </Text>
        ))}
        <Text style={[s.th, s.right, { flex: 0.8 }]}>CBS + IBS</Text>
      </View>
      {p.anos.map((a, i) => (
        <View key={a.ano} style={[s.row, i % 2 === 1 ? { backgroundColor: C.bg } : {}]}>
          <Text style={[s.td, { flex: 0.6, color: C.text, fontWeight: 500 }]}>
            {a.ano}
            {a.status !== "LEI" ? "*" : ""}
          </Text>
          {disp.map((r) => (
            <Text key={r} style={[s.td, s.right, { flex: 1.2 }, a.melhor === r ? { color: C.success, fontWeight: 600 } : {}]}>
              {a.custos[r] === null ? "—" : brl(a.custos[r]!)}
            </Text>
          ))}
          <Text style={[s.td, s.right, { flex: 0.8, color: C.muted }]}>{pct(a.aliquotaIbsCbs, 1)}</Text>
        </View>
      ))}
      <View style={[s.row, { backgroundColor: C.bg }]}>
        <Text style={[s.td, s.tdStrong, { flex: 0.6, borderBottomWidth: 0 }]}>2027–33</Text>
        {disp.map((r) => (
          <Text
            key={r}
            style={[s.td, s.right, { flex: 1.2, borderBottomWidth: 0, fontWeight: 600 }, p.melhorAcumulado === r ? { color: C.success } : { color: C.text }]}
          >
            {p.acumulado[r] === null ? "—" : brl(p.acumulado[r]!)}
          </Text>
        ))}
        <Text style={[s.td, { flex: 0.8, borderBottomWidth: 0 }]} />
      </View>
    </View>
  );
}

function Relatorio({ comparativo: c, empresa, projecao }: DadosPdf) {
  const rec = c.recomendado;
  const simples = c.resultados.find((r) => r.regime === "SIMPLES");
  const data = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const nome = empresa.nome.trim() || "a sua empresa";
  const cab = `Planejador de CNPJ · ${data}`;
  const porque = explicarVencedor(c);
  const wa = whatsappLink(mensagemWhatsApp(c, { empresa: empresa.nome || undefined, cnae: empresa.cnae?.cnae }));

  return (
    <Document
      title={`Planejador de CNPJ — ${empresa.nome || "simulação"}`}
      author={site.legalName}
      subject="Comparativo de regimes tributários"
      language="pt-BR"
    >
      {/* ------------------------------------------------------------ capa */}
      <Page size="A4" style={s.page}>
        <Cabecalho direita={cab} />

        <View style={{ flexGrow: 1, justifyContent: "center" }}>
          {empresa.logo ? (
            <View style={{ alignItems: "flex-start", marginBottom: 24 }}>
              <Image src={empresa.logo} style={{ maxWidth: 170, maxHeight: 80, objectFit: "contain" }} />
            </View>
          ) : null}
          <Text style={s.eyebrow}>{empresa.nome ? `Preparado para ${empresa.nome}` : "Simulação de regime tributário"}</Text>
          <Text style={[s.h1, { maxWidth: 420 }]}>Qual regime faz {nome} pagar menos imposto?</Text>
          <Text style={[s.p, { maxWidth: 420, marginTop: 12, fontSize: 10.5 }]}>
            Comparativo entre MEI, Simples Nacional, Lucro Presumido e Lucro Real com as tabelas de {ANO_REFERENCIA},
            a partir da atividade, do faturamento e da folha informados. Com memória de cálculo, Reforma Tributária e
            próximos passos.
          </Text>

          <View style={[s.row, { gap: 10, marginTop: 26 }]}>
            {[
              ["Receita/mês", brl(c.entrada.receitaAnual / 12)],
              ["Pró-labore/mês", brl(c.entrada.proLaboreAnual / 12)],
              ["Folha/mês", brl(c.entrada.folhaAnual / 12)],
              ["Sócios / empreg.", `${c.entrada.socios} / ${c.entrada.empregados}`],
              ["CNAE", empresa.cnae ? empresa.cnae.cnae : NOME_ATIVIDADE[c.entrada.atividade]],
            ].map(([k, v]) => (
              <View key={k} style={[s.panel, { flex: 1, padding: 10, justifyContent: "flex-end" }]}>
                <Text style={{ fontSize: 7, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>{k}</Text>
                <Text style={{ fontSize: 9.5, fontWeight: 600, color: C.text, marginTop: 3 }}>{v}</Text>
              </View>
            ))}
          </View>

          <View style={[s.row, { gap: 10, marginTop: 22 }]}>
            {[
              ["1", "Resumo", "Os quatro regimes lado a lado e por que o indicado vence."],
              ["2", "Memória", "Cada tributo, alíquota e conta, para conferir com o contador."],
              ["3", "Reforma", "O custo de cada caminho de 2026 a 2033."],
              ["4", "Próximos passos", "O que confirmar antes de decidir, e um glossário."],
            ].map(([n, t, d]) => (
              <View key={n} style={{ flex: 1 }}>
                <Text style={{ fontSize: 8, fontWeight: 700, color: C.primary }}>{n} · {t}</Text>
                <Text style={[s.small, { marginTop: 2 }]}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {rec ? (
          <View style={[s.card, { borderColor: C.primary, borderWidth: 1.5, padding: 20 }]}>
            <Text style={s.badge}>✓ Regime indicado</Text>
            <Text style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: C.text, marginTop: 8, lineHeight: 1.2 }}>
              {NOME_REGIME[rec.regime]}
              {rec.simples ? <Text style={{ color: C.primary }}> · Anexo {rec.simples.anexo}</Text> : null}
            </Text>
            <View style={[s.row, { marginTop: 12, gap: 10 }]}>
              {[
                ["Por ano", brl(rec.totalGeralAnual), true],
                ["Por mês", brl(rec.totalGeralAnual / 12), false],
                ["Da receita", pct(rec.cargaEfetiva, 1), false],
              ].map(([k, v, d]) => (
                <View key={String(k)} style={[s.panel, { flex: 1, padding: 10 }, d ? { backgroundColor: C.primarySoft } : {}]}>
                  <Text style={{ fontSize: 7, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{String(k)}</Text>
                  <Text style={{ fontSize: 15, fontWeight: 700, color: d ? C.primary : C.text, marginTop: 3 }}>{String(v)}</Text>
                </View>
              ))}
            </View>
            {c.segundo ? (
              <View style={{ marginTop: 10, backgroundColor: C.successSoft, borderRadius: 8, padding: 9 }}>
                <Text style={{ color: C.success, fontWeight: 700, fontSize: 10 }}>
                  Economia de {brl(c.economiaAnual)} por ano frente ao {NOME_REGIME[c.segundo.regime]}, a segunda opção.
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <Rodape />
      </Page>

      {/* ------------------------------------------------------------ resumo */}
      <Page size="A4" style={s.page}>
        <Cabecalho direita={cab} />
        <Text style={s.eyebrow}>Resumo</Text>
        <Text style={s.h2}>Os quatro regimes, lado a lado</Text>
        <Text style={s.p}>
          Receita anual de {brl(c.entrada.receitaAnual)} ({brl(c.entrada.receitaAnual / 12)} por mês), folha de empregados de{" "}
          {brl(c.entrada.folhaAnual)}, pró-labore de {brl(c.entrada.proLaboreAnual)} para {c.entrada.socios} sócio
          {c.entrada.socios > 1 ? "s" : ""}, {c.entrada.empregados} empregado{c.entrada.empregados === 1 ? "" : "s"}.
          Natureza da atividade: {NOME_ATIVIDADE[c.entrada.atividade]}
          {empresa.cnae ? ` (CNAE ${empresa.cnae.cnae})` : ""}.
        </Text>
        <View style={[s.card, { marginTop: 8 }]}>
          <TabelaComparativo c={c} />
        </View>
        <Text style={[s.small, { marginTop: 8 }]}>
          Os totais somam os tributos sobre a receita e o lucro e os encargos patronais sobre folha e pró-labore, que mudam de regime para regime. Não entram: INSS do sócio, FGTS, ICMS/IPI fora do Simples e taxas municipais.
        </Text>

        <View style={[s.row, { gap: 14, marginTop: 18 }]}>
          <View style={[s.panel, { flex: 1.1 }]}>
            <Text style={[s.h3, { marginBottom: 10 }]}>Custo total por ano</Text>
            <GraficoBarras c={c} />
          </View>
          {porque.length ? (
            <View style={{ flex: 1 }}>
              <Text style={s.h3}>Por que o indicado vence</Text>
              {porque.map((f, i) => (
                <Text key={i} style={[s.p, { fontSize: 9, marginBottom: 4 }]}>
                  {i === 0 ? "" : "• "}
                  {f}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={[s.row, { gap: 14, marginTop: 18 }]} wrap={false}>
          {simples?.simples && simples.simples.fatorRAtingido !== null ? (
            <View style={{ flex: 1 }}>
              <Text style={s.eyebrow}>Fator R</Text>
              <Text style={[s.h3, { fontSize: 12 }]}>A folha decide o anexo</Text>
              <Text style={[s.p, { fontSize: 9 }]}>
                Folha mais pró-labore representam {pct(simples.simples.fatorR ?? 0, 1)} da receita.{" "}
                {simples.simples.fatorRAtingido
                  ? "Acima de 28 %, a atividade é tributada pelo Anexo III, o mais barato dos dois."
                  : `Abaixo de 28 %, a atividade cai no Anexo V. Com mais ${brl(simples.simples.folhaParaFatorR ?? 0)} por ano de folha ou pró-labore, ela migraria para o Anexo III. Às vezes aumentar o pró-labore reduz o imposto total — vale fazer a conta com o contador.`}
              </Text>
            </View>
          ) : null}
          {empresa.cnae ? (
            <View style={{ flex: 1 }}>
              <Text style={s.eyebrow}>CNAE</Text>
              <Text style={[s.h3, { fontSize: 12 }]}>
                {empresa.cnae.cnae} — {empresa.cnae.descricao}
              </Text>
              <Text style={[s.p, { fontSize: 9 }]}>
                Natureza: {NOME_ATIVIDADE[empresa.cnae.atividade]}.{" "}
                {empresa.cnae.sujeitoFatorR && simples?.simples
                  ? `Atividade sujeita ao Fator R: com a folha informada cai no Anexo ${simples.simples.anexo}${simples.simples.fatorRAtingido ? " (Fator R atingido)" : " (Fator R abaixo de 28 %)"}.`
                  : `No Simples Nacional, Anexo ${empresa.cnae.anexoBase}.`}{" "}
                Base legal: {empresa.cnae.fonte}.
              </Text>
              {empresa.cnae.nota && !empresa.cnae.sujeitoFatorR ? <Text style={[s.p, { fontSize: 9 }]}>{empresa.cnae.nota}</Text> : null}
              {empresa.cnae.impeditivo ? (
                <View style={{ backgroundColor: C.dangerSoft, borderRadius: 8, padding: 9 }}>
                  <Text style={{ color: C.danger, fontSize: 9 }}>
                    Atenção: este CNAE consta da lista de atividades impeditivas ao Simples Nacional ({empresa.cnae.impeditivo.fonte}).
                  </Text>
                </View>
              ) : null}
              {empresa.cnae.ambiguo ? (
                <View style={{ backgroundColor: C.warningSoft, borderRadius: 8, padding: 9 }}>
                  <Text style={{ color: C.warning, fontSize: 9 }}>
                    Este CNAE pode ou não ser aceito no Simples, conforme a atividade exercida de fato ({empresa.cnae.ambiguo.fonte}). {empresa.cnae.ambiguo.condicao ?? ""}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        <Rodape />
      </Page>

      {/* ------------------------------------------------------------ memória */}
      <Page size="A4" style={s.page}>
        <Cabecalho direita={cab} />
        <Text style={s.eyebrow}>Memória de cálculo</Text>
        <Text style={s.h2}>Como cada número foi obtido</Text>
        <Text style={[s.p, { marginBottom: 12 }]}>
          Receita constante ao longo do ano, com a receita anual informada como RBT12. Alíquotas e tabelas de {ANO_REFERENCIA}.
        </Text>
        {c.resultados.filter((r) => r.elegivel).map((r) => <Memoria key={r.regime} r={r} />)}

        {/* ---------------------------------------------------------- reforma (segue na mesma página se couber) */}
        <View minPresenceAhead={260} style={{ marginTop: 10 }} />
        <Text style={s.eyebrow}>Reforma Tributária</Text>
        <Text style={s.h2}>De 2026 a 2033, ano a ano</Text>
        <Text style={s.p}>
          PIS, COFINS, ICMS e ISS dão lugar à CBS e ao IBS. Custo anual estimado de cada caminho com o cenário{" "}
          {projecao.cenario.nome} e {projecao.reducao.rotulo}. Em verde, o mais barato do ano.
        </Text>
        <View style={[s.card, { marginTop: 8 }]} wrap={false}>
          <TabelaReforma p={projecao} />
        </View>
        {projecao.melhorAcumulado ? (
          <Text style={[s.p, { marginTop: 10 }]}>
            Somando 2027 a 2033, o caminho mais barato é {NOME_REGIME_REFORMA[projecao.melhorAcumulado]}
            {c.recomendado && projecao.melhorAcumulado.startsWith("SIMPLES") === (c.recomendado.regime === "SIMPLES")
              ? ", o mesmo rumo indicado para hoje."
              : ". É diferente do indicado para hoje: vale reavaliar a opção a cada janeiro."}
          </Text>
        ) : null}
        <View style={{ marginTop: 8, gap: 3 }}>
          {[...projecao.notas, `* 2029–2032: ICMS/ISS reduzidos por lei a 90 %, 80 %, 70 % e 60 %; a alíquota do IBS nesses anos será fixada pelo Senado e aqui é estimada na mesma proporção. ${projecao.cenario.fonte}.`].map((n) => (
            <Text key={n} style={s.small}>
              • {n}
            </Text>
          ))}
        </View>

        <View style={{ marginTop: 18, borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 10 }}>
          <Text style={s.small}>
            Base legal: LC 123/2006 (Simples Nacional e MEI), Lei 9.249/1995, 9.250/1995 e 9.430/1996 (IRPJ e CSLL), Lei 9.715/1998, 9.718/1998, 10.637/2002 e 10.833/2003 (PIS e COFINS), Lei 8.212/1991 (encargos previdenciários), LC 224/2025 (presunção acima de R$ 5 milhões), LC 238/2026 (MEI); Reforma: {projecao.fonte}. Encargos de folha estimados com RAT de 2 % e terceiros de 5,8 %. ISS pela alíquota informada; ICMS e IPI fora do Simples não estimados.
          </Text>
          <Text style={[s.small, { marginTop: 5 }]}>
            Este documento é uma estimativa educativa gerada automaticamente a partir dos dados informados pelo próprio usuário. Não constitui parecer, consultoria ou garantia de resultado. A definição do regime tributário exige análise individual por profissional habilitado. Nenhum dado informado foi transmitido ou armazenado pela Korium.
          </Text>
        </View>
        <Rodape />
      </Page>

      {/* ------------------------------------------------------------ próximos passos */}
      <Page size="A4" style={s.page}>
        <Cabecalho direita={cab} />
        <Text style={s.eyebrow}>Próximos passos</Text>
        <Text style={s.h2}>O que fazer com este relatório</Text>
        {[
          ["Confirme a elegibilidade.", "A escolha do regime depende de o CNAE ser aceito no Simples, da atividade exercida de fato, de sócios em outras empresas e de pendências na Receita. A simulação não enxerga nada disso."],
          ["Compare com os números reais.", "Receita, folha e pró-labore dos últimos 12 meses mudam a faixa e o Fator R. Pequenas diferenças de folha podem trocar o anexo."],
          ["Avalie o pró-labore.", "No Anexo V, elevar o pró-labore até o Fator R pode reduzir o imposto total, mesmo com mais INSS. É uma conta de otimização, não uma regra."],
          ["Olhe para 2027.", "A Reforma Tributária substitui PIS, COFINS, ICMS e ISS por CBS e IBS entre 2027 e 2033. Quem está no Lucro Presumido sente primeiro; quem está no Simples ganha a opção do regime híbrido. Isso muda a decisão em alguns casos."],
          ["Decida com o contador.", "Opção pelo regime é anual, feita em janeiro. Erro de enquadramento custa o ano inteiro."],
        ].map(([t, d], i) => (
          <View key={t} style={[s.row, { marginBottom: 6, gap: 10 }]}>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: C.white, fontSize: 8, fontWeight: 700 }}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 600, color: C.text }}>{t}</Text>
              <Text style={s.p}>{d}</Text>
            </View>
          </View>
        ))}

        <View style={{ marginTop: 14, backgroundColor: C.primary, borderRadius: 10, padding: 18 }}>
          <Text style={{ fontSize: 14, fontWeight: 700, color: C.white, lineHeight: 1.25, marginBottom: 4 }}>
            Quer que a Korium confirme este cenário?
          </Text>
          <Text style={{ color: "#DBE6FF", marginBottom: 12 }}>
            Respondemos em até 10 minutos no horário comercial, e a troca de contador é por nossa conta.
          </Text>
          <View style={[s.row, { gap: 10, alignItems: "center" }]}>
            <Link
              src={wa}
              style={{ backgroundColor: C.white, color: C.primary, fontWeight: 700, fontSize: 10, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, textDecoration: "none" }}
            >
              Falar no WhatsApp  →
            </Link>
            <Link
              src={`mailto:${site.email}?subject=${encodeURIComponent("Planejador de CNPJ")}`}
              style={{ color: C.white, fontWeight: 600, fontSize: 10, textDecoration: "none", borderWidth: 1, borderColor: "#93B4FF", paddingVertical: 7, paddingHorizontal: 14, borderRadius: 8 }}
            >
              {site.email}
            </Link>
            <Text style={{ color: "#DBE6FF", fontSize: 8.5 }}>WhatsApp {site.phone}</Text>
          </View>
        </View>

        <View style={[s.panel, { marginTop: 14, padding: 12 }]}>
          <Text style={[s.h3, { marginBottom: 4 }]}>Termos que aparecem neste relatório</Text>
          <View style={[s.row, { flexWrap: "wrap", columnGap: 10, rowGap: 4 }]}>
            {GLOSSARIO.map(([t, d]) => (
              <View key={t} style={{ width: "48%" }}>
                <Text style={{ fontSize: 8, fontWeight: 600, color: C.text }}>{t}</Text>
                <Text style={[s.small, { fontSize: 7.5 }]}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        <Rodape />
      </Page>
    </Document>
  );
}

/** `assets` = URL (ou caminho absoluto, no Node) da pasta public/planejador. */
export function documentoPdf(dados: DadosPdf, assets = `${window.location.origin}/planejador`) {
  registrarFontes(assets);
  return <Relatorio {...dados} />;
}

export async function gerarPdf(dados: DadosPdf): Promise<Blob> {
  return pdf(documentoPdf(dados)).toBlob();
}
