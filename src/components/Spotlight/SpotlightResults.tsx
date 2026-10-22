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

export default function SpotlightResults({
  entries,
  activeIndex,
  groupLabels,
  onHover,
  onSelect
}: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  return (
    <div ref={listRef} id={resultsListId} role="listbox" className={S.list}>
      {entries.map((entry, index) => {
        const startsGroup =
          index === 0 || entries[index - 1].group !== entry.group
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
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(entry)}
            >
              <span
                className={S.optionIcon}
                data-question={entry.group === 'questions'}
              >
                <SpotlightEntryIcon icon={entry.icon} />
              </span>
              <span className={S.optionText}>
                <b className={S.optionTitle}>{entry.title}</b>
                {entry.subtitle && (
                  <span className={S.optionSubtitle}>{entry.subtitle}</span>
                )}
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
