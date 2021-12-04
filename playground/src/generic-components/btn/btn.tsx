import { CSSProperties } from 'react'
import { toClassesString } from 'src/utils/to-classes-string'


export const enum IconSides {
  right = 1,
  left = 2,
}

export interface BtnProps {
  action: () => void,
  children?: string | JSX.Element,
  icon?: string,
  iconSide?: IconSides,
  classList?: string[],
  styles?: CSSProperties,
}

export default function Btn({ classList, action, icon, children, iconSide, styles }: BtnProps): JSX.Element {
  iconSide ??= IconSides.left

  return <a className={`btn waves-effect waves-light${toClassesString(classList)}`}
    style={styles}
    onClick={action}>
    {icon && iconSide === IconSides.left && <i className="material-icons">{icon}</i>}
    {children}
    {icon && iconSide === IconSides.right && <i className="material-icons">{icon}</i>}
  </a>
}
