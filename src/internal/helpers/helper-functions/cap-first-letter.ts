
export function capFirstLetter(str: string): string {
  return str && str.charAt(0).toUpperCase() + str.slice(1)
}
