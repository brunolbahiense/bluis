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
    ogTagline:
      'Construo produtos com IA — bonitos, seguros e em evolução contínua.'
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
      {
        name: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'JavaScript']
      },
      {
        name: 'Backend',
        items: ['Node.js', 'Express', 'GraphQL', 'APIs REST']
      },
      { name: 'Dados', items: ['MongoDB', 'Redis', 'ElasticSearch'] },
      {
        name: 'Infra & CI/CD',
        items: ['AWS', 'Docker', 'Jenkins', 'EasyPanel']
      },
      {
        name: 'IA & Automação',
        items: ['LLMs', 'MCP', 'n8n', 'Airtable', 'Mautic']
      }
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
        keywords: [
          'ia',
          'ai',
          'llm',
          'llms',
          'mcp',
          'automação',
          'agente',
          'agentes',
          'n8n',
          'inteligência'
        ],
        answer:
          'Uso IA no produto — LLMs e MCPs integrados às plataformas — e no processo, automatizando fluxos com n8n para o time entregar mais com menos trabalho manual. Sempre com uma pessoa revisando as decisões que importam.',
        widget: {
          type: 'chips',
          items: [
            'LLMs',
            'MCP',
            'n8n',
            'Agentes com ferramentas',
            'Automação de atendimento'
          ]
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
        keywords: [
          'stack',
          'tecnologia',
          'tecnologias',
          'react',
          'node',
          'next',
          'typescript',
          'aws',
          'docker',
          'ferramentas'
        ],
        answer:
          'Ponta a ponta, do front à infraestrutura — e IA no meio de tudo.',
        widget: {
          type: 'rows',
          items: [
            { label: 'Frontend', status: 'React · Next.js · TypeScript' },
            { label: 'Backend', status: 'Node.js · Express · GraphQL' },
            {
              label: 'Dados & Infra',
              status: 'MongoDB · Redis · AWS · Docker'
            },
            { label: 'IA & Automação', status: 'LLMs · MCP · n8n' }
          ]
        }
      },
      {
        id: 'projects',
        question: 'Mostre seus projetos',
        subtitle: 'projetos pessoais públicos',
        keywords: [
          'projeto',
          'projetos',
          'portfólio',
          'trabalhos',
          'trips',
          'tomatracker',
          'github'
        ],
        answer:
          'Dois projetos pessoais públicos. O resto do meu trabalho roda em produção, com dados de clientes que não posso mostrar.',
        widget: { type: 'projects' }
      }
    ],
    sections: [
      {
        id: 'experience',
        title: 'Experiência',
        subtitle: 'jul 2022 → hoje · 3 cargos'
      },
      {
        id: 'projects',
        title: 'Projetos',
        subtitle: 'Bluis Trips, Tomatracker'
      },
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
    empty: {
      title: 'Não encontrei isso aqui. Quer me mandar um e-mail?',
      action: 'Copiar e-mail'
    },
    footer: {
      navigate: 'navegar',
      open: 'abrir',
      close: 'fechar',
      note: 'busca no conteúdo deste site'
    },
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
      reply:
        'Encontrei: sai para entrega hoje até 18h. Te aviso quando chegar ✓',
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
    typographyItems: [
      'Fraunces 300/500 · títulos',
      'Inter 400/500/600 · texto',
      'JetBrains Mono · rótulos'
    ],
    rendering: 'Renderização',
    renderingValue:
      'Server Components + ilhas: Spotlight, LiveBuild, Inspector',
    build: 'Saúde do build',
    version: 'versão',
    commit: 'commit',
    builtAt: 'build',
    tests: 'testes',
    testsValue: '{passed}/{total} passaram',
    tipPadding: 'padding',
    tipRadius: 'raio'
  },
  notFound: {
    title: 'Página não encontrada',
    body: 'O endereço que você abriu não existe aqui.',
    back: 'Voltar para o início'
  }
}

export default pt
