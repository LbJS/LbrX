import { ErrorTestSubject } from '__test__/test-subjects'

export class ErrorFactory {

  public static createError(text: string = 'Some new error data.'): Error {
    return new Error(text)
  }

  public static createErrorTestSubject(text: string = 'Some error data.'): ErrorTestSubject {
    return new ErrorTestSubject(text)
  }

  public static createNestedError(): ErrorTestSubject {
    let err = new ErrorTestSubject('Layer3 error')
    err = new ErrorTestSubject(err, 'Layer2 error')
    return new ErrorTestSubject(err, 'Layer1 error')
  }
}
