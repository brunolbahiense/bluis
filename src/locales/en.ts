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
    ogTagline:
      'I build products with AI — beautiful, secure and always evolving.'
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
      {
        name: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'JavaScript']
      },
      {
        name: 'Backend',
        items: ['Node.js', 'Express', 'GraphQL', 'REST APIs']
      },
      { name: 'Data', items: ['MongoDB', 'Redis', 'ElasticSearch'] },
      {
        name: 'Infra & CI/CD',
        items: ['AWS', 'Docker', 'Jenkins', 'EasyPanel']
      },
      {
        name: 'AI & Automation',
        items: ['LLMs', 'MCP', 'n8n', 'Airtable', 'Mautic']
      }
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
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/brunolbahiense'
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/brunolbahiense/'
      },
      {
        id: 'instagram',
        label: 'Instagram',
        href: 'https://www.instagram.com/brunolbahiense/'
      }
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
        keywords: [
          'ai',
          'llm',
          'llms',
          'mcp',
          'automation',
          'agent',
          'agents',
          'n8n',
          'artificial',
          'intelligence'
        ],
        answer:
          'I use AI in the product — LLMs and MCPs built into the platforms — and in the process, automating workflows with n8n so the team ships more with less manual work. Always with a person reviewing the decisions that matter.',
        widget: {
          type: 'chips',
          items: [
            'LLMs',
            'MCP',
            'n8n',
            'Agents with tools',
            'Customer service automation'
          ]
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
        keywords: [
          'stack',
          'technology',
          'technologies',
          'react',
          'node',
          'next',
          'typescript',
          'aws',
          'docker',
          'tools'
        ],
        answer:
          'End to end, from front end to infrastructure — with AI in the middle of it all.',
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
        keywords: [
          'project',
          'projects',
          'portfolio',
          'work',
          'trips',
          'tomatracker',
          'github'
        ],
        answer:
          'Two public side projects. The rest of my work runs in production, with client data I cannot show.',
        widget: { type: 'projects' }
      }
    ],
    sections: [
      {
        id: 'experience',
        title: 'Experience',
        subtitle: 'Jul 2022 → now · 3 roles'
      },
      {
        id: 'projects',
        title: 'Projects',
        subtitle: 'Bluis Trips, Tomatracker'
      },
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
    empty: {
      title: "I couldn't find that here. Want to send me an e-mail?",
      action: 'Copy e-mail'
    },
    footer: {
      navigate: 'navigate',
      open: 'open',
      close: 'close',
      note: 'searches this site’s content'
    },
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
      reply:
        'Found it: out for delivery today by 6 pm. I’ll let you know when it arrives ✓',
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
    typographyItems: [
      'Fraunces 300/500 · headings',
      'Inter 400/500/600 · text',
      'JetBrains Mono · labels'
    ],
    rendering: 'Rendering',
    renderingValue:
      'Server Components + islands: Spotlight, LiveBuild, Inspector',
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
