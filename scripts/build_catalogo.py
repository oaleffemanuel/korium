#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera docs/CATALOGO_DE_SERVICOS.md e docs/CATALOGO_DE_SERVICOS.pdf a partir de
scripts/catalogo_data.py.

    python3 scripts/build_catalogo.py

Os dois arquivos saem da mesma fonte, então não existe a possibilidade de o
PDF e o Markdown mostrarem preços diferentes.

Dependência: reportlab (pip install reportlab).
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import catalogo_data as d  # noqa: E402

from reportlab.lib import colors  # noqa: E402
from reportlab.lib.enums import TA_JUSTIFY  # noqa: E402
from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.styles import ParagraphStyle  # noqa: E402
from reportlab.lib.units import mm  # noqa: E402
from reportlab.pdfbase import pdfmetrics  # noqa: E402
from reportlab.pdfbase.ttfonts import TTFont  # noqa: E402
from reportlab.platypus import (  # noqa: E402
    BaseDocTemplate,
    Frame,
    KeepTogether,
    LongTable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    TableStyle,
)

# --------------------------------------------------------------------------
# Identidade visual (mesmos tokens de app/globals.css)
# --------------------------------------------------------------------------

CANVAS = colors.Color(250 / 255, 248 / 255, 244 / 255)      # warm white
SURFACE = colors.Color(255 / 255, 255 / 255, 255 / 255)
SAND = colors.Color(245 / 255, 241 / 255, 234 / 255)
INK = colors.Color(10 / 255, 26 / 255, 44 / 255)            # deep navy
INK2 = colors.Color(47 / 255, 66 / 255, 88 / 255)
INK3 = colors.Color(88 / 255, 102 / 255, 119 / 255)
GOLD = colors.Color(168 / 255, 133 / 255, 71 / 255)
LINE = colors.Color(228 / 255, 221 / 255, 210 / 255)

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
MARGIN_TOP = 20 * mm
MARGIN_BOTTOM = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X  # 174 mm


def register_fonts():
    """Usa as fontes da marca. Cai para Helvetica se não estiverem no repo."""
    faces = {
        "Inter": "Inter-Regular.ttf",
        "Inter-SemiBold": "Inter-SemiBold.ttf",
        "Instrument": "InstrumentSerif-Regular.ttf",
        "Instrument-Italic": "InstrumentSerif-Italic.ttf",
    }
    try:
        for name, filename in faces.items():
            pdfmetrics.registerFont(TTFont(name, os.path.join(HERE, "fonts", filename)))
        return "Inter", "Inter-SemiBold", "Instrument"
    except Exception as exc:  # pragma: no cover
        print(f"  aviso: fontes da marca indisponíveis ({exc}); usando Helvetica")
        return "Helvetica", "Helvetica-Bold", "Times-Roman"


SANS, SANS_BOLD, SERIF = register_fonts()

# --------------------------------------------------------------------------
# Estilos
# --------------------------------------------------------------------------

S_TITLE = ParagraphStyle("title", fontName=SERIF, fontSize=30, leading=33, textColor=INK)
S_SUB = ParagraphStyle("sub", fontName=SANS, fontSize=10.5, leading=15, textColor=INK3)
S_EYEBROW = ParagraphStyle(
    "eyebrow", fontName=SANS_BOLD, fontSize=7.5, leading=10, textColor=INK3
)
S_H2 = ParagraphStyle("h2", fontName=SANS_BOLD, fontSize=13, leading=17, textColor=INK)
S_BODY = ParagraphStyle(
    "body", fontName=SANS, fontSize=9.5, leading=14.5, textColor=INK2, alignment=TA_JUSTIFY
)
S_NOTICE = ParagraphStyle(
    "notice", fontName=SANS, fontSize=9, leading=13.5, textColor=INK2
)
S_NOTE = ParagraphStyle("note", fontName=SANS, fontSize=8.5, leading=13, textColor=INK3)
S_BULLET = ParagraphStyle(
    "bullet", parent=S_BODY, leftIndent=9, bulletIndent=0, spaceAfter=5, alignment=0
)

