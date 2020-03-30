import { mockWindow, mockReduxDevToolsExtension, deleteMockedWindow, mockLocalStorage, deleteLocalStorageMock } from 'mocks'

export default class MockBuilder {

	private static jobsList: (() => any)[] = []

	private constructor() { }

	public static mockWindow(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockWindow)
		return MockBuilder
	}

	public static mockReduxDevToolsExtension(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockReduxDevToolsExtension)
		return MockBuilder
	}

	public static mockLocalStorage(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockLocalStorage)
		return MockBuilder
	}

	public static build(): void {
		if (!MockBuilder.jobsList.map(f => f.name).includes(mockWindow.name)) {
			mockWindow()
		}
		MockBuilder.jobsList.forEach(f => f())
		MockBuilder.jobsList = []
	}

	public static deleteAllMocks(): void {
		deleteLocalStorageMock()
		deleteMockedWindow()
	}
}
