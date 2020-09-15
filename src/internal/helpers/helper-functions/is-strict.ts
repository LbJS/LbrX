
let _isStrict: boolean | null = null

// tslint:disable: no-eval
export function isStrict(): boolean {
  if (_isStrict !== null) return _isStrict
  _isStrict = eval('(function() { return !this; })()') as boolean
  return _isStrict
}
