import MockBuilder from 'mock-builder'
import { LbrXManager as LbrXManager_type } from 'lbrx'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let LbrXManager: typeof LbrXManager_type

	beforeEach(async () => {
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		MockBuilder.addReduxDevToolsExtensionMock()
			.buildMocks()
	})

	afterEach(() => {
		MockBuilder.deleteAllMocks()
		jest.resetModules()
	})

	it('should initialize set Redux DevTools configurations.', () => {
		LbrXManager.initializeDevTools({ name: 'NEW-NAME' })
		expect((window as any).__REDUX_DEVTOOLS_EXTENSION__.config).toMatchObject({
			name: 'NEW-NAME'
		})
	})

	it('should return LbrXManager.', () => {
		const value = LbrXManager.initializeDevTools()
		expect(value).toStrictEqual(LbrXManager)
	})
})
