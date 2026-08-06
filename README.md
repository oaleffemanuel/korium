# Korium

Site institucional da **Korium Contabilidade** — [korium.co](https://korium.co)

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion ·
exportação estática publicada no GitHub Pages.

---

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build + exportação estática para `out/` |
| `npm run start` | Serve o `out/` já exportado, igual ao GitHub Pages |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir arquivos |

Para conferir exatamente o que vai ao ar, rode `npm run build && npm run start` —
é o único jeito de testar o redirect de `/` e os caminhos com barra final do
mesmo jeito que o servidor de produção entrega.

---

## Estrutura

```
app/
  page.tsx          → redireciona / para a variante ativa
  a/page.tsx        → Versão A (no ar)
  b/page.tsx        → Versão B (reservada)
  layout.tsx        → fontes, metadata, <html>
  globals.css       → design tokens e utilitários
components/
  sections/         → seções da página
  variants/         → composição de cada versão
  site/             → nav, rodapé, CTA de WhatsApp, botão flutuante
  ui/               → primitivas (button, accordion)
lib/
  site.ts           → contato, mensagens de WhatsApp, helper de link
  variants.ts       → registro de variantes e variante padrão
docs/
  experiments.md    → hipóteses e registro dos testes A/B
```

Detalhes do teste A/B em [`docs/experiments.md`](docs/experiments.md).

---

## Publicação

### 1. Como publicar

```bash
git add .
git commit -m "feat: ajusta copy da seção de serviços"
git push origin main
```

E acabou. **Não existe passo manual de deploy.**

### 2. O que acontece depois do push

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
dispara sozinho a cada push na branch `main` e executa, nesta ordem:

1. `checkout` do repositório;
2. instalação das dependências com `npm ci`;
3. `npm run typecheck`;
4. `npm run lint`;
5. `npm run build` (gera a exportação estática em `out/`);
6. verificação de que `index.html`, `a/`, `b/`, `CNAME` e `.nojekyll` existem
   no `out/`;
7. publicação no GitHub Pages.

Se o typecheck, o lint ou o build falharem, **nada é publicado** — o site no ar
continua sendo a última versão que passou. Dá para acompanhar o andamento na
aba **Actions** do repositório, e também dá para republicar a `main` atual sem
commit nenhum pelo botão **Run workflow**.

### 3. Configurar o GitHub Pages (uma vez só)

1. Repositório → **Settings** → **Pages**.
2. Em **Build and deployment**, no campo **Source**, escolher
   **GitHub Actions**.
   Não escolher "Deploy from a branch" — o workflow deste projeto publica por
   artefato, não por branch, e as duas opções não convivem.
3. Fazer um push na `main` (ou rodar o workflow manualmente) e conferir se o
   job termina em verde.

### 4. Configurar o domínio korium.co

O arquivo [`public/CNAME`](public/CNAME) já contém `korium.co` e é copiado para
a raiz do site a cada build, então o domínio não se perde entre deploys.

No **GitHub**:

1. Settings → Pages → **Custom domain** → digitar `korium.co` → **Save**.
2. Esperar a verificação do domínio terminar.
3. Marcar **Enforce HTTPS** assim que a opção ficar disponível (pode levar
   alguns minutos até o certificado ser emitido).

No **DNS do domínio**, apontar o apex para o GitHub Pages:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<usuario>.github.io` |

(Os quatro registros A são todos necessários — são os quatro servidores do
GitHub Pages.)

### 5. Configurar o Cloudflare

Se o DNS estiver no Cloudflare:

1. Criar os mesmos registros A da tabela acima, e o CNAME de `www`.
2. **Deixar a nuvenzinha cinza (DNS only) até o GitHub validar o domínio e
   emitir o certificado.** Com o proxy laranja ligado antes disso, a validação
   do GitHub falha e o HTTPS não sobe.
3. Depois que o **Enforce HTTPS** estiver ativo no GitHub, dá para ligar o
   proxy laranja se quiser CDN e analytics do Cloudflare.
4. Com o proxy ligado, em **SSL/TLS** → **Overview**, usar o modo **Full** ou
   **Full (strict)**. O modo **Flexible** cria loop de redirecionamento com o
   GitHub Pages.
5. Opcional — redirect de verdade na home. Hoje `/` vai para `/a/` por um
   redirect no HTML (host estático não emite 301). Para um redirect de
   servidor, criar em **Rules** → **Redirect Rules**:
   - quando `URI Path` for exatamente `/`
   - redirecionar para `https://korium.co/a/`, tipo **302 (temporário)**.

   Usar 302, e não 301: redirect permanente fica em cache no navegador e
   atrapalha na hora de trocar a variante ativa.

6. Ao publicar uma alteração, se o Cloudflare estiver com proxy ligado, pode
   ser necessário **Purge Cache** para ver a mudança na hora.

### 6. Trocar o número de WhatsApp

Um lugar só: [`lib/site.ts`](lib/site.ts).

```ts
export const WHATSAPP_NUMBER = "5531975965032";
```

Formato: código do país + DDD + número, **somente dígitos**, sem `+`, espaço,
parêntese ou traço. Todos os botões, o link do rodapé e o botão flutuante
passam pelo helper `whatsappLink()` e seguem esse valor automaticamente.

Nesse mesmo arquivo ficam as mensagens que já vêm escritas na conversa, uma
para cada contexto de botão:

```ts
export const WHATSAPP_MESSAGES = {
  default: "Olá! Vi o site da Korium e gostaria de conversar...",
  dono: "...",
  investimento: "...",
  duvida: "...",
};
```

O número que aparece escrito no rodapé é o campo `site.phone`, logo acima —
**atualize os dois** ao trocar de número.

---

## Documentos internos

Em `docs/` ficam dois documentos que não são publicados no site:

| Documento | O que é |
| --- | --- |
| [`PRINCIPIOS_COMERCIAIS.md`](docs/PRINCIPIOS_COMERCIAIS.md) | Como a Korium toma decisões comerciais |
| [`CATALOGO_DE_SERVICOS.md`](docs/CATALOGO_DE_SERVICOS.md) / `.pdf` | O que está incluso na mensalidade e quanto cobrar fora dela |

O catálogo é **gerado**, não editado à mão. O Markdown e o PDF saem da mesma
fonte para que nunca mostrem preços diferentes.

### Como alterar preços e regerar o PDF

1. Editar os valores em [`scripts/catalogo_data.py`](scripts/catalogo_data.py).
   Todos os preços, limites e tabelas estão nesse arquivo.
2. Acrescentar uma linha em `HISTORICO_ROWS` e subir o `VERSAO` / `DATA_REVISAO`.
3. Rodar:

```bash
python3 -m pip install -r scripts/requirements.txt   # só na primeira vez
python3 scripts/build_catalogo.py
```

Isso reescreve `docs/CATALOGO_DE_SERVICOS.md` e `docs/CATALOGO_DE_SERVICOS.pdf`.
Não edite esses dois arquivos diretamente: a próxima geração sobrescreve.

O script verifica sozinho se algum texto ficou largo demais para a coluna e
falha antes de gravar um PDF com palavra cortada ao meio. Se isso acontecer,
ele diz qual coluna precisa de quantos milímetros, e o ajuste é feito nas
listas `*_LARGURAS` do arquivo de dados (a soma precisa fechar em 174 mm).

As fontes da marca ficam em `scripts/fonts/` como TTF, extraídas das mesmas
Inter e Instrument Serif que o site usa, para que o PDF saia com a tipografia
correta em qualquer máquina.

---

## Notas técnicas

- **Exportação estática.** O GitHub Pages serve arquivos e não roda Node, então
  `redirects()`, `rewrites()`, middleware, route handlers e server actions não
  funcionam. Por isso o redirect de `/` é feito por `app/page.tsx`, que gera um
  documento estático com `meta refresh` + `location.replace` + link visível.
- **`trailingSlash: true`.** As páginas saem como `out/a/index.html`, o que
  garante que `/a` e `/a/` resolvam em qualquer host estático.
- **`.nojekyll`.** Impede que o Jekyll ignore a pasta `_next` (começa com
  underscore). Já está em `public/`.
- **Sem `basePath`.** Só seria necessário se o site fosse servido em
  `usuario.github.io/korium`. Com domínio próprio na raiz, não é.
- **Indexação.** Só a variante ativa entra no `sitemap.xml`; as demais saem
  como `noindex` e no `disallow` do `robots.txt`.
