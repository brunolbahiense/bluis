import styled from 'styled-components'

export const Sites = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  @media only screen and (max-width: 1080px) {
    display: flex;
    flex-direction: column;
  }
`

export const Logo = styled.img`
  width: min(45rem, 100%);
  margin-bottom: 2rem;
`

export const Description = styled.h2`
  font-size: 2.5rem;
  font-weight: 400;
`
export const Title = styled.h1`
  font-size: 4rem;
`

export const ClickTrips = styled.div`
  background-image: url(../img/trips.png);
  width: 50em;
  height: 50em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6em;
  border-radius: 10px;
  @media only screen and (max-width: 1080px) {
    width: 20em;
    height: 20em;
    margin: 3em;
  }
`
export const ClickToma = styled.div`
  background-image: url(../img/tomatracker.png);
  width: 50em;
  height: 50em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6em;
  border-radius: 10px;
  @media only screen and (max-width: 1080px) {
    width: 20em;
    height: 20em;
    margin: 3em;
  }
`
