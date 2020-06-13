import { isError, isString } from 'lbrx/helpers'

export function createError(): Error {
  return new Error('Some error text')
}

export class CustomError extends Error {

  public innerError: CustomError | null = null

  constructor()
  constructor(errMsg: string)
  constructor(error: CustomError)
  constructor(error: CustomError, errMsg: string)
  constructor(errMsgOrError?: string | CustomError, errMsg?: string) {
    super(isString(errMsg) ? errMsg : isString(errMsgOrError) ? errMsgOrError : undefined)
    if (isError(errMsgOrError)) this.innerError = errMsgOrError
  }
}

export function createCustomError(): CustomError {
  const err1 = new CustomError('First Error')
  const err2 = new CustomError(err1, 'Second Error')
  return new CustomError(err2)
}
