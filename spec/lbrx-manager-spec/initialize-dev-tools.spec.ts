import { MockBuilder } from 'mocks'
import { LbrXManager_Type } from 'types'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let LbrXManager: LbrXManager_Type

	beforeEach(async () => {
		const lbrx = await import('lbrx')
		LbrXManager = lbrx.LbrXManager
		MockBuilder.mockWindow()
			.mockReduxDevToolsExtension()
			.build()
	})

	afterEach(() => {
		MockBuilder.deleteAllMocks()
		jest.resetModules()
	})

	it('should return LbrXManager.', () => {
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
