import * as S from '../styles/Main'
import SocialMedia from 'components/Social'

export default function Home() {
  return (
    <>
      <S.Wrapper>
        <S.Logo src="/img/Bluis.svg" alt="Bluis escrito entre os síbolos < >" />
        <S.Description>Soluções em Tech</S.Description>
      </S.Wrapper>
      <S.WrapperW>
        <h1>Meus Projetos</h1>
        <h2>Esses são os principais projetos desenvolvidos por mim:</h2>

        <h1>Bluis trips</h1>
        <h1>Tomatracker</h1>
      </S.WrapperW>
      <S.Wrapper>
        <S.Description>Siga-me nas redes Sociais</S.Description>
        <SocialMedia />
      </S.Wrapper>
    </>
  )
}
