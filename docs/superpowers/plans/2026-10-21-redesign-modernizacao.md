# Redesign e modernização do portfólio — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o bluis em Next 16 + CSS Modules, com a identidade nova (squircle, creme/tinta/vermelho), Spotlight ⌘K local, LiveBuild no hero, modo Inspecionar com números reais de build, i18n por rota e testes no CI.

**Architecture:** Conteúdo em Server Components, textos e dados em `src/locales` (tipados), interações em ilhas de cliente pequenas (Spotlight, LiveBuild, Inspector, botões/cards animados). Lógica pura (`lib/search`, `lib/catalog`, `lib/locale`, `lib/buildInfo`) com testes Vitest; fluxos de ponta a ponta com Playwright contra o build de produção. O `prebuild` roda os testes e grava `src/generated/build-info.json`.

**Tech Stack:** Next.js 16.4 (App Router, Turbopack), React 19, TypeScript 5.9, CSS Modules, next/font, ESLint 9 + Prettier 3, Vitest 5, Playwright 1.64, Yarn 1, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-21-redesign-modernizacao-design.md`. **Referência visual:** `.superpowers/brainstorm/74325-1792611406/content/hero-build-v3.html` (abrir no navegador local).

---

## Decisões técnicas (lidas na documentação do Next 16.4 em `node_modules/next/dist/docs/`)

- `cacheComponents` **desligado**: o site é estático e, com ele ligado, `dynamicParams` não existe. Rotas `/pt` e `/en` via `generateStaticParams` + `dynamicParams = false`.
- O layout raiz fica em `src/app/[locale]/layout.tsx` (permitido pelo Next). O 404 é `src/app/[locale]/not-found.tsx`, acionado por `notFound()` e por um catch-all `src/app/[locale]/[...rest]/page.tsx`. O `proxy.ts` redireciona tudo que não tem prefixo de idioma (`/xx` → `/pt/xx` → 404).
- `middleware` foi renomeado para `proxy` no Next 16: arquivo `src/proxy.ts`, função `export function proxy(request: NextRequest)`.
- `params` é `Promise` em layout, page, `generateMetadata` e `opengraph-image`.
- Tipos explícitos `{ params: Promise<{ locale: string }> }` em vez de `PageProps`/`LayoutProps` (esses dependem de typegen e quebrariam o `tsc` no CI antes do build).
- Imports absolutos a partir de `src/` via `"baseUrl": "src"` (padrão do portfólio). CSS global importado com caminho relativo.
- Formatação: o `.prettierrc` atual (sem ponto e vírgula, aspas simples, sem vírgula final). Depois de escrever código, sempre `yarn lint --fix` e depois `yarn lint`.
- O ESLint do Next 16 traz as regras novas de `react-hooks` (ex.: proíbe `setState` síncrono dentro de `useEffect`). O código abaixo já respeita: estado só muda em callbacks (timers, observers, eventos) e componentes que precisam "zerar" estado são remontados com `key`.

## Mapa de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `.nvmrc`, `.gitignore` | Configuração |
| `src/types/next.d.ts` | Tipos do Next (CSS Modules, imagens) sem depender do `next-env.d.ts` gerado |
| `src/styles/tokens.css`, `global.css`, `fonts.ts` | Tokens, base global (reset, ripple, inspeção), fontes |
| `src/lib/locale.ts` (+ test) | Idiomas suportados e escolha de idioma (cookie > Accept-Language > pt) |
| `src/lib/search.ts` (+ test) | Normalização e pontuação da busca |
| `src/lib/catalog.ts` (+ test) | Catálogo do Spotlight montado a partir dos locales |
| `src/lib/buildInfo.ts` (+ test) | Leitura do `build-info.json` com fallback |
| `src/lib/clipboard.ts` | Copiar texto com fallback |
| `src/locales/types.ts`, `pt.ts`, `en.ts`, `index.ts` (+ test) | Todo texto e dado do site |
| `scripts/build-info.mjs` | `prebuild`: roda testes e grava números reais |
| `src/proxy.ts` | Redireciona para o idioma e grava cookie |
| `src/app/icon.svg`, `src/app/[locale]/{layout,page,not-found,opengraph-image}.tsx`, `[...rest]/page.tsx` | Rotas |
| `src/hooks/*` | `useReducedMotion`, `useInView`, `usePageVisible`, `usePointerTilt`, `useMagnetic`, `useRipple`, `useHotkey`, `useTypewriter` |
| `src/contexts/SpotlightContext.tsx`, `InspectorContext.tsx` | Estado global de abrir/fechar Spotlight, toast e inspeção |
| `src/components/*` | Um diretório por componente: `index.tsx` + `styles.module.css` |
| `tests/e2e/*.spec.ts` | Playwright |
| `.github/workflows/ci.yml` | CI |

---

### Task 1: Migrar dependências e configuração

**Files:**
- Modify: `package.json`, `.gitignore`, `tsconfig.json`
- Create: `next.config.ts`, `eslint.config.mjs`, `.nvmrc`, `src/types/next.d.ts`
- Delete: `src/pages/`, `src/components/`, `src/styles/`, `.babelrc`, `next.config.js`, `next-env.d.ts`, `yarn.lock`, PWA e imagens não usadas
- Move: `public/img/logo.svg` → `src/app/icon.svg`

- [ ] **Step 1: Confirmar a branch**

Run: `git branch --show-current`
Expected: `redesign`

- [ ] **Step 2: Remover código, configs e arquivos antigos**

```bash
git rm -r -q src/pages src/components src/styles .babelrc next.config.js next-env.d.ts yarn.lock \
  public/sw.js public/workbox-030153e1.js public/manifest.json public/vercel.svg \
  public/img/Bluis.svg public/img/perfil.jpg public/img/profile.jpg public/img/square.png public/img/square.svg \
  public/img/twitter.png public/img/github.png public/img/linkedin.png public/img/instagram.png \
  public/img/social public/img/partners public/img/logob.svg public/img/logow.svg
mkdir -p src/app src/types
git mv public/img/logo.svg src/app/icon.svg
rm -rf node_modules .next
ls public/img
```

Expected: `tomatracker.png  trips.png`

- [ ] **Step 3: Escrever `package.json`**

```json
{
  "name": "bluis",
  "version": "2.0.0",
  "private": true,
  "engines": {
    "node": ">=20"
  },
  "packageManager": "yarn@1.22.22",
  "scripts": {
    "dev": "next dev",
    "prebuild": "node scripts/build-info.mjs",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "16.4.2",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.64.1",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.4.2",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.7",
    "prettier": "^3.9.10",
    "typescript": "~5.9.3",
    "vite": "^8",
    "vitest": "^5.0.5"
  }
}
```

- [ ] **Step 4: Escrever `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false
}

export default nextConfig
```

- [ ] **Step 5: Escrever `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "baseUrl": "src",
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.mts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", ".superpowers"]
}
```

- [ ] **Step 6: Escrever `src/types/next.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 7: Escrever `eslint.config.mjs`**

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierRecommended,
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly' }
    }
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/generated/**',
    'playwright-report/**',
    'test-results/**',
    '.superpowers/**'
  ])
])
```

- [ ] **Step 8: Escrever `.nvmrc`**

```
22
```

- [ ] **Step 9: Escrever `.gitignore`**

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage
/test-results
/playwright-report
/.vitest-report.json

# next.js
/.next/
/out/
next-env.d.ts
*.tsbuildinfo

# production
/build

# generated
/src/generated/

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files
.env*

# vercel
.vercel

# brainstorming companion
/.superpowers
```

- [ ] **Step 10: Instalar no Node 22**

Run: `node -v && yarn install`
Expected: `v22.x` e `Done in …s.` (avisos de peer dependency são aceitáveis; erro não).

- [ ] **Step 11: Verificar lint e tipos da configuração**

Run: `yarn lint --fix && yarn lint && yarn typecheck`
Expected: sem erros.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: migrar para Next 16, React 19 e remover stack antiga

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Tokens, estilos globais e fontes

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/fonts.ts`

- [ ] **Step 1: Escrever `src/styles/tokens.css`**

```css
/*
 * Tokens do design system.
 * Breakpoint único do site: 48rem (custom properties não funcionam dentro de media query).
 * Texto pequeno em vermelho usa --color-accent-text (contraste AA); --color-accent fica para
 * títulos grandes e elementos decorativos.
 */
