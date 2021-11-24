import styled from 'styled-components'

export const Button = styled.div`
  width: 6.5em;
  font-size: 2.5rem;
  font-weight: 400;
  padding: 1.5rem;
  background-color: ${(props) => props.theme.blue};
  color: #eee;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin: 2em;

  :hover {
    background-color: ${(props) => props.theme.gray};
  }
`
