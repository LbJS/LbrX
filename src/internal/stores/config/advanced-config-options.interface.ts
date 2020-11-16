import { Clone, CloneError, Compare, Freeze, HandleTypes, Merge } from '../store-accessories'

export interface AdvancedConfigOptions {
  clone?: Clone | null
  compare?: Compare | null
  freeze?: Freeze | null
  handleTypes?: HandleTypes | null
  cloneError?: CloneError | null
  merge?: Merge | null
}
