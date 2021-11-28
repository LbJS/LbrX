import { assert, isString } from 'lbrx/utils'
import React, { CSSProperties, Dispatch, MutableRefObject, SetStateAction, useEffect, useImperativeHandle, useState } from 'react'
import Btn from 'src/generic-components/btn/btn'
import { toClassesString } from 'src/utils/to-classes-string'
import { v4 as uuidv4 } from 'uuid'
import './dialog.component.scss'

export interface DialogOptions {
  modalOptions?: Partial<M.ModalOptions>,
  modalStyles?: CSSProperties,
  modalClasses?: string[],
  header?: JSX.Element | string,
  headerStyles?: CSSProperties,
  headerClasses?: string[],
  content: JSX.Element | string,
  contentStyles?: CSSProperties,
  contentClasses?: string[],
  footer?: JSX.Element | string,
  footerStyles?: CSSProperties,
  footerClasses?: string[],
  modalRef?: MutableRefObject<M.Modal | undefined>,
}

type ModalState = [M.Modal | null, Dispatch<SetStateAction<M.Modal | null>>]

export default function Dialog({
  modalOptions,
  modalClasses,
  modalStyles,
  header,
  headerClasses,
  headerStyles,
  content,
  contentClasses,
  contentStyles,
  footer,
  footerClasses,
  footerStyles,
  modalRef,
}: DialogOptions
): JSX.Element {
  const modalId = uuidv4()
  const [modal, setModal]: ModalState = useState<M.Modal | null>(null)

  useEffect(() => {
    setModal(createModal())
  }, [])

  useEffect(() => {
    if (!modal) return
    modal.open()
    return () => modal.destroy()
  }, [modal])

  useImperativeHandle(modalRef, () => modal!, [modal])

  function createModal(): M.Modal {
    const modalElem: HTMLElement | null = document.getElementById(modalId)
    assert(modalElem instanceof HTMLElement, `Cannot find modal's root element.`)
    return M.Modal.init(modalElem, modalOptions)
  }

  function closeModal(): void {
    modal?.close()
  }

  if (isString(header)) {
    header = <React.Fragment>
      <h3>{header}</h3>
      <Btn icon="close"
        action={closeModal}
        classList={[`btn-floating`, `btn-large`, `btn-flat`]}
        styles={{ paddingTop: `2px` }}></Btn>
    </React.Fragment>
  }

  return <div className={`modal${toClassesString(modalClasses)}`}
    style={modalStyles}
    id={modalId}>
    {header && <div className={`modal-header${toClassesString(headerClasses)}`}
      style={headerStyles}>{header}</div>}
    <div className={`modal-content${toClassesString(contentClasses)}`}
      style={contentStyles}>{content}</div>
    {footer && <div className={`modal-footer${toClassesString(footerClasses)}`}
      style={footerStyles}>{footer}</div>}
  </div>
}
