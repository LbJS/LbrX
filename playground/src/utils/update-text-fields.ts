import { Subject } from 'rxjs'
import { debounceTime, take } from 'rxjs/operators'

const debouncerSubject = new Subject<void>()
const debouncer = debouncerSubject.pipe(debounceTime(30))
debouncer.subscribe(() => {
  M.updateTextFields()
  const textareaElements = document.querySelectorAll(`.materialize-textarea`)
  textareaElements.forEach(textareaEl => {
    M.textareaAutoResize(textareaEl)
  })
})

export function updateTextFields(): Promise<void> {
  debouncerSubject.next()
  return debouncer.pipe(take(1)).toPromise()
}
