import { DeepNestedTestSubject } from './deep-nested-test-subject.model'

export class InnerTestSubject {

  public stringValue: string | null = null
  public numberValue: number | null = null
  public booleanValue: boolean | null = null
  public dateValue: Date | null = null
  private _getterSetterDate: Date | null = null
  public get getterSetterDate(): Date | null {
    return this._getterSetterDate
  }
  public set getterSetterDate(value: Date | null) {
    this._getterSetterDate = value
  }
  public deepNestedObj: DeepNestedTestSubject | null = null
  public obj: { value: string, date: Date } | null = null

  constructor(innerTestObject?: Partial<InnerTestSubject>) {
    if (innerTestObject) Object.assign(this, innerTestObject)
  }
}
