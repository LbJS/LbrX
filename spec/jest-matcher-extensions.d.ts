
declare global {
  namespace jest {
    interface Matchers<R> {
      toFinishWithin(ms: number): CustomMatcherResult
    }
  }
}

export { }

