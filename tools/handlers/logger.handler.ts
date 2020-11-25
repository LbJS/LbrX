import { LogLevels } from '../enums'
import { isError, isString } from '../helpers'
import { AppError } from '../models'
import { LoggerConfig } from '../models/logger-config'

export class LoggerHandler {

  private static _wasLastEmptyLine = false

  private _config: LoggerConfig
  public set config(value: LoggerConfig) {
    this._config = value
  }

  constructor(config: LoggerConfig) {
    this._config = config
    if (this._config.fileLogLevel !== LogLevels.none && this._config.isActive) {
      console.warn('\x1b[33m', 'File logging is not implemented yet', '\x1b[0m')
    }
  }

  private _logErrTonConsole(value: AppError | Error | string): void {
    console.error('\x1b[31m', value, '\x1b[0m')
  }

  private _logEmptyLine(): void {
    console.log()
  }

  public logError(e: AppError | Error | string): void {
    if (!this._config.isActive) return
    if ([LogLevels.log, LogLevels.warn, LogLevels.error].includes(this._config.consoleLogLevel)) {
      this._logErrTonConsole('ERROR!!!')
      if (e instanceof AppError) {
        this._logErrTonConsole(e)
        if (e.innerError) this.logError(e.innerError)
      } else if (isString(e) || isError(e)) {
        this._logErrTonConsole(e)
      } else {
        throw new Error('The provided error is not supported.')
      }
      this._logEmptyLine()
      LoggerHandler._wasLastEmptyLine = true
    }
  }

  public logWarning(msg: string): void {
    if (!this._config.isActive) return
    if ([LogLevels.log, LogLevels.warn].includes(this._config.consoleLogLevel)) {
      console.warn('\x1b[33m', msg, '\x1b[0m')
      LoggerHandler._wasLastEmptyLine = false
    }
  }

  public log(msg: string): void {
    if (!this._config.isActive) return
    if (LogLevels.log === this._config.consoleLogLevel) {
      console.log('\x1b[0m', msg)
      LoggerHandler._wasLastEmptyLine = false
    }
  }

  public logInfo(msg: string): void {
    if (!this._config.isActive) return
    if (LogLevels.log === this._config.consoleLogLevel) {
      console.log('\x1b[36m', msg, '\x1b[0m')
      LoggerHandler._wasLastEmptyLine = false
    }
  }

  public logSuccess(msg: string, isFullMsg: boolean = false): void {
    if (!this._config.isActive) return
    if (!LoggerHandler._wasLastEmptyLine) this._logEmptyLine()
    if (isFullMsg) {
      console.log('\x1b[32m', msg, '\x1b[0m')
    } else {
      console.log('\x1b[32m', `${msg} was successful.`, '\x1b[0m')
    }
    this._logEmptyLine()
    LoggerHandler._wasLastEmptyLine = true
  }
}
