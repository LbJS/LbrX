import { InnerTestSubject } from './inner-test-subject.model'

export class TestSubject {

  public id: any
  public stringValue: string | null
  public numberValue: number | null
  public booleanValue: boolean | null
  public dateValue: Date | null
  private _getterSetterDate: Date | null
  public get getterSetterDate(): Date | null {
    return this._getterSetterDate
  }
  public set getterSetterDate(value: Date | null) {
    this._getterSetterDate = value
  }
  public innerTestObject: InnerTestSubject | null
  private _innerTestObjectGetSet: InnerTestSubject | null
  public get innerTestObjectGetSet(): InnerTestSubject | null {
    return this._innerTestObjectGetSet
  }
  public set innerTestObjectGetSet(value: InnerTestSubject | null) {
    this._innerTestObjectGetSet = value
  }

  constructor({
    stringValue = null,
    numberValue = null,
    booleanValue = null,
    dateValue = null,
    getterSetterDate = null,
    innerTestObject = null,
    innerTestObjectGetSet = null,
    id
  }: Partial<TestSubject>) {
    this.stringValue = stringValue
    this.numberValue = numberValue
    this.booleanValue = booleanValue
    this.dateValue = dateValue
    this._getterSetterDate = getterSetterDate
    this.innerTestObject = innerTestObject
    this._innerTestObjectGetSet = innerTestObjectGetSet
    if (typeof id != `undefined`) this.id = id
  }
}
