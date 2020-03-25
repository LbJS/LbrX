import MockBuilder from 'mock-builder'
import { LbrXManager } from 'lbrx'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let lbrxManager: typeof LbrXManager

	beforeEach(async () => {
		const provider = (await import('provider')).default
		lbrxManager = provider.provide(LbrXManager.name)
		MockBuilder.mockWindow()
			.mockReduxDevToolsExtension()
			.build()
	})

	afterEach(() => {
		MockBuilder.deleteAllMocks()
		jest.resetModules()
	})

	it('should return LbrXManager.', () => {
		lbrxManager.initializeDevTools({ name: 'NEW-NAME' })
		expect((window as any).__REDUX_DEVTOOLS_EXTENSION__.config).toMatchObject({
			name: 'NEW-NAME'
		})
	})

	it('should return LbrXManager.', () => {
		const value = lbrxManager.initializeDevTools()
		expect(value).toStrictEqual(lbrxManager)
	})
})
