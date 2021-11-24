import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UiService } from 'src/app/services/ui.service'
import Dialog from 'src/generic-components/dialog/dialog.component'
import Footer from './components/footer/footer.component'
import Header from './components/header/header.component'
import Main from './components/main/main.component'

type IsTaskFormOpenState = [boolean, Dispatch<SetStateAction<boolean>>]

export default function App(): JSX.Element {
  const [isTaskFormDialogOpen, setIsTaskFormOpen]: IsTaskFormOpenState = useState<boolean>(false)
  const uiService: UiService = UiService.getUiService()
  const modalOptions: Partial<M.ModalOptions> = {
    onCloseEnd: () => updateIsTaskFormOpen(false)
  }

  useEffect(() => {
    subscribeToIsTaskFormOpen()
  }, [])

  function subscribeToIsTaskFormOpen(): void {
    uiService.uiStore.get$(value => value.isTaskFormOpen).subscribe(setIsTaskFormOpen)
  }

  function updateIsTaskFormOpen(isTaskFormOpen: boolean): void {
    uiService.uiStore.update({ isTaskFormOpen }, `app=>${isTaskFormDialogOpen ? `open` : `close`}-dialog`)
  }
  
  return <React.Fragment>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
    {isTaskFormDialogOpen && <Dialog modalOptions={modalOptions}></Dialog>}
  </React.Fragment>
}
