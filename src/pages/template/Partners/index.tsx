import * as S from './styles'
import Wrapper from 'components/Wrapper'

export default function Main() {
  return (
    <Wrapper background="white">
      <S.Content>
        <S.Title>Parceiros</S.Title>
        <S.Subtitle>
          Estas são algumas empresas que trabalharam comigo
        </S.Subtitle>
        <S.Partners>
          <S.PartnersImg src="/img/partners/logoBP.png" />
          <S.Salt src="/img/partners/logo_salt.png" />
          <S.PartnersImg src="/img/partners/logoFuja.svg" />
        </S.Partners>
      </S.Content>
    </Wrapper>
  )
}