:root {
  --color-cream: #fefaec;
  --color-surface: #fffdf6;
  --color-hover: #f5efdc;
  --color-ink: #24242c;
  --color-muted: #6b6a66;
  --color-faint: #75726a;
  --color-line: #e6dec6;
  --color-accent: #e15638;
  --color-accent-text: #b8432a;
  --color-highlight: #71c492;
  --color-amber: #c9962b;

  --theme-coral: #e15638;
  --theme-coral-soft: #fbe3dc;
  --theme-ink: #3b3fb6;
  --theme-ink-soft: #e1e2f7;
  --theme-mint: #2f9e6b;
  --theme-mint-soft: #dcf2e6;
  --theme-amber: #c9962b;
  --theme-amber-soft: #f6ecd3;

  --font-serif: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-pill: 999px;

  --space-page: clamp(1rem, 4vw, 2.5rem);
  --width-page: 72rem;

  --shadow-soft: 0 18px 40px -28px rgba(36, 36, 44, 0.4);
  --shadow-float: 0 30px 60px -30px rgba(36, 36, 44, 0.45);

  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Squircle: com corner-shape o raio precisa ser maior para a curva parecer igual. */
@supports (corner-shape: squircle) {
  :root {
    --radius-sm: 14px;
    --radius-md: 26px;
    --radius-lg: 40px;
  }
}
```

- [ ] **Step 2: Escrever `src/styles/global.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

@supports (corner-shape: squircle) {
  *,
  *::before,
  *::after {
    corner-shape: squircle;
  }
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

img {
  display: block;
  max-width: 100%;
}

ul,
ol {
  padding: 0;
}

:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
}

::selection {
  background: var(--theme-coral-soft);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Ripple criado por hooks/useRipple dentro de qualquer elemento com overflow: hidden */
.ripple {
  position: absolute;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border: 1.5px solid currentColor;
  border-radius: 6px;
  opacity: 0.6;
  pointer-events: none;
  animation: ripple 0.55s ease-out forwards;
}

@keyframes ripple {
  to {
    transform: scale(5);
    opacity: 0;
  }
}

/* Modo Inspecionar: atributo no <html> ligado pelo InspectorProvider */
html[data-inspecting] [data-component] {
  outline: 1px dashed var(--color-accent);
  outline-offset: 3px;
}

html[data-inspecting] [data-component]::after {
  content: attr(data-component);
  position: absolute;
  top: -18px;
  left: 0;
  z-index: 20;
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--color-accent-text);
  color: #fff;
  font: 500 10px/1.5 var(--font-mono);
  white-space: nowrap;
  pointer-events: none;
}

html[data-inspecting] [data-component][data-inspect-hover] {
  outline-style: solid;
  background-color: rgba(225, 86, 56, 0.04);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Regra para todo componente com `data-component`: ele precisa ter `position: relative` (ou outro posicionamento) no próprio CSS, para a etiqueta `::after` da inspeção ficar presa a ele.

- [ ] **Step 3: Escrever `src/styles/fonts.ts`**

```ts
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '500'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap'
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
})

export const fontVariables = [fraunces.variable, inter.variable, jetbrainsMono.variable].join(' ')
```

- [ ] **Step 4: Verificar e commitar**

Run: `yarn lint --fix && yarn lint && yarn typecheck`
Expected: sem erros. (CSS é verificado visualmente na Task 13.)

```bash
git add src/styles
git commit -m "feat: tokens do design system, estilos globais e fontes

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Escolha de idioma (`lib/locale`) com TDD

**Files:**
- Create: `vitest.config.ts`, `src/lib/locale.ts`, `src/lib/locale.test.ts`

- [ ] **Step 1: Escrever `vitest.config.ts`**

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const sourceDirectory = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [{ find: /^(lib|locales)(\/.*)?$/, replacement: `${sourceDirectory}/$1$2` }]
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
})
```

- [ ] **Step 2: Escrever o teste que falha — `src/lib/locale.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { chooseLocale, isLocale, localeFromPath, otherLocale } from 'lib/locale'

describe('isLocale', () => {
  it('aceita só os idiomas suportados', () => {
    expect(isLocale('pt')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
})

describe('localeFromPath', () => {
  it('lê o idioma do primeiro segmento', () => {
    expect(localeFromPath('/pt')).toBe('pt')
    expect(localeFromPath('/en/qualquer')).toBe('en')
  })

  it('retorna null sem prefixo de idioma', () => {
    expect(localeFromPath('/')).toBeNull()
    expect(localeFromPath('/portfolio')).toBeNull()
    expect(localeFromPath('/xx')).toBeNull()
  })
})

describe('chooseLocale', () => {
  it('prioriza o cookie válido', () => {
    expect(chooseLocale({ cookie: 'en', acceptLanguage: 'pt-BR' })).toBe('en')
  })

  it('ignora cookie inválido e usa o Accept-Language', () => {
    expect(chooseLocale({ cookie: 'fr', acceptLanguage: 'pt-BR,pt;q=0.9' })).toBe('pt')
  })

  it('respeita a ordem de preferência por q', () => {
    expect(chooseLocale({ acceptLanguage: 'fr;q=0.9,en;q=0.8,pt;q=0.95' })).toBe('pt')
  })

  it('usa inglês quando o navegador prefere um idioma não suportado', () => {
    expect(chooseLocale({ acceptLanguage: 'de-DE,de;q=0.9' })).toBe('en')
  })

  it('usa português sem cookie nem Accept-Language', () => {
    expect(chooseLocale({})).toBe('pt')
    expect(chooseLocale({ acceptLanguage: '' })).toBe('pt')
  })
})

describe('otherLocale', () => {
  it('alterna entre pt e en', () => {
    expect(otherLocale('pt')).toBe('en')
    expect(otherLocale('en')).toBe('pt')
  })
})
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `yarn test src/lib/locale.test.ts`
Expected: FAIL — `Failed to resolve import "lib/locale"` (ou similar).

- [ ] **Step 4: Implementar `src/lib/locale.ts`**

```ts
export const locales = ['pt', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt'

const foreignVisitorLocale: Locale = 'en'

export const localeCookie = 'locale'

export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', en: 'en' }

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'pt' ? 'en' : 'pt'
}

export function localeFromPath(pathname: string): Locale | null {
  const firstSegment = pathname.split('/')[1]
  return isLocale(firstSegment) ? firstSegment : null
}

function parseAcceptLanguage(header: string) {
  return header
    .split(',')
    .map((part, position) => {
      const [tag, ...parameters] = part.trim().split(';')
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='))
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1
      return {
        language: tag.toLowerCase().split('-')[0],
        quality: Number.isNaN(quality) ? 0 : quality,
        position
      }
    })
    .filter((entry) => entry.language && entry.quality > 0)
    .sort((first, second) => second.quality - first.quality || first.position - second.position)
}

export function chooseLocale({
  cookie,
  acceptLanguage
}: {
  cookie?: string
  acceptLanguage?: string | null
}): Locale {
  if (isLocale(cookie)) return cookie
  if (!acceptLanguage?.trim()) return defaultLocale
  const preferred = parseAcceptLanguage(acceptLanguage).find((entry) => isLocale(entry.language))
  return preferred ? (preferred.language as Locale) : foreignVisitorLocale
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `yarn test src/lib/locale.test.ts`
Expected: PASS — 9 testes.

- [ ] **Step 6: Commit**

```bash
yarn lint --fix && yarn lint
git add vitest.config.ts src/lib/locale.ts src/lib/locale.test.ts
git commit -m "feat: escolha de idioma por cookie e Accept-Language

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Busca (`lib/search`) com TDD

**Files:**
- Create: `src/lib/search.ts`, `src/lib/search.test.ts`

- [ ] **Step 1: Escrever o teste que falha — `src/lib/search.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { normalize, scoreEntry, searchEntries, type SearchEntry } from 'lib/search'

const entry = (id: string, title: string, extra: Partial<SearchEntry> = {}): SearchEntry => ({
  id,
  title,
  ...extra
})

describe('normalize', () => {
  it('remove acentos, caixa e espaços nas pontas', () => {
    expect(normalize('  Automação ÉPICA ')).toBe('automacao epica')
  })
})

describe('scoreEntry', () => {
  it('começo do nome vale mais que começo de palavra, que vale mais que meio', () => {
    const nameStart = scoreEntry(entry('a', 'Experiência'), 'exp')
    const wordStart = scoreEntry(entry('b', 'Minha experiência'), 'exp')
    const middle = scoreEntry(entry('c', 'Inexperiente'), 'exp')
    expect(nameStart).toBeGreaterThan(wordStart)
    expect(wordStart).toBeGreaterThan(middle)
    expect(middle).toBeGreaterThan(0)
  })

  it('ignora acento e caixa', () => {
    expect(scoreEntry(entry('a', 'Automação'), 'AUTOMACAO')).toBeGreaterThan(0)
  })

  it('palavra-chave conta como começo do nome, mesmo no meio de uma frase', () => {
    const question = entry('q', 'Como você garante qualidade?', { keywords: ['testes', 'review'] })
    expect(scoreEntry(question, 'você faz testes a/b?')).toBe(scoreEntry(entry('x', 'Testes'), 'testes'))
  })

  it('palavra-chave aceita digitação parcial a partir de 3 letras', () => {
    const question = entry('q', 'Como você garante qualidade?', { keywords: ['testes'] })
    expect(scoreEntry(question, 'tes')).toBeGreaterThan(0)
    expect(scoreEntry(question, 'te')).toBe(0)
  })

  it('procura também no subtítulo, como trecho', () => {
    const copyEmail = entry('a', 'Copiar e-mail', { subtitle: 'brunoluisbahiense@gmail.com' })
    expect(scoreEntry(copyEmail, 'gmail')).toBeGreaterThan(0)
  })

  it('retorna zero quando nada casa', () => {
    expect(scoreEntry(entry('a', 'Projetos'), 'kubernetes')).toBe(0)
  })
})

describe('searchEntries', () => {
  const catalog = [
    entry('1', 'Inexperiente'),
    entry('2', 'Minha experiência'),
    entry('3', 'Experiência'),
    entry('4', 'Projetos')
  ]

  it('sem busca devolve o catálogo na ordem original', () => {
    expect(searchEntries(catalog, '  ').map((item) => item.id)).toEqual(['1', '2', '3', '4'])
  })

  it('ordena por pontuação e remove o que não casa', () => {
    expect(searchEntries(catalog, 'exp').map((item) => item.id)).toEqual(['3', '2', '1'])
  })

  it('empate preserva a ordem do catálogo', () => {
    const tied = [entry('a', 'Stack de dados'), entry('b', 'Stack de front')]
    expect(searchEntries(tied, 'stack').map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('devolve lista vazia quando nada casa', () => {
    expect(searchEntries(catalog, 'zzz')).toEqual([])
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `yarn test src/lib/search.test.ts`
Expected: FAIL — `Failed to resolve import "lib/search"`.

- [ ] **Step 3: Implementar `src/lib/search.ts`**

```ts
export type SearchEntry = {
  id: string
  title: string
  subtitle?: string
  keywords?: string[]
}

// Mesma hierarquia da busca do painel do trabalho:
// começo do nome > começo de palavra > trecho no meio.
const scores = { nameStart: 3, wordStart: 2, middle: 1, none: 0 } as const

const minimumPartialKeywordLength = 3

export function normalize(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

function queryWords(query: string) {
  return query
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}/-]/gu, ''))
    .filter((word) => word.length >= 2)
}

function matchesKeyword(keywords: string[], query: string) {
  const words = queryWords(query)
  return keywords.some((keyword) => {
    const normalizedKeyword = normalize(keyword)
    return words.some(
      (word) =>
        word === normalizedKeyword ||
        (word.length >= minimumPartialKeywordLength && normalizedKeyword.startsWith(word)) ||
        (normalizedKeyword.length >= minimumPartialKeywordLength && word.startsWith(normalizedKeyword))
    )
  })
}

export function scoreEntry(entry: SearchEntry, rawQuery: string): number {
  const query = normalize(rawQuery)
  if (!query) return scores.none

  const title = normalize(entry.title)
  if (title.startsWith(query)) return scores.nameStart
  if (entry.keywords && matchesKeyword(entry.keywords, query)) return scores.nameStart
  if (title.split(/[\s\-/·,.()?!]+/).some((word) => word.startsWith(query))) return scores.wordStart
  if (title.includes(query)) return scores.middle
  if (entry.subtitle && normalize(entry.subtitle).includes(query)) return scores.middle
  return scores.none
}

export function searchEntries<Entry extends SearchEntry>(entries: Entry[], rawQuery: string): Entry[] {
  if (!normalize(rawQuery)) return entries
  return entries
    .map((entry, position) => ({ entry, position, score: scoreEntry(entry, rawQuery) }))
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score || first.position - second.position)
    .map((result) => result.entry)
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `yarn test src/lib/search.test.ts`
Expected: PASS — 11 testes.

- [ ] **Step 5: Commit**

```bash
yarn lint --fix && yarn lint
git add src/lib/search.ts src/lib/search.test.ts
git commit -m "feat: busca local com pontuação por posição e palavras-chave

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Locales (todo o texto e dados do site) + teste de paridade

**Files:**
- Create: `src/locales/types.ts`, `src/locales/pt.ts`, `src/locales/en.ts`, `src/locales/index.ts`, `src/locales/locales.test.ts`

> Variação documentada em relação ao padrão do portfólio: o tipo `Translations` fica em `types.ts` (e não inferido de `en.ts`) porque os widgets de resposta são uma união discriminada que `typeof en` não preserva. Os dois idiomas continuam tipados pelo mesmo contrato.

- [ ] **Step 1: Escrever `src/locales/types.ts`**

```ts
import type { Locale } from 'lib/locale'

export type AnswerWidget =
  | { type: 'chips'; items: string[] }
  | { type: 'rows'; items: { label: string; status: string }[] }
  | { type: 'flow'; steps: { label: string; text: string }[] }
  | { type: 'projects' }

export type FrequentQuestion = {
  id: string
  question: string
  subtitle: string
  keywords: string[]
  answer: string
  widget: AnswerWidget
}

export type SectionId = 'experience' | 'projects' | 'contact'

export type SocialId = 'github' | 'linkedin' | 'instagram'

export type Translations = {
  locale: Locale
  dateLocale: string
  currency: string
  brand: { firstName: string; lastName: string }
  meta: { title: string; description: string; ogTagline: string }
  nav: {
    ariaLabel: string
    experience: string
    projects: string
    contact: string
    searchTrigger: string
    switchLanguage: string
    switchLanguageLabel: string
  }
  hero: {
    label: string
    titleStart: string
    titleEmphasis: string
    titleEnd: string
    bio: string
    commandPlaceholder: string
    hints: string[]
    primaryCta: string
    secondaryCta: string
  }
  metrics: {
    label: string
    items: {
      state: string
      tone: 'ok' | 'progress'
      value: string
      countTo: number | null
      suffix: string
      description: string
      progress: number
      note: string
    }[]
  }
  experience: {
    label: string
    title: string
    items: { period: string; role: string; description: string }[]
    stackTitle: string
    stackGroups: { name: string; items: string[] }[]
  }
  projects: {
    label: string
    title: string
    open: string
    items: {
      name: string
      description: string
      tech: string
      href: string
      image: string
      imageAlt: string
    }[]
  }
  contact: {
    label: string
    titleStart: string
    titleEmphasis: string
    titleEnd: string
    email: string
    copyEmail: string
    socials: { id: SocialId; label: string; href: string }[]
  }
  footer: { inspect: string; version: string }
  spotlight: {
    dialogLabel: string
    placeholder: string
    groups: { questions: string; goTo: string; actions: string; content: string }
    questions: FrequentQuestion[]
    sections: { id: SectionId; title: string; subtitle: string }[]
    actions: {
      copyEmail: string
      openGithub: string
      openLinkedin: string
      opensInNewTab: string
      switchLanguage: string
      switchLanguageSubtitle: string
      inspect: string
      inspectSubtitle: string
    }
    kinds: {
      question: string
      section: string
      action: string
      project: string
      role: string
      technology: string
    }
    empty: { title: string; action: string }
    footer: { navigate: string; open: string; close: string; note: string }
    back: string
    toasts: { emailCopied: string; inspectOn: string; inspectOff: string }
  }
  liveBuild: {
    description: string
    building: string
    live: string
    dashboard: { kind: string; title: string; kpiLabel: string; delta: string; cta: string; success: string }
    report: {
      kind: string
      title: string
      columns: [string, string, string]
      rows: { channel: string; status: string; total: string }[]
      cta: string
      success: string
    }
    automation: {
      kind: string
      title: string
      nodes: { label: string; text: string }[]
      cta: string
      success: string
    }
    support: {
      kind: string
      title: string
      customer: string
      assistant: string
      reply: string
      cta: string
      success: string
    }
    deals: { kind: string; title: string; kpiLabel: string; discount: string; cta: string; success: string }
  }
  inspector: {
    title: string
    hint: string
    close: string
    colors: string
    typography: string
    typographyItems: string[]
    rendering: string
    renderingValue: string
    build: string
    version: string
    commit: string
    builtAt: string
    tests: string
    testsValue: string
  }
  notFound: { title: string; body: string; back: string }
}
```

- [ ] **Step 2: Escrever `src/locales/pt.ts`**

```ts
import type { Translations } from './types'

const pt: Translations = {
  locale: 'pt',
  dateLocale: 'pt-BR',
  currency: 'BRL',
  brand: { firstName: 'Bruno', lastName: 'Bahiense' },
  meta: {
    title: 'Bruno Bahiense — Senior Software Engineer',
    description:
      'Construo produtos com IA: bonitos, seguros e em evolução contínua. Arquitetura, liderança técnica e plataformas fintech.',
    ogTagline: 'Construo produtos com IA — bonitos, seguros e em evolução contínua.'
  },
  nav: {
    ariaLabel: 'Principal',
    experience: 'Experiência',
    projects: 'Projetos',
    contact: 'Contato',
    searchTrigger: 'Buscar ou perguntar…',
    switchLanguage: 'EN',
    switchLanguageLabel: 'View in English'
  },
  hero: {
    label: '// senior software engineer · ia & produto',
    titleStart: 'Construo produtos com IA — ',
    titleEmphasis: 'bonitos',
    titleEnd: ', seguros e em evolução contínua.',
    bio: 'Em vez de um currículo, uma interface. Navegue, execute comandos ou pergunte — do jeito que eu construo software.',
    commandPlaceholder: 'Pergunte algo ou busque uma seção…',
    hints: ['O que você faz com IA?', 'Copiar e-mail', 'Ver em inglês'],
    primaryCta: 'Vamos conversar →',
    secondaryCta: 'GitHub ↗'
  },
  metrics: {
    label: 'Resultados',
    items: [
      {
        state: 'Em produção',
        tone: 'ok',
        value: '15+',
        countTo: 15,
        suffix: '+',
        description: 'portais entregues ponta a ponta',
        progress: 100,
        note: 'front, back e integrações'
      },
      {
        state: 'Antes: 2 meses',
        tone: 'ok',
        value: '3 semanas',
        countTo: null,
        suffix: '',
        description: 'para lançar um portal novo',
        progress: 37,
        note: 'com padrões de arquitetura reutilizáveis'
      },
      {
        state: 'Evolução contínua',
        tone: 'progress',
        value: 'Tech lead',
        countTo: null,
        suffix: '',
        description: 'referência técnica de uma squad',
        progress: 72,
        note: 'code review, arquitetura e entregas'
      }
    ]
  },
  experience: {
    label: '01',
    title: 'Experiência',
    items: [
      {
        period: 'nov 2025 — hoje',
        role: 'Senior Software Engineer',
        description:
          'Referência técnica e liderança de squad em plataformas fintech: arquitetura, code review, decisões técnicas e conversa direta com clientes e stakeholders. Automação, observabilidade e IA aplicada ao desenvolvimento.'
      },
      {
        period: 'nov 2023 — nov 2025',
        role: 'Full Stack Developer Pleno & Squad Leader',
        description:
          'Plataformas de recuperação de crédito para pessoas físicas e jurídicas e chatbots de atendimento automatizado. Capacitação do time em boas práticas e metodologias ágeis.'
      },
      {
        period: 'jul 2022 — out 2023',
        role: 'Full Stack Developer',
        description:
          'React no front, Node no back, APIs REST, automações via WhatsApp e Telegram e manutenção de ambientes em AWS e Docker.'
      }
    ],
    stackTitle: 'Stack',
    stackGroups: [
      { name: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript'] },
      { name: 'Backend', items: ['Node.js', 'Express', 'GraphQL', 'APIs REST'] },
      { name: 'Dados', items: ['MongoDB', 'Redis', 'ElasticSearch'] },
      { name: 'Infra & CI/CD', items: ['AWS', 'Docker', 'Jenkins', 'EasyPanel'] },
      { name: 'IA & Automação', items: ['LLMs', 'MCP', 'n8n', 'Airtable', 'Mautic'] }
    ]
  },
  projects: {
    label: '02',
    title: 'Projetos',
    open: 'Abrir projeto',
    items: [
      {
        name: 'Bluis Trips',
        description: 'Mapa dos lugares que visitei.',
        tech: 'Next.js · GraphQL',
        href: 'https://bluis-trips.vercel.app',
        image: '/img/trips.png',
        imageAlt: 'Captura do projeto Bluis Trips'
      },
      {
        name: 'Tomatracker',
        description: 'Pomodoro com tarefas, temas e relatório diário.',
        tech: 'Next.js · TypeScript',
        href: 'https://tomatracker.vercel.app',
        image: '/img/tomatracker.png',
        imageAlt: 'Captura do projeto Tomatracker'
      }
    ]
  },
  contact: {
    label: '03 · contato',
    titleStart: 'Tem um produto para ',
    titleEmphasis: 'tirar do papel',
    titleEnd: '?',
    email: 'brunoluisbahiense@gmail.com',
    copyEmail: 'Copiar e-mail',
    socials: [
      { id: 'github', label: 'GitHub', href: 'https://github.com/brunolbahiense' },
      { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/brunolbahiense/' },
      { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/brunolbahiense/' }
    ]
  },
  footer: { inspect: 'Inspecionar este site', version: 'versão' },
  spotlight: {
    dialogLabel: 'Buscar no site',
    placeholder: 'Buscar seções, projetos… ou perguntar',
    groups: {
      questions: 'Perguntas frequentes',
      goTo: 'Ir para',
      actions: 'Fazer algo',
      content: 'No site'
    },
    questions: [
      {
        id: 'ai',
        question: 'O que você faz com IA?',
        subtitle: 'LLMs, MCP e automação',
        keywords: ['ia', 'ai', 'llm', 'llms', 'mcp', 'automação', 'agente', 'agentes', 'n8n', 'inteligência'],
        answer:
          'Uso IA no produto — LLMs e MCPs integrados às plataformas — e no processo, automatizando fluxos com n8n para o time entregar mais com menos trabalho manual. Sempre com uma pessoa revisando as decisões que importam.',
        widget: {
          type: 'chips',
          items: ['LLMs', 'MCP', 'n8n', 'Agentes com ferramentas', 'Automação de atendimento']
        }
      },
      {
        id: 'quality',
        question: 'Como você garante qualidade?',
        subtitle: 'revisão, testes e evolução',
        keywords: [
          'qualidade',
          'teste',
          'testes',
          'review',
          'revisão',
          'a/b',
          'consistência',
          'estabilidade',
          'segurança',
          'padrão',
          'padrões'
        ],
        answer:
          'Qualidade é processo: padrão, revisão, testes e medição — e o ciclo não termina no deploy.',
        widget: {
          type: 'flow',
          steps: [
            { label: '01 · padrão', text: 'Arquitetura e design tokens' },
            { label: '02 · revisão', text: 'Code review em toda entrega' },
            { label: '03 · testes', text: 'Unitários, e2e e testes A/B' },
            { label: '04 · produção', text: 'Observabilidade e segurança' },
            { label: '05 · evolução', text: 'Medir e melhorar ↺' }
          ]
        }
      },
      {
        id: 'stack',
        question: 'Qual sua stack?',
        subtitle: 'do front à infraestrutura',
        keywords: ['stack', 'tecnologia', 'tecnologias', 'react', 'node', 'next', 'typescript', 'aws', 'docker', 'ferramentas'],
        answer: 'Ponta a ponta, do front à infraestrutura — e IA no meio de tudo.',
        widget: {
          type: 'rows',
          items: [
            { label: 'Frontend', status: 'React · Next.js · TypeScript' },
            { label: 'Backend', status: 'Node.js · Express · GraphQL' },
            { label: 'Dados & Infra', status: 'MongoDB · Redis · AWS · Docker' },
            { label: 'IA & Automação', status: 'LLMs · MCP · n8n' }
          ]
        }
      },
      {
        id: 'projects',
        question: 'Mostre seus projetos',
        subtitle: 'projetos pessoais públicos',
        keywords: ['projeto', 'projetos', 'portfólio', 'trabalhos', 'trips', 'tomatracker', 'github'],
        answer:
          'Dois projetos pessoais públicos. O resto do meu trabalho roda em produção, com dados de clientes que não posso mostrar.',
        widget: { type: 'projects' }
      }
    ],
    sections: [
      { id: 'experience', title: 'Experiência', subtitle: 'jul 2022 → hoje · 3 cargos' },
      { id: 'projects', title: 'Projetos', subtitle: 'Bluis Trips, Tomatracker' },
      { id: 'contact', title: 'Contato', subtitle: 'e-mail e redes' }
    ],
    actions: {
      copyEmail: 'Copiar e-mail',
      openGithub: 'Abrir GitHub',
      openLinkedin: 'Abrir LinkedIn',
      opensInNewTab: 'abre em nova aba',
      switchLanguage: 'Ver em inglês',
      switchLanguageSubtitle: 'o site inteiro muda para EN',
      inspect: 'Inspecionar o site',
      inspectSubtitle: 'mostra os componentes por trás da interface'
    },
    kinds: {
      question: 'pergunta',
      section: 'seção',
      action: 'comando',
      project: 'projeto',
      role: 'cargo',
      technology: 'tecnologia'
    },
    empty: { title: 'Não encontrei isso aqui. Quer me mandar um e-mail?', action: 'Copiar e-mail' },
    footer: { navigate: 'navegar', open: 'abrir', close: 'fechar', note: 'busca no conteúdo deste site' },
    back: 'volta para a busca',
    toasts: {
      emailCopied: 'E-mail copiado ✓',
      inspectOn: 'Modo inspeção ligado',
      inspectOff: 'Modo inspeção desligado'
    }
  },
  liveBuild: {
    description:
      'Demonstração: interfaces de dashboard, relatório, automação, atendimento e acordos sendo montadas com os mesmos componentes.',
    building: 'construindo…',
    live: 'em produção',
    dashboard: {
      kind: 'dashboard',
      title: 'Vendas · Outubro',
      kpiLabel: 'receita do mês',
      delta: '+18%',
      cta: 'Compartilhar painel',
      success: 'Link copiado ✓'
    },
    report: {
      kind: 'relatório',
      title: 'Relatório semanal',
      columns: ['Canal', 'Status', 'Total'],
      rows: [
        { channel: 'E-mail', status: 'ok', total: '12.480' },
        { channel: 'WhatsApp', status: 'ok', total: '9.215' },
        { channel: 'SMS', status: 'revisar', total: '3.902' },
        { channel: 'App', status: 'ok', total: '7.660' }
      ],
      cta: 'Exportar PDF',
      success: 'Relatório pronto ✓'
    },
    automation: {
      kind: 'automação',
      title: 'Fluxo · novo lead',
      nodes: [
        { label: 'gatilho', text: 'Novo lead' },
        { label: 'agente ia', text: 'Qualificar' },
        { label: 'ação', text: 'Avisar time' }
      ],
      cta: 'Ativar fluxo',
      success: 'Rodando ✓'
    },
    support: {
      kind: 'atendimento',
      title: 'Atendimento · IA',
      customer: 'Meu pedido não chegou 😕',
      assistant: 'assistente',
      reply: 'Encontrei: sai para entrega hoje até 18h. Te aviso quando chegar ✓',
      cta: 'Avaliar atendimento',
      success: 'Nota 5 ★'
    },
    deals: {
      kind: 'acordos',
      title: 'Portal de Acordos',
      kpiLabel: 'valor à vista',
      discount: '−62%',
      cta: 'Fechar acordo',
      success: 'Acordo fechado ✓'
    }
  },
  inspector: {
    title: 'Inspecionar',
    hint: 'Passe o mouse em qualquer componente',
    close: 'Fechar',
    colors: 'Cores',
    typography: 'Tipografia',
    typographyItems: ['Fraunces 300/500 · títulos', 'Inter 400/500/600 · texto', 'JetBrains Mono · rótulos'],
    rendering: 'Renderização',
    renderingValue: 'Server Components + ilhas: Spotlight, LiveBuild, Inspector',
    build: 'Saúde do build',
    version: 'versão',
    commit: 'commit',
    builtAt: 'build',
    tests: 'testes',
    testsValue: '{passed}/{total} passaram'
  },
  notFound: {
    title: 'Página não encontrada',
    body: 'O endereço que você abriu não existe aqui.',
    back: 'Voltar para o início'
  }
}

export default pt
```

- [ ] **Step 3: Escrever `src/locales/en.ts`**

```ts
import type { Translations } from './types'

const en: Translations = {
  locale: 'en',
  dateLocale: 'en-US',
  currency: 'USD',
  brand: { firstName: 'Bruno', lastName: 'Bahiense' },
  meta: {
    title: 'Bruno Bahiense — Senior Software Engineer',
    description:
      'I build products with AI: beautiful, secure and always evolving. Architecture, technical leadership and fintech platforms.',
    ogTagline: 'I build products with AI — beautiful, secure and always evolving.'
  },
  nav: {
    ariaLabel: 'Main',
    experience: 'Experience',
    projects: 'Projects',
    contact: 'Contact',
    searchTrigger: 'Search or ask…',
    switchLanguage: 'PT',
    switchLanguageLabel: 'Ver em português'
  },
  hero: {
    label: '// senior software engineer · ai & product',
    titleStart: 'I build products with AI — ',
    titleEmphasis: 'beautiful',
    titleEnd: ', secure and always evolving.',
    bio: 'Instead of a résumé, an interface. Browse, run commands or ask — the way I build software.',
    commandPlaceholder: 'Ask something or search a section…',
    hints: ['What do you do with AI?', 'Copy e-mail', 'Ver em português'],
    primaryCta: "Let's talk →",
    secondaryCta: 'GitHub ↗'
  },
  metrics: {
    label: 'Results',
    items: [
      {
        state: 'In production',
        tone: 'ok',
        value: '15+',
        countTo: 15,
        suffix: '+',
        description: 'portals delivered end to end',
        progress: 100,
        note: 'front end, back end and integrations'
      },
      {
        state: 'Before: 2 months',
        tone: 'ok',
        value: '3 weeks',
        countTo: null,
        suffix: '',
        description: 'to launch a new portal',
        progress: 37,
        note: 'with reusable architecture patterns'
      },
      {
        state: 'Always evolving',
        tone: 'progress',
        value: 'Tech lead',
        countTo: null,
        suffix: '',
        description: 'technical reference for a squad',
        progress: 72,
        note: 'code review, architecture and delivery'
      }
    ]
  },
  experience: {
    label: '01',
    title: 'Experience',
    items: [
      {
        period: 'Nov 2025 — now',
        role: 'Senior Software Engineer',
        description:
          'Technical reference and squad lead on fintech platforms: architecture, code review, technical decisions and direct conversations with clients and stakeholders. Automation, observability and AI applied to development.'
      },
      {
        period: 'Nov 2023 — Nov 2025',
        role: 'Mid-level Full Stack Developer & Squad Leader',
        description:
          'Credit recovery platforms for individuals and companies, plus automated customer service chatbots. Coached the team on good practices and agile methods.'
      },
      {
        period: 'Jul 2022 — Oct 2023',
        role: 'Full Stack Developer',
        description:
          'React on the front end, Node on the back end, REST APIs, WhatsApp and Telegram automations, and AWS and Docker environments.'
      }
    ],
    stackTitle: 'Stack',
    stackGroups: [
      { name: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript'] },
      { name: 'Backend', items: ['Node.js', 'Express', 'GraphQL', 'REST APIs'] },
      { name: 'Data', items: ['MongoDB', 'Redis', 'ElasticSearch'] },
      { name: 'Infra & CI/CD', items: ['AWS', 'Docker', 'Jenkins', 'EasyPanel'] },
      { name: 'AI & Automation', items: ['LLMs', 'MCP', 'n8n', 'Airtable', 'Mautic'] }
    ]
  },
  projects: {
    label: '02',
    title: 'Projects',
    open: 'Open project',
    items: [
      {
        name: 'Bluis Trips',
        description: 'A map of the places I have visited.',
        tech: 'Next.js · GraphQL',
        href: 'https://bluis-trips.vercel.app',
        image: '/img/trips.png',
        imageAlt: 'Screenshot of the Bluis Trips project'
      },
      {
        name: 'Tomatracker',
        description: 'Pomodoro timer with tasks, themes and a daily report.',
        tech: 'Next.js · TypeScript',
        href: 'https://tomatracker.vercel.app',
        image: '/img/tomatracker.png',
        imageAlt: 'Screenshot of the Tomatracker project'
      }
    ]
  },
  contact: {
    label: '03 · contact',
    titleStart: 'Got a product to ',
    titleEmphasis: 'get off the ground',
    titleEnd: '?',
    email: 'brunoluisbahiense@gmail.com',
    copyEmail: 'Copy e-mail',
    socials: [
      { id: 'github', label: 'GitHub', href: 'https://github.com/brunolbahiense' },
      { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/brunolbahiense/' },
      { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/brunolbahiense/' }
    ]
  },
  footer: { inspect: 'Inspect this site', version: 'version' },
  spotlight: {
    dialogLabel: 'Search the site',
    placeholder: 'Search sections, projects… or ask',
    groups: {
      questions: 'Frequent questions',
      goTo: 'Go to',
      actions: 'Do something',
      content: 'On this site'
    },
    questions: [
      {
        id: 'ai',
        question: 'What do you do with AI?',
        subtitle: 'LLMs, MCP and automation',
        keywords: ['ai', 'llm', 'llms', 'mcp', 'automation', 'agent', 'agents', 'n8n', 'artificial'],
        answer:
          'I use AI in the product — LLMs and MCPs built into the platforms — and in the process, automating workflows with n8n so the team ships more with less manual work. Always with a person reviewing the decisions that matter.',
        widget: {
          type: 'chips',
          items: ['LLMs', 'MCP', 'n8n', 'Agents with tools', 'Customer service automation']
        }
      },
      {
        id: 'quality',
        question: 'How do you ensure quality?',
        subtitle: 'review, tests and evolution',
        keywords: [
          'quality',
          'test',
          'tests',
          'testing',
          'review',
          'a/b',
          'consistency',
          'stability',
          'security',
          'pattern',
          'patterns'
        ],
        answer:
          'Quality is a process: patterns, review, tests and measurement — and the cycle does not end at deploy.',
        widget: {
          type: 'flow',
          steps: [
            { label: '01 · patterns', text: 'Architecture and design tokens' },
            { label: '02 · review', text: 'Code review on every delivery' },
            { label: '03 · tests', text: 'Unit, e2e and A/B tests' },
            { label: '04 · production', text: 'Observability and security' },
            { label: '05 · evolution', text: 'Measure and improve ↺' }
          ]
        }
      },
      {
        id: 'stack',
        question: 'What is your stack?',
        subtitle: 'from front end to infrastructure',
        keywords: ['stack', 'technology', 'technologies', 'react', 'node', 'next', 'typescript', 'aws', 'docker', 'tools'],
        answer: 'End to end, from front end to infrastructure — with AI in the middle of it all.',
        widget: {
          type: 'rows',
          items: [
            { label: 'Frontend', status: 'React · Next.js · TypeScript' },
            { label: 'Backend', status: 'Node.js · Express · GraphQL' },
            { label: 'Data & Infra', status: 'MongoDB · Redis · AWS · Docker' },
            { label: 'AI & Automation', status: 'LLMs · MCP · n8n' }
          ]
        }
      },
      {
        id: 'projects',
        question: 'Show me your projects',
        subtitle: 'public side projects',
        keywords: ['project', 'projects', 'portfolio', 'work', 'trips', 'tomatracker', 'github'],
        answer:
          'Two public side projects. The rest of my work runs in production, with client data I cannot show.',
        widget: { type: 'projects' }
      }
    ],
    sections: [
      { id: 'experience', title: 'Experience', subtitle: 'Jul 2022 → now · 3 roles' },
      { id: 'projects', title: 'Projects', subtitle: 'Bluis Trips, Tomatracker' },
      { id: 'contact', title: 'Contact', subtitle: 'e-mail and socials' }
    ],
    actions: {
      copyEmail: 'Copy e-mail',
      openGithub: 'Open GitHub',
      openLinkedin: 'Open LinkedIn',
      opensInNewTab: 'opens in a new tab',
      switchLanguage: 'Ver em português',
      switchLanguageSubtitle: 'the whole site switches to PT',
      inspect: 'Inspect the site',
      inspectSubtitle: 'shows the components behind the interface'
    },
    kinds: {
      question: 'question',
      section: 'section',
      action: 'command',
      project: 'project',
      role: 'role',
      technology: 'technology'
    },
    empty: { title: "I couldn't find that here. Want to send me an e-mail?", action: 'Copy e-mail' },
    footer: { navigate: 'navigate', open: 'open', close: 'close', note: 'searches this site’s content' },
    back: 'back to search',
    toasts: {
      emailCopied: 'E-mail copied ✓',
      inspectOn: 'Inspect mode on',
      inspectOff: 'Inspect mode off'
    }
  },
  liveBuild: {
    description:
      'Demo: dashboard, report, automation, support and deals interfaces being assembled from the same components.',
    building: 'building…',
    live: 'in production',
    dashboard: {
      kind: 'dashboard',
      title: 'Sales · October',
      kpiLabel: 'monthly revenue',
      delta: '+18%',
      cta: 'Share dashboard',
      success: 'Link copied ✓'
    },
    report: {
      kind: 'report',
      title: 'Weekly report',
      columns: ['Channel', 'Status', 'Total'],
      rows: [
        { channel: 'E-mail', status: 'ok', total: '12,480' },
        { channel: 'WhatsApp', status: 'ok', total: '9,215' },
        { channel: 'SMS', status: 'review', total: '3,902' },
        { channel: 'App', status: 'ok', total: '7,660' }
      ],
      cta: 'Export PDF',
      success: 'Report ready ✓'
    },
    automation: {
      kind: 'automation',
      title: 'Flow · new lead',
      nodes: [
        { label: 'trigger', text: 'New lead' },
        { label: 'ai agent', text: 'Qualify' },
        { label: 'action', text: 'Notify team' }
      ],
      cta: 'Activate flow',
      success: 'Running ✓'
    },
    support: {
      kind: 'support',
      title: 'Support · AI',
      customer: 'My order hasn’t arrived 😕',
      assistant: 'assistant',
      reply: 'Found it: out for delivery today by 6 pm. I’ll let you know when it arrives ✓',
      cta: 'Rate support',
      success: 'Rated 5 ★'
    },
    deals: {
      kind: 'deals',
      title: 'Deals Portal',
      kpiLabel: 'pay-in-full amount',
      discount: '−62%',
      cta: 'Close deal',
      success: 'Deal closed ✓'
    }
  },
  inspector: {
    title: 'Inspect',
    hint: 'Hover over any component',
    close: 'Close',
    colors: 'Colors',
    typography: 'Typography',
    typographyItems: ['Fraunces 300/500 · headings', 'Inter 400/500/600 · text', 'JetBrains Mono · labels'],
    rendering: 'Rendering',
    renderingValue: 'Server Components + islands: Spotlight, LiveBuild, Inspector',
    build: 'Build health',
    version: 'version',
    commit: 'commit',
    builtAt: 'built',
    tests: 'tests',
    testsValue: '{passed}/{total} passing'
  },
  notFound: {
    title: 'Page not found',
    body: 'The address you opened does not exist here.',
    back: 'Back to home'
  }
}

export default en
```

- [ ] **Step 4: Escrever `src/locales/index.ts`**

```ts
import type { Locale } from 'lib/locale'
import en from './en'
import pt from './pt'
import type { Translations } from './types'

export type { AnswerWidget, FrequentQuestion, SectionId, SocialId, Translations } from './types'

export const translations: Record<Locale, Translations> = { pt, en }

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}
```

- [ ] **Step 5: Escrever o teste de paridade — `src/locales/locales.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { translations } from 'locales'

function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([key, item]) => [key, shapeOf(item)])
    )
  }
  return typeof value
}

function emptyStringPaths(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return value.trim() ? [] : [path]
  if (Array.isArray(value)) return value.flatMap((item, index) => emptyStringPaths(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => emptyStringPaths(item, path ? `${path}.${key}` : key))
  }
  return []
}

describe('locales', () => {
  it('pt e en têm a mesma estrutura, as mesmas chaves e o mesmo tamanho de listas', () => {
    expect(shapeOf(translations.en)).toEqual(shapeOf(translations.pt))
  })

  it('não têm texto vazio', () => {
    expect(emptyStringPaths(translations.pt)).toEqual([])
    expect(emptyStringPaths(translations.en)).toEqual([])
  })

  it('perguntas frequentes têm ids únicos e iguais nos dois idiomas', () => {
    const portugueseIds = translations.pt.spotlight.questions.map((question) => question.id)
    const englishIds = translations.en.spotlight.questions.map((question) => question.id)
    expect(new Set(portugueseIds).size).toBe(portugueseIds.length)
    expect(englishIds).toEqual(portugueseIds)
  })

  it('o template de testes do Inspector tem os dois marcadores', () => {
    for (const locale of [translations.pt, translations.en]) {
      expect(locale.inspector.testsValue).toContain('{passed}')
      expect(locale.inspector.testsValue).toContain('{total}')
    }
  })
})
```

- [ ] **Step 6: Rodar testes e tipos**

Run: `yarn test && yarn typecheck`
Expected: PASS — todos os testes (locale, search, locales); tipos sem erro.

- [ ] **Step 7: Commit**

```bash
yarn lint --fix && yarn lint
git add src/locales
git commit -m "feat: textos e dados do site em pt e en com teste de paridade

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Catálogo do Spotlight (`lib/catalog`) com TDD

**Files:**
- Create: `src/lib/catalog.ts`, `src/lib/catalog.test.ts`

- [ ] **Step 1: Escrever o teste que falha — `src/lib/catalog.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { buildCatalog, emptyStateEntry, visibleEntries } from 'lib/catalog'
import { translations } from 'locales'

const catalog = buildCatalog(translations.pt)

describe('catálogo do Spotlight', () => {
  it('sem busca mostra perguntas, seções e comandos, nessa ordem', () => {
    const groups = visibleEntries(catalog, '').map((entry) => entry.group)
    expect([...new Set(groups)]).toEqual(['questions', 'goTo', 'actions'])
  })

  it('projetos, cargos e tecnologias só aparecem buscando', () => {
    expect(visibleEntries(catalog, '').some((entry) => entry.group === 'content')).toBe(false)
    expect(
      visibleEntries(catalog, 'react').some((entry) => entry.title === 'React' && entry.group === 'content')
    ).toBe(true)
  })

  it('"testes" leva primeiro à pergunta de qualidade', () => {
    expect(visibleEntries(catalog, 'testes')[0].action).toEqual({ kind: 'answer', questionId: 'quality' })
  })

  it('perguntas livres casam por palavra-chave', () => {
    expect(visibleEntries(catalog, 'você trabalha com IA?')[0].action).toEqual({
      kind: 'answer',
      questionId: 'ai'
    })
  })

  it('comandos casam pelo título', () => {
    expect(visibleEntries(catalog, 'copiar')[0].action).toEqual({ kind: 'copyEmail' })
    expect(visibleEntries(catalog, 'inspecionar')[0].action).toEqual({ kind: 'toggleInspector' })
  })

  it('ids são únicos', () => {
    const ids = catalog.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('links externos são https', () => {
    for (const entry of catalog) {
      if (entry.action.kind === 'openUrl') expect(entry.action.url).toMatch(/^https:\/\//)
    }
  })

  it('estado vazio oferece copiar o e-mail', () => {
    expect(emptyStateEntry(translations.pt.spotlight, translations.pt.contact.email)).toMatchObject({
      title: 'Copiar e-mail',
      subtitle: 'brunoluisbahiense@gmail.com',
      action: { kind: 'copyEmail' }
    })
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `yarn test src/lib/catalog.test.ts`
Expected: FAIL — `Failed to resolve import "lib/catalog"`.

- [ ] **Step 3: Implementar `src/lib/catalog.ts`**

```ts
import { searchEntries, type SearchEntry } from 'lib/search'
import type { SectionId, SocialId, Translations } from 'locales'

export type SpotlightAction =
  | { kind: 'answer'; questionId: string }
  | { kind: 'scroll'; sectionId: SectionId }
  | { kind: 'copyEmail' }
  | { kind: 'openUrl'; url: string }
  | { kind: 'switchLanguage' }
  | { kind: 'toggleInspector' }

export type SpotlightGroup = 'questions' | 'goTo' | 'actions' | 'content'

export type SpotlightIcon =
  | 'question'
  | 'section'
  | 'copy'
  | 'link'
  | 'globe'
  | 'inspect'
  | 'project'
  | 'role'
  | 'technology'

export type SpotlightEntry = SearchEntry & {
  group: SpotlightGroup
  kind: string
  icon: SpotlightIcon
  action: SpotlightAction
  showWhenEmpty: boolean
}

export type CatalogSource = Pick<Translations, 'spotlight' | 'projects' | 'experience' | 'contact'>

function socialUrl(contact: Translations['contact'], id: SocialId) {
  return contact.socials.find((social) => social.id === id)?.href ?? ''
}

export function buildCatalog({ spotlight, projects, experience, contact }: CatalogSource): SpotlightEntry[] {
  const { kinds, actions } = spotlight

  const questions = spotlight.questions.map(
    (question): SpotlightEntry => ({
      id: `question-${question.id}`,
      title: question.question,
      subtitle: question.subtitle,
      keywords: question.keywords,
      group: 'questions',
      kind: kinds.question,
      icon: 'question',
      action: { kind: 'answer', questionId: question.id },
      showWhenEmpty: true
    })
  )

  const sections = spotlight.sections.map(
    (section): SpotlightEntry => ({
      id: `section-${section.id}`,
      title: section.title,
      subtitle: section.subtitle,
      group: 'goTo',
      kind: kinds.section,
      icon: 'section',
      action: { kind: 'scroll', sectionId: section.id },
      showWhenEmpty: true
    })
  )

  const commands: SpotlightEntry[] = [
    {
      id: 'action-copy-email',
      title: actions.copyEmail,
      subtitle: contact.email,
      group: 'actions',
      kind: kinds.action,
      icon: 'copy',
      action: { kind: 'copyEmail' },
      showWhenEmpty: true
    },
    {
      id: 'action-github',
      title: actions.openGithub,
      subtitle: actions.opensInNewTab,
      group: 'actions',
      kind: kinds.action,
      icon: 'link',
      action: { kind: 'openUrl', url: socialUrl(contact, 'github') },
      showWhenEmpty: true
    },
    {
      id: 'action-linkedin',
      title: actions.openLinkedin,
      subtitle: actions.opensInNewTab,
      group: 'actions',
      kind: kinds.action,
      icon: 'link',
      action: { kind: 'openUrl', url: socialUrl(contact, 'linkedin') },
      showWhenEmpty: true
    },
    {
      id: 'action-language',
      title: actions.switchLanguage,
      subtitle: actions.switchLanguageSubtitle,
      group: 'actions',
      kind: kinds.action,
      icon: 'globe',
      action: { kind: 'switchLanguage' },
      showWhenEmpty: true
    },
    {
      id: 'action-inspect',
      title: actions.inspect,
      subtitle: actions.inspectSubtitle,
      group: 'actions',
      kind: kinds.action,
      icon: 'inspect',
      action: { kind: 'toggleInspector' },
      showWhenEmpty: true
    }
  ]

  const projectEntries = projects.items.map(
    (project): SpotlightEntry => ({
      id: `project-${project.name}`,
      title: project.name,
      subtitle: project.description,
      group: 'content',
      kind: kinds.project,
      icon: 'project',
      action: { kind: 'openUrl', url: project.href },
      showWhenEmpty: false
    })
  )

  const roleEntries = experience.items.map(
    (item): SpotlightEntry => ({
      id: `role-${item.period}`,
      title: item.role,
      subtitle: item.period,
      group: 'content',
      kind: kinds.role,
      icon: 'role',
      action: { kind: 'scroll', sectionId: 'experience' },
      showWhenEmpty: false
    })
  )

  const technologyEntries = experience.stackGroups.flatMap((group) =>
    group.items.map(
      (technology): SpotlightEntry => ({
        id: `technology-${technology}`,
        title: technology,
        subtitle: group.name,
        group: 'content',
        kind: kinds.technology,
        icon: 'technology',
        action: { kind: 'scroll', sectionId: 'experience' },
        showWhenEmpty: false
      })
    )
  )

  return [...questions, ...sections, ...commands, ...projectEntries, ...roleEntries, ...technologyEntries]
}

export function visibleEntries(catalog: SpotlightEntry[], query: string) {
  if (!query.trim()) return catalog.filter((entry) => entry.showWhenEmpty)
  return searchEntries(catalog, query)
}

export function emptyStateEntry(spotlight: Translations['spotlight'], email: string): SpotlightEntry {
  return {
    id: 'empty-copy-email',
    title: spotlight.empty.action,
    subtitle: email,
    group: 'actions',
    kind: spotlight.kinds.action,
    icon: 'copy',
    action: { kind: 'copyEmail' },
    showWhenEmpty: false
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `yarn test`
Expected: PASS — inclui 8 testes novos do catálogo.

- [ ] **Step 5: Commit**

```bash
yarn lint --fix && yarn lint
git add src/lib/catalog.ts src/lib/catalog.test.ts
git commit -m "feat: catálogo do Spotlight a partir dos locales

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Saúde do build (`lib/buildInfo` + `prebuild`)

**Files:**
- Create: `src/lib/buildInfo.ts`, `src/lib/buildInfo.test.ts`, `scripts/build-info.mjs`

- [ ] **Step 1: Escrever o teste que falha — `src/lib/buildInfo.test.ts`**

```ts
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { copyrightYear, developmentBuildInfo, formatBuiltAt, readBuildInfo } from 'lib/buildInfo'

const directory = mkdtempSync(join(tmpdir(), 'build-info-'))

describe('readBuildInfo', () => {
  it('usa os valores de desenvolvimento quando o arquivo não existe', () => {
    expect(readBuildInfo(join(directory, 'nao-existe.json'))).toEqual(developmentBuildInfo)
  })

  it('lê um arquivo válido', () => {
    const path = join(directory, 'valido.json')
    const info = { version: '2.0.0', commit: 'abc1234', builtAt: '2026-10-21T12:00:00.000Z', tests: { passed: 40, total: 40 } }
    writeFileSync(path, JSON.stringify(info))
    expect(readBuildInfo(path)).toEqual(info)
  })

  it('usa os valores de desenvolvimento quando o JSON é inválido ou incompleto', () => {
    const invalidPath = join(directory, 'invalido.json')
    writeFileSync(invalidPath, '{ não é json')
    expect(readBuildInfo(invalidPath)).toEqual(developmentBuildInfo)

    const incompletePath = join(directory, 'incompleto.json')
    writeFileSync(incompletePath, JSON.stringify({ version: '2.0.0' }))
    expect(readBuildInfo(incompletePath)).toEqual(developmentBuildInfo)
  })
})

describe('formatBuiltAt', () => {
  it('formata datas ISO no idioma da página', () => {
    expect(formatBuiltAt('2026-10-21T12:00:00.000Z', 'pt-BR')).toMatch(/2026/)
  })

  it('devolve o texto original quando não é data', () => {
    expect(formatBuiltAt('dev', 'pt-BR')).toBe('dev')
  })
})

describe('copyrightYear', () => {
  it('usa o ano do build', () => {
    expect(copyrightYear({ ...developmentBuildInfo, builtAt: '2026-10-21T12:00:00.000Z' })).toBe(2026)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `yarn test src/lib/buildInfo.test.ts`
Expected: FAIL — `Failed to resolve import "lib/buildInfo"`.

- [ ] **Step 3: Implementar `src/lib/buildInfo.ts`**

```ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type BuildInfo = {
  version: string
  commit: string
  builtAt: string
  tests: { passed: number; total: number }
}

export const developmentBuildInfo: BuildInfo = {
  version: 'dev',
  commit: 'local',
  builtAt: 'dev',
  tests: { passed: 0, total: 0 }
}

const buildInfoPath = join(process.cwd(), 'src', 'generated', 'build-info.json')

function isBuildInfo(value: unknown): value is BuildInfo {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<BuildInfo>
  return (
    typeof candidate.version === 'string' &&
    typeof candidate.commit === 'string' &&
    typeof candidate.builtAt === 'string' &&
    typeof candidate.tests?.passed === 'number' &&
    typeof candidate.tests?.total === 'number'
  )
}

export function readBuildInfo(path = buildInfoPath): BuildInfo {
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'))
    return isBuildInfo(parsed) ? parsed : developmentBuildInfo
  } catch {
    return developmentBuildInfo
  }
}

export function formatBuiltAt(builtAt: string, dateLocale: string) {
  const date = new Date(builtAt)
  if (Number.isNaN(date.getTime())) return builtAt
  return new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function copyrightYear(buildInfo: BuildInfo) {
  const date = new Date(buildInfo.builtAt)
  return Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear()
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `yarn test`
Expected: PASS.

- [ ] **Step 5: Escrever `scripts/build-info.mjs`**

```js
// Roda os testes unitários e grava os números reais do build em src/generated/build-info.json.
// Se algum teste falhar, o build para aqui — o site nunca publica com testes quebrados.
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const reportPath = join(process.cwd(), '.vitest-report.json')
const outputPath = join(process.cwd(), 'src', 'generated', 'build-info.json')

try {
  execSync(`yarn vitest run --reporter=default --reporter=json --outputFile.json=${reportPath}`, {
    stdio: 'inherit'
  })
} catch {
  console.error('\nTestes falharam — build interrompido.')
  process.exit(1)
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'))
rmSync(reportPath)
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))

function currentCommit() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'local'
  }
}

const buildInfo = {
  version: packageJson.version,
  commit: currentCommit(),
  builtAt: new Date().toISOString(),
  tests: { passed: report.numPassedTests, total: report.numTotalTests }
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(buildInfo, null, 2)}\n`)
console.log(
  `build-info: v${buildInfo.version} · ${buildInfo.commit} · ${buildInfo.tests.passed}/${buildInfo.tests.total} testes`
)
```

- [ ] **Step 6: Rodar o script**

Run: `node scripts/build-info.mjs && cat src/generated/build-info.json`
Expected: os testes passam e o JSON mostra `"version": "2.0.0"`, o commit curto e `tests.passed` igual a `tests.total`.

- [ ] **Step 7: Commit**

```bash
yarn lint --fix && yarn lint
git add src/lib/buildInfo.ts src/lib/buildInfo.test.ts scripts/build-info.mjs
git commit -m "feat: build-info com versão, commit e resultado real dos testes

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Rotas, proxy de idioma, metadata e OG

**Files:**
- Create: `src/proxy.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (provisória), `src/app/[locale]/page.module.css`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/not-found.module.css`, `src/app/[locale]/[...rest]/page.tsx`, `src/app/[locale]/opengraph-image.tsx`

- [ ] **Step 1: Escrever `src/proxy.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { chooseLocale, localeCookie, localeFromPath } from 'lib/locale'

const oneYearInSeconds = 60 * 60 * 24 * 365

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathLocale = localeFromPath(pathname)

  if (pathLocale) {
    const response = NextResponse.next()
    if (request.cookies.get(localeCookie)?.value !== pathLocale) {
      response.cookies.set(localeCookie, pathLocale, { path: '/', maxAge: oneYearInSeconds, sameSite: 'lax' })
    }
    return response
  }

  const locale = chooseLocale({
    cookie: request.cookies.get(localeCookie)?.value,
    acceptLanguage: request.headers.get('accept-language')
  })
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Ignora arquivos internos do Next e qualquer caminho com extensão (imagens, ícone, etc.)
  matcher: ['/((?!_next|.*\\..*).*)']
}
```

- [ ] **Step 2: Escrever `src/app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { htmlLang, isLocale, locales } from 'lib/locale'
import { getTranslations } from 'locales'
import { fontVariables } from 'styles/fonts'
import '../../styles/tokens.css'
import '../../styles/global.css'

const siteUrl = 'https://bluis.vercel.app'

type LayoutParams = { params: Promise<{ locale: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getTranslations(locale)
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { 'pt-BR': '/pt', en: '/en' }
    },
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      title: meta.title,
      description: meta.description,
      locale: htmlLang[locale].replace('-', '_')
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description }
  }
}

export default async function LocaleLayout({ children, params }: LayoutParams & { children: ReactNode }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Escrever a página provisória `src/app/[locale]/page.tsx`** (substituída na Task 13)

```tsx
import { notFound } from 'next/navigation'
import { isLocale } from 'lib/locale'
import { getTranslations } from 'locales'
import S from './page.module.css'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { hero } = getTranslations(locale)
  return (
    <main className={S.main}>
      <h1>
        {hero.titleStart}
        {hero.titleEmphasis}
        {hero.titleEnd}
      </h1>
    </main>
  )
}
```

- [ ] **Step 4: Escrever `src/app/[locale]/page.module.css`**

```css
.main {
  display: grid;
  gap: clamp(3.5rem, 8vw, 5.5rem);
  max-width: var(--width-page);
  margin: 0 auto;
  padding: 0 var(--space-page) 3rem;
}
```

- [ ] **Step 5: Escrever `src/app/[locale]/not-found.tsx`**

```tsx
import { htmlLang, locales } from 'lib/locale'
import { translations } from 'locales'
import S from './not-found.module.css'

// not-found não recebe params: mostra os dois idiomas.
export default function NotFound() {
  return (
    <main className={S.notFound}>
      {locales.map((locale) => {
        const { notFound } = translations[locale]
        return (
          <section key={locale} lang={htmlLang[locale]} className={S.block}>
            <h1 className={S.title}>{notFound.title}</h1>
            <p className={S.body}>{notFound.body}</p>
            <a href={`/${locale}`} className={S.link}>
              {notFound.back} →
            </a>
          </section>
        )
      })}
    </main>
  )
}
```

- [ ] **Step 6: Escrever `src/app/[locale]/not-found.module.css`**

```css
.notFound {
  display: grid;
  gap: 2.5rem;
  max-width: 40rem;
  margin: 0 auto;
  padding: 18vh var(--space-page) 4rem;
}

.block {
  display: grid;
  gap: 0.6rem;
}

.title {
  font: 300 clamp(2rem, 5vw, 2.8rem) / 1.05 var(--font-serif);
  letter-spacing: -0.02em;
}

.body {
  color: var(--color-muted);
}

.link {
  width: fit-content;
  color: var(--color-accent-text);
  font-weight: 500;
}
```

- [ ] **Step 7: Escrever `src/app/[locale]/[...rest]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return []
}

export default function UnknownPage() {
  notFound()
}
```

- [ ] **Step 8: Escrever `src/app/[locale]/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'
import { isLocale } from 'lib/locale'
import { getTranslations } from 'locales'

export const alt = 'Bruno Bahiense — Senior Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// ImageResponse não lê CSS custom properties: as cores repetem os tokens de styles/tokens.css.
const colors = { cream: '#fefaec', ink: '#24242c', accent: '#e15638', accentText: '#b8432a' }

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { meta, hero, brand } = getTranslations(isLocale(locale) ? locale : 'pt')
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: colors.cream,
          color: colors.ink
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 3, color: colors.accentText }}>
          {hero.label.toUpperCase()}
        </div>
        <div style={{ display: 'flex', fontSize: 66, lineHeight: 1.1, maxWidth: 1000 }}>{meta.ogTagline}</div>
        <div style={{ display: 'flex', fontSize: 40 }}>
          {brand.firstName}
          <span style={{ color: colors.accent, marginLeft: 14 }}>{brand.lastName}</span>
        </div>
      </div>
    ),
    size
  )
}
```

- [ ] **Step 9: Build de produção**

Run: `yarn lint --fix && yarn lint && yarn typecheck && yarn build`
Expected: `build-info: v2.0.0 · …`, depois `Compiled successfully` e, na tabela de rotas, `/[locale]` com `/pt` e `/en` como estáticas (●) e o Proxy listado. Se o Next avisar sobre `[...rest]` com `generateStaticParams` vazio, troque o `generateStaticParams` desse arquivo por `export const dynamicParams = true` e rode o build de novo.

- [ ] **Step 10: Verificar redirecionamentos com o servidor de produção**

```bash
yarn start --port 3100 &
sleep 4
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -H 'Accept-Language: en-US,en;q=0.9' http://localhost:3100/
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3100/
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -H 'Cookie: locale=en' -H 'Accept-Language: pt-BR' http://localhost:3100/
curl -s -o /dev/null -w '%{http_code}\n' -L http://localhost:3100/xx
curl -s http://localhost:3100/en | grep -o '<html lang="en"'
curl -s -D - -o /dev/null http://localhost:3100/en | grep -i 'set-cookie'
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://localhost:3100/pt/opengraph-image
kill %1
```

Expected, nessa ordem: `307 http://localhost:3100/en`, `307 http://localhost:3100/pt`, `307 http://localhost:3100/en`, `404`, `<html lang="en"`, uma linha `set-cookie: locale=en; …`, `200 image/png`.

- [ ] **Step 11: Commit**

```bash
git add src/proxy.ts src/app
git commit -m "feat: rotas /pt e /en, proxy de idioma, metadata e imagem OG

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Hooks de interação e componentes de movimento

**Files:**
- Create: `src/hooks/useReducedMotion.ts`, `useInView.ts`, `usePageVisible.ts`, `usePointerTilt.ts`, `useMagnetic.ts`, `useRipple.ts`, `useHotkey.ts`, `useTypewriter.ts`
- Create: `src/lib/clipboard.ts`
- Create: `src/components/MagneticButton/{index.tsx,styles.module.css}`, `src/components/CountUp/index.tsx`, `src/components/TiltCard/{index.tsx,styles.module.css}`, `src/components/ProgressBar/{index.tsx,styles.module.css}`

- [ ] **Step 1: `src/hooks/useReducedMotion.ts`**

```ts
import { useSyncExternalStore } from 'react'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export default function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false
  )
}
```

- [ ] **Step 2: `src/hooks/useInView.ts`**

```ts
import { useEffect, useRef, useState } from 'react'

type Options = { once?: boolean; threshold?: number }

export default function useInView<ElementType extends Element>({ once = false, threshold = 0.15 }: Options = {}) {
  const ref = useRef<ElementType>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [once, threshold])

  return { ref, isInView }
}
```

- [ ] **Step 3: `src/hooks/usePageVisible.ts`**

```ts
import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

export default function usePageVisible() {
  return useSyncExternalStore(
    subscribe,
    () => document.visibilityState === 'visible',
    () => true
  )
}
```

- [ ] **Step 4: `src/hooks/usePointerTilt.ts`**

```ts
import { useCallback, type PointerEvent } from 'react'
import useReducedMotion from './useReducedMotion'

// Escreve --pointer-x/--pointer-y (brilho) e --tilt-x/--tilt-y (inclinação) no elemento.
export default function usePointerTilt({ maxTiltX = 5, maxTiltY = 6 } = {}) {
  const isReducedMotion = useReducedMotion()

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const element = e.currentTarget
      const bounds = element.getBoundingClientRect()
      const x = (e.clientX - bounds.left) / bounds.width
      const y = (e.clientY - bounds.top) / bounds.height
      element.style.setProperty('--pointer-x', `${x * 100}%`)
      element.style.setProperty('--pointer-y', `${y * 100}%`)
      if (isReducedMotion) return
      element.style.setProperty('--tilt-x', `${(0.5 - y) * maxTiltX}deg`)
      element.style.setProperty('--tilt-y', `${(x - 0.5) * maxTiltY}deg`)
    },
    [isReducedMotion, maxTiltX, maxTiltY]
  )

  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg')
    e.currentTarget.style.setProperty('--tilt-y', '0deg')
  }, [])

  return { onPointerMove, onPointerLeave }
}
```

- [ ] **Step 5: `src/hooks/useMagnetic.ts`**

```ts
import { useCallback, type PointerEvent } from 'react'
import useReducedMotion from './useReducedMotion'

// Escreve --magnet-x/--magnet-y: o elemento é puxado levemente na direção do cursor.
export default function useMagnetic(strength = 0.25) {
  const isReducedMotion = useReducedMotion()

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isReducedMotion) return
      const element = e.currentTarget
      const bounds = element.getBoundingClientRect()
      element.style.setProperty('--magnet-x', `${(e.clientX - bounds.left - bounds.width / 2) * strength}px`)
      element.style.setProperty('--magnet-y', `${(e.clientY - bounds.top - bounds.height / 2) * strength}px`)
    },
    [isReducedMotion, strength]
  )

  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--magnet-x', '0px')
    e.currentTarget.style.setProperty('--magnet-y', '0px')
  }, [])

  return { onPointerMove, onPointerLeave }
}
```

- [ ] **Step 6: `src/hooks/useRipple.ts`**

```ts
import { useCallback, type PointerEvent } from 'react'
import useReducedMotion from './useReducedMotion'

