import { exec } from 'child_process'
import { readJsonFromFile, resolvePath } from '../extensions'
import { PostSrcBuildConfig } from '../models'
import { ConfigHandler } from './config.handler'

export class AppDetails {

  private _pkgJsonPath: string
  private _appName: string | null = null
  public get appName(): string {
    if (!this._appName) this._appName = this._getAppNameFromPkgJson()
    return this._appName
  }

  private _curAppVer: string | null = null

  private _nextAppVer: string | null = null
  public get nextAppVer(): string {
    if (!this._nextAppVer) this._nextAppVer = this._getAppVerFromPkgJson()
    return this._nextAppVer
  }
  public set nextAppVer(value: string) {
    this._nextAppVer = value
  }

  constructor(
    private _config: ConfigHandler<PostSrcBuildConfig>
  ) {
    this._pkgJsonPath = this._config.config.packageJsonPath
  }

  public async getCurrAppVer(): Promise<string> {
    if (this._curAppVer) return Promise.resolve(this._curAppVer)
    let npmCommand: string | null = null
    if (this._config.config.npmGetVerCommand.includes('[appName]')) {
      npmCommand = this._config.config.npmGetVerCommand.replace('[appName]', this.appName)
    }
    const currVer = await this.getCurrentVersionFromNpm(npmCommand || this._config.config.npmGetVerCommand)
    if (currVer) {
      this._curAppVer = currVer.trim()
      return Promise.resolve(this._curAppVer)
    } else {
      return Promise.reject("Can't find current app version.")
    }
  }

  public setCurrAppVer(value: string): void {
    this._curAppVer = value
  }

  private _getAppNameFromPkgJson(): string {
    const pkgJson: { [key: string]: any } = readJsonFromFile(resolvePath(this._pkgJsonPath))
    if (!pkgJson || !pkgJson.name) throw new Error('Package json is invalid.')
    return pkgJson.name.trim()
  }

  private _getAppVerFromPkgJson(): string {
    const pkgJson: { [key: string]: any } = readJsonFromFile(resolvePath(this._pkgJsonPath))
    if (!pkgJson || !pkgJson.version) throw new Error('Package json is invalid.')
    return pkgJson.version.trim()
  }

  private getCurrentVersionFromNpm(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        error ? reject(error || stderr) : resolve(stdout)
      })
    })
  }
}
