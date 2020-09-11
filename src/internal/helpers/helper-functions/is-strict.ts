
export function isStrict(): boolean {
  // tslint:disable: no-eval
  return eval('(function() { return !this; })()')
}
