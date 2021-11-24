import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface DialogOptions {
  modalOptions?: Partial<M.ModalOptions>,
}

export default function Dialog({ modalOptions }: DialogOptions): JSX.Element {
  const modalId = uuidv4()

  useEffect(() => {
    const modal: M.Modal | null = createModal()
    modal?.open()
    return () => {
      modal?.destroy()
    }
  }, [])

  function createModal(): M.Modal | null {
    const modalElem: HTMLElement | null = document.getElementById(modalId)
    return modalElem ? M.Modal.init(modalElem, modalOptions) : null
  }

  return <div className="modal"
    id={modalId}>test</div>
}
