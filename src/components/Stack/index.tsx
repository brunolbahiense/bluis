import TiltCard from 'components/TiltCard'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = {
  title: string
  groups: Translations['experience']['stackGroups']
}

export default function Stack({ title, groups }: Props) {
  return (
    <div className={S.stack} data-component="<Stack />">
      <h3 className={S.title}>{title}</h3>
      <div className={S.groups}>
        {groups.map((group) => (
          <TiltCard
            key={group.name}
            className={S.group}
            component="<StackGroup />"
          >
            <h4 className={S.groupName}>{group.name}</h4>
            <ul className={S.tags}>
              {group.items.map((item) => (
                <li key={item} className={S.tag}>
                  {item}
                </li>
              ))}
            </ul>
          </TiltCard>
        ))}
      </div>
    </div>
  )
}
