
export class GenericStorage implements Storage {
  private _data: { [key: string]: string } = {}
  public get length(): number {
    return Object.keys(this._data).length
  }
  private [Symbol.toStringTag]: `Storage`

  constructor() { }

  public key(index: number): string | null {
    const key = Object.keys(this._data)[index]
    return key ? key : null
  }

  public getItem(key: string): string | null {
    const value = this._data[key]
    return value !== undefined ? value : null
  }

  public setItem(key: string, value: string): void {
    this._data[key] = value
  }

  public removeItem(key: string): void {
    delete this._data[key]
  }

  public clear(): void {
    this._data = {}
  }
}
