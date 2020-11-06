import { STORE_CONFIG_KEY } from 'lbrx/internal/stores/config'

describe(`Store Accessories - store config key:`, () => {

  it(`should be the expected key.`, () => {
    expect(STORE_CONFIG_KEY).toBe(`storeConfig`)
  })
})
