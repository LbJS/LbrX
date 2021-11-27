import { toClassesString } from 'src/utils/to-classes-string'

export interface BtnProps {
  classList?: string[],
  action: () => void,
  icon: string,
}

export default function Btn({ classList, action, icon }: BtnProps): JSX.Element {
  return <a className={`waves-effect waves-light${toClassesString(classList)}`}
    onClick={action}>
    <i className="material-icons">{icon}</i>
  </a>
}
