import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1em 0;
`

export const Title = styled.h1`
  font-size: 6em;
  font-weight: 700;
  color: ${(props) => props.theme.red};
  text-transform: uppercase;
`
export const Subtitle = styled.h2`
  font-size: 4em;
  font-weight: 700;
  padding: 0.3em;
`

export const Partners = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 5em;
  margin: 2em 0;
`
export const PartnersImg = styled.img`
  width: 18em;
`

export const Salt = styled.img`
  width: 35em;
`
