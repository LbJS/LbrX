import { cloneObject, isArray, isBool, isDate, isFunction, isPlainObject, isString, objectAssign } from '../helpers'
import { KeyOrNever, SortMethod } from '../types'

export const enum SortDirections {
  ASC = 'ASC',
  DESC = 'DESC',
}

// tslint:disable-next-line: quotemark
interface CompleteSortOptions<T extends any> extends Pick<SortOptions<T>, 'key'>, DefaultSortOptions {
  isKey: boolean
}

export type SortingAlgorithm<T = any> = (arr: T[], compareFn: (a: any, b: any) => number) => T[]

export type SortingAlgorithmToken = string

export interface SortOptions<T extends any, K = KeyOrNever<T>> {
  key: K | (<V>(element: T) => V),
  dir?: SortDirections | null
  cascade?: boolean | null
  compareFn?: ((firstEl: any, secondEl: any) => number) | null
}

export interface DefaultSortOptions {
  dir: SortDirections
  cascade: boolean
  compareFn: ((firstEl: any, secondEl: any) => number)
}

export interface SortMethodApi<T extends any> extends SortMethod<T> {
  setSortingAlgorithm(token: SortingAlgorithmToken): void
}

export class SortFactory {

  public static readonly sortingAlgorithmsMap = new Map<SortingAlgorithmToken, SortingAlgorithm>()

  public static defaultOptions: DefaultSortOptions = {
    dir: SortDirections.ASC,
    cascade: false,
    compareFn: SortFactory._defaultCompare
  }

  private static get _defaultOptions(): DefaultSortOptions {
    return cloneObject(SortFactory.defaultOptions)
  }

  public static create<T = any>(): SortMethodApi<T>
  public static create<T = any>(desc: true): SortMethodApi<T>
  public static create<T = any>(key: KeyOrNever<T>): SortMethodApi<T>
  public static create<T = any>(sortOptions: SortOptions<T>): SortMethodApi<T>
  public static create<T = any>(sortOptions: SortOptions<T>[]): SortMethodApi<T>
  public static create<T = any>(partialSortOptions?: true | false | KeyOrNever<T> | SortOptions<T> | SortOptions<T>[]): SortMethodApi<T>
  public static create<T = any>(partialSortOptions?: true | KeyOrNever<T> | SortOptions<T> | SortOptions<T>[]): SortMethodApi<T> {
    const sortOptions: CompleteSortOptions<T>[] = SortFactory._getFullSortOptions(partialSortOptions)
    const maxDepth = sortOptions.length - 1
    const isDesc = isBool(partialSortOptions) && partialSortOptions
    const compareFn: (a: any, b: any) => number = !sortOptions.length ?
      isDesc ?
        (a: T, b: T) => SortFactory._defaultCompare(a, b) * -1 :
        SortFactory._defaultCompare :
      (a: T, b: T) => {
        let depthIndex = 0
        let result = 0
        do {
          const key = sortOptions[depthIndex].key
          const [resolvedValA, resolvedValB]: [any, any] =
            sortOptions[depthIndex].isKey ?
              [a[key as (keyof T)], b[key as (keyof T)]] :
              [(key as <V>(element: T) => V)(a), (key as <V>(element: T) => V)(b)]
          result = sortOptions[depthIndex].compareFn(resolvedValA, resolvedValB)
          if (sortOptions[depthIndex].dir == SortDirections.DESC) result *= -1
        } while (depthIndex++ < maxDepth && result == 0)
        return result
      }
    let _token: SortingAlgorithmToken | null = null
    const _o: Pick<SortMethodApi<T>, 'setSortingAlgorithm'> = {
      setSortingAlgorithm: (token: SortingAlgorithmToken) => { _token = token }
    }
    const _f: SortMethod<T> = (arr: T[]) => (_token && SortFactory.sortingAlgorithmsMap.has(_token)) ?
      SortFactory.sortingAlgorithmsMap.get(_token)!(arr, compareFn) :
      arr.sort(compareFn)
    return objectAssign(_f, _o)
  }

  private static _getFullSortOptions<T extends any>(
    partialSortOptions?: true | KeyOrNever<T> | SortOptions<T> | SortOptions<T>[]
  ): CompleteSortOptions<T>[] {
    const sortOptions: CompleteSortOptions<T>[] = []
    if (isString<keyof T>(partialSortOptions)) {
      sortOptions.push(objectAssign(SortFactory._defaultOptions, { key: partialSortOptions, isKey: !isFunction(partialSortOptions) }))
    } else if (isPlainObject<SortOptions<T>>(partialSortOptions)) {
      sortOptions.push(objectAssign(SortFactory._defaultOptions,
        cloneObject(partialSortOptions),
        { isKey: !isFunction(partialSortOptions.key) }))
    } else if (isArray(partialSortOptions) && partialSortOptions.length) {
      cloneObject(partialSortOptions).forEach((x, i) => {
        if (i > 0 && sortOptions[i - 1].cascade) {
          sortOptions.push(objectAssign(SortFactory._defaultOptions, sortOptions[i - 1], x, { isKey: !isFunction(x.key) }))
        } else {
          sortOptions.push(objectAssign(SortFactory._defaultOptions, x, { isKey: !isFunction(x.key) }))
        }
      })
    }
    return sortOptions
  }

  private static _defaultCompare(a: any, b: any): number {
    if (isString(a) && isString(b)) {
      a = a.toUpperCase()
      b = b.toUpperCase()
    } else if (isDate(a) && isDate(b)) {
      a = a.getTime()
      b = b.getTime()
    }
    return a > b ? 1 : a < b ? -1 : 0
  }

  private constructor() { }
}