# Células de tabela
S_TH = ParagraphStyle("th", fontName=SANS_BOLD, fontSize=7.6, leading=9.6, textColor=CANVAS)
S_TD = ParagraphStyle("td", fontName=SANS, fontSize=7.8, leading=10.4, textColor=INK2)
S_TD_KEY = ParagraphStyle("tdk", parent=S_TD, fontName=SANS_BOLD, textColor=INK)
S_TD_PRICE = ParagraphStyle("tdp", parent=S_TD, fontName=SANS_BOLD, textColor=INK)


def kmark(canvas, x, y, size):
    """Marca K da Korium, desenhada em vetor a partir de app/icon.svg."""
    s = size / 32.0
    canvas.saveState()
    canvas.translate(x, y)
    canvas.setLineCap(1)
    canvas.setLineWidth(2.4 * s)
    canvas.setStrokeColor(INK)
    canvas.line(10.5 * s, size - 5.5 * s, 10.5 * s, size - 26.5 * s)
    canvas.setStrokeColor(GOLD)
    canvas.line(23.5 * s, size - 5.5 * s, 12.6 * s, size - 16.1 * s)
    canvas.setStrokeColor(INK)
    canvas.line(15.9 * s, size - 15.1 * s, 24.0 * s, size - 26.5 * s)
    canvas.restoreState()


def page_furniture(canvas, doc):
    """Fundo, marca e rodapé. O número da página é fechado no segundo passe."""
    canvas.saveState()
    canvas.setFillColor(CANVAS)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    if doc.page > 1:
        kmark(canvas, MARGIN_X, PAGE_H - MARGIN_TOP + 4 * mm, 7 * mm)
        canvas.setFont(SANS, 7.5)
        canvas.setFillColor(INK3)
        canvas.drawRightString(
            PAGE_W - MARGIN_X, PAGE_H - MARGIN_TOP + 6 * mm, "Documento interno"
        )
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(
            MARGIN_X, PAGE_H - MARGIN_TOP + 2 * mm, PAGE_W - MARGIN_X, PAGE_H - MARGIN_TOP + 2 * mm
        )

    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, MARGIN_BOTTOM - 4 * mm, PAGE_W - MARGIN_X, MARGIN_BOTTOM - 4 * mm)
    canvas.setFont(SANS, 7.5)
    canvas.setFillColor(INK3)
    canvas.drawString(
        MARGIN_X,
        MARGIN_BOTTOM - 9 * mm,
        f"{d.TITULO} — Korium · versão {d.VERSAO}",
    )
    canvas.restoreState()


def assert_fits(cols, widths_mm, rows, label):
    """
    Falha o build se alguma palavra indivisível for mais larga que a coluna.
    Sem isso, o reportlab quebra a palavra no meio em silêncio (a header
    "Complexidade" já saiu como "Complexidad e" uma vez) e o PDF vai para o
    Git com defeito. Roda a cada geração, então editar texto é seguro.
    """
    padding = 10  # LEFTPADDING + RIGHTPADDING, em pontos
    problems = []
    for col, (title, w_mm) in enumerate(zip(cols, widths_mm)):
        available = w_mm * mm - padding
        candidates = [(title, SANS_BOLD, 7.6)] + [
            (row[col], SANS, 7.8) for row in rows if row[col]
        ]
        for text, font, size in candidates:
            for word in text.split():
                width = pdfmetrics.stringWidth(word, font, size)
                if width > available:
                    problems.append(
                        f"    coluna {col} ({title!r}): a palavra {word!r} precisa de "
                        f"{width / mm:.1f} mm e a coluna tem {available / mm:.1f} mm úteis"
                    )
    if problems:
        raise SystemExit(
            f"  ERRO em '{label}': texto largo demais para a coluna.\n"
            + "\n".join(problems)
            + "\n    Ajuste as larguras em scripts/catalogo_data.py."
        )
    total = sum(widths_mm) * mm
    if abs(total - CONTENT_W) > 0.5:
        raise SystemExit(
            f"  ERRO em '{label}': as colunas somam {total / mm:.1f} mm, "
            f"mas a área útil da página é {CONTENT_W / mm:.1f} mm."
        )


