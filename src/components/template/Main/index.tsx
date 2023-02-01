import * as S from './styles'
import Wrapper from 'components/Wrapper'

export default function Main() {
  return (
    <Wrapper background="white">
      <S.Content>
        <S.Profile />
        <S.TextWrapper>
          <S.Title>Olá! eu sou o:</S.Title>
          <S.Name>Bruno Luis Bahiense</S.Name>
          <S.Description>
            Sommelier de café e entusiasta de Cloud, Crypto & Blockchain
            <br />
            <br />
            Atualmente trabalho no desenvolvimento full-stack, criando portais e
            plataformas que recuperam o crédito de pessoas físicas e juridicas
            de forma descomplicada e intuitiva.
          </S.Description>
        </S.TextWrapper>
      </S.Content>
    </Wrapper>
  )
}
