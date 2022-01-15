import { toClassesString } from 'src/utils/to-classes-string'

export interface TableOptions {
  tableClasses?: string[],
  tableHead?: JSX.Element,
  tableBody?: JSX.Element,
}

export default function Table({
  tableClasses,
  tableHead,
  tableBody
}: TableOptions
): JSX.Element {

  return <table className={toClassesString(tableClasses)}>
    {tableHead && <thead>{tableHead}</thead>}
    {tableBody && <tbody>{tableBody}</tbody>}
  </table>
}
