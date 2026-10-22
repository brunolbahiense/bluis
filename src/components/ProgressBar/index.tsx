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
