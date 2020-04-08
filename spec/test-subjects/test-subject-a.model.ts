import { InnerTestSubjectA } from './inner-test-subject-a.model'

export class TestSubjectA {

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
  public innerTestObject: InnerTestSubjectA | null
  private _innerTestObjectGetSet: InnerTestSubjectA | null
  public get innerTestObjectGetSet(): InnerTestSubjectA | null {
    return this._innerTestObjectGetSet
  }
  public set innerTestObjectGetSet(value: InnerTestSubjectA | null) {
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
  }: Partial<TestSubjectA>) {
    this.stringValue = stringValue
    this.numberValue = numberValue
    this.booleanValue = booleanValue
    this.dateValue = dateValue
    this._getterSetterDate = getterSetterDate
    this.innerTestObject = innerTestObject
    this._innerTestObjectGetSet = innerTestObjectGetSet
  }
}
