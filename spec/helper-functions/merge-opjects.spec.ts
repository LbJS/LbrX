import { MergedTestSubjectFactory } from 'helpers/factories'
import { MergeTestSubject } from 'helpers/test-subjects'
import { mergeObjects } from 'lbrx/helpers'

describe('Helper Function - mergeObjects():', () => {

  const func = () => { }

  it('should return a merged object.', () => {
    const [oA, oB, oC]: MergeTestSubject[] = MergedTestSubjectFactory.createMergeTestSubject()
    const objA = oA
    const objB = oB
    const expectedObj = oC
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(expectedObj)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | resultObj
    ${1.1}  | ${{ a: 'a', b: 'b' }}                                     | ${{ a: 'a', b: 'c' }}                                     | ${{ a: 'a', b: 'c' }}
    ${1.2}  | ${{ a: func, b: null }}                                   | ${{ a: false, b: func }}                                  | ${{ a: false, b: func }}
    ${1.3}  | ${{ a: func }}                                            | ${{ a: func }}                                            | ${{ a: func }}
    ${1.4}  | ${{ a: 'a', b: 'b', c: '3' }}                             | ${{ a: null, b: undefined, c: 3 }}                        | ${{ a: null, b: undefined, c: 3 }}
    ${1.5}  | ${{ a: 0, b: 0, c: 0 }}                                   | ${{ a: null, b: undefined, c: '' }}                       | ${{ a: null, b: undefined, c: '' }}
    ${1.6}  | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 1) }}   | ${{ a: new Date(2000, 0, 1), b: null }}                   | ${{ a: new Date(2000, 0, 1), b: null }}
    ${1.7}  | ${{ a: null, b: new Date(2000, 0, 1) }}                   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}
    ${1.8}  | ${{ a: undefined, b: new Date(2000, 0, 1) }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}
    ${1.9}  | ${{ a: null, b: undefined }}                              | ${{ a: undefined, b: null }}                              | ${{ a: undefined, b: null }}
    ${1.10} | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}
    ${1.11} | ${{ a: [], b: {} }}                                       | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}
    ${1.12} | ${{ a: {}, b: {} }}                                       | ${{ a: new Date(2000, 0, 1), b: func }}                   | ${{ a: new Date(2000, 0, 1), b: func }}
    ${1.13} | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}
  `('should return a merged object. (testId: $testId)', ({ objA, objB, resultObj }) => {
    expect(mergeObjects(objA, objB)).toStrictEqual(resultObj)
  })
})
