
export type Stringify = (
  value: any,
  replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
  space?: string | number
) => string
