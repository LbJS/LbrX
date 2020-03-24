
export function mockReduxDevToolsExtension(): void {
	const devTools = {
		send: () => { },
		subscribe: () => { },
	};
	(window as any).__REDUX_DEVTOOLS_EXTENSION__ = {
		connect: (config: object) => {
			(window as any).__REDUX_DEVTOOLS_EXTENSION__.config = config
			return devTools
		},
	}
}
