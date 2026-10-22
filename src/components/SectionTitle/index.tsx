import S from './styles.module.css'

export default function SectionTitle({
  label,
  title
}: {
  label: string
  title: string
}) {
  return (
    <div className={S.sectionTitle}>
      <span className={S.label}>{label}</span>
      <h2 className={S.title}>{title}</h2>
    </div>
  )
}
