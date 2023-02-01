import * as S from './styles'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <S.Footer>
        <S.ContactDiv>
          <S.Title>Portifolio criado por:</S.Title>
          <Link href="https://bluis.vercel.app/">
            <S.Name>{'<B/uis>'}</S.Name>
          </Link>
        </S.ContactDiv>
        <S.LinkDiv>
          <S.Title>Redes Sociais</S.Title>
          <S.IconsDiv>
            <Link href="http://github.com/brunolbahiense">
              <S.Icons src="/img/github.png" />
            </Link>
            <Link href="https://www.linkedin.com/in/brunolbahiense/">
              <S.Icons src="/img/linkedin.png" />
            </Link>
            <Link href="https://www.instagram.com/brunolbahiense/">
              <S.Icons src="/img/instagram.png" />
            </Link>
          </S.IconsDiv>
        </S.LinkDiv>
      </S.Footer>
    </>
  )
}
