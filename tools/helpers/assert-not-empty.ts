
export function assertNotEmpty(value: any): asserts value {
  if (value === null || value === undefined) {
    throw new Error('Value does not exist.')
  }
}
