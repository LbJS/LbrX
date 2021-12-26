import { ChangeEvent, ChangeEventHandler } from 'react'

export function onChangeHandler<T = string | number | boolean>(
  setter: (value: T) => void
): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.type == `checkbox`) {
      setter((event.target as HTMLInputElement).checked as unknown as T)
    } else {
      setter(event.target.value as unknown as T)
    }
  }
}
