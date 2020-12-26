import { isArray, isPlainObject, isString, mergeObjects } from '../helpers'
import { SortMethod } from '../types'

export const enum SortDirections {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortOptions<T extends any> {
  key?: keyof T | null,
  dir?: SortDirections | null
  cascade?: boolean | null
  compareFn?: ((firstEl: any, secondEl: any) => -1 | 0 | 1) | null
  nestedValueResolver?: (<V>(element: T) => V) | null
}

export class SortFactory {

  private static get _defaultOptions(): Required<SortOptions<any>> {
    return {
      key: null,
      dir: SortDirections.ASC,
      cascade: false,
      compareFn: null,
      nestedValueResolver: null,
    }
  }

  public static create<T extends any>(): SortMethod<T>
  public static create<T extends any>(key: keyof T): SortMethod<T>
  public static create<T extends any>(sortOptions: SortOptions<T>): SortMethod<T>
  public static create<T extends any>(sortOptions: SortOptions<T>[]): SortMethod<T>
  public static create<T extends any>(partialSortOptions?: keyof T | SortOptions<T> | SortOptions<T>[]): SortMethod<T> {
    const sortOptions: Required<SortOptions<any>>[] = []
    if (isString(partialSortOptions)) {
      sortOptions.push(mergeObjects(SortFactory._defaultOptions, { key: partialSortOptions }))
    } else if (isPlainObject<SortOptions<T>>(partialSortOptions)) {
      sortOptions.push(mergeObjects(SortFactory._defaultOptions, partialSortOptions))
    } else if (isArray(partialSortOptions)) {
      // TODO
    } else {
      sortOptions.push(SortFactory._defaultOptions)
    }
    return (arr: T[]) => {
      return arr
    }
  }

  private constructor() { }
}
