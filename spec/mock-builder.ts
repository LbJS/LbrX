import { mockWindow, mockReduxDevToolsExtension, deleteMockedWindow, mockLocalStorage, deleteLocalStorageMock, mockSessionStorage, deleteSessionStorageMock, deleteReduxDevToolsExtensionMock } from 'mocks'

export default class MockBuilder {

	private static jobsList: (() => any)[] = []

	private constructor() { }

	public static addWindowMock(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockWindow)
		return MockBuilder
	}

	public static addReduxDevToolsExtensionMock(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockReduxDevToolsExtension)
		return MockBuilder
	}

	public static addLocalStorageMock(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockLocalStorage)
		return MockBuilder
	}

	public static addSessionStorageMock(): typeof MockBuilder {
		MockBuilder.jobsList.push(mockSessionStorage)
		return MockBuilder
	}

	public static buildMocks(): void {
		if (!MockBuilder.jobsList.map(f => f.name).includes(mockWindow.name)) {
			mockWindow()
		}
		MockBuilder.jobsList.forEach(f => f())
		MockBuilder.jobsList = []
	}

	public static deleteAllMocks(): void {
		deleteReduxDevToolsExtensionMock()
		deleteLocalStorageMock()
		deleteSessionStorageMock()
		deleteMockedWindow()
	}
}
