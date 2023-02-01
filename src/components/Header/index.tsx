import * as S from './styles'
import Link from 'next/link'

const Header = () => (
  <S.Header>
    <Link href="#">
      <S.Icon src="/img/logo.svg" alt="logo da empresa Bluis" />
    </Link>
  </S.Header>
)

export default Header
