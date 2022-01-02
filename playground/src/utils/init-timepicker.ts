import { mergeObjects } from 'lbrx/utils'

function getDefaultOptions(): Partial<M.TimepickerOptions> {
  return {
    container: `body`,
  }
}

export function initTimepicker(els: Element, options?: Partial<M.TimepickerOptions>): M.Timepicker {
  options = options ? mergeObjects(getDefaultOptions(), options) : getDefaultOptions()
  return M.Timepicker.init(els, options)
}
