import { getDefaultGlobalStoreConfig, StoreConfig, STORE_CONFIG_KEY } from 'lbrx/internal/stores/config'

describe(`Store Accessories - store config decorator:`, () => {

  it(`should insert store's configuration into class's constructor object under STORE_CONFIG_KEY key.`, () => {
    @StoreConfig({
      name: `FOO-STORE`
    })
    class FooStore { }
    const fooStore = new FooStore()
    const expectedStoreConfig = Object.assign({ name: `FOO-STORE` }, getDefaultGlobalStoreConfig())
    expect(fooStore.constructor[STORE_CONFIG_KEY]).toStrictEqual(expectedStoreConfig)
  })

  it(`should throw if the decorator is not decorating a class.`, () => {
    expect(() => {
      const CastedToAnyStoreConfig: any = StoreConfig
      class FooStore {

        @CastedToAnyStoreConfig({
          name: `FOO-STORE`
        })
        public FooProp: any
      }
      const store = new FooStore()
    }).toThrow()
  })
})
