import * as S from './styles'

export interface WrapperProps {
  background?: 'blue' | 'white'
  children?: React.ReactNode
}
const Wrapper = ({ background = 'blue', ...props }: WrapperProps) => {
  return <S.Wrapper {...props} background={background} />
}

export default Wrapper
