import { CSSProperties, MutableRefObject, useEffect, useImperativeHandle, useState } from 'react'
import { initDatepicker } from 'src/utils/init-datepicker'
import { initTimepicker } from 'src/utils/init-timepicker'
import { toClassesString } from 'src/utils/to-classes-string'
import { updateTextFields } from 'src/utils/update-text-fields'

export const enum InputTypes {
  text,
  date,
  time,
}

export interface FormFieldOptions {
  children: JSX.Element,
  inputElement?: HTMLElement | null,
  styles?: CSSProperties,
  classes?: string[],
  inputType?: InputTypes,
  datepickerOptions?: M.DatepickerOptions,
  datepickerRef?: MutableRefObject<M.Datepicker | undefined>,
  timepickerOptions?: M.TimepickerOptions,
  timepickerRef?: MutableRefObject<M.Timepicker | undefined>,
}

type DatepickerState = [M.Datepicker | null, React.Dispatch<React.SetStateAction<M.Datepicker | null>>]
type TimepickerState = [M.Timepicker | null, React.Dispatch<React.SetStateAction<M.Timepicker | null>>]

export default function FormField({
  children,
  styles,
  classes,
  inputType,
  inputElement,
  datepickerOptions,
  datepickerRef,
  timepickerOptions,
  timepickerRef,
}: FormFieldOptions): JSX.Element {

  if (!inputType) inputType = InputTypes.text

  const [datepicker, setDatepicker]: DatepickerState = useState<M.Datepicker | null>(null)
  const [timepicker, setTimepicker]: TimepickerState = useState<M.Timepicker | null>(null)

  useEffect(() => {
    if (!inputElement) return
    switch (inputType) {
      case InputTypes.date:
        setDatepicker(initDatepicker(inputElement, datepickerOptions))
        break
      case InputTypes.time:
        setTimepicker(initTimepicker(inputElement, timepickerOptions))
        break
      default: updateTextFields()
    }
  }, [inputElement])

  useEffect(() => {
    if (!datepicker) return
    return () => datepicker.destroy()
  }, [datepicker])

  useEffect(() => {
    if (!timepicker) return
    return () => timepicker.destroy()
  }, [timepicker])

  useImperativeHandle(datepickerRef, () => datepicker!, [datepicker])
  useImperativeHandle(timepickerRef, () => timepicker!, [timepicker])

  return <div className={`input-field${toClassesString(classes)}`}
    style={styles}>{children}</div>
}
