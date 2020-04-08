export function parse<T>(text: string | null, reviver?: (this: any, key: string, value: any) => any): T {
  return JSON.parse(text as string, reviver)
}
