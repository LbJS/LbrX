import { TestSubject } from './test-subject.model'

export class TestSubjectWithMethods extends TestSubject {

  public method: (() => void) | null
  private _methodGetSet: (() => void) | null
  public get methodGetSet(): (() => void) | null {
    return this._methodGetSet
  }
  public set methodGetSet(value: (() => void) | null) {
    this._methodGetSet = value
  }
  public innerObjectWithMethod: { method: (() => void) | null } | null
  public listOfMethods: ((() => void) | null)[] | null

  constructor({
    stringValue = null,
    numberValue = null,
    booleanValue = null,
    dateValue = null,
    getterSetterDate = null,
    innerTestObject = null,
    innerTestObjectGetSet = null,
    method = null,
    methodGetSet = null,
    innerObjectWithMethod = null,
    listOfMethods = null,
  }: Partial<TestSubjectWithMethods>) {
    super({
      stringValue,
      numberValue,
      booleanValue,
      dateValue,
      getterSetterDate,
      innerTestObject,
      innerTestObjectGetSet,
    })
    this.method = method
    this._methodGetSet = methodGetSet
    this.innerObjectWithMethod = innerObjectWithMethod
    this.listOfMethods = listOfMethods
  }
}
