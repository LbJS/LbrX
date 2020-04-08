import { compareObjects } from 'lbrx/helpers'
import { BetterPerson, Person } from 'test-subjects'

describe('Helper Function - compareObjects():', () => {

  it('should return that the objects are equal. {testId: 1}', () => {
    const person1 = new Person({
      firstName: 'Leon'
    })
    const person2 = new Person({
      firstName: 'Leon'
    })
    expect(compareObjects(person1, person2)).toBeTruthy()
  })

  it('should return that the objects are equal. {testId: 2}', () => {
    const person1 = new Person({
      birthday: new Date(1700)

    })
    const person2 = new Person({
      birthday: new Date(1700)
    })
    expect(compareObjects(person1, person2)).toBeTruthy()
  })

  it('should return that the objects are equal. {testId: 3}', () => {
    const person1 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            {
              a: {
                b: () => { },
                c: new Date(1700),
              }
            }
          ]
        }
      }
    })
    const person2 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            {
              a: {
                b: () => { },
                c: new Date(1700),
              }
            }
          ]
        }
      }
    })
    expect(compareObjects(person1, person2)).toBeTruthy()
  })

  it('should return that the objects are equal. {testId: 4}', () => {
    const person1 = new BetterPerson({
      firstName: 'some name',
      lastName: 'some other name',
      address: {
        city: 'some city',
        country: null,
        homeNumber: '6',
      },
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 2),
      someOtherDate: new Date(2000, 0, 5),
      betterDate: new Date(1700, 0),
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            '5',
            {
              test: 'test',
              n: new Date(1700)
            },
            [
              1, 3, 2, 5, 6
            ],
            {
              a: 'a',
              b: null
            }
          ]
        }
      }
    })
    const person2 = new BetterPerson({
      firstName: 'some name',
      lastName: 'some other name',
      address: {
        city: 'some city',
        country: null,
        homeNumber: '6',
      },
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 2),
      someOtherDate: new Date(2000, 0, 5),
      betterDate: new Date(1700, 0),
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            '5',
            {
              test: 'test',
              n: new Date(1700)
            },
            [
              1, 3, 2, 5, 6
            ],
            {
              a: 'a',
              b: null
            }
          ]
        }
      }
    })
    expect(compareObjects(person1, person2)).toBeTruthy()
  })

  it('should return that the objects are different. {testId: 5}', () => {
    const person1 = new Person({
      lastName: 'Leon'
    })
    const person2 = new Person({
      lastName: 'Sasha'
    })
    expect(compareObjects(person1, person2)).toBeFalsy()
  })

  it('should return that the objects are different. {testId: 6}', () => {
    const person1 = new BetterPerson({
      firstName: 'some name',
      lastName: 'some other name',
      address: {
        city: 'some city',
        country: null,
        homeNumber: '6',
      },
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 2),
      someOtherDate: new Date(2000, 0, 5),
      betterDate: new Date(),
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            '5',
            {
              test: 'test',
              n: new Date()
            },
            [
              1, 3, 2, 5, 6
            ],
            {
              a: 'a',
              b: null // <= not equal
            }
          ]
        }
      }
    })
    const person2 = new BetterPerson({
      firstName: 'some name',
      lastName: 'some other name',
      address: {
        city: 'some city',
        country: null,
        homeNumber: '6',
      },
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 2),
      someOtherDate: new Date(2000, 0, 5),
      betterDate: new Date(),
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            '5',
            {
              test: 'test',
              n: new Date()
            },
            [
              1, 3, 2, 5, 6
            ],
            {
              a: 'a',
              b: () => { } // <= not equal
            }
          ]
        }
      }
    })
    expect(compareObjects(person1, person2)).toBeFalsy()
  })
})
