import Button from 'components/Button'
import * as S from './styles'

export default function Form() {
  async function handleOnSubmit(e) {
    e.preventDefault()
    const formData = {} //colect all the form data
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return
      formData[field.name] = field.value
    })
    fetch('/api/mail', {
      method: 'post',
      body: JSON.stringify(formData)
    })
    console.log(formData)
  }
  return (
    <>
      <S.Form>
        <form method="post" onSubmit={handleOnSubmit}>
          <p>
            <S.FormLabel htmlFor="name"></S.FormLabel>
            <S.FormInput type="text" name="name" placeholder="Nome" />
          </p>
          <p>
            <S.FormLabel htmlFor="email"></S.FormLabel>
            <S.FormInput type="email" name="email" placeholder="Email" />
          </p>
          <p>
            <S.FormLabel htmlFor="message"></S.FormLabel>
            <textarea name="message" placeholder="Digite a sua mensagem" />
          </p>
          <Button text="Enviar"></Button>
        </form>
      </S.Form>
    </>
  )
}
