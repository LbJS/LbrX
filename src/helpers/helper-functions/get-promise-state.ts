import { PromiseStates } from './promise-states.enum'

export function getPromiseState(promise: Promise<any>): Promise<PromiseStates> {
  const obj = {}
  return Promise.race([promise, obj])
    .then(result => result === obj ?
      PromiseStates.pending :
      PromiseStates.fulfilled,
      () => PromiseStates.rejected
    )
}
