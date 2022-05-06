import { cloneObject, mergeObjects } from 'lbrx/utils'
import { Datepicker } from 'materialize-css'

export interface DatepickerOptionsExtensions {
  onChange?: ((this: Datepicker, newDate: Date | null) => void) | null,
}

interface DatepickerDataHelper {
  date?: Date | null,
  onDoneClick?: (<K extends keyof HTMLElementEventMap>(this: HTMLButtonElement, ev: HTMLElementEventMap[K]) => any) | null,
}

function scrollToSelectedYear(yearSelectDropdownEl: HTMLElement): void {
  yearSelectDropdownEl.style.position = `fixed`
  yearSelectDropdownEl.style.scrollBehavior = `smooth`
}

function onDraw(datepicker: Datepicker): void {
  setTimeout(() => {
    const modalEl: HTMLElement | undefined = datepicker[`modalEl`]
    const yearSelectDropdownTriggerEl = modalEl?.querySelector(`.select-wrapper.select-year input.select-dropdown.dropdown-trigger`)
    const yearSelectDropdownElId = yearSelectDropdownTriggerEl?.getAttribute(`data-target`)
    if (!yearSelectDropdownElId) return
    const yearSelectDropdownEl = document.getElementById(yearSelectDropdownElId)
    if (!yearSelectDropdownEl) return
    yearSelectDropdownTriggerEl?.addEventListener(`click`, () => scrollToSelectedYear(yearSelectDropdownEl), { once: true })
  }, 250)
}

function extendAndFixOnDrawMethod(onDrawFromUser?: ((this: Datepicker) => void) | null): any {
  return (datepicker: Datepicker) => {
    onDrawFromUser?.call(datepicker)
    onDraw(datepicker)
  }
}

function onOpen(
  this: Datepicker,
  datepickerData: DatepickerDataHelper,
  onChangeFromUser?: ((this: Datepicker, newDate: Date | null) => void) | null,
): void {
  datepickerData.date ||= cloneObject(this.date)
  if (datepickerData.onDoneClick) this.doneBtn.removeEventListener(`click`, datepickerData.onDoneClick)
  datepickerData.onDoneClick = () => {
    datepickerData.date = cloneObject(this.date)
    onChangeFromUser?.call(this, datepickerData.date || null)
  }
  this.doneBtn.addEventListener(`click`, datepickerData.onDoneClick, { once: true })
}

function extendOnOpen(
  datepickerData: DatepickerDataHelper,
  onOpenFromUser?: ((this: Datepicker) => void) | null,
  onChangeFromUser?: ((this: Datepicker, newDate: Date | null) => void) | null,
): (this: Datepicker) => void {
  return function (this: Datepicker): void {
    onOpenFromUser?.call(this)
    onOpen.call(this, datepickerData, onChangeFromUser)
  }
}

function onClose(
  this: Datepicker,
  datepickerData: DatepickerDataHelper,
): void {
  setTimeout(() => {
    if (datepickerData.onDoneClick) this.doneBtn.removeEventListener(`click`, datepickerData.onDoneClick)
    this.setDate(datepickerData.date || undefined)
    this.setInputValue()
  })
}

function extendOnClose(
  datepickerData: DatepickerDataHelper,
  onCloseFromUser?: ((this: Datepicker) => void) | null,
): (this: Datepicker) => void {
  return function (this: Datepicker): void {
    onCloseFromUser?.call(this)
    onClose.call(this, datepickerData)
  }
}

function getDefaultOptions(): Partial<M.DatepickerOptions> {
  return {
    container: document.getElementsByTagName(`body`)[0],
    yearRange: 50,
  }
}

export function initDatepicker(el: Element, options?: Partial<M.DatepickerOptions & DatepickerOptionsExtensions>): M.Datepicker {
  options ||= {}
  const datepickerData: DatepickerDataHelper = {}
  options.onDraw = extendAndFixOnDrawMethod(options.onDraw)
  options.onOpen = extendOnOpen(datepickerData, options.onOpen, options.onChange)
  options.onClose = extendOnClose(datepickerData, options.onClose)
  options = mergeObjects(getDefaultOptions(), options)
  return M.Datepicker.init(el, options)
}
