import { QueryableListStoreAdapter } from '../../queryable-list-store-adapter'

export interface ChainableListStoreQuery<T> extends Pick<QueryableListStoreAdapter<T>,
  `setCompare` | `where` | `select` | `when` | `orderBy` | `toList` | `firstOrDefault` | `first` | `any` | `count` | `last` | `lastOrDefault`
  | `toList$` | `firstOrDefault$` | `first$` | `any$` | `count$` | `last$` | `lastOrDefault$`> { }