// Cria um ripple (classe global .ripple) no ponto do clique.
// O elemento precisa de position: relative e overflow: hidden.
export default function useRipple() {
  const isReducedMotion = useReducedMotion()

  return useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isReducedMotion) return
      const target = e.currentTarget
      const bounds = target.getBoundingClientRect()
      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      ripple.style.left = `${e.clientX - bounds.left}px`
      ripple.style.top = `${e.clientY - bounds.top}px`
      target.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
    },
    [isReducedMotion]
  )
}
```

- [ ] **Step 7: `src/hooks/useHotkey.ts`**

```ts
import { useEffect, useRef, useSyncExternalStore } from 'react'

// Atalho com ⌘ (Mac) ou Ctrl (demais sistemas) + tecla.
export function useHotkey(key: string, onPress: () => void) {
  const onPressRef = useRef(onPress)

  useEffect(() => {
    onPressRef.current = onPress
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) {
        e.preventDefault()
        onPressRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key])
}

const noSubscription = () => () => {}

export function useModifierLabel() {
  return useSyncExternalStore(
    noSubscription,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl '),
    () => '⌘'
  )
}
```

- [ ] **Step 8: `src/hooks/useTypewriter.ts`**

```ts
import { useEffect, useState } from 'react'

// Revela o texto aos poucos. Para recomeçar com outro texto, remonte o componente (key).
export default function useTypewriter(text: string, isEnabled: boolean, charactersPerTick = 2, tickMs = 14) {
  const [typedLength, setTypedLength] = useState(0)

  useEffect(() => {
    if (!isEnabled || typedLength >= text.length) return
    const timer = window.setTimeout(
      () => setTypedLength((length) => Math.min(text.length, length + charactersPerTick)),
      tickMs
    )
    return () => window.clearTimeout(timer)
  }, [isEnabled, typedLength, text, charactersPerTick, tickMs])

  return isEnabled ? text.slice(0, typedLength) : text
}
```

- [ ] **Step 9: `src/lib/clipboard.ts`**

```ts
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const hasCopied = document.execCommand('copy')
    field.remove()
    return hasCopied
  }
}
```

- [ ] **Step 10: `src/components/MagneticButton/index.tsx`**

```tsx
'use client'

