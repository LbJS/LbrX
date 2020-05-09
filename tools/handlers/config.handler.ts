
export class ConfigHandler<T extends object> {

  public get config(): T {
    return JSON.parse(JSON.stringify(this._config))
  }
  public set config(value: T) {
    this._config = value
  }

  constructor(
    private _config: T
  ) { }
}
