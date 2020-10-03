import { enableStackTracingErrors as enableStackTracingErrors_type, isStackTracingErrors as isStackTracingErrors_type } from 'lbrx/internal/core'

describe('stack-tracing-errors:', () => {

  let enableStackTracingErrors: typeof enableStackTracingErrors_type
  let isStackTracingErrors: typeof isStackTracingErrors_type

  beforeEach(async () => {
    const provider = await import('provider')
    enableStackTracingErrors = provider.enableStackTracingErrors
    isStackTracingErrors = provider.isStackTracingErrors
  })

  it('should be disabled by default.', () => {
    expect(isStackTracingErrors()).toBeFalsy()
  })

  it('should be enabled by default after enabling.', () => {
    enableStackTracingErrors()
    expect(isStackTracingErrors()).toBeTruthy()
  })
})