import type { ReactNode } from 'react'
import useMagnetic from 'hooks/useMagnetic'
import useRipple from 'hooks/useRipple'
import S from './styles.module.css'

type Props = {
  href: string
  variant: 'primary' | 'ghost' | 'light'
  isExternal?: boolean
  children: ReactNode
}

export default function MagneticButton({ href, variant, isExternal = false, children }: Props) {
  const magnetic = useMagnetic(0.25)
  const createRipple = useRipple()
  const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a
      href={href}
      className={`${S.button} ${S[variant]}`}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      onPointerDown={createRipple}
      data-component={`<Button ${variant} />`}
      {...externalProps}
    >
      {children}
    </a>
  )
}
```

- [ ] **Step 11: `src/components/MagneticButton/styles.module.css`**

```css
.button {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  translate: var(--magnet-x, 0px) var(--magnet-y, 0px);
  transition:
    translate 0.35s var(--ease-spring),
    scale 0.12s ease-out,
    background-color 0.2s,
    border-color 0.2s;
}

.button:active {
  scale: 0.95;
}

.primary {
  background: var(--color-ink);
  color: var(--color-cream);
}

.primary:hover {
  background: color-mix(in srgb, var(--color-ink) 88%, white);
}

.ghost {
  border-color: var(--color-line);
}

.ghost:hover {
  border-color: var(--color-ink);
}

.light {
  background: var(--color-cream);
  color: var(--color-ink);
}

.light:hover {
  background: var(--color-surface);
}
```

- [ ] **Step 12: `src/components/CountUp/index.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import useInView from 'hooks/useInView'
import useReducedMotion from 'hooks/useReducedMotion'

type Props = {
  to: number
  locale: string
  suffix?: string
  // Se usar minimumFractionDigits, passe também maximumFractionDigits (o padrão é 0).
  formatOptions?: Intl.NumberFormatOptions
  durationMs?: number
  // Controle externo (LiveBuild). Sem ele, conta quando entra na tela.
  play?: boolean
  // O que mostrar antes de tocar: valor final (bom para HTML do servidor) ou zero.
  idle?: 'final' | 'zero'
}

export default function CountUp({
  to,
  locale,
  suffix = '',
  formatOptions,
  durationMs = 1100,
  play,
  idle = 'final'
}: Props) {
  const isReducedMotion = useReducedMotion()
  const { ref, isInView } = useInView<HTMLSpanElement>({ once: true })
  const shouldPlay = play ?? isInView
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!shouldPlay || isReducedMotion) return
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const nextProgress = Math.min(1, (now - startedAt) / durationMs)
      setProgress(nextProgress)
      if (nextProgress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldPlay, isReducedMotion, durationMs])

  let value = to
  let isComplete = true
  if (!isReducedMotion && !shouldPlay) {
    value = idle === 'final' ? to : 0
    isComplete = idle === 'final'
  } else if (!isReducedMotion) {
    value = to * (1 - Math.pow(1 - progress, 3))
    isComplete = progress === 1
  }

  const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0, ...formatOptions })

  return (
    <span ref={ref}>
      {formatter.format(value)}
      {isComplete ? suffix : ''}
    </span>
  )
}
```

- [ ] **Step 13: `src/components/TiltCard/index.tsx`**

```tsx
'use client'

import type { ReactNode } from 'react'
import usePointerTilt from 'hooks/usePointerTilt'
import S from './styles.module.css'

type Props = {
  component: string
  className?: string
  as?: 'div' | 'article' | 'li'
  children: ReactNode
}

export default function TiltCard({ component, className = '', as: Element = 'div', children }: Props) {
  const tilt = usePointerTilt()
  return (
    <Element
      className={`${S.card} ${className}`}
      data-component={component}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      {children}
    </Element>
  )
}
```

- [ ] **Step 14: `src/components/TiltCard/styles.module.css`**

```css
.card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  transform: perspective(700px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition:
    transform 0.25s var(--ease-out),
    border-color 0.25s,
    box-shadow 0.25s;
}

/* Brilho neutro seguindo o cursor (sem cor quente) */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    260px circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(255, 255, 255, 0.9),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}

.card:hover {
  border-color: rgba(36, 36, 44, 0.22);
  box-shadow: var(--shadow-soft);
}

.card:hover::before {
  opacity: 1;
}
```

- [ ] **Step 15: `src/components/ProgressBar/index.tsx`**

```tsx
'use client'

import useInView from 'hooks/useInView'
import S from './styles.module.css'

export default function ProgressBar({ value }: { value: number }) {
  const { ref, isInView } = useInView<HTMLDivElement>({ once: true })
  return (
    <div ref={ref} className={S.track} aria-hidden="true">
      <i className={S.fill} style={{ width: isInView ? `${value}%` : '0%' }} />
    </div>
  )
}
```

- [ ] **Step 16: `src/components/ProgressBar/styles.module.css`**

```css
.track {
  height: 5px;
  overflow: hidden;
  border-radius: var(--radius-pill);
  background: var(--color-hover);
}

.fill {
  display: block;
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  transition: width 1.2s var(--ease-out);
}
```

- [ ] **Step 17: Verificar e commitar**

Run: `yarn lint --fix && yarn lint && yarn typecheck`
Expected: sem erros.

```bash
git add src/hooks src/lib/clipboard.ts src/components
git commit -m "feat: hooks e componentes de micro-interação (magnético, ripple, tilt, contagem)

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Spotlight (contexto, barra de comando, diálogo, toast)

**Files:**
- Create: `src/contexts/SpotlightContext.tsx`, `src/contexts/InspectorContext.tsx`
- Create: `src/components/Toast/{index.tsx,styles.module.css}`
- Create: `src/components/CommandBar/{index.tsx,styles.module.css}`
- Create: `src/components/Spotlight/{index.tsx,SpotlightResults.tsx,SpotlightAnswer.tsx,AnswerWidget.tsx,icons.tsx,styles.module.css}`

(O `InspectorContext` entra aqui porque o Spotlight tem o comando "Inspecionar o site"; a UI do Inspector é a Task 11.)

- [ ] **Step 1: `src/contexts/InspectorContext.tsx`**

