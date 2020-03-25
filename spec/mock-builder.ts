import { mockWindow, mockReduxDevToolsExtension, deleteMockedWindow } from 'mocks'

export default class MockBuilder {

	private static jobsList: (() => any)[] = []

	private constructor() { }

	public static mockWindow(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockWindow)
		return MockBuilder
	}

	public static mockReduxDevToolsExtension(): typeof MockBuilder {
		if (!MockBuilder.jobsList.map(f => f.name).includes(mockWindow.name)) {
			throw new Error('Build Window object first before building Redux Dev Tools Extension.')
		}
		MockBuilder.jobsList.push(mockReduxDevToolsExtension)
		return MockBuilder
	}

	public static build(): void {
		MockBuilder.jobsList.forEach(f => f())
		MockBuilder.jobsList = []
	}

	public static deleteAllMocks(): void {
		deleteMockedWindow()
	}
}
