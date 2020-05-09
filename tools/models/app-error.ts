import { isError, isString } from '../helpers'

export class AppError extends Error {

  public innerError: AppError | Error | null = null

  constructor()
  constructor(msg: string)
  constructor(error: Error)
  constructor(error: AppError)
  constructor(error: Error, msg: string)
  constructor(error: AppError, msg: string)
  constructor(msgOrError?: AppError | Error | string, msg?: string) {
    super(isString(msg) ? msg : isString(msgOrError) ? msgOrError : undefined)
    if (isError(msgOrError)) this.innerError = msgOrError
  }
}
