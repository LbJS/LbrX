import { mergeObjects } from 'lbrx/utils'

function getDefaultOptions(): Partial<M.DatepickerOptions> {
  return {
    container: document.getElementsByTagName(`body`)[0],
  }
}

export function initDatepicker(els: Element, options?: Partial<M.DatepickerOptions>): M.Datepicker {
  options = options ? mergeObjects(getDefaultOptions(), options) : getDefaultOptions()
  return M.Datepicker.init(els, options)
}
