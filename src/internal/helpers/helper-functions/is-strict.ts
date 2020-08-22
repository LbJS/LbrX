
export function isStrict(): boolean {
  // tslint:disable
  var x = true
  eval('var x=false')
  return x
}
