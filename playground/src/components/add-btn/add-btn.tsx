
export interface AddBtnProps {
  classList?: string[],
  action: () => void
}

export default function AddBtn({ classList, action }: AddBtnProps): JSX.Element {
  return <a className={`btn-floating btn-large waves-effect waves-light ${classList?.join(` `)}`}
    onClick={action}>
    <i className="material-icons">add</i>
  </a>
}
