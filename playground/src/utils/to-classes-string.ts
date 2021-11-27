import { isArray } from 'lbrx/utils'

export function toClassesString(classes?: string[] | string | null | undefined): string {
  if (!classes) return ``
  let result = ` `
  if (isArray(classes)) result += classes.join(` `)
  else result += classes
  return result
}
