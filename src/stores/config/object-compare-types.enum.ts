
/**
 * Object compare types.
 */
export const enum ObjectCompareTypes {
  /**
   * Object's change detection will be checked by object's reference.
   * Using === operator.
   * - Very fast for big objects and heavy callbacks.
   */
  reference,
  /**
   * Object's change detection will be checked by comparing stringified objects.
   * - Fast for big objects and medium callbacks.
   */
  simple,
  /**
   * Object's change detection will be triggered by deep value comparison.
   * - Best for small objects.
   * - May improve performance for heavy callbacks.
   */
  advanced,
}
