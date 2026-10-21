# Redesign e modernização do portfólio (bluis)

**Data:** 2026-10-21
**Status:** aprovado em brainstorming (protótipos no visual companion), aguardando revisão do spec

## Contexto

O site atual (bluis.vercel.app) foi feito em 2021–2023, quando o Bruno era júnior. Roda Next 10 (Pages Router) + React 17 + styled-components 5 + next-pwa 5/webpack 4, não builda no Node 22, tem 342 vulnerabilidades no `yarn audit` e o conteúdo está desatualizado. Hoje ele é Senior Software Engineer e tech lead, trabalha com IA, automação e produto, e se importa com segurança, consistência, estabilidade, testes e evolução contínua.

O site novo precisa **mostrar como ele constrói software**, não só descrever: interface de produto (Spotlight ⌘K), algo sendo construído ao vivo no hero, micro-interações cuidadosas e um modo que revela a estrutura por trás da interface.

## Objetivos

1. Modernizar a stack seguindo o padrão do portfólio (`~/Code/portfolio-standards`), trocando styled-components por CSS Modules, e registrar essa variação como nova convenção de stack.
2. Redesenhar o site com a identidade aprovada: nome do Bruno como marca, paleta creme/tinta/vermelho/verde, cantos squircle, sem linhas duras.
3. Três interações-assinatura: **Spotlight (⌘K)**, **LiveBuild** (produtos se construindo no hero) e **modo Inspecionar**.
4. Micro-animações em hover, clique e entrada de elementos, respeitando `prefers-reduced-motion`.
5. Site bilíngue (pt-BR / en) por rota, com todo o texto e dados em arquivos de locale.
6. Qualidade verificável: testes unitários e e2e no CI, e os números reais de build aparecem no modo Inspecionar.

## Público

Recrutadores/empresas **e** potenciais clientes: portfólio pessoal com CTA de contato.

## Fora de escopo

- Chat com LLM/API de IA (decisão: o Spotlight responde a partir do conteúdo do próprio site). Consequentemente: sem rate limit, sem chave de API, sem evals de modelo.
- Rótulos ou elementos que sugiram uma IA respondendo (ex.: "bruno.ai", trace de ferramentas) — o site só afirma o que existe.
- Testes A/B no próprio site e coleta de analytics.
- Foto de perfil, seção de parceiros/logos, menção a clientes ou ao nome da empresa empregadora.
- Modo escuro, PWA, formulário de contato.

## Stack

| Item | Escolha |
| --- | --- |
| Framework | Next.js 16 (App Router), Turbopack em dev e build |
| UI | React 19 |
| Linguagem | TypeScript 5.9, `strict` |
| Estilo | CSS Modules (`styles.module.css` por componente) + tokens em CSS custom properties |
| Fontes | `next/font/google`: Fraunces (títulos), Inter (texto), JetBrains Mono (rótulos/teclas) |
| Lint/format | ESLint 9 (flat config, `eslint-config-next`) + Prettier 3 (`.prettierrc` atual) |
| Testes | Vitest (unidade) + Playwright (e2e) |
| Runtime | Node.js >= 20 (`engines` + `.nvmrc` com `22`), Yarn 1 |

Next 16: o padrão pede "15+"; 16 é o `latest`. O scaffold do Next 16.4 vem com `cacheComponents` e `partialPrefetching` ligados — o plano de implementação deve consultar `node_modules/next/dist/docs/` (aviso do próprio `AGENTS.md` do Next) antes de usar APIs de rota, proxy e metadata.

Por que CSS Modules: styled-components está em modo de manutenção e obriga `'use client'` em todo componente estilizado. CSS Modules é nativo, gera CSS no build, permite Server Components no conteúdo e mantém a separação componente/estilos do padrão. Tailwind v4 foi considerado e preterido por essa separação. pnpm e Biome descartados para não divergir do padrão sem ganho relevante.

