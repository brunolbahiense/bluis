# Redesign e modernização do portfólio (bluis)

**Data:** 2026-10-21
**Status:** aprovado em brainstorming, aguardando revisão do spec

## Contexto

O site atual (bluis.vercel.app) foi feito em 2021–2023, quando o Bruno era júnior. Roda Next 10 (Pages Router) + React 17 + styled-components 5 + next-pwa 5/webpack 4, não builda no Node 22, tem 342 vulnerabilidades no `yarn audit` e o conteúdo está desatualizado (hoje ele é Senior Software Engineer). A marca `<B/uis>` será abandonada.

## Objetivos

1. Modernizar a stack seguindo o padrão do portfólio (`~/Code/portfolio-standards`), trocando styled-components por CSS Modules — e registrar essa variação como nova convenção de stack no `portfolio-standards`.
2. Redesenhar o site: visual mais clean, com o nome do Bruno como identidade.
3. Refletir a senioridade atual: experiência, números de impacto e stack ampliada.
4. Site bilíngue (pt-BR / en) com todo o texto em arquivos de locale, para o Bruno reescrever os textos sem tocar em componentes.

## Público

Recrutadores/empresas **e** potenciais clientes: portfólio pessoal com CTA de contato.

## Fora de escopo

- Foto de perfil (removida por enquanto).
- Seção de parceiros/logos e qualquer menção a clientes da empresa (Itaú, Nubank etc.).
- Nome da empresa empregadora (Salt Systems) no site.
- Modo escuro.
- PWA (site de uma página, sem ganho offline).
- Formulário de contato.
- Testes automatizados (a única lógica é a escolha de idioma no `proxy.ts`, coberta pelas checagens com `curl` em Verificação).

## Stack

| Item | Escolha |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Linguagem | TypeScript 5.9, `strict` |
| Estilo | CSS Modules (`styles.module.css` por componente) + tokens em CSS custom properties; sem dependência extra |
| Fontes | `next/font/google`: Fraunces (títulos), Inter (texto), JetBrains Mono (rótulos/tags) |
| Lint/format | ESLint 9 (flat config, `eslint-config-next`) + Prettier 3 (`.prettierrc` atual mantido) |
| Runtime | Node.js >= 20 (`engines` + `.nvmrc` com `22`), Yarn 1 |
| Bundler | Turbopack (padrão do Next 16) em dev e build |
| Renderização | Server Components em todos os componentes; zero componentes de cliente |

Next 16 em vez de 15: o padrão pede "15+"; 16 é o `latest` atual e evita nova migração em curto prazo.

Por que CSS Modules em vez de styled-components: styled-components está em modo de manutenção e, por ser CSS-in-JS em runtime, obriga `'use client'` em todo componente estilizado. CSS Modules é nativo do Next, gera CSS no build, permite Server Components em tudo e mantém a separação componente/estilos do padrão (`index.tsx` + arquivo de estilos). Tailwind v4 foi considerado e preterido para preservar essa separação.

Avaliados e descartados: React Compiler (só otimiza componentes de cliente — não haverá nenhum), pnpm e Biome (divergem do padrão sem ganho relevante aqui).

## Identidade visual

Direção aprovada: estrutura minimalista + paleta atual + detalhes monospace.

- **Wordmark:** "Bruno **Bahiense**" em Fraunces, sobrenome em vermelho.
- **Favicon:** o símbolo de triângulos atual (`logo.svg`).
- **Paleta (tokens em `styles/tokens.css`, como `--color-<nome>`):**
  - `background` `#fefaec` (creme)
  - `surface` `#fffdf6` (cards)
  - `ink` `#24242c` (texto principal, bloco de contato)
  - `muted` `#6b6a66` (texto secundário)
  - `line` `#e9e2cc` (bordas/divisores)
  - `accent` `#e15638` (vermelho: destaques, rótulos)
  - `highlight` `#71c492` (verde: links/CTA no bloco escuro)
- **Tipografia:** títulos em Fraunces (300 no hero/contato, 500 em seções), corpo em Inter, rótulos `// assim` e tags em JetBrains Mono.
- Layout de coluna única, largura máxima ~1100px, divisores finos entre seções; responsivo com breakpoint mobile (grids viram coluna única).

## Estrutura da página (rotas `/pt` e `/en`)