def build_table(cols, widths_mm, rows, key_col=0, price_col=None, align_right=None, label=""):
    assert_fits(cols, widths_mm, rows, label or cols[0])
    header = [Paragraph(c, S_TH) for c in cols]
    data = [header]
    for row in rows:
        cells = []
        for i, cell in enumerate(row):
            if i == key_col:
                style = S_TD_KEY
            elif price_col is not None and i == price_col:
                style = S_TD_PRICE
            else:
                style = S_TD
            # Célula vazia fica vazia mesmo: um traço em 20 linhas polui a tabela.
            cells.append(Paragraph(cell, style) if cell else "")
        data.append(cells)

    widths = [w * mm for w in widths_mm]
    table = LongTable(data, colWidths=widths, repeatRows=1, hAlign="LEFT")

    style = [
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("TEXTCOLOR", (0, 0), (-1, 0), CANVAS),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, 0), 5),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
        ("TOPPADDING", (0, 1), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 4.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 1), (-1, -2), 0.4, LINE),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, GOLD),
        ("BOX", (0, 1), (-1, -1), 0.4, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [SURFACE, SAND]),
    ]
    if align_right:
        for c in align_right:
            style.append(("ALIGN", (c, 0), (c, -1), "RIGHT"))
    table.setStyle(TableStyle(style))
    return table


def heading(number, text):
    return KeepTogether(
        [
            Spacer(1, 7 * mm),
            Paragraph(f"{number}", S_EYEBROW),
            Spacer(1, 1.5 * mm),
            Paragraph(text, S_H2),
            Spacer(1, 4 * mm),
        ]
    )


def paragraphs(items, style=S_BODY, gap=3.2 * mm):
    out = []
    for text in items:
        out.append(Paragraph(text, style))
        out.append(Spacer(1, gap))
    return out


def bullets(items):
    return [
        Paragraph(text, S_BULLET, bulletText="–") for text in items
    ]


def build_pdf(path):
    doc = BaseDocTemplate(
        path,
        pagesize=A4,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOTTOM,
        title=f"{d.TITULO} — Korium",
        author="Korium Contabilidade",
        subject=d.SUBTITULO,
    )
    frame = Frame(
        MARGIN_X,
        MARGIN_BOTTOM,
        CONTENT_W,
        PAGE_H - MARGIN_TOP - MARGIN_BOTTOM,
        id="body",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="std", frames=[frame], onPage=page_furniture)])

    story = []

    # Capa curta, no topo da primeira página
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("KORIUM CONTABILIDADE", S_EYEBROW))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(d.TITULO, S_TITLE))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(d.SUBTITULO, S_SUB))
    story.append(Spacer(1, 2 * mm))
    story.append(
        Paragraph(f"Versão {d.VERSAO} · {d.DATA_REVISAO}", S_NOTE)
    )
    story.append(Spacer(1, 8 * mm))

    notice = LongTable(
        [[Paragraph(d.AVISO, S_NOTICE)]], colWidths=[CONTENT_W], hAlign="LEFT"
    )
    notice.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SAND),
                ("BOX", (0, 0), (-1, -1), 0.4, LINE),
                ("LINEBEFORE", (0, 0), (0, -1), 2, GOLD),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(notice)

    story.append(heading("Seção 1", "Finalidade do documento"))
    story += paragraphs(d.FINALIDADE)

    story.append(heading("Seção 2", "Serviços inclusos na mensalidade"))
    story.append(
        build_table(d.MENSAIS_COLS, d.MENSAIS_LARGURAS, d.MENSAIS_ROWS)
    )

    story.append(heading("Seção 3", "Serviços inclusos com limite de uso"))
    story.append(build_table(d.LIMITES_COLS, d.LIMITES_LARGURAS, d.LIMITES_ROWS))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(d.NOTA_LIMITES, S_NOTE))

    story.append(heading("Seção 4", "Serviços extraordinários"))
    story += paragraphs(d.EXTRAORDINARIOS)

    story.append(PageBreak())
    story.append(heading("Seção 5", "Preços-base provisórios"))
    story.append(
        build_table(
            d.PRECOS_COLS, d.PRECOS_LARGURAS, d.PRECOS_ROWS, price_col=1
        )
    )

    story.append(heading("Seção 6", "Regras de ajuste de preço"))
    story.append(build_table(d.AJUSTE_COLS, d.AJUSTE_LARGURAS, d.AJUSTE_ROWS, price_col=1))
    story.append(Spacer(1, 5 * mm))
    story += bullets(d.REGRAS_EXTRAS)

    story.append(heading("Seção 7", "Princípios comerciais"))
    story += bullets(d.PRINCIPIOS)
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(d.PRINCIPIOS_RODAPE, S_NOTE))

    story.append(heading("Seção 8", "Histórico de revisões"))
    story.append(build_table(d.HISTORICO_COLS, d.HISTORICO_LARGURAS, d.HISTORICO_ROWS))

    # Dois passes: o primeiro conta as páginas, o segundo escreve "X de Y".
    from reportlab.pdfgen import canvas as canvas_mod

    class TwoPassCanvas(canvas_mod.Canvas):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self._saved = []

        def showPage(self):
            self._saved.append(dict(self.__dict__))
            self._startPage()

        def save(self):
            total = len(self._saved)
            for state in self._saved:
                self.__dict__.update(state)
                self.setFont(SANS, 7.5)
                self.setFillColor(INK3)
                self.drawRightString(
                    PAGE_W - MARGIN_X,
                    MARGIN_BOTTOM - 9 * mm,
                    f"Página {self._pageNumber} de {total}",
                )
                super().showPage()
            super().save()

    doc.build(story, canvasmaker=TwoPassCanvas)


