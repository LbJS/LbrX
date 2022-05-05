import { CSSProperties, ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Observable, Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { DatepickerOptionsExtensions, initDatepicker } from 'src/utils/init-datepicker'
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
  datepickerOptions?: Partial<M.DatepickerOptions & DatepickerOptionsExtensions>,
  timepickerOptions?: Partial<M.TimepickerOptions>,
  forceUpdateState?: React.Dispatch<React.SetStateAction<number>>,
  updateLabels$?: Observable<any>,
}

type PickerState = [M.Datepicker | M.Timepicker | null, React.Dispatch<React.SetStateAction<M.Datepicker | M.Timepicker | null>>]

export const FormField = forwardRef(({
  children,
  styles,
  classes,
  inputType,
  inputElement,
  datepickerOptions,
  timepickerOptions,
  forceUpdateState,
  updateLabels$,
}: FormFieldOptions, ref: ForwardedRef<M.Datepicker | M.Timepicker | undefined>) => {

  if (!inputType) inputType = InputTypes.text

  const [picker, setPicker]: PickerState = useState<M.Datepicker | M.Timepicker | null>(null)

  useEffect(() => {
    if (!updateLabels$) return
    const updateLabelsSub: Subscription = updateLabels$
      .pipe(debounceTime(30))
      .subscribe(M.updateTextFields)
    return () => updateLabelsSub.unsubscribe()
  }, [])

  useEffect(() => {
    switch (inputType) {
      case InputTypes.date:
        // tslint:disable-next-line: no-unused-expression
        inputElement && setPicker(initDatepicker(inputElement, datepickerOptions))
        break
      case InputTypes.time:
        // tslint:disable-next-line: no-unused-expression
        inputElement && setPicker(initTimepicker(inputElement, timepickerOptions))
        break
      default: updateTextFields()
    }
  }, [inputElement])

  useEffect(() => {
    if (!picker) return
    return () => picker.destroy()
  }, [picker])

  useImperativeHandle(ref, () => {
    forceUpdateState?.(Math.random())
    return picker!
  }, [picker])

  return <div className={`input-field${toClassesString(classes)}`}
    style={styles}>{children}</div>
})
