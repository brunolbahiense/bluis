import styled from 'styled-components'

export const Title = styled.h1`
  font-size: 4rem;
  color: ${(props) => props.theme.red};
  text-transform: uppercase;
`

export const Subtitle = styled.h2`
  font-size: 2.5em;
`
export const Description = styled.p`
  font-size: 2em;
`

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

export const ClickTrips = styled.div`
  background-image: url('../img/trips.png');
  background-position: center;
  width: 30em;
  height: 30em;
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
  background-image: url('../img/tomatracker.png');
  background-position: center;
  width: 30em;
  height: 30em;
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
