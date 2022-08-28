import * as S from './styles'
import Link from 'next/link'

const Header = () => (
  <S.Header>
    <div>
      <Link href="#">
        <S.Icon src="/img/logow.svg" alt="logo da empresa Bluis" />
      </Link>
    </div>
    <S.Navigation>
      <Link href="#About">
        <S.NavItems>Sobre mim</S.NavItems>
      </Link>
      <Link href="#Projects">
        <S.NavItems>Projetos</S.NavItems>
      </Link>
    </S.Navigation>
  </S.Header>
)

export default Header
