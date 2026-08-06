# Experimentos de landing page

Registro de todos os testes de posicionamento da Korium. Cada variante é uma
rota real, servida pelo mesmo layout e pelo mesmo design system — o que muda
entre elas é a argumentação, nunca a identidade visual.

---

## Como a arquitetura funciona

| Peça | Onde fica | Papel |
| --- | --- | --- |
| Registro de variantes | `lib/variants.ts` | Fonte única de verdade: id, rota, posicionamento, status e se é indexável |
| Composição de cada variante | `components/variants/version-*.tsx` | Define quais seções entram e em que ordem |
| Rotas públicas | `app/a/page.tsx`, `app/b/page.tsx` | Metadata própria + render da composição |
| Redirect da home | `app/page.tsx` | Lê `DEFAULT_VARIANT` e manda `/` para a variante ativa |
| Seções | `components/sections/*` | Compartilhadas entre variantes até que uma precise divergir |

### Trocar a variante servida em `/`

Uma linha, em `lib/variants.ts`:

```ts
export const DEFAULT_VARIANT: VariantId = "a"; // troque para "b"
```

O redirect, o `sitemap.xml` e o `robots.txt` seguem a partir daí.

O redirect acontece no cliente, não no servidor: o site é exportado
estaticamente para o GitHub Pages, que serve arquivos e não emite 307. O
`app/page.tsx` gera um documento com `meta refresh`, `location.replace` e um
link visível de fallback. Quem quiser um redirect de servidor de verdade pode
criar uma Redirect Rule no Cloudflare — sempre 302, nunca 301, porque redirect
permanente fica em cache no navegador e atrapalha na hora de virar a chave do
experimento.

> **Nota sobre SEO.** Enquanto `/` redireciona, a URL canônica do site passa a
> ser `/a/`, e todo compartilhamento de `korium.co` dá um salto extra — que
> aqui custa uma requisição a mais, já que o redirect é feito no HTML. Para
> uma operação de teste isso é aceitável e reversível. Quando o experimento
> terminar, o caminho recomendado é trocar o conteúdo de `app/page.tsx` pela
> composição vencedora, servindo-a direto em `/`, e manter `/a` e `/b` apenas
> para consulta.

### Criar uma variante nova

1. Adicionar a entrada em `VARIANTS` (`lib/variants.ts`).
2. Criar `components/variants/version-c.tsx`.
3. Criar `app/c/page.tsx` copiando o padrão de `app/b/page.tsx`.

Nada além disso muda no app.

### Indexação

Só a variante marcada como `indexable: true` entra no `sitemap.xml`. As demais
saem com `noindex, follow` e entram no `disallow` do `robots.txt`, para que
duas versões do mesmo texto nunca disputem a mesma busca. Todas apontam a
canônica para a variante ativa.

---

## Experimento 001 — Emoção x objetividade

**Status:** Versão B promovida a padrão em 06/08/2026 e servida em `/`.
Versão A continua ativa em `/a` para comparação.
**Aberto em:** 05/08/2026.

### Hipótese

O visitante típico da Korium já paga por contabilidade e não está procurando
contratar o serviço — está procurando parar de sofrer com o serviço que já tem.
Se isso for verdade, uma página que nomeia a frustração antes de falar de
contabilidade deve converter melhor do que uma página que lista competência
técnica.

A Versão B existe para tentar derrubar essa hipótese. É possível que o público
de maior valor (clínicas maiores, empresas com estrutura societária mais
complexa) leia o apelo emocional como falta de profundidade técnica e prefira
uma abertura mais sóbria.

### Versão A — emoção primeiro `/a`

Primeiro posicionamento. Continua no ar em `/a`, fora do índice.

- **Promessa:** "Nunca mais corra atrás do seu contador."
- **Abertura:** a frustração do visitante, antes de qualquer credencial.
- **Ordem do argumento:** dor → reenquadramento → a Korium → serviços → como
  funciona → para quem → perguntas → o que está incluído → conversa → contato.
- **Papel dos serviços:** prova de competência, deliberadamente apresentados
  como "o mínimo", nunca como o motivo da troca.
- **Conversão:** exclusivamente WhatsApp, sem formulário. CTA principal
  "Falar com o dono".

### Versão B — página de serviço `/b`

Variante padrão desde 06/08/2026. Onde A defende um ponto de vista, B responde a pergunta de quem
já está procurando contador: o que vocês fazem, para quem, como funciona e
como eu começo.

- **Manchete:** "Quase ninguém troca de contador por causa de imposto" — abre
  uma curiosidade e resolve no subtítulo, em vez de nomear a dor de saída.
- **Abertura:** para quem atendemos, logo seguido do que fazemos.
- **Ordem do argumento:** para quem → serviços → comparação → como funciona →
  o que está incluído → perguntas → contato.
- **Papel dos serviços:** sobem para o topo e viram checklist objetivo, sem os
  parágrafos longos de A e sem o enquadramento de "isso é só o mínimo".
- **Peça nova:** bloco de comparação lado a lado, focado em experiência de
  atendimento e não em competência técnica.
- **Perguntas:** cinco, todas de objeção (troca, deslocamento, preço, porte,
  atendimento), contra nove em A.
- **Conversão:** a mesma — WhatsApp, mesmo CTA "Falar com o dono", para não
  contaminar a comparação.

Arquivos em `components/sections/b/`, compostos por
`components/variants/version-b.tsx`. Nada é compartilhado com A além do design
system e da casca (nav, rodapé, botão flutuante), então as duas podem divergir
à vontade.

### O que precisa ser igual nas duas

Para que a diferença medida seja de posicionamento e não de outra coisa:
identidade visual, tipografia, espaçamento, animações, canal de conversão,
textos dos botões e ausência de preço. Tudo isso está mantido — as duas usam
os mesmos componentes de `components/ui` e `components/site`, o mesmo helper
de WhatsApp e o mesmo bloco de investimento borrado.

### Como medir

Ainda não definido. Antes de rodar o teste é preciso fechar:

- métrica primária (sugestão: cliques em CTA de WhatsApp por visitante único);
- métrica secundária (mensagens que viram conversa de verdade — só dá para
  medir do lado do WhatsApp, cruzando pelo texto pré-preenchido, que já é
  diferente por contexto de CTA);
- divisão de tráfego e critério de parada.

Sem isso definido, rodar o teste só produz números que confirmam o que a gente
já queria acreditar.

---

## Pendências conhecidas

- Sem imagem de Open Graph (`opengraph-image`). Todo compartilhamento em rede
  social hoje aparece sem arte.
- A cidade do escritório não é afirmada em lugar nenhum do site. O DDD 31 é de
  Minas Gerais; se houver atendimento presencial, vale nomear a cidade no
  rodapé e na pergunta sobre visita.
