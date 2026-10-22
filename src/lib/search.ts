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
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
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
        (word.length >= minimumPartialKeywordLength &&
          normalizedKeyword.startsWith(word)) ||
        (normalizedKeyword.length >= minimumPartialKeywordLength &&
          word.startsWith(normalizedKeyword))
    )
  })
}

export function scoreEntry(entry: SearchEntry, rawQuery: string): number {
  const query = normalize(rawQuery)
  if (!query) return scores.none

  const title = normalize(entry.title)
  if (title.startsWith(query)) return scores.nameStart
  if (entry.keywords && matchesKeyword(entry.keywords, query))
    return scores.nameStart
  if (title.split(/[\s\-/·,.()?!]+/).some((word) => word.startsWith(query)))
    return scores.wordStart
  if (title.includes(query)) return scores.middle
  if (entry.subtitle && normalize(entry.subtitle).includes(query))
    return scores.middle
  return scores.none
}

export function searchEntries<Entry extends SearchEntry>(
  entries: Entry[],
  rawQuery: string
): Entry[] {
  if (!normalize(rawQuery)) return entries
  return entries
    .map((entry, position) => ({
      entry,
      position,
      score: scoreEntry(entry, rawQuery)
    }))
    .filter((result) => result.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score || first.position - second.position
    )
    .map((result) => result.entry)
}
