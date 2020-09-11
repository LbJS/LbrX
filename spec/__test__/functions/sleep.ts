
export function sleep(ms?: number): Promise<void> {
  return new Promise(resolve => {
    return (ms && ms > 0) ? setTimeout(resolve, ms) : resolve()
  })
}
