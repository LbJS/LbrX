import { isError, isString } from 'lbrx/utils'

export class ErrorTestSubject extends Error {

  public innerError: ErrorTestSubject | null = null

  constructor()
  constructor(errMsg: string)
  constructor(error: ErrorTestSubject)
  constructor(error: ErrorTestSubject, errMsg: string)
  constructor(errMsgOrError?: string | ErrorTestSubject, errMsg?: string) {
    super(isString(errMsg) ? errMsg : isString(errMsgOrError) ? errMsgOrError : undefined)
    if (isError(errMsgOrError)) this.innerError = errMsgOrError
  }
}
