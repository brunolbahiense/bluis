import * as S from './styles'
import Link from 'next/link'

interface HeaderProps {
  title?: string
}

const Header = (props: HeaderProps) => (
  <S.Header>
    <div>
      <Link href="/">
        <S.Icon src="/img/logow.svg" alt="logo da empresa Bluis" />
      </Link>
    </div>
    <S.Navigation>
      <S.NavIndicator>{props.title}</S.NavIndicator>
      <Link href="/About">
        <S.NavItems>Quem somos</S.NavItems>
      </Link>
      <Link href="/Contact">
        <S.NavItems>Contato</S.NavItems>
      </Link>
    </S.Navigation>
  </S.Header>
)

export default Header
