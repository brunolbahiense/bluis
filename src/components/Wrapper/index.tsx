import * as S from './styles'

export interface WrapperProps {
  background?: 'white' | 'red' | 'black' | 'whiteD'
  children?: React.ReactNode
}
const Wrapper = ({ background = 'white', ...props }: WrapperProps) => {
  return <S.Wrapper {...props} background={background} />
}

export default Wrapper
