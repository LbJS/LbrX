import { getDefaultDevToolsConfig } from 'lbrx/internal/dev-tools/config'

describe(`Dev Tools Config - getDefaultDevToolsConfig():`, () => {

  it(`should return the default config.`, () => {
    expect(getDefaultDevToolsConfig()).toStrictEqual({
      name: `LBRX-STORE`,
      maxAge: 50,
      logEqualStates: false,
      displayValueAsState: false,
      showStackTrace: false,
    })
  })
})