## Identidade visual

- **Wordmark:** "Bruno **Bahiense**" em Fraunces, sobrenome em vermelho. **Favicon:** os triângulos atuais (`logo.svg`).
- **Tokens (`styles/tokens.css`):**
  - `--color-cream` `#fefaec` (fundo) · `--color-surface` `#fffdf6` (cards) · `--color-hover` `#f5efdc`
  - `--color-ink` `#24242c` (texto, botões primários) · `--color-muted` `#6b6a66` · `--color-faint` `#9c998f` · `--color-line` `#e6dec6`
  - `--color-accent` `#e15638` (vermelho) · `--color-highlight` `#71c492` (verde, estados ok) · `--color-amber` `#c9962b` (estado "em evolução")
  - Temas do LiveBuild: coral `#e15638`, tinta `#3b3fb6`, menta `#2f9e6b`, âmbar `#c9962b` (cada um com uma versão `-soft`)
- **Tipografia:** títulos em Fraunces 300 (hero) e 500 (seções e números), corpo em Inter, rótulos `// assim` e teclas em JetBrains Mono.
- **Squircle em tudo:** três raios (`--radius-sm/md/lg`) aplicados com `corner-shape: squircle` dentro de `@supports`, com `border-radius` comum como fallback. Nada de cantos retos em cards, botões, inputs, chips, teclas, toasts ou painéis.
- **Sem linhas duras:** sem divisória fixa no header; separação por espaço e superfícies, bordas finas `--color-line` só em cards/inputs.
- **Hover neutro:** nada de brilho vermelho em hover de cards; o realce é neutro (borda escurece levemente, brilho branco suave seguindo o cursor).
- **Movimento:** curvas de mola (`cubic-bezier(.34,1.56,.64,1)`) para entradas e cliques, `cubic-bezier(.22,1,.36,1)` para barras/sublinhados. Tudo desliga com `prefers-reduced-motion: reduce`.

## Estrutura da página (rotas `/pt` e `/en`)

1. **Header**: wordmark; links Experiência · Projetos · Contato (sublinhado vermelho que desliza no hover); gatilho compacto "Buscar ou perguntar… ⌘K"; seletor PT/EN.
2. **Hero** (duas colunas no desktop, uma no mobile):
   - Esquerda: rótulo `// senior software engineer · ia & produto`, título em serifa com uma palavra em vermelho itálico, bio curta, **CommandBar** (barra compacta, ~440px, abre o Spotlight), sugestões em texto ("O que você faz com IA?" · "Copiar e-mail" · "Ver em inglês"), botões "Vamos conversar →" e "GitHub ↗".
   - Direita: **LiveBuild** (ver Interações). No mobile vai abaixo do texto, em tamanho reduzido.
3. **Metrics**: 3 cards com estado (ponto colorido + texto), número grande, descrição, barra e nota: "15+ portais entregues ponta a ponta", "3 semanas para lançar um portal novo (antes: 2 meses)", "Tech lead — referência técnica de uma squad".
4. **Experience**: linha do tempo com 3 cargos, sem nome da empresa:
   - nov/2025 – hoje · Senior Software Engineer
   - nov/2023 – nov/2025 · Full Stack Developer Pleno & Squad Leader
   - jul/2022 – out/2023 · Full Stack Developer

   Abaixo, a **Stack** em cards por grupo: Frontend (React, Next.js, TypeScript, JavaScript) · Backend (Node.js, Express, GraphQL, APIs REST) · Dados (MongoDB, Redis, ElasticSearch) · Infra & CI/CD (AWS, Docker, Jenkins, EasyPanel) · IA & Automação (LLMs, MCP, n8n, Airtable, Mautic).
