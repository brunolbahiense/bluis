import styled from 'styled-components'

export const Title = styled.h1`
  font-size: 6em;
  color: ${(props) => props.theme.green};
  text-transform: uppercase;
`

export const Subtitle = styled.h2`
  font-size: 4em;
`
export const Description = styled.p`
  font-size: 3em;
`

export const Sites = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5em;
  margin: 3em 0;
  text-align: center;
  @media only screen and (max-width: 1080px) {
    display: flex;
    flex-direction: column;
  }
`
export const SiteIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const ClickTrips = styled.div`
  background-image: url('../img/trips.png');
  background-position: center;
  width: 22em;
  height: 22em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  @media only screen and (max-width: 1080px) {
    width: 20em;
    height: 20em;
  }
`
export const ClickToma = styled.div`
  background-image: url('../img/tomatracker.png');
  background-position: center;
  width: 22em;
  height: 22em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  @media only screen and (max-width: 1080px) {
    width: 20em;
    height: 20em;
  }
`
