import Link from 'next/link'
import * as S from './styles'
import Button from 'components/Button'
import Wrapper from 'components/Wrapper'

export default function Projects() {
  return (
    <Wrapper background="black">
      <S.Title>Projetos</S.Title>
      <S.Subtitle>Quer conhecer o meu trabalho?</S.Subtitle>
      <S.Description>
        Aqui estão alguns projetos que fiz ao longo do meu percurso!
      </S.Description>
      <S.Sites>
        <S.SiteIcon>
          <S.ClickTrips />
          <Link href="https://bluis-trips.vercel.app">
            <div>
              <Button text="Bluis Trips" />
            </div>
          </Link>
        </S.SiteIcon>
        <S.SiteIcon>
          <S.ClickToma />
          <Link href="https://tomatracker.vercel.app/">
            <div>
              <Button text="Tomatracker" />
            </div>
          </Link>
        </S.SiteIcon>
      </S.Sites>
    </Wrapper>
  )
}
