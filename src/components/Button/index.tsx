import * as S from './styles'

interface ButtonProps {
  text: string
}

const Button = (props: ButtonProps) => <S.Button>{props.text}</S.Button>

export default Button
