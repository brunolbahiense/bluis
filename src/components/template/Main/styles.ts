import styled, { keyframes } from 'styled-components'

const slide = keyframes`
  from{
    transform: translateX(-5em);
    opacity: 1;
  }
  to{
    transform: translateX(0)
    opacity: 0;
  }
`

export const Logo = styled.img`
  width: min(45rem, 100%);
  margin-bottom: 2rem;
`
export const Code = styled.img`
  width: min(70rem, 100%);
  margin-bottom: 2rem;
  animation: ${slide} 2.5s;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`

export const Description = styled.h2`
  font-size: 2.5rem;
  font-weight: 400;
`
export const RightDiv = styled.div`
  animation: ${slide} 2.5s;
`
export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
