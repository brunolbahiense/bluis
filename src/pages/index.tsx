import Main from './template/Main'
import Projects from './template/Projects'
import Partners from './template/Partners'
import Footer from 'components/Footer'
import Header from 'components/Header'
export default function Home() {
  return (
    <>
      <Header />
      <Main />
      <Projects />
      <Partners />
      <Footer />
    </>
  )
}