1. **Header**: wordmark à esquerda; âncoras Experiência · Projetos · Contato e seletor PT/EN à direita.
2. **Hero**: rótulo `// senior software engineer`, frase-título em serifa com uma palavra em vermelho itálico, bio curta, botões "Vamos conversar" (âncora para Contato) e "GitHub ↗".
3. **Metrics**: faixa com 3 números de impacto — "15+ portais entregues ponta a ponta", "2 meses → 3 semanas para lançar um novo produto", "Tech lead".
4. **Experience**: linha do tempo com 3 cargos (sem nome da empresa):
   - nov/2025 – atual · Senior Software Engineer
   - nov/2023 – nov/2025 · Full Stack Developer Pleno & Squad Leader
   - jul/2022 – out/2023 · Full Stack Developer

   Cada item: período, cargo, 1–2 frases de descrição (resumidas do LinkedIn).
5. **Stack**: (dentro da seção Experiência) cards por grupo, cada um com tags:
   - Frontend: React, Next.js, TypeScript, JavaScript
   - Backend: Node.js, Express, GraphQL, APIs REST
   - Dados: MongoDB, Redis, ElasticSearch
   - Infra & CI/CD: AWS, Docker, Jenkins, EasyPanel
   - IA & Automação: LLMs, MCP, n8n, Airtable, Mautic
6. **Projects**: grid de cards (imagem real, nome, descrição, techs, link externo):
   - Bluis Trips — mapa dos lugares que visitei — https://bluis-trips.vercel.app
   - Tomatracker — pomodoro com tarefas, temas e relatório diário — https://tomatracker.vercel.app
7. **Contact**: bloco escuro (`ink`) com rótulo `// contato`, chamada em serifa, e-mail `brunoluisbahiense@gmail.com` (`mailto:`), links GitHub/LinkedIn/Instagram.
8. **Footer**: "© {ano} Bruno Bahiense" e "Feito com Next.js".

Textos iniciais: os do mockup aprovado e do LinkedIn. O Bruno vai reescrever quase tudo depois, editando só os locales.

## Arquitetura

```
src/
├── proxy.ts                    # redireciona `/` para `/pt` ou `/en` (cookie > Accept-Language > pt)
├── app/
│   ├── icon.svg                # favicon (triângulos)
│   └── [locale]/
│       ├── layout.tsx          # <html lang>, fontes, estilos globais, generateMetadata, generateStaticParams
│       ├── page.tsx            # compõe as seções
│       ├── not-found.tsx       # 404 simples no idioma
│       └── opengraph-image.tsx # imagem OG 1200x630 gerada por idioma (nome + cargo na paleta)
├── components/                 # <Nome>/index.tsx + styles.module.css
│   ├── Header/
│   ├── LanguageSwitcher/
│   ├── Hero/
│   ├── Metrics/
│   ├── Experience/
│   ├── Stack/
│   ├── Projects/
│   ├── Contact/
│   ├── Footer/
│   └── SectionTitle/           # título de seção + rótulo numérico, reutilizado
├── locales/
│   ├── en.ts                   # fonte da verdade; exporta type Translations
│   ├── pt.ts                   # tipado como Translations
│   └── index.ts                # translations, getTranslations(locale), type Locale, locales, defaultLocale, isLocale()
└── styles/
    ├── tokens.css              # :root com cores, fontes (vars do next/font), espaçamentos, largura máxima
    ├── global.css              # reset, base tipográfica, importa tokens.css
    └── fonts.ts                # instâncias do next/font (Fraunces, Inter, JetBrains Mono) com `variable`
```

Sem `contexts/` nem `hooks/`: não há estado global nem lógica de cliente. As pastas entram quando houver necessidade real.

- **Componentes** seguem o padrão adaptado: `export default function <Nome>({ t }: Props)`, estilos importados como `import S from './styles.module.css'` e usados como `className={S.hero}`. Todos são Server Components (sem `'use client'`).
- **Textos via props:** `page.tsx` chama `getTranslations(locale)` e passa a cada seção só o seu trecho (`<Hero t={translations.hero} />`). Componentes não leem locale por conta própria. Tipos das props derivam de `Translations` (ex.: `Translations['hero']`).
- **Imports absolutos** a partir de `src/` (`baseUrl: "src"`).
- **Dados em locales:** projetos, experiências, grupos de stack e métricas são arrays dentro de `en.ts`/`pt.ts`. Nomes de tecnologias são iguais nos dois idiomas, mas ficam no locale para manter uma fonte só por seção. URLs e caminhos de imagem também ficam no locale junto do item. Adicionar projeto = adicionar um item em cada locale; o TypeScript acusa divergência de forma.
- **Nenhuma cor/fonte hardcoded** em componente: tudo via `var(--…)` de `tokens.css`. Breakpoints não podem ser CSS vars em media query; usa-se um único valor (`48rem`) documentado em comentário no `tokens.css`.
- CSS moderno nativo: nesting, `clamp()` para tipografia fluida, grid com `auto-fill`.

