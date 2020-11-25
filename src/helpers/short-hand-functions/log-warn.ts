
export function logWarn(message: any, ...optionalParams: any[]): void {
  optionalParams ? console.warn(message, optionalParams) : console.warn(message)
}
