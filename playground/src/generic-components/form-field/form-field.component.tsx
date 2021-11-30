import { CSSProperties, useEffect } from 'react'
import { toClassesString } from 'src/utils/to-classes-string'
import { updateTextFields } from 'src/utils/update-text-fields'

export interface FormFieldOptions {
  children: JSX.Element,
  styles?: CSSProperties,
  classes?: string[],
}

export default function FormField({ children, styles, classes }: FormFieldOptions): JSX.Element {

  useEffect(() => {
    updateTextFields()
  }, [])

  return <div className={`input-field${toClassesString(classes)}`}
    style={styles}>{children}</div>
}
