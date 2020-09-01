
export interface AdvancedConfigOptions {
  clone?: (<T extends object | null>(obj: T) => T) | null
  compare?: (<T extends object>(objA: T, pbjB: T) => boolean) | null
  freeze?: (<T extends object>(obj: T) => Readonly<T>) | null
  handleTypes?: (<T extends object | object[]>(instanced: T, plain: object | object[]) => T) | null
  cloneError?: (<T extends Error | object>(error: T) => T) | null
  merge?: (<T extends object>(target: T, source: Partial<T>) => T) | null
}
