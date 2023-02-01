import styled from 'styled-components'

export const Button = styled.div`
  width: 6.5em;
  font-size: 3em;
  padding: 0.2em;
  border: 2px solid ${(props) => props.theme.green};
  color: ${(props) => props.theme.green};
  border-radius: 15px;
  cursor: pointer;
  margin: 1em 0;

  :hover {
    color: ${(props) => props.theme.white};
    background-color: ${(props) => props.theme.green};
  }
`
