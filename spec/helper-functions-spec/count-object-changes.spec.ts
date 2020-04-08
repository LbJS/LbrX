import { countObjectChanges } from 'lbrx/helpers'
import { BetterPerson, Person } from '../test-subjects'

describe('Helper Function - countObjectChanges():', () => {

  const expectedChangesA = 1
  it(`should count ${expectedChangesA} changes between two objects. {testId: 1}`, () => {
    const person1 = new Person({
      firstName: 'some name',
      lastName: 'some name', // 1
    })
    const person2 = new Person({
      firstName: 'some name',
      lastName: 'some other name', // 1
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesA)
  })

  const expectedChangesB = 3
  it(`should count ${expectedChangesB} changes between two objects. {testId: 2}`, () => {
    const person1 = new Person({
      address: {
        city: 'some city',
        country: 'some country', // 1
        region: 'some region', // 2
        homeNumber: 6, // 3
      },
    })
    const person2 = new Person({
      address: {
        city: 'some city',
        country: null, // 1
        // 2 - no region
        homeNumber: '6', // 3
      },
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesB)
  })

  const expectedChangesC = 3
  it(`should count ${expectedChangesC} changes between two objects. {testId: 3}`, () => {
    const person1 = new Person({
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 1), // 1
      // 2 - no someOtherDate
      // 3 - no betterDate
    })
    const person2 = new BetterPerson({
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 2), // 1
      someOtherDate: new Date(2000, 0, 5), // 2
      betterDate: new Date(), // 3
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesC)
  })

  const expectedChangesD = 2
  it(`should count ${expectedChangesD} changes between two objects. {testId: 4}`, () => {
    const person1 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            5, // 1
            {
              test: 'test',
              n: null // 2
            },
          ]
        }
      }
    })
    const person2 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            '5', // 1
            {
              test: 'test',
              n: new Date() // 2
            },
          ]
        }
      }
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesD)
  })

  const expectedChangesE = 4
  it(`should count ${expectedChangesE} changes between two objects. {testId: 5}`, () => {
    const person1 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            [
              1,
              2, // 1
              3, // 2
              // 3 - no 5
              // 4 - no 6
            ]
          ]
        }
      }
    })
    const person2 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            [
              1,
              3, // 1
              2, // 2
              5, // 3
              6, // 4
            ]
          ]
        }
      }
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesE)
  })

  const expectedChangesF = 1
  it(`should count ${expectedChangesF} changes between two objects. {testId: 6}`, () => {
    const person1 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            [
              {
                a: new Date(1900, 0),
                b: new Date(), // 1
              }
            ]
          ]
        }
      }
    })
    const person2 = new Person({
      nestedObject: {
        nestedValue: {
          randomList: [
            [
              {
                a: new Date(1900, 0),
                b: new Date(1700, 0), // 1
              }
            ]
          ]
        }
      }
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesF)
  })

  const expectedChangesG = 13
  it(`should count ${expectedChangesG} changes between two objects. {testId: 7}`, () => {
    const person1 = new Person({
      firstName: 'some name',
      lastName: 'some name', // 1
      address: {
        city: 'some city',
        country: 'some country', // 2
        region: 'some region', // 3
        homeNumber: 6, // 4
      },
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 1), // 5
      // 6 - no someOtherDate
      // 7 - no betterDate
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            5, // 8
            {
              test: 'test',
              n: null // 9
            },
            [
              1,
              2, // 10
              3, // 11
              // 12 - no 5
              // 13 - no 6
            ]
          ]
        }
      }
    })
    const person2 = new BetterPerson({
      firstName: 'some name',
      lastName: 'some other name', // 1
      address: {
        city: 'some city',
        country: null, // 2
        // 3 - no region
        homeNumber: '6', // 4
      },
      birthday: new Date(2000, 0, 1),
      someDate: new Date(2000, 0, 2), // 5
      someOtherDate: new Date(2000, 0, 5), // 6
      betterDate: new Date(), // 7
      nestedObject: {
        nestedValue: {
          randomList: [
            'string',
            '5', // 8
            {
              test: 'test',
              n: new Date() // 9
            },
            [
              1,
              3, // 10
              2, // 11
              5, // 12
              6, // 13
            ]
          ]
        }
      }
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesG)
  })

  const expectedChangesH = 0
  it(`should count ${expectedChangesH} changes between two objects. {testId: 8}`, () => {
    const person1 = new Person({
      func: () => { }
    })
    const person2 = new Person({
      func: () => { }
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesH)
  })

  const expectedChangesI = 1
  it(`should count ${expectedChangesI} changes between two objects. {testId: 9}`, () => {
    const person1 = new Person({
      func: () => { },
      nestedObject: {
        nestedValue: {
          randomList: [
            () => { },
            () => { }, // 1
          ]
        }
      }
    })
    const person2 = new Person({
      func: () => { },
      nestedObject: {
        nestedValue: {
          randomList: [
            () => { },
            // 1 - no () => { }
          ]
        }
      }
    })
    expect(countObjectChanges(person1, person2)).toBe(expectedChangesI)
  })
})
