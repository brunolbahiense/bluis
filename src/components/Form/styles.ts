import styled from 'styled-components'

export const Form = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.white};
  color: ${(props) => props.theme.blue};
  height: 18em;
  width: 12em;
  padding: 1.6em 2em;
  border-radius: 0.2em;
  font-size: 3em;
`
export const Title = styled.h1`
  font-size: 4em;
  margin: 1em;
`
export const FormLabel = styled.label`
  display: flex;
  margin-bottom: 0.1em;
  font-weight: 500;
`
export const FormInput = styled.input`
  display: flex;
  width: 100%;
  margin-bottom: 1em;
  border: none;
  background-color: ${(props) => props.theme.white};
  border-bottom: 2px solid ${(props) => props.theme.blueL};
`
export const FormButton = styled.button`
  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.theme.blueL};
  padding: 0.8em 1em;
  border: none;
  border-radius: 0.2em;
  font-size: 0.6em;
`
