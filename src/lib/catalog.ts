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

export type CatalogSource = Pick<
  Translations,
  'spotlight' | 'projects' | 'experience' | 'contact'
>

function socialUrl(contact: Translations['contact'], id: SocialId) {
  return contact.socials.find((social) => social.id === id)?.href ?? ''
}

export function buildCatalog({
  spotlight,
  projects,
  experience,
  contact
}: CatalogSource): SpotlightEntry[] {
  const { kinds, actions } = spotlight

  const questions = spotlight.questions.map((question): SpotlightEntry => ({
    id: `question-${question.id}`,
    title: question.question,
    subtitle: question.subtitle,
    keywords: question.keywords,
    group: 'questions',
    kind: kinds.question,
    icon: 'question',
    action: { kind: 'answer', questionId: question.id },
    showWhenEmpty: true
  }))

  const sections = spotlight.sections.map((section): SpotlightEntry => ({
    id: `section-${section.id}`,
    title: section.title,
    subtitle: section.subtitle,
    group: 'goTo',
    kind: kinds.section,
    icon: 'section',
    action: { kind: 'scroll', sectionId: section.id },
    showWhenEmpty: true
  }))

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

  const projectEntries = projects.items.map((project): SpotlightEntry => ({
    id: `project-${project.name}`,
    title: project.name,
    subtitle: project.description,
    group: 'content',
    kind: kinds.project,
    icon: 'project',
    action: { kind: 'openUrl', url: project.href },
    showWhenEmpty: false
  }))

  const roleEntries = experience.items.map((item): SpotlightEntry => ({
    id: `role-${item.period}`,
    title: item.role,
    subtitle: item.period,
    group: 'content',
    kind: kinds.role,
    icon: 'role',
    action: { kind: 'scroll', sectionId: 'experience' },
    showWhenEmpty: false
  }))

  const technologyEntries = experience.stackGroups.flatMap((group) =>
    group.items.map((technology): SpotlightEntry => ({
      id: `technology-${technology}`,
      title: technology,
      subtitle: group.name,
      group: 'content',
      kind: kinds.technology,
      icon: 'technology',
      action: { kind: 'scroll', sectionId: 'experience' },
      showWhenEmpty: false
    }))
  )

  return [
    ...questions,
    ...sections,
    ...commands,
    ...projectEntries,
    ...roleEntries,
    ...technologyEntries
  ]
}

export function visibleEntries(catalog: SpotlightEntry[], query: string) {
  if (!query.trim()) return catalog.filter((entry) => entry.showWhenEmpty)
  return searchEntries(catalog, query)
}

export function emptyStateEntry(
  spotlight: Translations['spotlight'],
  email: string
): SpotlightEntry {
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
