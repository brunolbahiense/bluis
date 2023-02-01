import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 1em 0;
`

export const Profile = styled.div`
  width: 50em;
  background: url(/img/profile.jpg);
  margin-bottom: 2rem;
  border-radius: 10px;
  height: 60em;
  background-size: cover;
`

export const TextWrapper = styled.div`
  height: 60em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 2em;
`

export const Title = styled.h1`
  font-size: 5em;
  font-weight: 700;
  color: ${(props) => props.theme.red};
  text-transform: uppercase;
`
export const Name = styled.h2`
  font-size: 5em;
  font-weight: 700;
  background-color: ${(props) => props.theme.black};
  color: ${(props) => props.theme.white};
  padding: 0.3em;
  margin: 0.5em 0;
  text-transform: uppercase;
`
export const Description = styled.p`
  font-size: 2em;
  text-align: start;
  width: 20em;
`
