
export function mockReduxDevToolsExtension(): void {
  const devTools = {
    init: () => { },
    send: () => { },
    subscribe: () => { },
  }
  globalThis.__REDUX_DEVTOOLS_EXTENSION__ = {
    connect: (config: object) => {
      globalThis.__REDUX_DEVTOOLS_EXTENSION__.config = config
      return devTools
    },
  }
}

export function deleteReduxDevToolsExtensionMock(): void {
  delete globalThis.__REDUX_DEVTOOLS_EXTENSION__
}
