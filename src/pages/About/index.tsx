import * as S from '../../components/template/About/styles'
import Wrapper from 'components/Wrapper'

export default function About() {
  return (
    <>
      <Wrapper background="white">
        <S.Organizer id="About">
          <S.Card>
            <S.Title>Sobre nós</S.Title>
            <S.ImgOrganizer>
              <S.Icon src="/img/afro.svg" />
              <S.Icon src="/img/beard.svg" />
              <S.Icon src="/img/female.svg" />
            </S.ImgOrganizer>
            <S.Description>
              Somos uma empresa Tech com o foco em construir uma imagem digital
              de maneira ágil e descompliada, transormando a sua ideia em um
              negócio sem barreiras fisicas!
            </S.Description>
          </S.Card>

          <S.Card>
            <S.Title>Inovação em nosso DNA</S.Title>
            <S.Icon src="/img/DNA.svg" />
            <S.Description>
              Entendemos que a web está em constante evolução; desta forma,
              construimos soluções com as mais novas tecnologias do mercado,
              entregando sempre um produto autualizado e pronto para sustentar
              seus proximos passos
            </S.Description>
          </S.Card>
        </S.Organizer>
      </Wrapper>
    </>
  )
}
