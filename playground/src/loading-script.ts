import { validateBrowserVer } from './utils/browser-ver-validator'

// tslint:disable: only-arrow-functions
// tslint:disable: prefer-const
// tslint:disable: no-var-keyword

(function (): void {
  validateBrowserVer()
  if (!Element.prototype.hasOwnProperty(`remove`)) return // ie
  var scriptContainer = document.getElementById(`loadingScript`)
  if (scriptContainer) scriptContainer.remove()
})()