### i18n por rota

- Duas rotas estáticas, `/pt` e `/en`, geradas no build via `generateStaticParams`. Locale inválido → `notFound()`.
- `proxy.ts` só atua em `/` (e caminhos sem prefixo de idioma): escolhe pelo cookie `locale`, senão pelo `Accept-Language` (começa com `pt` → `pt`, senão `en`), senão `pt`; redireciona com 307.
- O seletor PT/EN é um par de links simples (`/pt`, `/en`), sem JavaScript. O `proxy.ts` também atua em `/pt` e `/en`: deixa passar e grava o cookie `locale` com o idioma da rota, para a próxima visita a `/` respeitar a última escolha. As páginas continuam estáticas.
- `<html lang>` vem do servidor (`pt-BR` / `en`); não há troca de texto no cliente depois do carregamento.
- `generateMetadata` por idioma (title, description, OG/twitter), com `alternates.languages` (hreflang) apontando uma versão para a outra e `canonical` por rota.
- Textos de metadata também ficam nos locales.

### Acessibilidade e SEO

- Links externos como `<a href target="_blank" rel="noopener noreferrer">`; âncoras internas como `<a href="#secao">`.
- Imagens com `alt` vindo do locale; `next/image` para os thumbs dos projetos.
- Hierarquia: um `h1` (hero), `h2` por seção, `h3` em itens.
- Contraste do texto `muted` sobre creme verificado (mínimo AA).
- `metadataBase: https://bluis.vercel.app`; OG/twitter com a imagem gerada em PNG.

## Limpeza

- Remover: `src/pages/`, `.babelrc`, styled-components e dependências ligadas (`babel-plugin-styled-components`, `@types/styled-components`, `@babel/preset-typescript`), `src/styles/theme.ts` e `global.ts`, `next-env.d.ts` antigo (regerado), `Form`, `Wrapper`, `Button` antigo, `components/template/`, PWA (`next-pwa`, `public/sw.js`, `public/workbox-*.js`, `public/manifest.json`), dependência `webpack`, imagens não usadas (`Bluis.svg`, `perfil.jpg`, `profile.jpg`, `square.*`, `twitter.png`, `github.png`/`linkedin.png`/`instagram.png` da raiz, `social/`, `partners/`, `logob.svg`, `logow.svg`, `vercel.svg`).
- Manter: `public/img/trips.png`, `public/img/tomatracker.png`, `logo.svg` (vira `app/icon.svg`).
- `.gitignore`: adicionar `/.superpowers`.
- `package.json`: `name: "bluis"`, scripts `dev`/`build`/`start`/`lint` (`eslint .`), sem `lint-estaged`/`test:watch` quebrados.
- README reescrito no template do portfólio (inglês), com screenshot do novo site.

## Atualização do `portfolio-standards`

Ao final, no repositório `~/Code/portfolio-standards` (commit separado, lá):

- Novo `conventions/stacks/nextjs-css-modules.md`, extraído deste projeto: stack base, estrutura (sem contexts/hooks por padrão), componente `index.tsx` + `styles.module.css`, tokens em `styles/tokens.css`, i18n por rota com `getTranslations` + props, `proxy.ts`.
- `conventions/project-structure.md`: citar a variação CSS Modules ao lado da de styled-components.
- `nextjs-styled-components.md` permanece como está (tomatracker continua nele).

## Verificação

- `yarn lint`, `yarn tsc --noEmit` e `yarn build` sem erros no Node 22.
- `yarn audit` sem vulnerabilidades altas/críticas em dependências de runtime.
- Saída do build mostra `/pt` e `/en` como páginas estáticas (SSG).
- `curl -I` em `/` com `Accept-Language: en-US` → 307 para `/en`; sem header → `/pt`; com cookie `locale=en` → `/en`; `/xx` → 404.
- HTML de `/en` já vem em inglês do servidor, com `<html lang="en">` e `hreflang` corretos.
- Visitar `/en` grava o cookie `locale=en` (`Set-Cookie` na resposta).
- Nenhum arquivo em `src/` contém `'use client'`.
- No navegador (dev e build de produção): layout desktop e mobile (~375px), troca PT/EN, âncoras do menu, links externos em nova aba, `mailto:` do contato, favicon e imagem OG por idioma.

## Commits

Conventional Commits em português, pequenos, na branch `redesign` (ex.: `chore: migrar para Next 16 com App Router`, `feat: seção de experiência com linha do tempo e stack`).
