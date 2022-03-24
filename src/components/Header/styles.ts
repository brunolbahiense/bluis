import styled from 'styled-components'

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${(props) => props.theme.blue};
  color: ${(props) => props.theme.white};
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  position: fixed;
  z-index: 1;

  @media only screen and (max-width: 768px) {
    border: none;
    box-shadow: none;
    overflow: hidden;
    margin: unset;
    width: 100%;
    font-size: 1em;
  }
`
export const Icon = styled.img`
  margin: 1rem;
  width: 10rem;
  cursor: pointer;
`
export const Navigation = styled.div`
  display: flex;
  flex-direction: row;
`
export const NavItems = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.white};
  font-size: 2em;
  font-weight: 400;
  margin-left: 2em;
  cursor: pointer;
  :hover {
    color: ${(props) => props.theme.gray};
  }
  @media only screen and (max-width: 768px) {
    margin-left: 1em;
  }
`
export const NavIndicator = styled.h1`
  font-weight: 700;
  margin-left: 2em;
  color: #dedede;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`
