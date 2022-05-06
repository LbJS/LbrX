import { isNumber, mergeObjects } from 'lbrx/utils'
import { Modal, Timepicker } from 'materialize-css'

export interface TimepickerOptionsExtensions {
  onChange?: ((this: Modal, hours: number, minutes: number) => void) | null,
}

interface TimepickerDataHelper {
  time?: {
    hours: number,
    minutes: number,
  } | null,
  onDoneClick?: (<K extends keyof HTMLElementEventMap>(this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any) | null,
  timepicker?: Timepicker
  doneBtn?: HTMLButtonElement
}

function onOpenEnd(
  this: Modal,
  el: Element,
  timepickerData: TimepickerDataHelper,
  onChangeFromUser?: ((this: Modal, hours: number, minutes: number) => void) | null,
): void {
  if (!isNumber(timepickerData.timepicker?.[`hours`])
    || !isNumber(timepickerData.timepicker?.[`minutes`])
    || !timepickerData.timepicker
  ) {
    return
  }
  timepickerData.time ||= {
    hours: timepickerData.timepicker![`hours`],
    minutes: timepickerData.timepicker![`minutes`],
  }
  if (timepickerData.onDoneClick && timepickerData.doneBtn) {
    timepickerData.doneBtn.removeEventListener(`click`, timepickerData.onDoneClick)
  }
  if (!timepickerData.doneBtn) timepickerData.doneBtn = findDoneBtn(el, timepickerData.timepicker.options)
  if (!timepickerData.doneBtn) return
  timepickerData.onDoneClick = () => {
    if (!isNumber(timepickerData.timepicker?.[`hours`])
      || !isNumber(timepickerData.timepicker?.[`minutes`])
      || !timepickerData.timepicker
    ) {
      return
    }
    timepickerData.time = {
      hours: timepickerData.timepicker![`hours`],
      minutes: timepickerData.timepicker![`minutes`],
    }
    const { hours, minutes }: { hours: number, minutes: number } = timepickerData.timepicker.options.twelveHour ?
      resolve24Hours(timepickerData.time, timepickerData.timepicker.amOrPm) :
      { hours: timepickerData.time.hours, minutes: timepickerData.time.minutes }
    onChangeFromUser?.call(this, hours, minutes)
  }
  timepickerData.doneBtn.addEventListener(`click`, timepickerData.onDoneClick, { once: true })
}

function findDoneBtn(timepickerModal: Element, timepickerOptions: M.TimepickerOptions): HTMLButtonElement | undefined {
  const closeBtns = timepickerModal.querySelectorAll<HTMLButtonElement>(`button.timepicker-close`)
  for (const closeBtn of closeBtns) {
    if (closeBtn.textContent?.toLowerCase() == timepickerOptions.i18n.done?.toLocaleLowerCase()) return closeBtn
  }
  return
}

function resolve24Hours(time: NonNullable<TimepickerDataHelper[`time`]>, amOrPm: string): { hours: number, minutes: number } {
  const result = { hours: time.hours, minutes: time.minutes }
  if (amOrPm.toLowerCase() == `am` && result.hours == 12) {
    result.hours = 0
  } else if (amOrPm.toLowerCase() == `pm` && result.hours < 12) {
    result.hours += 12
  }
  return result
}

function extendOnOpenEnd(
  timepickerData: TimepickerDataHelper,
  onOpenEndFromUser?: ((this: Modal, el: Element) => void) | null,
  onChangeFromUser?: ((this: Modal, hours: number, minutes: number) => void) | null,
): (this: Modal, el: Element) => void {
  return function (this: Modal, el: Element): void {
    onOpenEndFromUser?.call(this, el)
    onOpenEnd.call(this, el, timepickerData, onChangeFromUser)
  }
}

function onCloseEnd(
  this: Modal,
  timepickerData: TimepickerDataHelper,
): void {
  setTimeout(() => {
    if (timepickerData.onDoneClick && timepickerData.doneBtn) {
      timepickerData.doneBtn.removeEventListener(`click`, timepickerData.onDoneClick)
    }
    if (isNumber(timepickerData.time?.hours) && isNumber(timepickerData.time?.minutes)) {
      timepickerData.timepicker![`hours`] = timepickerData.time!.hours
      timepickerData.timepicker![`hours`] = timepickerData.time!.minutes
    }
  })
}

function extendOnCloseEnd(
  timepickerData: TimepickerDataHelper,
  onCloseEndFromUser?: ((this: Modal, el: Element) => void) | null,
): (this: Modal, el: Element) => void {
  return function (this: Modal, el: Element): void {
    onCloseEndFromUser?.call(this, el)
    onCloseEnd.call(this, timepickerData)
  }
}

function getDefaultOptions(): Partial<M.TimepickerOptions> {
  return {
    container: `body`,
  }
}

export function initTimepicker(els: Element, options?: Partial<M.TimepickerOptions & TimepickerOptionsExtensions>): M.Timepicker {
  options ||= {}
  const timepickerData: TimepickerDataHelper = {}
  options.onOpenEnd = extendOnOpenEnd(timepickerData, options.onOpenEnd, options.onChange)
  options.onCloseEnd = extendOnCloseEnd(timepickerData, options.onCloseEnd)
  options = options ? mergeObjects(getDefaultOptions(), options) : getDefaultOptions()
  timepickerData.timepicker = M.Timepicker.init(els, options)
  return timepickerData.timepicker
}
