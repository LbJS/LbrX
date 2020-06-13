import { MergedTestSubjectFactory } from 'helpers/factories'
import { MergeTestSubject } from 'helpers/test-subjects'
import { mergeObjects } from 'lbrx/helpers'

describe('Helper Function - mergeObjects():', () => {

  let objA: MergeTestSubject
  let objB: MergeTestSubject
  let expectedObj: MergeTestSubject

  beforeEach(() => {
    // [obj1, obj2, expectedObj]
    const [oA, oB, oC]: MergeTestSubject[] = MergedTestSubjectFactory.createMergeTestSubject()
    objA = oA
    objB = oB
    expectedObj = oC
  })

  it('should merge objects.', () => {
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(expectedObj)
  })
})
