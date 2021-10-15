import Link from 'next/link'
import * as S from '../../styles/Main'
import Button from 'components/Button'

export default function Portfolio() {
  return (
    <>
      <S.WrapperW>
        <S.Title>My Projects</S.Title>
        <S.Description>
          These are the main projects developed by me:
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
            <Link href="https://bluis.vercel.app">
              <div>
                <Button text="Tomatracker" />
              </div>
            </Link>
          </S.ClickToma>
        </S.Sites>
      </S.WrapperW>
    </>
  )
}