5. **Projects**: cards com imagem real, nome, descrição, techs e link: Bluis Trips (mapa dos lugares que visitei — https://bluis-trips.vercel.app) e Tomatracker (pomodoro com tarefas, temas e relatório diário — https://tomatracker.vercel.app).
6. **Contact**: bloco escuro com chamada em serifa, e-mail `brunoluisbahiense@gmail.com` (`mailto:` + botão copiar), GitHub, LinkedIn, Instagram.
7. **Footer**: "© {ano} Bruno Bahiense", versão do site (`v{package.version}`) e link "Inspecionar este site".

Textos iniciais: os dos protótipos aprovados e do LinkedIn. O Bruno ajusta a fraseologia depois, editando só os locales.

## Interações

### Spotlight (⌘K)

Inspirado no Spotlight do macOS e na command palette que o Bruno constrói no trabalho.

- **Abrir:** ⌘K / Ctrl+K, clique na CommandBar do hero ou no gatilho do header. Fecha com Esc ou clique fora. Overlay com blur leve; painel squircle com entrada em mola.
- **Estrutura:** campo de busca + lista agrupada + rodapé de atalhos (`↑ ↓ navegar · ↵ abrir · esc fechar`) e nota "busca no conteúdo deste site".
- **Grupos sem busca digitada:**
  - *Perguntas frequentes* — 4 itens definidos no locale (ex.: "O que você faz com IA?", "Como você garante qualidade?", "Qual sua stack?", "Mostre seus projetos").
  - *Ir para* — seções da página (rola suave até a âncora e fecha).
  - *Fazer algo* — Copiar e-mail · Abrir GitHub · Abrir LinkedIn · Ver em inglês/português · Inspecionar o site.
- **Busca (sem IA, local e instantânea — mesmo modelo da busca que o Bruno construiu no trabalho):** catálogo fixo montado no servidor a partir do locale (perguntas, seções, comandos, projetos, cargos, tecnologias). Comparação de texto sem acento e sem maiúscula, com pontuação por posição: **começo do nome > começo de palavra > trecho no meio**. Perguntas também casam por palavras-chave declaradas no locale (ex.: `["ia", "ai", "llm", "mcp", "automação"]`), pontuadas como começo de nome. Empate: mantém a ordem do catálogo. Não entende linguagem natural livre — limitação aceita e explícita no rodapé ("busca no conteúdo deste site").
- **Sem resultado:** estado vazio honesto ("Não encontrei isso aqui. Quer me mandar um e-mail?" + item Copiar e-mail).
- **Responder pergunta:** a lista dá lugar à resposta: pergunta em serifa, texto com efeito de digitação rápida (desligado em reduced motion) e um **widget** montado com os componentes do site: `chips` (tags), `rows` (linhas com status ✓), `flow` (etapas encadeadas) ou `projects` (mini-cards com link). Esc volta para a busca.
- **Toast** de confirmação para comandos ("E-mail copiado ✓").
- **Teclado:** ↑/↓ circulam, Enter executa, hover do mouse move a seleção, foco preso no diálogo enquanto aberto, foco volta ao gatilho ao fechar.

### LiveBuild (hero, direita)

Painel squircle com fundo pontilhado em que, em loop, **um produto diferente se constrói** com os mesmos componentes — mostrando amplitude e consistência por design tokens. Sem trace de agente (variação "só a interface").

- **Cenas (dados no locale, cores nos tokens):**
  1. Dashboard de vendas — receita contando, chip "+18%", barras crescendo; clique em "Compartilhar painel" → "Link copiado ✓".
  2. Relatório semanal — linhas da tabela entrando uma a uma; "Exportar PDF" → "Relatório pronto ✓".
  3. Automação — nós gatilho → agente IA → ação se conectando; "Ativar fluxo" → "Rodando ✓".
  4. Atendimento — mensagem do cliente, indicador digitando, resposta resolvendo; "Avaliar atendimento" → "Nota 5 ★".
  5. Acordos — valor contando, chip de desconto, etapas; "Fechar acordo" → "Acordo fechado ✓".
- **Sequência por cena:** peças entram em mola como skeleton com shimmer → conteúdo real aparece → animação própria da cena → status "em produção" → cursor fantasma vai até o botão e clica (afunda e vira sucesso) → pausa → sai e entra a próxima cena com outra cor.
- **Mouse:** o painel inclina em 3D seguindo o cursor, com as peças em profundidades diferentes (parallax); hover numa peça mostra o nome do componente (`<KpiCard />`); clique pula para a próxima cena.
- **Performance:** o loop pausa quando o painel sai da tela (IntersectionObserver) ou a aba fica oculta (`visibilitychange`).
- **Reduced motion:** mostra o estado final de uma cena, estático; clique troca de cena sem animação.
- **Acessibilidade:** decorativo (`aria-hidden`), com uma descrição curta em texto para leitores de tela ("Demonstração: interfaces de dashboard, relatório, automação, atendimento e acordos sendo montadas").

### Micro-interações

- **Botões magnéticos** (CTAs do hero e do contato): deslocam levemente na direção do cursor e afundam com mola no clique.
- **Ripple** squircle no ponto de clique em botões e itens clicáveis.
- **Cards** (metrics, projetos, stack): brilho branco suave seguindo o cursor, inclinação 3D leve, borda escurece um pouco. Sem cor quente.
- **Entrada na tela:** números das métricas contam até o valor e as barras enchem em sequência ao entrar na viewport (uma vez).
- **Links do header:** sublinhado vermelho desliza da esquerda no hover.
- Cada comportamento vive num único hook/componente reutilizável e desliga com reduced motion.

### Modo Inspecionar

Mostra o cuidado com detalhe e a estrutura por trás da interface.

- Liga/desliga pelo Spotlight ("Inspecionar o site") ou pelo link do footer. Estado não persiste.
- Componentes marcados com `data-component="<Nome />"` ganham contorno tracejado vermelho e etiqueta com o nome.
- **Hover** num componente: tooltip que segue o cursor com nome, largura × altura, padding e raio lidos ao vivo via `getComputedStyle` (e "squircle" quando `corner-shape` é suportado).
- **Painel lateral** com: tokens de cor (amostras), tipografia, renderização ("Server Components + ilhas: Spotlight, LiveBuild, …") e **saúde do build** com números reais: versão, commit curto, data do build e resultado dos testes (ver abaixo).

### Saúde do build (dados reais)

- O script `prebuild` roda os testes unitários com reporter JSON e gera `src/generated/build-info.json` com: versão do `package.json`, commit (`VERCEL_GIT_COMMIT_SHA` ou `git rev-parse --short HEAD`), data/hora do build e totais de testes (passaram/total).
- Se os testes falham, o build falha — o site nunca publica com testes quebrados.
- O arquivo é gerado (no `.gitignore`); em dev, um fallback com valores "dev" evita erro.

## Arquitetura

```
src/
├── proxy.ts                         # `/` e caminhos sem idioma → /pt ou /en (cookie > Accept-Language > pt); grava cookie em /pt e /en
├── app/
│   ├── icon.svg                     # favicon
│   └── [locale]/
│       ├── layout.tsx               # <html lang>, fontes, global.css, generateMetadata, generateStaticParams
│       ├── page.tsx                 # carrega traduções e compõe as seções
│       ├── not-found.tsx
│       └── opengraph-image.tsx      # OG 1200x630 por idioma
├── components/                      # <Nome>/index.tsx + styles.module.css
│   ├── Header/  LanguageSwitcher/  Hero/  CommandBar/  Metrics/  MetricCard/
│   ├── Experience/  Stack/  Projects/  ProjectCard/  Contact/  Footer/  SectionTitle/
│   ├── Spotlight/                   # client: diálogo, busca, lista, resposta, toast
│   │   └── index.tsx  SpotlightResults.tsx  SpotlightAnswer.tsx  AnswerWidget.tsx  styles.module.css
│   ├── LiveBuild/                   # client: painel, cenas, cursor fantasma
│   │   └── index.tsx  scenes/*.tsx  styles.module.css
│   ├── Inspector/                   # client: contornos, tooltip, painel de tokens/saúde
│   └── MagneticButton/  Ripple/  CountUp/
├── contexts/
│   ├── SpotlightContext.tsx         # abrir/fechar de qualquer gatilho
│   └── InspectorContext.tsx         # liga/desliga inspeção
├── hooks/
│   └── useHotkey.ts  usePointerTilt.ts  useMagnetic.ts  useInView.ts  useReducedMotion.ts
├── lib/
│   ├── search.ts                    # normalização, índice e ranking (puro, testado)
│   ├── locale.ts                    # escolha de idioma usada pelo proxy (pura, testada)
│   └── buildInfo.ts                 # lê build-info.json com fallback
├── generated/build-info.json        # gerado no prebuild (gitignored)
├── locales/  en.ts  pt.ts  index.ts
└── styles/   tokens.css  global.css  fonts.ts
scripts/
└── build-info.mjs                   # roda vitest --reporter=json e escreve build-info.json
tests/e2e/                           # Playwright
```

- **Server Components** para todo o conteúdo (Header, Hero, Metrics, Experience, Stack, Projects, Contact, Footer). **Ilhas de cliente** só onde há interação: Spotlight, CommandBar (gatilho), LiveBuild, Inspector, MagneticButton, Ripple, CountUp e MetricCard (tilt/brilho).
- **Textos via props:** `page.tsx` chama `getTranslations(locale)` e passa a cada seção o seu trecho (`t`). Ilhas recebem o que precisam por props (o Spotlight recebe o índice de busca já montado no servidor).
- **Dados em locales:** seções, perguntas frequentes (pergunta, palavras-chave, resposta, widget), comandos, projetos, experiências, stack, métricas, cenas do LiveBuild e textos de metadata. `pt.ts` é tipado por `Translations` (de `en.ts`), então chave faltando quebra o build.
- **Componentes:** `export default function <Nome>({ t }: Props)`, `import S from './styles.module.css'`, `className={S.algo}`. Nenhuma cor/fonte/raio hardcoded: tudo `var(--…)`.
- **Breakpoint único** `48rem` (documentado em `tokens.css`).

### i18n por rota

- `/pt` e `/en` estáticas via `generateStaticParams`; locale inválido → 404.
- `proxy.ts`: em `/` e caminhos sem prefixo, escolhe cookie `locale` → `Accept-Language` (começa com `pt` → pt, senão en) → `pt`, e redireciona (307). Em `/pt` e `/en`, deixa passar e grava o cookie `locale`.
- Seletor PT/EN (link simples, sem JS) e o comando "Ver em inglês/português" do Spotlight levam à outra rota; o comando preserva a âncora atual.
- `<html lang>` vem do servidor; `generateMetadata` por idioma com `alternates.languages` (hreflang) e `canonical`.

## Acessibilidade

- Spotlight: `role="dialog"` + `aria-modal`, campo `role="combobox"` controlando `role="listbox"` com `aria-activedescendant`; foco preso e devolvido; Esc fecha.
- Toda ação tem caminho por teclado; nada depende só de hover.
- LiveBuild e efeitos decorativos com `aria-hidden`; informação importante sempre também em texto.
- Contraste AA verificado para `muted` e `faint` sobre `cream`/`surface` (ajustar `faint` se não passar em texto).
- `prefers-reduced-motion` desliga loop, tilt, magnético, ripple, digitação e contagem (mostram estado final).
- Links externos com `target="_blank" rel="noopener noreferrer"`; um `h1`, `h2` por seção.

## Limpeza

- Remover: `src/pages/`, `.babelrc`, styled-components e dependências ligadas (`babel-plugin-styled-components`, `@types/styled-components`, `@babel/preset-typescript`), `src/styles/theme.ts`/`global.ts`, `Form`, `Wrapper`, `Button` antigo, `components/template/`, PWA (`next-pwa`, `public/sw.js`, `public/workbox-*.js`, `public/manifest.json`), dependência `webpack`, imagens não usadas (`Bluis.svg`, `perfil.jpg`, `profile.jpg`, `square.*`, `twitter.png`, `github.png`/`linkedin.png`/`instagram.png` da raiz, `social/`, `partners/`, `logob.svg`, `logow.svg`, `vercel.svg`).
- Manter: `public/img/trips.png`, `public/img/tomatracker.png`, `logo.svg` (vira `app/icon.svg`).
- `.gitignore`: `/.superpowers` (já feito), `src/generated/`, `/test-results`, `/playwright-report`.
- `package.json`: `name: "bluis"`, scripts `dev`, `prebuild` (build-info), `build`, `start`, `lint`, `test` (vitest), `test:e2e` (playwright).
- README reescrito no template do portfólio (inglês), com screenshot/GIF do hero.

## Testes e verificação

**Unitários (Vitest), rodam no `prebuild`:**
- `lib/search.ts`: normalização de acento/caixa; pontuação começo do nome > começo de palavra > meio; palavra-chave conta como começo do nome; empate preserva ordem do catálogo; estado vazio.
- `lib/locale.ts`: cookie > Accept-Language > padrão; valores inválidos.
- Paridade de locales: mesmas chaves e mesmo número de itens em listas (perguntas, cenas, experiências).
- `lib/buildInfo.ts`: fallback quando o arquivo não existe.

**E2E (Playwright), no CI contra o build de produção:**
- `/` redireciona conforme `Accept-Language` e cookie; `/xx` → 404; `/en` vem em inglês com `lang="en"`.
- Spotlight: ⌘K abre, ↑/↓/Enter navegam, busca "testes" mostra a pergunta de qualidade, Enter mostra a resposta, Esc volta e fecha, "Copiar e-mail" mostra toast.
- Inspecionar: liga pelo Spotlight, etiquetas aparecem, painel mostra versão e testes.
- Reduced motion (`reducedMotion: 'reduce'`): LiveBuild estático, sem contagem animada.
- Mobile (375px): sem scroll horizontal, hero em uma coluna.

**CI (GitHub Actions):** em push/PR — `yarn lint`, `tsc --noEmit`, `yarn test`, `yarn build`, `yarn test:e2e`.

**Manual antes do merge:** desktop e mobile no navegador, interações do mouse (LiveBuild, cards, botões), OG por idioma, `yarn audit` sem altas/críticas em dependências de runtime.

## Atualização do `portfolio-standards`

Ao final, no repositório `~/Code/portfolio-standards` (commit separado, lá):

- Novo `conventions/stacks/nextjs-css-modules.md`, extraído deste projeto: stack, estrutura (Server Components + ilhas de cliente), componente `index.tsx` + `styles.module.css`, tokens em `styles/tokens.css`, squircle, i18n por rota com `getTranslations` + props, `proxy.ts`, Vitest + Playwright, `build-info` no prebuild.
- `conventions/project-structure.md`: citar a variação CSS Modules ao lado da de styled-components.
- `nextjs-styled-components.md` permanece (tomatracker continua nele).

## Referência visual

Protótipos aprovados em `.superpowers/brainstorm/74325-1792611406/content/` (local, gitignored): `hero-build-v3.html` é a referência final de hero, Spotlight, cards e micro-interações; `command-palette-v3.html` para o modo Inspecionar com tooltip. Na implementação, remover dos protótipos o que este spec exclui (rótulo "bruno.ai", trace de ferramentas, resposta sobre guardrails/evals).

## Commits

Conventional Commits em português, pequenos, na branch `redesign`.
