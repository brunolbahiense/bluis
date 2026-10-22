'use client'

import useReducedMotion from 'hooks/useReducedMotion'
import useTypewriter from 'hooks/useTypewriter'
import type { FrequentQuestion, Translations } from 'locales'
import AnswerWidget from './AnswerWidget'
import S from './styles.module.css'

type Props = {
  question: FrequentQuestion
  projects: Translations['projects']
  backLabel: string
}

// Remontado com key={question.id}: a digitação recomeça a cada pergunta.
export default function SpotlightAnswer({
  question,
  projects,
  backLabel
}: Props) {
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
