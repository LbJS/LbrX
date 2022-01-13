import { isArray } from 'lbrx/utils'
import { CSSProperties, useCallback } from 'react'
import { toClassesString } from 'src/utils/to-classes-string'


export const enum IconSides {
  right = 1,
  left = 2,
}

export interface BtnProps {
  action: undefined | (() => void) | ((() => void) | undefined)[],
  children?: string | JSX.Element,
  icon?: string,
  iconSide?: IconSides,
  classList?: string[],
  styles?: CSSProperties,
}

export default function Btn({ classList, action, icon, children, iconSide, styles }: BtnProps): JSX.Element {
  iconSide ??= IconSides.left

  const onClickHandler = isArray(action) ?
    useCallback(() => (action as (() => void)[]).forEach(a => a?.()), [action]) :
    action

  return <a className={`btn waves-effect waves-light${toClassesString(classList)}`}
    style={styles}
    onClick={onClickHandler}>
    {icon && iconSide === IconSides.left && <i className="material-icons">{icon}</i>}
    {children}
    {icon && iconSide === IconSides.right && <i className="material-icons">{icon}</i>}
  </a>
}