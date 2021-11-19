import styled from 'styled-components'
import { WrapperProps } from '.'

export const Wrapper = styled.main<WrapperProps>`
  color: ${(props) => props.theme.white};
  width: 100%;
  height: 100%;
  padding: 3rem;
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
    height: 105%;
  }

  ${(props) =>
    props.background === 'white' &&
    `background: ${props.theme.white};
    color: ${props.theme.blue};
  `};
  ${(props) =>
    props.background === 'blue' &&
    `background: ${props.theme.blue};
    color: ${props.theme.white};
  `};
`
