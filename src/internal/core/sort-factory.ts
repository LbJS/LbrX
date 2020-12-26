import { cloneObject, isArray, isDate, isFunction, isPlainObject, isString, objectAssign } from '../helpers'
import { SortMethod } from '../types'

export const enum SortDirections {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortOptions<T extends any> {
  key: keyof T | (<V>(element: T) => V),
  dir?: SortDirections | null
  cascade?: boolean | null
  compareFn?: ((firstEl: any, secondEl: any) => number)
}

export class SortFactory {

  public static defaultOptions: Required<Pick<SortOptions<any>, 'dir' | 'cascade' | 'compareFn'>> = {
    dir: SortDirections.ASC,
    cascade: false,
    compareFn: SortFactory._getDefaultCompare()
  }

  public static defaultCompare = (a: any, b: any): number => {
    if (isString(a) && isString(b)) {
      a = a.toUpperCase()
      b = b.toUpperCase()
    } else if (isDate(a) && isDate(b)) {
      a = a.getTime()
      b = b.getTime()
    }
    return a > b ? 1 : a < b ? -1 : 0
  }

  private static get _defaultOptions(): Required<Pick<SortOptions<any>, 'dir' | 'cascade' | 'compareFn'>> {
    return cloneObject(SortFactory.defaultOptions)
  }

  public static create<T extends any>(): SortMethod<T>
  public static create<T extends any>(key: keyof T): SortMethod<T>
  public static create<T extends any>(sortOptions: SortOptions<T>): SortMethod<T>
  public static create<T extends any>(sortOptions: SortOptions<T>[]): SortMethod<T>
  public static create<T extends any>(partialSortOptions?: keyof T | SortOptions<T> | SortOptions<T>[]): SortMethod<T> {
    const sortOptions: (Required<SortOptions<any>> & { isKey: boolean })[] = []
    if (isString<keyof T>(partialSortOptions)) {
      sortOptions.push(objectAssign(SortFactory._defaultOptions, { key: partialSortOptions } as any) as any)
    } else if (isPlainObject<SortOptions<T>>(partialSortOptions)) {
      sortOptions.push(objectAssign(SortFactory._defaultOptions, cloneObject(partialSortOptions)) as any)
    } else if (isArray(partialSortOptions) && partialSortOptions.length) {
      cloneObject(partialSortOptions).forEach((x, i) => {
        if (i > 0 && sortOptions[i - 1].cascade) {
          sortOptions.push(objectAssign(SortFactory._defaultOptions, sortOptions[i - 1], x) as any)
        } else {
          sortOptions.push(objectAssign(SortFactory._defaultOptions, x) as any)
        }
      })
    }
    sortOptions.forEach(x => x.isKey = !isFunction(x.key))
    return (arr: T[]) => {
      const maxDepth = sortOptions.length - 1
      return !sortOptions.length ? arr.sort(SortFactory.defaultCompare) : arr.sort((a: T, b: T) => {
        let depthIndex = 0
        let result = 0
        do {
          const key: any = sortOptions[depthIndex].key
          let resolvedValA: any
          let resolvedValB: any
          if (sortOptions[depthIndex].isKey) {
            resolvedValA = a[key as (keyof T)]
            resolvedValB = b[key as (keyof T)]
          } else {
            resolvedValA = key(a)
            resolvedValB = key(b)
          }
          result = sortOptions[depthIndex].compareFn(resolvedValA, resolvedValB)
          if (sortOptions[depthIndex].dir == SortDirections.DESC) result *= -1
        } while (depthIndex++ < maxDepth && result == 0)
        return result
      })
    }
  }

  private static _getDefaultCompare(): (firstEl: any, secondEl: any) => number {
    return SortFactory.defaultCompare
  }

  private constructor() { }
}