```tsx
'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type InspectorContextValue = {
  isInspecting: boolean
  toggle: () => void
  stop: () => void
}

const InspectorContext = createContext<InspectorContextValue | null>(null)

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [isInspecting, setIsInspecting] = useState(false)

  useEffect(() => {
    document.documentElement.toggleAttribute('data-inspecting', isInspecting)
  }, [isInspecting])

  const toggle = useCallback(() => setIsInspecting((current) => !current), [])
  const stop = useCallback(() => setIsInspecting(false), [])
  const value = useMemo(() => ({ isInspecting, toggle, stop }), [isInspecting, toggle, stop])

  return <InspectorContext.Provider value={value}>{children}</InspectorContext.Provider>
}

export function useInspector() {
  const value = useContext(InspectorContext)
  if (!value) throw new Error('useInspector precisa estar dentro de <InspectorProvider>')
  return value
}
```

- [ ] **Step 2: `src/components/Toast/index.tsx`**

```tsx
import S from './styles.module.css'

export default function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <div role="status" aria-live="polite" className={S.toast} data-visible={isVisible}>
      {message}
    </div>
  )
}
```

- [ ] **Step 3: `src/components/Toast/styles.module.css`**

```css
.toast {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  z-index: 100;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  background: var(--color-ink);
  color: var(--color-cream);
  font-size: 0.85rem;
  opacity: 0;
  translate: -50% 10px;
  pointer-events: none;
  transition:
    opacity 0.2s,
    translate 0.25s var(--ease-spring);
}

.toast[data-visible='true'] {
  opacity: 1;
  translate: -50% 0;
}
```

- [ ] **Step 4: `src/contexts/SpotlightContext.tsx`**

```tsx
'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import Toast from 'components/Toast'

type SpotlightContextValue = {
  isOpen: boolean
  sessionId: number
  initialQuery: string
  open: (initialQuery?: string) => void
  close: () => void
  notify: (message: string) => void
}

const SpotlightContext = createContext<SpotlightContextValue | null>(null)

const toastDurationMs = 1800

export function SpotlightProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState({ id: 0, initialQuery: '' })
  const [toast, setToast] = useState({ message: '', isVisible: false })
  const toastTimer = useRef<number | undefined>(undefined)

  const open = useCallback((initialQuery = '') => {
    setSession((current) => ({ id: current.id + 1, initialQuery }))
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ message, isVisible: true })
    toastTimer.current = window.setTimeout(
      () => setToast((current) => ({ ...current, isVisible: false })),
      toastDurationMs
    )
  }, [])

  const value = useMemo(
    () => ({ isOpen, sessionId: session.id, initialQuery: session.initialQuery, open, close, notify }),
    [isOpen, session, open, close, notify]
  )

  return (
    <SpotlightContext.Provider value={value}>
      {children}
      <Toast message={toast.message} isVisible={toast.isVisible} />
    </SpotlightContext.Provider>
  )
}

export function useSpotlight() {
  const value = useContext(SpotlightContext)
  if (!value) throw new Error('useSpotlight precisa estar dentro de <SpotlightProvider>')
  return value
}
```

- [ ] **Step 5: `src/components/Spotlight/icons.tsx`**

```tsx
import type { ReactNode } from 'react'
import type { SpotlightIcon } from 'lib/catalog'

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

const iconPaths: Record<SpotlightIcon, ReactNode> = {
  question: <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />,
  section: <path d="M5 12h14M13 6l6 6-6 6" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
  link: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  inspect: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  project: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  role: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </>
  ),
  technology: <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />
}

export function SpotlightEntryIcon({ icon }: { icon: SpotlightIcon }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {iconPaths[icon]}
    </svg>
  )
}
```

- [ ] **Step 6: `src/components/Spotlight/AnswerWidget.tsx`**

```tsx
import type { AnswerWidget as AnswerWidgetData, Translations } from 'locales'
import S from './styles.module.css'

type Props = { widget: AnswerWidgetData; projects: Translations['projects'] }

export default function AnswerWidget({ widget, projects }: Props) {
  switch (widget.type) {
    case 'chips':
      return (
        <ul className={S.chips} data-component="<Chips />">
          {widget.items.map((item) => (
            <li key={item} className={S.chip}>
              {item}
            </li>
          ))}
        </ul>
      )
    case 'rows':
      return (
        <div className={S.rows} data-component="<StatusRows />">
          {widget.items.map((item) => (
            <div key={item.label} className={S.row}>
              <span>{item.label}</span>
              <span className={S.rowStatus}>{item.status}</span>
            </div>
          ))}
        </div>
      )
    case 'flow':
      return (
        <ol className={S.flow} data-component="<DeliveryFlow />">
          {widget.steps.map((step) => (
            <li key={step.label} className={S.step}>
              <small className={S.stepLabel}>{step.label}</small>
              {step.text}
            </li>
          ))}
        </ol>
      )
    case 'projects':
      return (
        <div className={S.rows} data-component="<ProjectRows />">
          {projects.items.map((project) => (
            <a key={project.name} href={project.href} target="_blank" rel="noopener noreferrer" className={S.row}>
              <span>
                <b>{project.name}</b> · {project.description}
              </span>
              <span className={S.rowStatus}>{projects.open} ↗</span>
            </a>
          ))}
        </div>
      )
  }
}
```

- [ ] **Step 7: `src/components/Spotlight/SpotlightAnswer.tsx`**

```tsx
'use client'

import useReducedMotion from 'hooks/useReducedMotion'
import useTypewriter from 'hooks/useTypewriter'
import type { FrequentQuestion, Translations } from 'locales'
import AnswerWidget from './AnswerWidget'
import S from './styles.module.css'

type Props = { question: FrequentQuestion; projects: Translations['projects']; backLabel: string }

// Remontado com key={question.id}: a digitação recomeça a cada pergunta.
export default function SpotlightAnswer({ question, projects, backLabel }: Props) {
  const isReducedMotion = useReducedMotion()
  const typedAnswer = useTypewriter(question.answer, !isReducedMotion)
  const isDone = typedAnswer.length === question.answer.length

  return (
    <div className={S.answer}>
      <p className={S.question}>{question.question}</p>
      <p className="visually-hidden" aria-live="polite">
        {question.answer}
      </p>
      <p className={S.answerText} aria-hidden="true">
        {typedAnswer}
        {!isDone && <span className={S.caret} />}
      </p>
      <div className={S.widget} data-visible={isDone}>
        <AnswerWidget widget={question.widget} projects={projects} />
      </div>
      <p className={S.back}>
        <kbd className={S.kbd}>esc</kbd> {backLabel}
      </p>
    </div>
  )
}
```

- [ ] **Step 8: `src/components/Spotlight/SpotlightResults.tsx`**

```tsx
'use client'

import { Fragment, useEffect, useRef } from 'react'
import type { SpotlightEntry } from 'lib/catalog'
import type { Translations } from 'locales'
import { SpotlightEntryIcon } from './icons'
import S from './styles.module.css'

type Props = {
  entries: SpotlightEntry[]
  activeIndex: number
  groupLabels: Translations['spotlight']['groups']
  onHover: (index: number) => void
  onSelect: (entry: SpotlightEntry) => void
}

export const resultsListId = 'spotlight-results'

export function optionId(index: number) {
  return `spotlight-option-${index}`
}

export default function SpotlightResults({ entries, activeIndex, groupLabels, onHover, onSelect }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  return (
    <div ref={listRef} id={resultsListId} role="listbox" className={S.list}>
      {entries.map((entry, index) => {
        const startsGroup = index === 0 || entries[index - 1].group !== entry.group
        return (
          <Fragment key={entry.id}>
            {startsGroup && (
              <p className={S.groupTitle} role="presentation">
                {groupLabels[entry.group]}
              </p>
            )}
            <div
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              className={S.option}
              onMouseMove={() => index !== activeIndex && onHover(index)}
              onClick={() => onSelect(entry)}
            >
              <span className={S.optionIcon} data-question={entry.group === 'questions'}>
                <SpotlightEntryIcon icon={entry.icon} />
              </span>
              <span className={S.optionText}>
                <b className={S.optionTitle}>{entry.title}</b>
                {entry.subtitle && <span className={S.optionSubtitle}>{entry.subtitle}</span>}
              </span>
              <span className={S.optionKind}>{entry.kind}</span>
              <kbd className={`${S.kbd} ${S.enterKey}`}>↵</kbd>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 9: `src/components/Spotlight/index.tsx`**

```tsx
'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useInspector } from 'contexts/InspectorContext'
import { useSpotlight } from 'contexts/SpotlightContext'
import { useHotkey } from 'hooks/useHotkey'
import useReducedMotion from 'hooks/useReducedMotion'
import { buildCatalog, emptyStateEntry, visibleEntries, type SpotlightEntry } from 'lib/catalog'
import { copyText } from 'lib/clipboard'
import { otherLocale, type Locale } from 'lib/locale'
import type { Translations } from 'locales'
import { SearchIcon } from './icons'
import SpotlightAnswer from './SpotlightAnswer'
import SpotlightResults, { optionId, resultsListId } from './SpotlightResults'
import S from './styles.module.css'

type Props = {
  t: Translations['spotlight']
  projects: Translations['projects']
  experience: Translations['experience']
  contact: Translations['contact']
  locale: Locale
}

export default function Spotlight(props: Props) {
  const { isOpen, sessionId, open, close } = useSpotlight()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useHotkey('k', () => (isOpen ? close() : open()))

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className={S.dialog}
      aria-label={props.t.dialogLabel}
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
      data-component="<Spotlight /> · client"
    >
      {isOpen && <SpotlightSession key={sessionId} {...props} />}
    </dialog>
  )
}

// Cada abertura é uma sessão nova (key={sessionId}): busca, seleção e resposta começam do zero.
function SpotlightSession({ t, projects, experience, contact, locale }: Props) {
  const { initialQuery, close, notify } = useSpotlight()
  const { isInspecting, toggle } = useInspector()
  const isReducedMotion = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState(initialQuery)
  const [activeIndex, setActiveIndex] = useState(0)
  const [answerId, setAnswerId] = useState<string | null>(null)

  const catalog = useMemo(
    () => buildCatalog({ spotlight: t, projects, experience, contact }),
    [t, projects, experience, contact]
  )
  const results = useMemo(() => visibleEntries(catalog, query), [catalog, query])
  const isEmpty = results.length === 0
  const entries = isEmpty ? [emptyStateEntry(t, contact.email)] : results
  const selectedIndex = Math.min(activeIndex, entries.length - 1)
  const question = answerId ? (t.questions.find((item) => item.id === answerId) ?? null) : null

  async function run(entry: SpotlightEntry) {
    const { action } = entry
    switch (action.kind) {
      case 'answer':
        setAnswerId(action.questionId)
        return
      case 'scroll':
        close()
        document.getElementById(action.sectionId)?.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' })
        return
      case 'copyEmail':
        await copyText(contact.email)
        notify(t.toasts.emailCopied)
        close()
        return
      case 'openUrl':
        window.open(action.url, '_blank', 'noopener,noreferrer')
        close()
        return
      case 'switchLanguage':
        window.location.assign(`/${otherLocale(locale)}${window.location.hash}`)
        return
      case 'toggleInspector':
        notify(isInspecting ? t.toasts.inspectOff : t.toasts.inspectOn)
        toggle()
        close()
        return
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' && question) {
      // Impede o diálogo de fechar: Esc na resposta volta para a busca.
      e.preventDefault()
      setAnswerId(null)
      requestAnimationFrame(() => inputRef.current?.focus())
      return
    }
    if (question) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((selectedIndex + 1) % entries.length)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((selectedIndex - 1 + entries.length) % entries.length)
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      void run(entries[selectedIndex])
    }
  }

  return (
    <div className={S.panel} onKeyDown={onKeyDown}>
      <div className={S.search}>
        <SearchIcon />
        <input
          ref={inputRef}
          className={S.input}
          role="combobox"
          aria-expanded={!question}
          aria-controls={resultsListId}
          aria-autocomplete="list"
          aria-activedescendant={question ? undefined : optionId(selectedIndex)}
          placeholder={t.placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(0)
            setAnswerId(null)
          }}
        />
        <kbd className={S.kbd}>esc</kbd>
      </div>

      {question ? (
        <SpotlightAnswer key={question.id} question={question} projects={projects} backLabel={t.back} />
      ) : (
        <>
          {isEmpty && <p className={S.empty}>{t.empty.title}</p>}
          <SpotlightResults
            entries={entries}
            activeIndex={selectedIndex}
            groupLabels={t.groups}
            onHover={setActiveIndex}
            onSelect={(entry) => void run(entry)}
          />
        </>
      )}

      <div className={S.footer}>
        <span>
          <kbd className={S.kbd}>↑</kbd> <kbd className={S.kbd}>↓</kbd> {t.footer.navigate}
        </span>
        <span>
          <kbd className={S.kbd}>↵</kbd> {t.footer.open}
        </span>
        <span>
          <kbd className={S.kbd}>esc</kbd> {t.footer.close}
        </span>
        <span className={S.note}>{t.footer.note}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 10: `src/components/Spotlight/styles.module.css`**

```css
.dialog {
  width: min(40rem, calc(100% - 2rem));
  max-height: min(34rem, calc(100% - 4rem));
  margin: 10vh auto auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-ink);
  box-shadow: 0 30px 60px -25px rgba(36, 36, 44, 0.45);
  transition:
    opacity 0.18s,
    translate 0.3s var(--ease-spring),
    scale 0.3s var(--ease-spring);
}

@starting-style {
  .dialog[open] {
    opacity: 0;
    translate: 0 -6px;
    scale: 0.985;
  }
}

.dialog::backdrop {
  background: rgba(36, 36, 44, 0.28);
  backdrop-filter: blur(2px);
}

.panel {
  display: flex;
  flex-direction: column;
  max-height: inherit;
}

.search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-muted);
}

.input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--color-ink);
  font: 400 1rem / 1.4 var(--font-sans);
  outline: none;
}

.input::placeholder {
  color: var(--color-faint);
}

.kbd {
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-cream);
  color: var(--color-muted);
  font: 500 0.66rem / 1 var(--font-mono);
}

.list {
  flex: 1;
  overflow-y: auto;
  padding: 0.35rem 0.5rem 0.5rem;
}

.groupTitle {
  padding: 0.75rem 0.6rem 0.35rem;
  color: var(--color-faint);
  font: 400 0.64rem / 1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.6rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color 0.15s,
    translate 0.15s;
}

.option[aria-selected='true'] {
  background: var(--color-hover);
  translate: 2px 0;
}

.optionIcon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-cream);
}

.optionIcon[data-question='true'] {
  border-color: var(--color-ink);
  background: var(--color-ink);
  color: var(--color-cream);
}

.optionText {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.optionTitle {
  font-size: 0.9rem;
  font-weight: 500;
}

.optionSubtitle {
  overflow: hidden;
  color: var(--color-muted);
  font-size: 0.78rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.optionKind {
  color: var(--color-faint);
  font-size: 0.75rem;
}

.enterKey {
  display: none;
}

.option[aria-selected='true'] .optionKind {
  display: none;
}

.option[aria-selected='true'] .enterKey {
  display: inline-block;
}

.empty {
  padding: 1rem 1.1rem 0.25rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.answer {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.8rem;
  overflow-y: auto;
  padding: 1.1rem 1.15rem 1.15rem;
}

.question {
  font: 300 1.2rem / 1.2 var(--font-serif);
}

.answerText {
  font-size: 0.92rem;
  line-height: 1.6;
}

.caret {
  display: inline-block;
  width: 7px;
  height: 15px;
  margin-left: 2px;
  border-radius: 2px;
  background: var(--color-accent);
  vertical-align: -2px;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.widget {
  opacity: 0;
  translate: 0 5px;
  transition:
    opacity 0.35s,
    translate 0.35s;
}

.widget[data-visible='true'] {
  opacity: 1;
  translate: 0 0;
}

.back {
  color: var(--color-muted);
  font-size: 0.76rem;
}

.footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
  padding: 0.6rem 0.95rem;
  border-top: 1px solid var(--color-line);
  color: var(--color-muted);
  font-size: 0.75rem;
}

.note {
  margin-left: auto;
  color: var(--color-faint);
}

/* Widgets de resposta */
.chips {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
}

.chip {
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-cream);
  font-size: 0.78rem;
}

.rows {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-cream);
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-top: 1px solid var(--color-line);
  font-size: 0.82rem;
}

.row:first-child {
  border-top: none;
}

a.row:hover {
  background: var(--color-hover);
}

.rowStatus {
  color: var(--color-muted);
  text-align: right;
}

.flow {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  list-style: none;
}

.step {
  padding: 0.6rem 0.7rem;
  border-left: 1px solid var(--color-line);
  font-size: 0.78rem;
}

.step:first-child {
  border-left: none;
}

.stepLabel {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--color-muted);
  font: 400 0.6rem / 1.3 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 48rem) {
  .dialog {
    margin-top: 1rem;
  }

  .note {
    display: none;
  }
}
```

- [ ] **Step 11: `src/components/CommandBar/index.tsx`**

```tsx
'use client'

import { useSpotlight } from 'contexts/SpotlightContext'
import { useModifierLabel } from 'hooks/useHotkey'
import useMagnetic from 'hooks/useMagnetic'
import { SearchIcon } from 'components/Spotlight/icons'
import S from './styles.module.css'

type Props = { variant: 'hero' | 'compact'; label: string; hints?: string[] }

export default function CommandBar({ variant, label, hints = [] }: Props) {
  const { open } = useSpotlight()
  const modifierLabel = useModifierLabel()
  const magnetic = useMagnetic(variant === 'hero' ? 0.06 : 0.12)

  return (
    <div className={S[variant]}>
      <button
        type="button"
        className={S.bar}
        aria-haspopup="dialog"
        onClick={() => open()}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        data-component={variant === 'hero' ? '<CommandBar />' : '<CommandBar compact />'}
      >
        <SearchIcon />
        <span className={S.label}>{label}</span>
        <kbd className={S.kbd}>{modifierLabel}K</kbd>
      </button>
      {hints.length > 0 && (
        <p className={S.hints}>
          {hints.map((hint) => (
            <button key={hint} type="button" className={S.hint} onClick={() => open(hint)}>
              “{hint}”
            </button>
          ))}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 12: `src/components/CommandBar/styles.module.css`**

```css
.hero {
  max-width: 28rem;
  margin-top: 1.6rem;
}

.compact {
  display: block;
}

.bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.55rem 0.55rem 0.85rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: 0 8px 24px -16px rgba(36, 36, 44, 0.35);
  color: var(--color-faint);
  text-align: left;
  translate: var(--magnet-x, 0px) var(--magnet-y, 0px);
  transition:
    translate 0.35s var(--ease-spring),
    border-color 0.15s,
    box-shadow 0.2s;
}

.bar:hover {
  border-color: var(--color-ink);
  box-shadow: 0 14px 30px -18px rgba(36, 36, 44, 0.5);
}

.label {
  flex: 1;
  font-size: 0.85rem;
}

.kbd {
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-cream);
  color: var(--color-muted);
  font: 500 0.68rem / 1 var(--font-mono);
}

.compact .bar {
  padding: 0.4rem 0.45rem 0.4rem 0.7rem;
  box-shadow: none;
}

.compact .label {
  font-size: 0.8rem;
}

.hints {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.9rem;
  margin-top: 0.6rem;
}

.hint {
  color: var(--color-faint);
  font-size: 0.8rem;
  transition: color 0.2s;
}

.hint:hover {
  color: var(--color-ink);
}

@media (max-width: 48rem) {
  .compact .label,
  .compact .kbd {
    display: none;
  }
}
```

- [ ] **Step 13: Verificar e commitar**

Run: `yarn lint --fix && yarn lint && yarn typecheck && yarn test`
Expected: sem erros; testes passando.

```bash
git add src/contexts src/components/Toast src/components/CommandBar src/components/Spotlight
git commit -m "feat: Spotlight ⌘K com busca local, respostas com widgets e toast

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Modo Inspecionar

**Files:**
- Create: `src/components/Inspector/{index.tsx,styles.module.css}`, `src/components/InspectToggle/{index.tsx,styles.module.css}`

