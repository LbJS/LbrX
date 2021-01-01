import { QueryableListStoreAdapter } from '../../queryable-list-store-adapter'

// tslint:disable-next-line: quotemark
export interface ChainableListStoreQuery<T> extends Pick<QueryableListStoreAdapter<T>,
  `select` | `when` | `where` | `orderBy` | `toList` | `firstOrDefault` | `first` | `any`> { }
