import { Clone, CloneError, Compare, Freeze, HandleClasses, Merge } from '../store-accessories'

export interface AdvancedConfigOptions {
  clone?: Clone | null
  compare?: Compare | null
  freeze?: Freeze | null
  handleClasses?: HandleClasses | null
  cloneError?: CloneError | null
  merge?: Merge | null
}
