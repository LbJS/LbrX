import { readJsonFromFile, resolvePath } from '../extensions'
import { PostSrcBuildConfig } from '../models'
import { ConfigHandler } from './config.handler'

export class AppDetails {

  private _pkgJsonPath: string
  private _appName: string | null = null
  public get appName(): string {
    if (!this._appName) this._appName = this._getAppName()
    return this._appName
  }

  private _appVer: string | null = null
  public get appVer(): string {
    if (!this._appVer) this._appVer = this._getAppVer()
    return this._appVer
  }
  public set appVer(value: string) {
    this._appVer = value
  }

  constructor(
    private _config: ConfigHandler<PostSrcBuildConfig>
  ) {
    this._pkgJsonPath = this._config.config.packageJsonPath
  }

  private _getAppName(): string {
    const pkgJson: { [key: string]: any } = readJsonFromFile(resolvePath(this._pkgJsonPath))
    if (!pkgJson || !pkgJson.name) throw new Error('Package json is invalid.')
    return pkgJson.name.trim()
  }

  private _getAppVer(): string {
    const pkgJson: { [key: string]: any } = readJsonFromFile(resolvePath(this._pkgJsonPath))
    if (!pkgJson || !pkgJson.version) throw new Error('Package json is invalid.')
    return pkgJson.version.trim()
  }

  public resetDetails(): void {
    this._appName = this._getAppName()
    this._appVer = this._getAppVer()
  }
}
