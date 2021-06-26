import * as S from './styles'
import SocialMedia from 'components/Social'

const Main = () => (
  <S.Wrapper>
    <S.Logo src="/img/Bluis.svg" alt="Bluis escrito entre os síbolos < >" />
    <S.Description>Redes Sociais</S.Description>
    <SocialMedia />
  </S.Wrapper>
)

export default Main
