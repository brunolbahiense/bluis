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
          <S.Description>Developing your future</S.Description>
        </S.RightDiv>
        <S.Code src="/img/carbon.svg" />
      </S.Content>
    </Wrapper>
  )
}
