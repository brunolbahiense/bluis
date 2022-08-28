import * as S from '../../components/template/About/styles'
import Wrapper from 'components/Wrapper'

export default function About() {
  return (
    <>
      <Wrapper background="white">
        <S.Organizer id="About">
          <S.Card>
            <S.Title>Oi, eu sou o Bruno!</S.Title>
            <S.ImgOrganizer>
              <S.Icon src="/img/beard.svg" />
            </S.ImgOrganizer>
            <S.Description>
              Sommelier de café e entusiasta de Cloud | Crypto | Blockchain
              Minimalista e fã de e-sports
            </S.Description>
          </S.Card>

          <S.Card>
            <S.Title>Tecnologia no DNA</S.Title>
            <S.Icon src="/img/DNA.svg" />
            <S.Description>
              Estudei direito na UFBA, porém descobri no meio deste caminho o
              amor pelo desenvolvimento, sempre fui fã de tecnologias e
              inovações, além de ser bastante curioso para aprender como as
              coisas funcionam.
              <br />
              Em 2017 fiz intercâmbio na Austrália com foco no teste acadêmico
              do IELTS, tornando-me fluente na língua da rainha, além de
              aprender a amar um bom Latte Macchiato.
              <br />
              Atualmente trabalho no desenvolvimento full-stack de soluções para
              empresas de médio e grande porte e tenho buscado cada vez mais
              explorar o desconhecido me aventurando nessas novas fronteiras do
              mundo digital.
            </S.Description>
          </S.Card>
        </S.Organizer>
      </Wrapper>
    </>
  )
}
