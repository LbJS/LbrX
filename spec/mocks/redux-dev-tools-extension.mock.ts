import { Window_Type } from 'types'

export function mockReduxDevToolsExtension(windowMock: Window_Type): Window_Type {
	const devTools = {
		send: () => { },
		subscribe: () => { },
	};
	(windowMock as any).__REDUX_DEVTOOLS_EXTENSION__ = {
		connect: (config: object) => {
			(windowMock as any).__REDUX_DEVTOOLS_EXTENSION__.config = config
			return devTools
		},
	}
	return windowMock
}
