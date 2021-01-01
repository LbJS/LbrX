import { isObject } from './is-object'

// tslint:disable: max-line-length
export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>
>(obj: T, prop1: P1): NonNullable<T>[P1]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>
>(obj: T, prop1: P1, prop2: P2): NonNullable<NonNullable<T>[P1]>[P2]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3): NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4): NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>,
  P5 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5): NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>,
  P5 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>,
  P6 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5, prop6: P6): NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>,
  P5 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>,
  P6 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>,
  P7 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>,
  >(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5, prop6: P6, prop7: P7): NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>,
  P5 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>,
  P6 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>,
  P7 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>,
  P8 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5, prop6: P6, prop7: P7, prop8: P8): NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>[P8]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>,
  P5 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>,
  P6 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>,
  P7 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>,
  P8 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>,
  P9 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>[P8]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5, prop6: P6, prop7: P7, prop8: P8, prop9: P9): NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>[P8]>[P9]

export function getNestedProp<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>,
  P5 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>,
  P6 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>,
  P7 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>,
  P8 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>,
  P9 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>[P8]>,
  P10 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>[P8]>[P9]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5, prop6: P6, prop7: P7, prop8: P8, prop9: P9, prop10: P10): NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6]>[P7]>[P8]>[P9]>[P10]

export function getNestedProp(obj: object, ...props: string[]): any {
  if (!obj) return obj
  let result = obj
  for (const prop of props) {
    if (!isObject(result)) return result
    result = result[prop]
  }
  return result
}
