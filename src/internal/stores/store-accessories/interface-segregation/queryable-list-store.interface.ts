import { ListStore } from '../../list-store'

// tslint:disable-next-line: quotemark
export interface QueryableListStore<T> extends Pick<ListStore<T>,
  `select` | `when` | `where` | `orderBy` | `toList` | `firstOrDefault` | `first`> { }
