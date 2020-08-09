
export function logWarn(message: any, ...optionalParams: any[]): void {
  optionalParams.length ? console.warn(message, optionalParams) : console.warn(message)
}
