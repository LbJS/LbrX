
export type Parse = <T = any>(text: string | null, reviver?: (this: any, key: string, value: any) => any) => T
