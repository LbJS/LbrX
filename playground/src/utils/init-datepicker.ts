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

function getDefaultOptions(): Partial<M.DatepickerOptions> {
  return {
    container: document.getElementsByTagName(`body`)[0],
    yearRange: 50,
    onDraw: onDraw as unknown as any
  }
}

export function initDatepicker(els: Element, options?: Partial<M.DatepickerOptions>): M.Datepicker {
  options = options ? mergeObjects(getDefaultOptions(), options) : getDefaultOptions()
  return M.Datepicker.init(els, options)
}