- [ ] **Step 1: `src/components/Inspector/index.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useInspector } from 'contexts/InspectorContext'
import { formatBuiltAt, type BuildInfo } from 'lib/buildInfo'
import type { Translations } from 'locales'
import S from './styles.module.css'

const colorTokens = ['--color-cream', '--color-surface', '--color-ink', '--color-accent', '--color-highlight', '--color-line']

const tipWidth = 230

type InspectTip = { name: string; size: string; padding: string; radius: string; x: number; y: number }

type Props = { t: Translations['inspector']; buildInfo: BuildInfo; dateLocale: string }

export default function Inspector({ t, buildInfo, dateLocale }: Props) {
  const { isInspecting, stop } = useInspector()
  const [tip, setTip] = useState<InspectTip | null>(null)

  useEffect(() => {
    if (!isInspecting) return
    const supportsSquircle = CSS.supports('corner-shape', 'squircle')
    let hovered: Element | null = null

    function onPointerMove(e: PointerEvent) {
      const target = e.target instanceof Element ? e.target.closest('[data-component]') : null
      if (target !== hovered) {
        hovered?.removeAttribute('data-inspect-hover')
        target?.setAttribute('data-inspect-hover', '')
        hovered = target
      }
      if (!target) {
        setTip(null)
        return
      }
      const style = getComputedStyle(target)
      const bounds = target.getBoundingClientRect()
      setTip({
        name: target.getAttribute('data-component') ?? '',
        size: `${Math.round(bounds.width)} × ${Math.round(bounds.height)}`,
        padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].join(' '),
        radius: `${style.borderTopLeftRadius}${supportsSquircle ? ' · squircle' : ''}`,
        x: Math.min(e.clientX + 14, window.innerWidth - tipWidth),
        y: e.clientY + 16
      })
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      hovered?.removeAttribute('data-inspect-hover')
    }
  }, [isInspecting])

  if (!isInspecting) return null

  const testsValue = t.testsValue
    .replace('{passed}', String(buildInfo.tests.passed))
    .replace('{total}', String(buildInfo.tests.total))

  return (
    <>
      <aside className={S.panel} aria-label={t.title}>
        <div className={S.head}>
          <b>{t.title}</b>
          <button type="button" className={S.close} onClick={stop}>
            {t.close}
          </button>
        </div>
        <p className={S.hint}>{t.hint}</p>

        <h3 className={S.heading}>{t.colors}</h3>
        <ul className={S.list}>
          {colorTokens.map((token) => (
            <li key={token}>
              <i className={S.swatch} style={{ background: `var(${token})` }} />
              {token}
            </li>
          ))}
        </ul>

        <h3 className={S.heading}>{t.typography}</h3>
        <ul className={S.list}>
          {t.typographyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className={S.heading}>{t.rendering}</h3>
        <p>{t.renderingValue}</p>

        <h3 className={S.heading}>{t.build}</h3>
        <dl className={S.build}>
          <dt>{t.version}</dt>
          <dd>v{buildInfo.version}</dd>
          <dt>{t.commit}</dt>
          <dd>{buildInfo.commit}</dd>
          <dt>{t.builtAt}</dt>
          <dd>{formatBuiltAt(buildInfo.builtAt, dateLocale)}</dd>
          <dt>{t.tests}</dt>
          <dd>{testsValue}</dd>
        </dl>
      </aside>

      {tip && (
        <div className={S.tip} style={{ left: tip.x, top: tip.y, maxWidth: tipWidth }} aria-hidden="true">
          <b>{tip.name}</b>
          <br />
          {tip.size}
          <br />
          padding {tip.padding}
          <br />
          radius {tip.radius}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: `src/components/Inspector/styles.module.css`**

```css
.panel {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 90;
  width: 15.5rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-ink);
  box-shadow: var(--shadow-float);
  color: var(--color-cream);
  font: 400 0.7rem / 1.7 var(--font-mono);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
}

.close {
  padding: 0.15rem 0.5rem;
  border: 1px solid color-mix(in srgb, var(--color-cream) 30%, transparent);
  border-radius: var(--radius-sm);
}

.hint {
  margin-top: 0.35rem;
  color: color-mix(in srgb, var(--color-cream) 70%, transparent);
}

.heading {
  margin-top: 0.85rem;
  color: var(--color-highlight);
  font: 500 0.62rem / 1.4 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.list {
  list-style: none;
}

.swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 0.45rem;
  border: 1px solid color-mix(in srgb, var(--color-cream) 35%, transparent);
  border-radius: 3px;
  vertical-align: -1px;
}

.build {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 0.75rem;
}

.build dd {
  margin: 0;
  text-align: right;
}

.tip {
  position: fixed;
  z-index: 95;
  padding: 0.5rem 0.65rem;
  border-radius: var(--radius-sm);
  background: var(--color-ink);
  color: var(--color-cream);
  font: 400 0.66rem / 1.6 var(--font-mono);
  pointer-events: none;
}

.tip b {
  color: var(--color-highlight);
  font-weight: 500;
}

@media (max-width: 48rem) {
  .panel {
    top: auto;
    right: 1rem;
    bottom: 1rem;
    left: 1rem;
    width: auto;
    max-height: 45vh;
  }
}
```

- [ ] **Step 3: `src/components/InspectToggle/index.tsx`**

```tsx
'use client'

import { useInspector } from 'contexts/InspectorContext'
import { useSpotlight } from 'contexts/SpotlightContext'
import S from './styles.module.css'

type Props = { label: string; onMessage: string; offMessage: string }

