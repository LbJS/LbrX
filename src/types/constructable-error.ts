
export interface ConstructableError {
  // tslint:disable-next-line: no-misused-new
  constructor(message?: string): void
}
