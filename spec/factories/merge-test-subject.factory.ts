import { MergeTestSubject } from 'test-subjects'

export class MergedTestSubjectFactory {

  public static createMergeTestSubject(): MergeTestSubject {
    // [obj1, obj2, expectedObj]
    return {
      a: [null, 'a', 'a']
    }
  }
}
