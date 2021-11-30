import { ChangeEvent, ChangeEventHandler } from 'react'

export function onChangeHandler<T = string | number>(setter: (value: T) => void): ChangeEventHandler<HTMLInputElement> {
  return (event: ChangeEvent<HTMLInputElement>) => setter(event.target.value as unknown as T)
}
