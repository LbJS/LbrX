import React from 'react'
import Footer from './components/footer/footer.component'
import Header from './components/header/header.component'
import Main from './components/main/main.component'

export default function App(): JSX.Element {
  return <React.Fragment>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
  </React.Fragment>
}
