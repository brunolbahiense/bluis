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
    groups: {
      questions: string
      goTo: string
      actions: string
      content: string
    }
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
    dashboard: {
      kind: string
      title: string
      kpiLabel: string
      delta: string
      cta: string
      success: string
    }
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
    deals: {
      kind: string
      title: string
      kpiLabel: string
      discount: string
      cta: string
      success: string
    }
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
