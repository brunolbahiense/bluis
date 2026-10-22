'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useInspector } from 'contexts/InspectorContext'
import { useSpotlight } from 'contexts/SpotlightContext'
import { useHotkey } from 'hooks/useHotkey'
import useReducedMotion from 'hooks/useReducedMotion'
import {
  buildCatalog,
  emptyStateEntry,
  visibleEntries,
  type SpotlightEntry
} from 'lib/catalog'
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
  const results = useMemo(
    () => visibleEntries(catalog, query),
    [catalog, query]
  )
  const isEmpty = results.length === 0
  const entries = isEmpty ? [emptyStateEntry(t, contact.email)] : results
  const selectedIndex = Math.min(activeIndex, entries.length - 1)
  const question = answerId
    ? (t.questions.find((item) => item.id === answerId) ?? null)
    : null

  async function run(entry: SpotlightEntry) {
    const { action } = entry
    switch (action.kind) {
      case 'answer':
        setAnswerId(action.questionId)
        return
      case 'scroll':
        close()
        document
          .getElementById(action.sectionId)
          ?.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' })
        return
      case 'copyEmail': {
        const copied = await copyText(contact.email)
        notify(
          copied
            ? t.toasts.emailCopied
            : t.toasts.copyFailed.replace('{email}', contact.email)
        )
        close()
        return
      }
      case 'openUrl':
        window.open(action.url, '_blank', 'noopener,noreferrer')
        close()
        return
      case 'switchLanguage':
        window.location.assign(
          new URL(
            `/${otherLocale(locale)}${window.location.hash}`,
            window.location.origin
          )
        )
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
          aria-controls={question ? undefined : resultsListId}
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
        <SpotlightAnswer
          key={question.id}
          question={question}
          projects={projects}
          backLabel={t.back}
        />
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
          <kbd className={S.kbd}>↑</kbd> <kbd className={S.kbd}>↓</kbd>{' '}
          {t.footer.navigate}
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