# --------------------------------------------------------------------------
# Markdown
# --------------------------------------------------------------------------


def md_table(cols, rows):
    def esc(cell):
        return (cell or "").replace("|", "\\|")

    out = ["| " + " | ".join(cols) + " |"]
    out.append("|" + "|".join([" --- "] * len(cols)) + "|")
    for row in rows:
        out.append("| " + " | ".join(esc(c) for c in row) + " |")
    return "\n".join(out)


def build_md(path):
    L = []
    a = L.append
    a(f"# {d.TITULO} — Korium")
    a("")
    a(f"{d.SUBTITULO} · Versão {d.VERSAO} · {d.DATA_REVISAO}")
    a("")
    a(f"> {d.AVISO}")
    a("")
    a(
        "<!-- Gerado por scripts/build_catalogo.py a partir de "
        "scripts/catalogo_data.py. Não editar à mão. -->"
    )
    a("")
    a("---")
    a("")

    a("## 1. Finalidade do documento")
    a("")
    for p in d.FINALIDADE:
        a(p)
        a("")
    a("---")
    a("")

    a("## 2. Serviços inclusos na mensalidade")
    a("")
    a(md_table(d.MENSAIS_COLS, d.MENSAIS_ROWS))
    a("")
    a("---")
    a("")

    a("## 3. Serviços inclusos com limite de uso")
    a("")
    a(md_table(d.LIMITES_COLS, d.LIMITES_ROWS))
    a("")
    a(d.NOTA_LIMITES)
    a("")
    a("---")
    a("")

    a("## 4. Serviços extraordinários")
    a("")
    for p in d.EXTRAORDINARIOS:
        a(p)
        a("")
    a("---")
    a("")

    a("## 5. Preços-base provisórios")
    a("")
    a(md_table(d.PRECOS_COLS, d.PRECOS_ROWS))
    a("")
    a("---")
    a("")

    a("## 6. Regras de ajuste de preço")
    a("")
    a(md_table(d.AJUSTE_COLS, d.AJUSTE_ROWS))
    a("")
    for item in d.REGRAS_EXTRAS:
        a(f"- {item}")
    a("")
    a("---")
    a("")

    a("## 7. Princípios comerciais")
    a("")
    for item in d.PRINCIPIOS:
        a(f"- {item}")
    a("")
    a(d.PRINCIPIOS_RODAPE)
    a("")
    a("---")
    a("")

    a("## 8. Histórico de revisões")
    a("")
    a(md_table(d.HISTORICO_COLS, d.HISTORICO_ROWS))
    a("")

    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(L))


def main():
    docs = os.path.join(ROOT, "docs")
    os.makedirs(docs, exist_ok=True)
    md_path = os.path.join(docs, "CATALOGO_DE_SERVICOS.md")
    pdf_path = os.path.join(docs, "CATALOGO_DE_SERVICOS.pdf")

    build_md(md_path)
    build_pdf(pdf_path)

    for p in (md_path, pdf_path):
        size = os.path.getsize(p)
        print(f"  {os.path.relpath(p, ROOT):38} {size / 1024:7.1f} KB")


if __name__ == "__main__":
    main()
