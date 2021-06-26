import * as S from './styles'

const Main = () => (
  <S.Wrapper>
    <S.Logo src="/img/Bluis.svg" alt="Bluis escrito entre os síbolos < >" />
    <S.Description>Redes Sociais</S.Description>
    <S.Links>
      <a href="https://github.com/brunolbahiense">
        <S.Icon src="/img/Github.png" />
      </a>
      <a href="https://www.linkedin.com/in/bruno-lu%C3%ADs-bahiense-de-sousa-almeida-73385a119/">
        <S.Icon src="/img/linkedin.png" />
      </a>
      <a href="https://www.instagram.com/brunolbahiense/">
        <S.Icon src="/img/instagram.png" />
      </a>
    </S.Links>
  </S.Wrapper>
)

export default Main
