import { deepFreeze, isArray } from 'lbrx/helpers'
import { BetterPerson, Person } from '../test-subjects'

describe('Helper Function - deepFreeze():', () => {

  let person: Person

  beforeEach(() => {
    person = new Person({
      firstName: 'Leon',
      emails: [
        'someEmail@email.com'
      ],
      address: {
        city: 'some city'
      },
      birthday: new Date(),
      nestedObject: {
        nestedValue: {
          randomList: []
        }
      }
    })
    deepFreeze(person)
  })

  it("should cause person's firstName property to throw on modification.", () => {
    expect(() => {
      person.firstName = 'Something Else'
    }).toThrow()
  })

  it("should cause person's lastName property to throw on modification.", () => {
    expect(() => {
      person.lastName = 'Something Else'
    }).toThrow()
  })

  it("should cause person's emails list to throw throw on adding a new item.", () => {
    expect(() => {
      if (isArray(person.emails)) person.emails.push('newEmail@email.com')
    }).toThrow()
  })

  it("should cause person's emails list to throw on item's modification.", () => {
    expect(() => {
      if (isArray(person.emails)) person.emails[0] = 'newEmail@email.com'
    }).toThrow()
  })

  it("should cause person's address to throw on modification.", () => {
    expect(() => {
      if (person.address) person.address.city = 'some other city'
    }).toThrow()
  })

  it("should cause person's deep nested value to throw on modification.", () => {
    expect(() => {
      if (person.nestedObject?.nestedValue) {
        person.nestedObject.nestedValue.randomList = ['some other value']
      }
    }).toThrow()
  })

  it("should cause person's birthday to throw on modification.", () => {
    expect(() => {
      person.birthday?.setFullYear(2677)
    }).toThrow()
  })

  it("should cause better person's firstName property to throw on modification.", () => {
    const betterPerson = new BetterPerson({})
    deepFreeze(betterPerson)
    expect(() => {
      betterPerson.firstName = 'better first name'
    }).toThrow()
  })
})
