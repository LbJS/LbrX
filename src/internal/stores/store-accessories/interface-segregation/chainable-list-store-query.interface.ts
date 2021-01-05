import { QueryableListStoreAdapter } from '../../queryable-list-store-adapter'

export interface ChainableListStoreQuery<T> extends Pick<QueryableListStoreAdapter<T>,
  `setCompare` | `where` | `select` | `when` | `orderBy` | `toList` | `firstOrDefault` | `first` | `any`
  | `toList$` | `firstOrDefault$` | `first$` | `any$`> { }
