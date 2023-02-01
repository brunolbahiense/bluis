import styled from 'styled-components'

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 3em 20em;
  background-color: #fff;

  @media only screen and (max-width: 768px) {
    padding: 3em;
  }
`
export const Icon = styled.img`
  width: 10rem;
  cursor: pointer;
`