export default function InspectToggle({ label, onMessage, offMessage }: Props) {
  const { isInspecting, toggle } = useInspector()
  const { notify } = useSpotlight()

  return (
    <button
      type="button"
      className={S.toggle}
      aria-pressed={isInspecting}
      onClick={() => {
        notify(isInspecting ? offMessage : onMessage)
        toggle()
      }}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 4: `src/components/InspectToggle/styles.module.css`**

```css
.toggle {
  color: var(--color-muted);
  text-decoration: underline;
  text-decoration-color: var(--color-line);
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.toggle:hover,
.toggle[aria-pressed='true'] {
  color: var(--color-ink);
}
```

- [ ] **Step 5: Verificar e commitar**

Run: `yarn lint --fix && yarn lint && yarn typecheck`
Expected: sem erros.

```bash
git add src/components/Inspector src/components/InspectToggle
git commit -m "feat: modo Inspecionar com medidas ao vivo, tokens e saúde do build

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: LiveBuild (produtos se construindo no hero)

**Files:**
- Create: `src/components/LiveBuild/index.tsx`, `src/components/LiveBuild/styles.module.css`
- Create: `src/components/LiveBuild/scenes/{shared.tsx,DashboardScene.tsx,ReportScene.tsx,AutomationScene.tsx,SupportScene.tsx,DealsScene.tsx}`

Fluxo de cada cena: `enter` (peças entram em mola via `@starting-style`, com atraso por `--order`) → `fill` (skeleton vira texto) → `animate` (animação própria) → `live` (status "em produção", cursor fantasma vai ao botão) → `click` (botão afunda) → `success` (botão vira sucesso) → `exit` (peças saem) → próxima cena. O painel expõe o estado como `data-*` e o CSS reage.

- [ ] **Step 1: `src/components/LiveBuild/scenes/shared.tsx`**

```tsx
import type { CSSProperties, ReactNode } from 'react'
import type { Translations } from 'locales'
import S from '../styles.module.css'

export type SceneProps = {
  t: Translations['liveBuild']
  isAnimated: boolean
  numberLocale: string
  currency: string
}

type PieceProps = { name: string; order: number; depth: number; className?: string; children: ReactNode }

export function Piece({ name, order, depth, className = '', children }: PieceProps) {
  const style = { '--order': order, '--depth': `${depth}px` } as CSSProperties
  return (
    <div className={`${S.piece} ${className}`} data-piece-name={name} style={style}>
      {children}
    </div>
  )
}

export function AppHeader({ title }: { title: string }) {
  return (
    <Piece name="<AppHeader />" order={0} depth={10} className={S.appHeader}>
      <span className={S.appLogo} />
      <span className={S.skeleton} />
      <span className={S.realText}>{title}</span>
    </Piece>
  )
}

export function SceneButton({ label, success, order }: { label: string; success: string; order: number }) {
  return (
    <Piece name="<Button primary />" order={order} depth={40} className={S.ctaPiece}>
      <span className={S.cta}>
        <span className={S.ctaLabel}>{label}</span>
        <span className={S.ctaSuccess}>{success}</span>
      </span>
    </Piece>
  )
}
```

- [ ] **Step 2: `src/components/LiveBuild/scenes/DashboardScene.tsx`**

```tsx
import type { CSSProperties } from 'react'
import CountUp from 'components/CountUp'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

const barHeights = [38, 52, 44, 61, 58, 72, 92]
const monthlyRevenue = 184320

export default function DashboardScene({ t, isAnimated, numberLocale, currency }: SceneProps) {
  const { dashboard } = t
  return (
    <>
      <AppHeader title={dashboard.title} />
      <Piece name="<KpiCard />" order={1} depth={30} className={S.card}>
        <span className={S.cardLabel}>{dashboard.kpiLabel}</span>
        <b className={S.kpi}>
          <CountUp
            to={monthlyRevenue}
            locale={numberLocale}
            formatOptions={{ style: 'currency', currency, maximumFractionDigits: 0 }}
            play={isAnimated}
            idle="zero"
          />
        </b>
        <span className={S.chip}>{dashboard.delta}</span>
        <div className={S.chart}>
          {barHeights.map((height, index) => (
            <i
              key={index}
              className={S.bar}
              style={{ '--bar-height': `${height}%`, '--bar-order': index } as CSSProperties}
            />
          ))}
        </div>
      </Piece>
      <SceneButton label={dashboard.cta} success={dashboard.success} order={2} />
    </>
  )
}
```

- [ ] **Step 3: `src/components/LiveBuild/scenes/ReportScene.tsx`**

```tsx
import type { CSSProperties } from 'react'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

export default function ReportScene({ t }: SceneProps) {
  const { report } = t
  return (
    <>
      <AppHeader title={report.title} />
      <Piece name="<ReportTable />" order={1} depth={30} className={`${S.card} ${S.table}`}>
        <div className={`${S.row} ${S.rowHead}`}>
          {report.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {report.rows.map((row, index) => (
          <div key={row.channel} className={S.row} style={{ '--row-order': index } as CSSProperties}>
            <span>{row.channel}</span>
            <span>
              <span className={S.tag}>{row.status}</span>
            </span>
            <b>{row.total}</b>
          </div>
        ))}
      </Piece>
      <SceneButton label={report.cta} success={report.success} order={2} />
    </>
  )
}
```

- [ ] **Step 4: `src/components/LiveBuild/scenes/AutomationScene.tsx`**

```tsx
import type { CSSProperties } from 'react'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

const nodePositions = [
  { left: '2%', top: '14%', delay: '0s' },
  { left: '35%', top: '56%', delay: '0.6s' },
  { left: '66%', top: '14%', delay: '1.2s' }
]

export default function AutomationScene({ t }: SceneProps) {
  const { automation } = t
  return (
    <>
      <AppHeader title={automation.title} />
      <Piece name="<FlowCanvas />" order={1} depth={30} className={`${S.card} ${S.flow}`}>
        <svg viewBox="0 0 270 130" preserveAspectRatio="none" aria-hidden="true">
          <path className={S.flowPath} style={{ '--path-delay': '0.25s' } as CSSProperties} d="M60 38 C 95 38, 95 92, 125 92" />
          <path className={S.flowPath} style={{ '--path-delay': '0.85s' } as CSSProperties} d="M175 92 C 205 92, 205 38, 222 38" />
        </svg>
        {automation.nodes.map((node, index) => (
          <div
            key={node.label}
            className={`${S.node} ${index === 1 ? S.nodeAi : ''}`}
            style={
              {
                left: nodePositions[index].left,
                top: nodePositions[index].top,
                '--node-delay': nodePositions[index].delay
              } as CSSProperties
            }
          >
            <small className={S.nodeLabel}>{node.label}</small>
            {node.text}
          </div>
        ))}
      </Piece>
      <SceneButton label={automation.cta} success={automation.success} order={2} />
    </>
  )
}
```

- [ ] **Step 5: `src/components/LiveBuild/scenes/SupportScene.tsx`**

```tsx
import type { CSSProperties } from 'react'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

export default function SupportScene({ t }: SceneProps) {
  const { support } = t
  return (
    <>
      <AppHeader title={support.title} />
      <Piece name="<ChatThread />" order={1} depth={30} className={`${S.card} ${S.chat}`}>
        <div className={`${S.message} ${S.customer}`}>{support.customer}</div>
        <div className={`${S.message} ${S.assistant}`} style={{ '--message-delay': '0.4s' } as CSSProperties}>
          <small className={S.assistantLabel}>{support.assistant}</small>
          <span className={S.assistantBody}>
            <span className={S.typing}>
              <i />
              <i />
              <i />
            </span>
            <span className={S.reply}>{support.reply}</span>
          </span>
        </div>
      </Piece>
      <SceneButton label={support.cta} success={support.success} order={2} />
    </>
  )
}
```

- [ ] **Step 6: `src/components/LiveBuild/scenes/DealsScene.tsx`**

```tsx
import type { CSSProperties } from 'react'
import CountUp from 'components/CountUp'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

const payInFullAmount = 1240
const stepCount = 3

export default function DealsScene({ t, isAnimated, numberLocale, currency }: SceneProps) {
  const { deals } = t
  return (
    <>
      <AppHeader title={deals.title} />
      <Piece name="<OfferCard />" order={1} depth={30} className={S.card}>
        <span className={S.cardLabel}>{deals.kpiLabel}</span>
        <b className={S.kpi}>
          <CountUp
            to={payInFullAmount}
            locale={numberLocale}
            formatOptions={{ style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            play={isAnimated}
            idle="zero"
          />
        </b>
        <span className={S.chip}>{deals.discount}</span>
        <div className={S.steps}>
          {Array.from({ length: stepCount }, (_, index) => (
            <i key={index} className={S.step} style={{ '--step-order': index } as CSSProperties} />
          ))}
        </div>
      </Piece>
      <SceneButton label={deals.cta} success={deals.success} order={2} />
    </>
  )
}
```

- [ ] **Step 7: `src/components/LiveBuild/index.tsx`**

```tsx
'use client'

import { useEffect, useState, type PointerEvent } from 'react'
import useInView from 'hooks/useInView'
import usePageVisible from 'hooks/usePageVisible'
import usePointerTilt from 'hooks/usePointerTilt'
import useReducedMotion from 'hooks/useReducedMotion'
import type { Translations } from 'locales'
import AutomationScene from './scenes/AutomationScene'
import DashboardScene from './scenes/DashboardScene'
import DealsScene from './scenes/DealsScene'
import ReportScene from './scenes/ReportScene'
import SupportScene from './scenes/SupportScene'
import S from './styles.module.css'

const phases = ['enter', 'fill', 'animate', 'live', 'click', 'success', 'exit'] as const

type Phase = (typeof phases)[number]

const phaseDurationsMs: Record<Phase, number> = {
  enter: 1100,
  fill: 500,
  animate: 1600,
  live: 1100,
  click: 180,
  success: 2400,
  exit: 360
}

const scenes = [
  { id: 'dashboard', theme: 'coral', Component: DashboardScene },
  { id: 'report', theme: 'ink', Component: ReportScene },
  { id: 'automation', theme: 'mint', Component: AutomationScene },
  { id: 'support', theme: 'amber', Component: SupportScene },
  { id: 'deals', theme: 'coral', Component: DealsScene }
] as const

type Props = { t: Translations['liveBuild']; numberLocale: string; currency: string }

type PieceTip = { name: string; x: number; y: number }

const tipWidth = 130

export default function LiveBuild({ t, numberLocale, currency }: Props) {
  const isReducedMotion = useReducedMotion()
  const isPageVisible = usePageVisible()
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const tilt = usePointerTilt({ maxTiltX: 10, maxTiltY: 14 })
  const [sceneIndex, setSceneIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('enter')
  const [tip, setTip] = useState<PieceTip | null>(null)

  const isPlaying = isInView && isPageVisible && !isReducedMotion
  const currentPhase: Phase = isReducedMotion ? 'success' : phase
  const scene = scenes[sceneIndex]
  const hasReached = (target: Phase) => phases.indexOf(currentPhase) >= phases.indexOf(target)

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setTimeout(() => {
      const nextPhase = phases[phases.indexOf(phase) + 1]
      if (nextPhase) {
        setPhase(nextPhase)
        return
      }
      setSceneIndex((index) => (index + 1) % scenes.length)
      setPhase('enter')
    }, phaseDurationsMs[phase])
    return () => window.clearTimeout(timer)
  }, [isPlaying, phase])

  function showNextScene() {
    setSceneIndex((index) => (index + 1) % scenes.length)
    setPhase('enter')
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    tilt.onPointerMove(e)
    const piece = e.target instanceof HTMLElement ? e.target.closest<HTMLElement>('[data-piece-name]') : null
    if (!piece) {
      setTip(null)
      return
    }
    const bounds = e.currentTarget.getBoundingClientRect()
    setTip({
      name: piece.dataset.pieceName ?? '',
      x: Math.min(e.clientX - bounds.left + 12, bounds.width - tipWidth),
      y: e.clientY - bounds.top + 14
    })
  }

  function onPointerLeave(e: PointerEvent<HTMLDivElement>) {
    tilt.onPointerLeave(e)
    setTip(null)
  }

  const { Component } = scene

  return (
    <div ref={ref} className={S.wrap} data-component="<LiveBuild /> · client">
      <p className="visually-hidden">{t.description}</p>
      <div
        aria-hidden="true"
        className={S.panel}
        data-live-build=""
        data-theme={scene.theme}
        data-static={isReducedMotion}
        data-filled={hasReached('fill')}
        data-animated={hasReached('animate')}
        data-live={hasReached('live')}
        data-clicked={currentPhase === 'click'}
        data-success={hasReached('success')}
        data-exiting={currentPhase === 'exit'}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={showNextScene}
      >
        <div className={S.dots} />
        <div className={S.head}>
          <span className={S.statusDot} />
          <span>{hasReached('live') ? t.live : t.building}</span>
          <span className={S.kind}>{t[scene.id].kind}</span>
        </div>
        <div key={sceneIndex} className={S.stage}>
          <Component t={t} isAnimated={hasReached('animate')} numberLocale={numberLocale} currency={currency} />
        </div>
        <span className={S.ghost}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path className={S.ghostPath} d="M4 3l15 8-7 2-3 7z" />
          </svg>
        </span>
        {tip && (
          <span className={S.tip} style={{ left: tip.x, top: tip.y }}>
            {tip.name}
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 8: `src/components/LiveBuild/styles.module.css`**

```css
.wrap {
  position: relative;
  width: 100%;
  max-width: 22rem;
  perspective: 900px;
}

.panel {
  --scene: var(--theme-coral);
  --scene-soft: var(--theme-coral-soft);
  position: relative;
  height: 24rem;
  padding: 0.9rem;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-float);
  cursor: pointer;
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transform-style: preserve-3d;
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s;
}

.panel[data-theme='ink'] {
  --scene: var(--theme-ink);
  --scene-soft: var(--theme-ink-soft);
}

.panel[data-theme='mint'] {
  --scene: var(--theme-mint);
  --scene-soft: var(--theme-mint-soft);
}

.panel[data-theme='amber'] {
  --scene: var(--theme-amber);
  --scene-soft: var(--theme-amber-soft);
}

.dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(36, 36, 44, 0.13) 1px, transparent 1px);
  background-size: 14px 14px;
  transition: opacity 0.6s;
}

.panel[data-live='true'] .dots {
  opacity: 0.35;
}

.head {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  height: 1.25rem;
  color: var(--color-muted);
  font: 400 0.62rem / 1 var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.statusDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-amber);
  transition: background-color 0.3s;
}

.panel[data-live='true'] .statusDot {
  background: var(--color-highlight);
}

.kind {
  margin-left: auto;
  color: var(--scene);
  transition: color 0.4s;
}

.stage {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  height: calc(100% - 1.25rem);
  padding-top: 0.8rem;
  transform-style: preserve-3d;
}

/* Peças: entram em mola na montagem (@starting-style), em sequência por --order */
.piece {
  position: relative;
  opacity: 1;
  transform: translateZ(var(--depth, 0px));
  transition:
    opacity 0.35s ease-out calc(var(--order) * 240ms),
    transform 0.55s var(--ease-spring) calc(var(--order) * 240ms),
    outline-color 0.15s;
  outline: 1px dashed transparent;
  outline-offset: 3px;
}

@starting-style {
  .piece {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
  }
}

.piece:hover {
  outline-color: var(--color-accent);
}

.panel[data-exiting='true'] .piece {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
  transition-delay: 0s;
  transition-duration: 0.3s;
}

.skeleton {
  display: block;
  width: 6rem;
  height: 9px;
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, var(--color-line), var(--color-hover), var(--color-line));
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.realText {
  display: none;
}

.panel[data-filled='true'] .skeleton {
  display: none;
}

.panel[data-filled='true'] .realText {
  display: inline;
  animation: pop 0.35s ease-out;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
}

.appHeader {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  height: 2.25rem;
  padding: 0 0.75rem;
  border-radius: var(--radius-md);
  background: var(--color-ink);
  color: var(--color-cream);
  font-size: 0.75rem;
  font-weight: 500;
}

.appHeader .skeleton {
  background: color-mix(in srgb, var(--color-ink) 82%, white);
  animation: none;
}

.appLogo {
  width: 14px;
  height: 14px;
  border-radius: 5px;
  background: var(--scene);
  transition: background-color 0.4s;
}

.card {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-cream);
}

.cardLabel {
  display: block;
  color: var(--color-muted);
  font: 400 0.58rem / 1 var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.kpi {
  display: block;
  margin-top: 0.3rem;
  font: 500 1.65rem / 1.1 var(--font-serif);
  letter-spacing: -0.02em;
}

.chip {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--scene-soft);
  color: var(--scene);
  font-size: 0.68rem;
  font-weight: 600;
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 0.4s,
    scale 0.4s var(--ease-spring);
}

.panel[data-animated='true'] .chip {
  opacity: 1;
  scale: 1;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 3.1rem;
  margin-top: 0.55rem;
}

.bar {
  flex: 1;
  height: 4%;
  border-radius: 6px 6px 3px 3px;
  background: var(--scene-soft);
  transition: height 0.7s var(--ease-spring) calc(var(--bar-order) * 80ms);
}

.bar:last-child {
  background: var(--scene);
}

.panel[data-animated='true'] .bar {
  height: var(--bar-height);
}

.table {
  padding: 0.35rem 0.9rem;
}

.row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.8fr;
  gap: 0.5rem;
  padding: 0.32rem 0;
  border-top: 1px solid var(--color-line);
  font-size: 0.7rem;
  opacity: 0;
  translate: -6px 0;
  transition:
    opacity 0.3s calc(var(--row-order) * 170ms),
    translate 0.3s calc(var(--row-order) * 170ms);
}

.row b {
  font-weight: 600;
  text-align: right;
}

.rowHead {
  border-top: none;
  color: var(--color-muted);
  font: 400 0.56rem / 1.6 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 1;
  translate: 0 0;
}

.rowHead span:last-child {
  text-align: right;
}

.panel[data-animated='true'] .row {
  opacity: 1;
  translate: 0 0;
}

.tag {
  display: inline-block;
  padding: 0 0.45rem;
  border-radius: var(--radius-pill);
  background: var(--scene-soft);
  color: var(--scene);
  font-size: 0.62rem;
}

.flow {
  height: 9rem;
}

.flow svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.flowPath {
  fill: none;
  stroke: var(--scene);
  stroke-width: 1.5;
  stroke-dasharray: 160;
  stroke-dashoffset: 160;
  transition: stroke-dashoffset 0.6s ease-out var(--path-delay);
}

.panel[data-animated='true'] .flowPath {
  stroke-dashoffset: 0;
}

.node {
  position: absolute;
  width: 6rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: 0.68rem;
  opacity: 0;
  scale: 0.7;
  transition:
    opacity 0.45s var(--node-delay),
    scale 0.45s var(--ease-spring) var(--node-delay);
}

.panel[data-animated='true'] .node {
  opacity: 1;
  scale: 1;
}

.nodeAi {
  border-color: var(--color-ink);
  background: var(--color-ink);
  color: var(--color-cream);
}

.nodeLabel {
  display: block;
  margin-bottom: 0.1rem;
  color: var(--color-muted);
  font: 400 0.52rem / 1.4 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nodeAi .nodeLabel {
  color: color-mix(in srgb, var(--color-cream) 65%, transparent);
}

.chat {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  height: 9rem;
}

.message {
  max-width: 85%;
  padding: 0.45rem 0.65rem;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  line-height: 1.4;
  opacity: 0;
  translate: 0 6px;
}

.panel[data-animated='true'] .message {
  animation: message-in 0.35s var(--ease-spring) var(--message-delay, 0s) forwards;
}

@keyframes message-in {
  to {
    opacity: 1;
    translate: 0 0;
  }
}

.customer {
  align-self: flex-end;
  background: var(--color-ink);
  color: var(--color-cream);
}

.assistant {
  align-self: flex-start;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
}

.assistantLabel {
  display: block;
  margin-bottom: 0.1rem;
  color: var(--scene);
  font: 400 0.52rem / 1.4 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Digitando e resposta ocupam a mesma célula: a bolha já nasce no tamanho da resposta */
.assistantBody {
  display: grid;
}

.typing,
.reply {
  grid-area: 1 / 1;
}

.typing {
  display: inline-flex;
  gap: 3px;
  align-self: center;
}

.typing i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-muted);
  animation: bounce 1s infinite;
}

.typing i:nth-child(2) {
  animation-delay: 0.15s;
}

.typing i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  50% {
    opacity: 0.5;
    translate: 0 -3px;
  }
}

.reply {
  opacity: 0;
}

.panel[data-animated='true'] .typing {
  animation: fade-out 0.2s ease-out 1.3s forwards;
}

.panel[data-animated='true'] .reply {
  animation: fade-in 0.3s ease-out 1.35s forwards;
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

.steps {
  display: flex;
  gap: 5px;
  margin-top: 0.65rem;
}

.step {
  flex: 1;
  height: 5px;
  border-radius: var(--radius-pill);
  background: var(--color-line);
  transition: background-color 0.3s calc(var(--step-order) * 160ms + 900ms);
}

.panel[data-animated='true'] .step {
  background: var(--scene);
}

.ctaPiece {
  margin-top: auto;
}

.cta {
  display: grid;
  place-items: center;
  height: 2.5rem;
  border-radius: var(--radius-md);
  background: var(--scene);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  transition:
    background-color 0.35s,
    scale 0.1s;
}

.ctaLabel,
.ctaSuccess {
  grid-area: 1 / 1;
  transition: opacity 0.25s;
}

.ctaSuccess {
  opacity: 0;
}

.panel[data-clicked='true'] .cta {
  scale: 0.94;
}

.panel[data-success='true'] .cta {
  background: var(--theme-mint);
}

.panel[data-success='true'] .ctaLabel {
  opacity: 0;
}

.panel[data-success='true'] .ctaSuccess {
  opacity: 1;
}

/* Cursor fantasma: sai de baixo e vai até o botão quando a cena fica "em produção" */
.ghost {
  position: absolute;
  top: 108%;
  left: 80%;
  z-index: 5;
  opacity: 0;
  pointer-events: none;
  transition:
    left 0.9s cubic-bezier(0.65, 0, 0.35, 1),
    top 0.9s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.3s;
}

.ghostPath {
  fill: var(--color-ink);
  stroke: var(--color-surface);
  stroke-width: 1.5;
  stroke-linejoin: round;
}

.panel[data-live='true']:not([data-exiting='true']) .ghost {
  top: calc(100% - 2.4rem);
  left: 55%;
  opacity: 1;
}

.panel[data-live='true'][data-success='true'] .ghost,
.panel[data-static='true'] .ghost {
  opacity: 0;
}

.tip {
  position: absolute;
  z-index: 6;
  padding: 0.2rem 0.45rem;
  border-radius: var(--radius-sm);
  background: var(--color-ink);
  color: var(--color-cream);
  font: 400 0.58rem / 1.4 var(--font-mono);
  white-space: nowrap;
  pointer-events: none;
}

@media (max-width: 48rem) {
  .wrap {
    max-width: 100%;
  }

  .panel {
    height: 22rem;
  }
}
```

- [ ] **Step 9: Verificar e commitar**

Run: `yarn lint --fix && yarn lint && yarn typecheck`
Expected: sem erros.

```bash
git add src/components/LiveBuild
git commit -m "feat: LiveBuild com cinco produtos se montando, tilt em camadas e cursor fantasma

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Seções de conteúdo e composição da página

**Files:**
- Create: `src/components/{SectionTitle,LanguageSwitcher,Header,Hero,Metrics,Experience,Stack,Projects,ProjectCard,Contact,CopyEmailButton,Footer}/{index.tsx,styles.module.css}`
- Modify: `src/app/[locale]/page.tsx` (versão final)

- [ ] **Step 1: `src/components/SectionTitle/index.tsx` e `styles.module.css`**

```tsx
import S from './styles.module.css'

export default function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className={S.sectionTitle}>
      <span className={S.label}>{label}</span>
      <h2 className={S.title}>{title}</h2>
    </div>
  )
}
```

```css
.sectionTitle {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
}

.label {
  color: var(--color-accent-text);
  font: 400 0.7rem / 1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.title {
  font: 500 clamp(1.6rem, 3vw, 2rem) / 1.1 var(--font-serif);
  letter-spacing: -0.02em;
}
```

- [ ] **Step 2: `src/components/LanguageSwitcher/index.tsx` e `styles.module.css`**

```tsx
import { otherLocale, type Locale } from 'lib/locale'
import S from './styles.module.css'

type Props = { locale: Locale; label: string; ariaLabel: string }

export default function LanguageSwitcher({ locale, label, ariaLabel }: Props) {
  const target = otherLocale(locale)
  return (
    <a href={`/${target}`} hrefLang={target} className={S.switcher} aria-label={ariaLabel}>
      {label}
    </a>
  )
}
```

```css
.switcher {
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font: 500 0.75rem / 1 var(--font-mono);
  letter-spacing: 0.08em;
  transition: border-color 0.2s;
}

.switcher:hover {
  border-color: var(--color-ink);
}
```

- [ ] **Step 3: `src/components/Header/index.tsx` e `styles.module.css`**

```tsx
import CommandBar from 'components/CommandBar'
import LanguageSwitcher from 'components/LanguageSwitcher'
import type { Locale } from 'lib/locale'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { t: Translations['nav']; brand: Translations['brand']; locale: Locale }

export default function Header({ t, brand, locale }: Props) {
  return (
    <header className={S.header} data-component="<Header />">
      <a href={`/${locale}`} className={S.brand}>
        {brand.firstName} <span className={S.brandAccent}>{brand.lastName}</span>
      </a>
      <nav className={S.nav} aria-label={t.ariaLabel}>
        <a href="#experience" className={S.link}>
          {t.experience}
        </a>
        <a href="#projects" className={S.link}>
          {t.projects}
        </a>
        <a href="#contact" className={S.link}>
          {t.contact}
        </a>
      </nav>
      <CommandBar variant="compact" label={t.searchTrigger} />
      <LanguageSwitcher locale={locale} label={t.switchLanguage} ariaLabel={t.switchLanguageLabel} />
    </header>
  )
}
```

```css
.header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  max-width: var(--width-page);
  margin: 0 auto;
  padding: 1.1rem var(--space-page);
}

.brand {
  margin-right: auto;
  font: 400 1.15rem / 1 var(--font-serif);
  letter-spacing: -0.01em;
}

.brandAccent {
  color: var(--color-accent);
}

.nav {
  display: flex;
  gap: 1.4rem;
}

.link {
  position: relative;
  color: var(--color-muted);
  font-size: 0.875rem;
  transition: color 0.2s;
}

.link::after {
  content: '';
  position: absolute;
  right: 100%;
  bottom: -5px;
  left: 0;
  height: 2px;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  transition: right 0.3s var(--ease-out);
}

.link:hover {
  color: var(--color-ink);
}

.link:hover::after {
  right: 0;
}

@media (max-width: 48rem) {
  .nav {
    display: none;
  }
}
```

- [ ] **Step 4: `src/components/Hero/index.tsx` e `styles.module.css`**

```tsx
import type { ReactNode } from 'react'
import CommandBar from 'components/CommandBar'
import MagneticButton from 'components/MagneticButton'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { t: Translations['hero']; githubUrl: string; visual: ReactNode }

export default function Hero({ t, githubUrl, visual }: Props) {
  return (
    <section className={S.hero} data-component="<Hero />">
      <div className={S.text}>
        <p className={S.label}>{t.label}</p>
        <h1 className={S.title}>
          {t.titleStart}
          <em className={S.emphasis}>{t.titleEmphasis}</em>
          {t.titleEnd}
        </h1>
        <p className={S.bio}>{t.bio}</p>
        <CommandBar variant="hero" label={t.commandPlaceholder} hints={t.hints} />
        <div className={S.actions}>
          <MagneticButton href="#contact" variant="primary">
            {t.primaryCta}
          </MagneticButton>
          <MagneticButton href={githubUrl} variant="ghost" isExternal>
            {t.secondaryCta}
          </MagneticButton>
        </div>
      </div>
      <div className={S.visual}>{visual}</div>
    </section>
  )
}
```

```css
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 22rem);
  align-items: center;
  gap: 2.5rem;
  padding: 3rem 0 0.5rem;
}

.text {
  max-width: 40rem;
}

.label {
  color: var(--color-accent-text);
  font: 400 0.7rem / 1.4 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.title {
  margin-top: 0.6rem;
  font: 300 clamp(2.3rem, 5vw, 3.4rem) / 1.04 var(--font-serif);
  letter-spacing: -0.02em;
}

.emphasis {
  color: var(--color-accent);
  font-style: italic;
}

.bio {
  max-width: 34rem;
  margin-top: 1rem;
  color: var(--color-muted);
  font-size: 1.02rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.25rem;
}

.visual {
  display: flex;
  justify-content: center;
}

@media (max-width: 48rem) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 1.5rem;
  }
}
```

- [ ] **Step 5: `src/components/Metrics/index.tsx` e `styles.module.css`**

```tsx
import CountUp from 'components/CountUp'
import ProgressBar from 'components/ProgressBar'
import TiltCard from 'components/TiltCard'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { t: Translations['metrics']; numberLocale: string }

export default function Metrics({ t, numberLocale }: Props) {
  return (
    <section className={S.metrics} aria-label={t.label} data-component="<Metrics />">
      {t.items.map((item) => (
        <TiltCard key={item.description} className={S.card} component="<MetricCard />">
          <span className={S.state} data-tone={item.tone}>
            {item.state}
          </span>
          <b className={S.value}>
            {item.countTo === null ? (
              item.value
            ) : (
              <CountUp to={item.countTo} suffix={item.suffix} locale={numberLocale} />
            )}
          </b>
          <p className={S.description}>{item.description}</p>
          <ProgressBar value={item.progress} />
          <small className={S.note}>{item.note}</small>
        </TiltCard>
      ))}
    </section>
  )
}
```

```css
.metrics {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem 1.25rem 1.1rem;
}

.state {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.state::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-highlight);
}

.state[data-tone='progress']::before {
  background: var(--color-amber);
}

.value {
  margin-top: 0.75rem;
  font: 500 2.2rem / 1.05 var(--font-serif);
  letter-spacing: -0.02em;
}

.description {
  margin-bottom: 0.75rem;
  color: var(--color-muted);
  font-size: 0.85rem;
}

.note {
  margin-top: 0.6rem;
  color: var(--color-faint);
  font-size: 0.78rem;
}

@media (max-width: 48rem) {
  .metrics {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: `src/components/Stack/index.tsx` e `styles.module.css`**

```tsx
import TiltCard from 'components/TiltCard'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { title: string; groups: Translations['experience']['stackGroups'] }

export default function Stack({ title, groups }: Props) {
  return (
    <div className={S.stack} data-component="<Stack />">
      <h3 className={S.title}>{title}</h3>
      <div className={S.groups}>
        {groups.map((group) => (
          <TiltCard key={group.name} className={S.group} component="<StackGroup />">
            <h4 className={S.groupName}>{group.name}</h4>
            <ul className={S.tags}>
              {group.items.map((item) => (
                <li key={item} className={S.tag}>
                  {item}
                </li>
              ))}
            </ul>
          </TiltCard>
        ))}
      </div>
    </div>
  )
}
```

```css
.stack {
  position: relative;
  margin-top: 2.5rem;
}

.title {
  margin-bottom: 1rem;
  font: 500 1.05rem / 1.2 var(--font-serif);
}

.groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  gap: 0.75rem;
}

.group {
  padding: 1rem 1.1rem;
}

.groupName {
  margin-bottom: 0.7rem;
  color: var(--color-accent-text);
  font: 400 0.66rem / 1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  list-style: none;
}

.tag {
  padding: 0.2rem 0.55rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-cream);
  font-size: 0.8rem;
}
```

- [ ] **Step 7: `src/components/Experience/index.tsx` e `styles.module.css`**

```tsx
import SectionTitle from 'components/SectionTitle'
import Stack from 'components/Stack'
import type { Translations } from 'locales'
import S from './styles.module.css'

export default function Experience({ t }: { t: Translations['experience'] }) {
  return (
    <section id="experience" className={S.experience} data-component="<Experience />">
      <SectionTitle label={t.label} title={t.title} />
      <ol className={S.timeline}>
        {t.items.map((item) => (
          <li key={item.period} className={S.item}>
            <span className={S.period}>{item.period}</span>
            <div>
              <h3 className={S.role}>{item.role}</h3>
              <p className={S.description}>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <Stack title={t.stackTitle} groups={t.stackGroups} />
    </section>
  )
}
```

```css
.experience {
  position: relative;
  scroll-margin-top: 1.5rem;
}

.timeline {
  display: grid;
  gap: 1.6rem;
  list-style: none;
}

.item {
  display: grid;
  grid-template-columns: 11rem 1fr;
  gap: 1.25rem;
}

.period {
  padding-top: 0.25rem;
  color: var(--color-accent-text);
  font: 400 0.72rem / 1.5 var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.role {
  font: 500 1.2rem / 1.25 var(--font-serif);
}

.description {
  max-width: 40rem;
  margin-top: 0.35rem;
  color: var(--color-muted);
  font-size: 0.93rem;
}

@media (max-width: 48rem) {
  .item {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
```

- [ ] **Step 8: `src/components/ProjectCard/index.tsx` e `styles.module.css`**

```tsx
import Image from 'next/image'
import TiltCard from 'components/TiltCard'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { project: Translations['projects']['items'][number]; openLabel: string }

export default function ProjectCard({ project, openLabel }: Props) {
  return (
    <TiltCard as="article" className={S.card} component="<ProjectCard />">
      <div className={S.thumb}>
        <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 48rem) 100vw, 33vw" className={S.image} />
      </div>
      <div className={S.body}>
        <h3 className={S.name}>{project.name}</h3>
        <p className={S.description}>{project.description}</p>
        <div className={S.meta}>
          <span className={S.tech}>{project.tech}</span>
          <a href={project.href} target="_blank" rel="noopener noreferrer" className={S.link}>
            {openLabel} ↗
          </a>
        </div>
      </div>
    </TiltCard>
  )
}
```

```css
.card {
  display: flex;
  flex-direction: column;
}

.thumb {
  position: relative;
  height: 10rem;
  overflow: hidden;
  background: var(--color-hover);
}

.image {
  object-fit: cover;
  transition: scale 0.5s var(--ease-out);
}

.card:hover .image {
  scale: 1.04;
}

.body {
  padding: 1rem 1.1rem 1.1rem;
}

.name {
  font: 500 1.15rem / 1.2 var(--font-serif);
}

.description {
  margin-top: 0.25rem;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.9rem;
}

.tech {
  color: var(--color-faint);
  font: 400 0.68rem / 1.4 var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.link {
  font-size: 0.82rem;
  font-weight: 500;
}

/* O card inteiro é clicável pelo link */
.link::after {
  content: '';
  position: absolute;
  inset: 0;
}
```

- [ ] **Step 9: `src/components/Projects/index.tsx` e `styles.module.css`**

```tsx
import ProjectCard from 'components/ProjectCard'
import SectionTitle from 'components/SectionTitle'
import type { Translations } from 'locales'
import S from './styles.module.css'

export default function Projects({ t }: { t: Translations['projects'] }) {
  return (
    <section id="projects" className={S.projects} data-component="<Projects />">
      <SectionTitle label={t.label} title={t.title} />
      <div className={S.grid}>
        {t.items.map((project) => (
          <ProjectCard key={project.name} project={project} openLabel={t.open} />
        ))}
      </div>
    </section>
  )
}
```

```css
.projects {
  position: relative;
  scroll-margin-top: 1.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1rem;
}
```

- [ ] **Step 10: `src/components/CopyEmailButton/index.tsx` e `styles.module.css`**

```tsx
'use client'

import { useSpotlight } from 'contexts/SpotlightContext'
import useRipple from 'hooks/useRipple'
import { copyText } from 'lib/clipboard'
import S from './styles.module.css'

type Props = { email: string; label: string; copiedMessage: string }

export default function CopyEmailButton({ email, label, copiedMessage }: Props) {
  const { notify } = useSpotlight()
  const createRipple = useRipple()

  return (
    <button
      type="button"
      className={S.button}
      onPointerDown={createRipple}
      onClick={async () => {
        await copyText(email)
        notify(copiedMessage)
      }}
      data-component="<CopyEmailButton />"
    >
      {label}
    </button>
  )
}
```

```css
.button {
  position: relative;
  overflow: hidden;
  padding: 0.7rem 1.1rem;
  border: 1px solid color-mix(in srgb, var(--color-cream) 30%, transparent);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    border-color 0.2s,
    scale 0.12s ease-out;
}

.button:hover {
  border-color: var(--color-cream);
}

.button:active {
  scale: 0.95;
}
```

- [ ] **Step 11: `src/components/Contact/index.tsx` e `styles.module.css`**

```tsx
import CopyEmailButton from 'components/CopyEmailButton'
import MagneticButton from 'components/MagneticButton'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { t: Translations['contact']; copiedMessage: string }

export default function Contact({ t, copiedMessage }: Props) {
  return (
    <section id="contact" className={S.contact} data-component="<Contact />">
      <p className={S.label}>{t.label}</p>
      <h2 className={S.title}>
        {t.titleStart}
        <em className={S.emphasis}>{t.titleEmphasis}</em>
        {t.titleEnd}
      </h2>
      <div className={S.actions}>
        <MagneticButton href={`mailto:${t.email}`} variant="light">
          {t.email}
        </MagneticButton>
        <CopyEmailButton email={t.email} label={t.copyEmail} copiedMessage={copiedMessage} />
      </div>
      <ul className={S.socials}>
        {t.socials.map((social) => (
          <li key={social.id}>
            <a href={social.href} target="_blank" rel="noopener noreferrer" className={S.social}>
              {social.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

```css
.contact {
  position: relative;
  padding: clamp(2rem, 5vw, 3.5rem);
  border-radius: var(--radius-lg);
  background: var(--color-ink);
  color: var(--color-cream);
  scroll-margin-top: 1.5rem;
}

.label {
  color: var(--color-highlight);
  font: 400 0.7rem / 1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.title {
  max-width: 34rem;
  margin-top: 0.75rem;
  font: 300 clamp(1.9rem, 4vw, 2.6rem) / 1.1 var(--font-serif);
  letter-spacing: -0.02em;
}

.emphasis {
  color: var(--color-accent);
  font-style: italic;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.5rem;
}

.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 1.75rem;
  font-size: 0.85rem;
  list-style: none;
}

.social {
  color: color-mix(in srgb, var(--color-cream) 78%, transparent);
  transition: color 0.2s;
}

.social:hover {
  color: var(--color-cream);
}
```

- [ ] **Step 12: `src/components/Footer/index.tsx` e `styles.module.css`**

```tsx
import InspectToggle from 'components/InspectToggle'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = {
  t: Translations['footer']
  brand: Translations['brand']
  toasts: Translations['spotlight']['toasts']
  version: string
  year: number
}

export default function Footer({ t, brand, toasts, version, year }: Props) {
  return (
    <footer className={S.footer} data-component="<Footer />">
      <span>
        © {year} {brand.firstName} {brand.lastName}
      </span>
      <span className={S.version}>
        {t.version} {version}
      </span>
      <span className={S.inspect}>
        <InspectToggle label={t.inspect} onMessage={toasts.inspectOn} offMessage={toasts.inspectOff} />
      </span>
    </footer>
  )
}
```

```css
.footer {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.25rem;
  max-width: var(--width-page);
  margin: 0 auto;
  padding: 1.5rem var(--space-page) 2.5rem;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.version {
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.inspect {
  margin-left: auto;
}
```

- [ ] **Step 13: Página final `src/app/[locale]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import Contact from 'components/Contact'
import Experience from 'components/Experience'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Hero from 'components/Hero'
import Inspector from 'components/Inspector'
import LiveBuild from 'components/LiveBuild'
import Metrics from 'components/Metrics'
import Projects from 'components/Projects'
import Spotlight from 'components/Spotlight'
import { InspectorProvider } from 'contexts/InspectorContext'
import { SpotlightProvider } from 'contexts/SpotlightContext'
import { copyrightYear, readBuildInfo } from 'lib/buildInfo'
import { isLocale } from 'lib/locale'
import { getTranslations } from 'locales'
import S from './page.module.css'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const translations = getTranslations(locale)
  const buildInfo = readBuildInfo()
  const githubUrl = translations.contact.socials.find((social) => social.id === 'github')?.href ?? ''

  return (
    <InspectorProvider>
      <SpotlightProvider>
        <Header t={translations.nav} brand={translations.brand} locale={locale} />
        <main className={S.main}>
          <Hero
            t={translations.hero}
            githubUrl={githubUrl}
            visual={
              <LiveBuild
                t={translations.liveBuild}
                numberLocale={translations.dateLocale}
                currency={translations.currency}
              />
            }
          />
          <Metrics t={translations.metrics} numberLocale={translations.dateLocale} />
          <Experience t={translations.experience} />
          <Projects t={translations.projects} />
          <Contact t={translations.contact} copiedMessage={translations.spotlight.toasts.emailCopied} />
        </main>
        <Footer
          t={translations.footer}
          brand={translations.brand}
          toasts={translations.spotlight.toasts}
          version={buildInfo.version}
          year={copyrightYear(buildInfo)}
        />
        <Spotlight
          t={translations.spotlight}
          projects={translations.projects}
          experience={translations.experience}
          contact={translations.contact}
          locale={locale}
        />
        <Inspector t={translations.inspector} buildInfo={buildInfo} dateLocale={translations.dateLocale} />
      </SpotlightProvider>
    </InspectorProvider>
  )
}
```

- [ ] **Step 14: Verificar o build**

Run: `yarn lint --fix && yarn lint && yarn typecheck && yarn build`
Expected: sem erros; `/pt` e `/en` estáticas.

- [ ] **Step 15: Verificação visual (desktop e mobile)**

```bash
yarn start --port 3100 &
sleep 4
yarn playwright install chromium
yarn playwright screenshot --viewport-size "1440, 900" --wait-for-timeout 4500 http://localhost:3100/pt /tmp/bluis-desktop.png
yarn playwright screenshot --viewport-size "375, 812" --full-page --wait-for-timeout 4500 http://localhost:3100/pt /tmp/bluis-mobile.png
kill %1
```

Abra as duas imagens e compare com `hero-build-v3.html`. Confira:
- hero em duas colunas no desktop, com LiveBuild à direita, e em uma coluna no mobile;
- cantos squircle (Chrome 139+);
- sem scroll horizontal no mobile;
- textos em pt.

Depois abra `http://localhost:3100/pt` num navegador real (`yarn start`) e teste com o mouse:
- LiveBuild: inclinação, nome do componente no hover, clique troca de cena e o loop passa pelas 5 cenas;
- cards com brilho neutro;
- botões magnéticos com ripple;
- ⌘K abrindo o Spotlight;
- comando "Inspecionar o site" funcionando.

Anote o que divergir e corrija antes de commitar.

- [ ] **Step 16: Commit**

```bash
git add src/components src/app
git commit -m "feat: seções do portfólio e composição da página

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Testes end-to-end (Playwright) e CI

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/i18n.spec.ts`, `tests/e2e/spotlight.spec.ts`, `tests/e2e/inspector.spec.ts`, `tests/e2e/motion.spec.ts`, `tests/e2e/layout.spec.ts`, `.github/workflows/ci.yml`

- [ ] **Step 1: `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

const port = 3100

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, hasTouch: true },
      testMatch: /layout\.spec\.ts/
    }
  ],
  // Roda contra o build de produção: faça `yarn build` antes.
  webServer: {
    command: `yarn start --port ${port}`,
    url: `http://localhost:${port}/pt`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
})
```

- [ ] **Step 2: `tests/e2e/i18n.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

test.describe('idioma por rota', () => {
  test('navegador em inglês vai para /en', async ({ request }) => {
    const response = await request.get('/', { maxRedirects: 0, headers: { 'accept-language': 'en-US,en;q=0.9' } })
    expect(response.status()).toBe(307)
    expect(response.headers()['location']).toMatch(/\/en$/)
  })

  test('sem Accept-Language vai para /pt', async ({ request }) => {
    const response = await request.get('/', { maxRedirects: 0, headers: { 'accept-language': '' } })
    expect(response.status()).toBe(307)
    expect(response.headers()['location']).toMatch(/\/pt$/)
  })

  test('cookie de idioma vence o Accept-Language', async ({ request }) => {
    const response = await request.get('/', {
      maxRedirects: 0,
      headers: { 'accept-language': 'pt-BR', cookie: 'locale=en' }
    })
    expect(response.headers()['location']).toMatch(/\/en$/)
  })

  test('caminho desconhecido termina em 404', async ({ request }) => {
    const response = await request.get('/xx')
    expect(response.status()).toBe(404)
  })

  test('/en já vem em inglês do servidor', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('I build products with AI')
  })

  test('o seletor troca para o outro idioma', async ({ page }) => {
    await page.goto('/pt')
    await page.getByRole('link', { name: 'View in English' }).click()
    await expect(page).toHaveURL(/\/en$/)
  })
})
```

- [ ] **Step 3: `tests/e2e/spotlight.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

test.describe('Spotlight', () => {
  test('abre pelo atalho, busca, responde e fecha', async ({ page }) => {
    await page.goto('/pt')
    await page.keyboard.press('ControlOrMeta+k')

    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await expect(dialog).toBeVisible()

    const search = dialog.getByRole('combobox')
    await search.fill('testes')
    await expect(dialog.getByRole('option').first()).toContainText('Como você garante qualidade?')

    await search.press('Enter')
    await expect(dialog.getByText('Qualidade é processo').first()).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(search).toBeFocused()
    await expect(dialog.getByRole('option').first()).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('setas mudam a seleção', async ({ page }) => {
    await page.goto('/pt')
    await page.getByRole('button', { name: /Pergunte algo ou busque uma seção/ }).click()
    const options = page.getByRole('dialog').getByRole('option')
    await expect(options.first()).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('ArrowDown')
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true')
  })

  test('copiar e-mail mostra confirmação', async ({ page }) => {
    await page.goto('/pt')
    await page.keyboard.press('ControlOrMeta+k')
    await page.getByRole('combobox').fill('copiar')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toHaveText('E-mail copiado ✓')
  })

  test('busca sem resultado oferece o e-mail', async ({ page }) => {
    await page.goto('/pt')
    await page.keyboard.press('ControlOrMeta+k')
    await page.getByRole('combobox').fill('kubernetes')
    await expect(page.getByText('Não encontrei isso aqui')).toBeVisible()
    await expect(page.getByRole('option').first()).toContainText('Copiar e-mail')
  })

  test('dica do hero abre com a busca preenchida', async ({ page }) => {
    await page.goto('/pt')
    await page.getByRole('button', { name: '“O que você faz com IA?”' }).click()
    await expect(page.getByRole('combobox')).toHaveValue('O que você faz com IA?')
  })
})
```

- [ ] **Step 4: `tests/e2e/inspector.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

test('modo Inspecionar mostra componentes e saúde real do build', async ({ page }) => {
  await page.goto('/pt')
  await page.keyboard.press('ControlOrMeta+k')
  await page.getByRole('combobox').fill('inspecionar')
  await page.keyboard.press('Enter')

  await expect(page.locator('html')).toHaveAttribute('data-inspecting', '')
  const panel = page.getByRole('complementary', { name: 'Inspecionar' })
  await expect(panel).toBeVisible()
  await expect(panel).toContainText('v2.0.0')
  await expect(panel).toContainText(/\d+\/\d+ passaram/)

  await panel.getByRole('button', { name: 'Fechar' }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-inspecting', '')
})
```

- [ ] **Step 5: `tests/e2e/motion.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

test.describe('com animações reduzidas', () => {
  test.use({ reducedMotion: 'reduce' })

  test('LiveBuild fica estático e as métricas mostram o valor final', async ({ page }) => {
    await page.goto('/pt')
    await expect(page.locator('[data-live-build]')).toHaveAttribute('data-static', 'true')
    await expect(page.getByText('15+', { exact: true })).toBeVisible()
  })
})

test('LiveBuild troca de cena ao clicar', async ({ page }) => {
  await page.goto('/pt')
  const panel = page.locator('[data-live-build]')
  await expect(panel).toHaveAttribute('data-theme', 'coral')
  await panel.click()
  await expect(panel).toHaveAttribute('data-theme', 'ink')
})
```

- [ ] **Step 6: `tests/e2e/layout.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

test('sem rolagem horizontal', async ({ page }) => {
  await page.goto('/pt')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
```

- [ ] **Step 7: Rodar os e2e contra o build**

Run: `yarn build && yarn test:e2e`
Expected: todos passam nos projetos `desktop` e `mobile`. Se o teste do toast falhar por permissão de clipboard no seu sistema, confirme que o fallback de `lib/clipboard.ts` está ativo (o toast aparece mesmo assim) antes de mexer no teste.

- [ ] **Step 8: `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: yarn

      - run: yarn install --frozen-lockfile
      - run: yarn lint
      - run: yarn typecheck
      - run: yarn test
      - run: yarn build
      - run: yarn playwright install --with-deps chromium
      - run: yarn test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report
```

- [ ] **Step 9: Commit**

```bash
yarn lint --fix && yarn lint
git add playwright.config.ts tests .github
git commit -m "test: e2e de idioma, Spotlight, inspeção, movimento e layout + CI

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: README, screenshot e auditoria final

**Files:**
- Modify: `README.md`
- Create: `docs/screenshot.png`

- [ ] **Step 1: Gerar o screenshot do README**

```bash
yarn build
yarn start --port 3100 &
sleep 4
yarn playwright screenshot --viewport-size "1440, 900" --wait-for-timeout 4500 http://localhost:3100/en docs/screenshot.png
kill %1
```

Expected: `docs/screenshot.png` com o hero em inglês e o LiveBuild montado.

- [ ] **Step 2: Escrever `README.md`**

````md
# 🧩 Bruno Bahiense — Portfolio

My personal site: an interface that shows how I build software instead of describing it.

**Live app:** [bluis.vercel.app](https://bluis.vercel.app/)

![Bruno Bahiense portfolio screenshot](docs/screenshot.png)

A bilingual (PT/EN) portfolio built like a product. A ⌘K Spotlight searches the site's own content, a hero panel assembles different products from the same components, and an Inspect mode reveals the components, design tokens and real build numbers behind the interface.

## Features

- **Spotlight (⌘K)** — keyboard-first search over sections, projects, roles, technologies and frequent questions; local and instant, with no AI and no per-use cost.
- **LiveBuild** — dashboard, report, automation, support and deals interfaces assembling in a loop; tilts in layers with the mouse and pauses when off-screen.
- **Inspect mode** — outlines every component, shows live size, padding and radius on hover, plus the design tokens and the build's version, commit and test results.
- **Micro-interactions** — magnetic buttons, squircle ripples, cursor-following card highlights and count-up metrics, all disabled under `prefers-reduced-motion`.
- **Bilingual by route** — `/pt` and `/en`, chosen by cookie or `Accept-Language`, with every string in typed locale files.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Components, Turbopack)
- [React 19](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- CSS Modules with design tokens in CSS custom properties (squircle corners via `corner-shape`)
- [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)

No state management or UI library — Server Components for content and a few small client islands.

## Getting started

Requires Node.js 20+ and Yarn.

```bash
git clone https://github.com/brunolbahiense/bluis.git
cd bluis
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script          | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `yarn dev`      | Start the development server                                 |
| `yarn build`    | Run unit tests, write build info and build for production    |
| `yarn start`    | Serve the production build                                   |
| `yarn lint`     | Run lint checks                                              |
| `yarn test`     | Run unit tests                                               |
| `yarn test:e2e` | Run end-to-end tests against `yarn start` (run `yarn build` first) |

## Project structure

```
src/
├── app/          # routes: /[locale] layout, page, not-found and OG image
├── components/   # one folder per component: index.tsx + styles.module.css
├── contexts/     # Spotlight and Inspector state
├── hooks/        # pointer, motion, hotkey and visibility hooks
├── lib/          # search, Spotlight catalog, locale choice, build info
├── locales/      # every string and data list, in pt and en
├── styles/       # design tokens, global styles and fonts
└── proxy.ts      # redirects to /pt or /en
scripts/          # prebuild: runs tests and writes build info
tests/e2e/        # Playwright
```

## Author

Made by **Bruno Bahiense** — [GitHub](https://github.com/brunolbahiense) · [LinkedIn](https://www.linkedin.com/in/brunolbahiense/)
````

- [ ] **Step 3: Auditoria de dependências de runtime**

Run: `yarn audit --groups dependencies --level high; echo "exit: $?"`
Expected: nenhuma vulnerabilidade alta ou crítica em `dependencies` (o `yarn audit` retorna código ≠ 0 só se encontrar). Se aparecer alguma no `next`, atualize para o patch mais recente da 16.4 e rode tudo de novo.

- [ ] **Step 4: Verificação completa**

Run: `yarn lint && yarn typecheck && yarn test && yarn build && yarn test:e2e`
Expected: tudo verde.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/screenshot.png
git commit -m "docs: README no padrão do portfólio com screenshot

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: Nova convenção no `portfolio-standards`

**Files (outro repositório, `~/Code/portfolio-standards`):**
- Create: `conventions/stacks/nextjs-css-modules.md`
- Modify: `conventions/project-structure.md`

- [ ] **Step 1: Escrever `conventions/stacks/nextjs-css-modules.md`**

````md
# Stack: Next.js + TypeScript + CSS Modules

Convenções extraídas do [bluis](https://github.com/brunolbahiense/bluis), portfólio pessoal. Complementam as [convenções core](../core.md). Variação da stack [Next.js + styled-components](nextjs-styled-components.md) para projetos com conteúdo majoritariamente estático, em que Server Components valem mais que CSS-in-JS.

## Stack base

- Next.js 16+ (App Router) + React 19
- TypeScript em modo `strict`
- CSS Modules (`styles.module.css`) + tokens em CSS custom properties — sem biblioteca de estilo
- Server Components para conteúdo; ilhas de cliente (`'use client'`) só onde há interação
- Vitest (unidade) + Playwright (e2e)
- Node.js >= 20 e Yarn

## Componentes

```
src/components/<Nome>/
├── index.tsx           # o componente
└── styles.module.css   # estilos do componente
```

- Estilos importados como `import S from './styles.module.css'` e usados como `className={S.hero}`.
- `export default function <Nome>({ t }: Props)` — textos chegam por props, já recortados do locale.
- Nenhuma cor, fonte, raio ou sombra fixa no CSS do componente: sempre `var(--…)` de `styles/tokens.css`.
- Cantos squircle: raios em tokens (`--radius-sm/md/lg`) e `corner-shape: squircle` global dentro de `@supports`.
- Componentes inspecionáveis levam `data-component="<Nome />"` e `position: relative`.

## Estrutura

```
src/
├── proxy.ts        # i18n: redireciona para /pt ou /en e grava cookie
├── app/[locale]/   # layout raiz, page, not-found, opengraph-image
├── components/
├── contexts/       # só estado global real (ex.: Spotlight, Inspector)
├── hooks/          # use<Coisa>.ts
├── lib/            # lógica pura e testada (busca, idioma, build info)
├── locales/        # types.ts, pt.ts, en.ts, index.ts
└── styles/         # tokens.css, global.css, fonts.ts
```

## Internacionalização por rota

- `/pt` e `/en` estáticas (`generateStaticParams` + `dynamicParams = false`).
- `proxy.ts`: cookie `locale` > `Accept-Language` > `pt`.
- `page.tsx` chama `getTranslations(locale)` e passa a cada seção o seu trecho (`t`).
- `locales/types.ts` define o contrato; `pt.ts` e `en.ts` são tipados por ele, e um teste de paridade garante as mesmas chaves e tamanhos de listas.

## Qualidade

- Lógica pura em `lib/` com testes Vitest colocados ao lado (`*.test.ts`).
- E2E com Playwright contra o build de produção.
- `prebuild` roda os testes e grava `src/generated/build-info.json` (versão, commit, data, testes): o build falha se um teste falhar.
- CI no GitHub Actions: lint, typecheck, test, build, e2e.
- `prefers-reduced-motion` desliga toda animação.
````

- [ ] **Step 2: Citar a variação em `conventions/project-structure.md`**

Logo depois do parágrafo "Estrutura de referência (extraída do tomatracker)…", acrescentar:

```md
> Variação com CSS Modules e Server Components (extraída do bluis): [`stacks/nextjs-css-modules.md`](stacks/nextjs-css-modules.md). A estrutura muda em três pontos: `styles.module.css` no lugar de `styles.ts`, `proxy.ts` + `app/[locale]/` para i18n por rota, e `lib/` para lógica pura testada.
```

- [ ] **Step 3: Commit no repositório de padrões (sem push)**

```bash
cd ~/Code/portfolio-standards
git add conventions/stacks/nextjs-css-modules.md conventions/project-structure.md
git commit -m "docs: convenção de stack Next.js + CSS Modules extraída do bluis

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
cd -
```

---

## Fora deste plano (pedir ao Bruno)

- `git push` da branch `redesign` e abertura do PR.
- Deploy: a Vercel builda a partir do push. Confirmar que o projeto lá usa Node 22, já que o `prebuild` roda os testes.
- Ajuste fino da fraseologia nos locales (combinado para depois).
