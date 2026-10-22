import S from './styles.module.css'

export default function Toast({
  message,
  isVisible
}: {
  message: string
  isVisible: boolean
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={S.toast}
      data-visible={isVisible}
    >
      {message}
    </div>
  )
}
