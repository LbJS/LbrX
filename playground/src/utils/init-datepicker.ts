import { mergeObjects } from 'lbrx/utils'
import { Datepicker } from 'materialize-css'

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

function extendAndFixOnDrawMethod(onDrawFromUser: (this: Datepicker) => void): any {
  // tslint:disable-next-line: only-arrow-functions
  return function (datepicker: Datepicker): void {
    onDrawFromUser.bind(datepicker)
    onDraw(datepicker)
  } as unknown as any
}

function getDefaultOptions(): Partial<M.DatepickerOptions> {
  return {
    container: document.getElementsByTagName(`body`)[0],
    yearRange: 50,
    onDraw: onDraw as unknown as any
  }
}

export function initDatepicker(el: Element, options?: Partial<M.DatepickerOptions>): M.Datepicker {
  if (options?.onDraw) options.onDraw = extendAndFixOnDrawMethod(options.onDraw)
  options = options ? mergeObjects(getDefaultOptions(), options) : getDefaultOptions()
  return M.Datepicker.init(el, options)
}
