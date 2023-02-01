import styled from 'styled-components'
import { WrapperProps } from '.'

export const Wrapper = styled.main<WrapperProps>`
  color: ${(props) => props.theme.white};
  width: 100%;
  height: auto;
  padding: 4em;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 768px) {
    border: none;
    box-shadow: none;
    overflow: hidden;
    margin: unset;
    width: 100%;
  }

  ${(props) =>
    props.background === 'white' &&
    `background: ${props.theme.white};
    color: ${props.theme.blue};
  `};

  ${(props) =>
    props.background === 'red' &&
    `background: ${props.theme.red};
    color: ${props.theme.whiteD};
  `};

  ${(props) =>
    props.background === 'black' &&
    `background: ${props.theme.black};
    color: ${props.theme.whiteD};
  `};
`
