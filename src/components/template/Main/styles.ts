import styled, { keyframes } from 'styled-components'

const slide = keyframes`
  from{
    transform: translateX(5em);
    opacity: 1;
  }
  to{
    transform: translateX(0);
    opacity: 0;
  }
`

export const Logo = styled.img`
  width: min(45em, 100%);
  margin-bottom: 2rem;
`
export const Profile = styled.img`
  width: min(40em, 100%);
  margin-bottom: 2rem;
  border-radius: 15px;
  animation: ${slide} 2.5s;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`

export const Description = styled.h2`
  font-size: 2.5rem;
  font-weight: 400;
`
export const RightDiv = styled.div``
export const LeftDiv = styled.div`
  width: 50vw;
`
export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100vh;
`
