
export class ClearableWeakMap<K extends object, V> {
  private _wm: WeakMap<K, V>

  constructor(iterable: Iterable<[K, V]>)
  constructor(entries?: readonly [K, V][] | null | undefined)
  constructor(iterableOrEntries?: readonly [K, V][] | null | undefined | Iterable<[K, V]>) {
    this._wm = new WeakMap(iterableOrEntries as any)
  }

  public clear(): this {
    this._wm = new WeakMap()
    return this
  }

  public delete(key: K): boolean {
    return this._wm.delete(key)
  }
  public get(key: K): V | undefined {
    return this._wm.get(key)
  }
  public has(key: K): boolean {
    return this._wm.has(key)
  }
  public set(key: K, value: V): this {
    this._wm.set(key, value)
    return this
  }
}
