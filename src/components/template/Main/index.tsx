import * as S from './styles'
import Wrapper from 'components/Wrapper'

export default function Main() {
  return (
    <Wrapper>
      <S.Content>
        <S.RightDiv>
          <S.Logo
            src="/img/Bluis.svg"
            alt="Bluis escrito entre os síbolos < >"
          />
          <S.Description>Desenvolvendo o seu futuro</S.Description>
        </S.RightDiv>
        <S.LeftDiv>
          <S.Profile src="/img/profile.jpg" />
        </S.LeftDiv>
      </S.Content>
    </Wrapper>
  )
}
