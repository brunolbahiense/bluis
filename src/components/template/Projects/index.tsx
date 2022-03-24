import Link from 'next/link'
import * as S from '../../../styles/Main'
import Button from 'components/Button'
import Wrapper from 'components/Wrapper'

export default function Projects() {
  return (
    <>
      <Wrapper>
        <S.Title id="Projects">Projetos</S.Title>
        <S.Description>
          Estes são os projetos que estão sendo desenvolvidos por nós:
        </S.Description>
        <S.Sites>
          <S.ClickTrips>
            <Link href="https://bluis-trips.vercel.app">
              <div>
                <Button text="Bluis Trips" />
              </div>
            </Link>
          </S.ClickTrips>
          <S.ClickToma>
            <Link href="https://tomatracker.vercel.app/">
              <div>
                <Button text="Tomatracker" />
              </div>
            </Link>
          </S.ClickToma>
        </S.Sites>
      </Wrapper>
    </>
  )
}
