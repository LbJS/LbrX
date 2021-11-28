import { CSSProperties } from 'react'
import { toClassesString } from 'src/utils/to-classes-string'

export interface BtnProps {
  action: () => void,
  icon: string,
  classList?: string[],
  styles?: CSSProperties,
}

export default function Btn({ classList, action, icon, styles }: BtnProps): JSX.Element {
  return <a className={`waves-effect waves-light${toClassesString(classList)}`}
    style={styles}
    onClick={action}>
    <i className="material-icons">{icon}</i>
  </a>
}
