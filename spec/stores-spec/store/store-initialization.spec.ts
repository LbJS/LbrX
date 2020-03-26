import { createInitialUiState, NullStateStore, UiStateStore, createCommonModel } from 'test-subjects'
import { LbrXManager } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'

describe('Store Initialization: ', () => {

	let uiStore: UiStateStore
	let nullService: NullStateStore
	let lbrxManager: typeof LbrXManager
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		uiStore = provider.provide(UiStateStore.name)
		nullService = provider.provide(NullStateStore.name)
		lbrxManager = provider.provide(LbrXManager.name)
		isDev = provider.provide(isDevFunc.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set the initial value as the first state.', () => {
		expect(uiStore.value).toStrictEqual(createInitialUiState())
	})

	it("should set the initial value to store's initial value.", () => {
		expect(uiStore.value).toStrictEqual(uiStore.initialValue)
	})

	it('should return the initial state from observable.', done => {
		uiStore.select().subscribe(value => {
			expect(value).toStrictEqual(createInitialUiState())
			done()
		})
	}, 100)

	it('should have null as an initial value.', () => {
		expect(nullService.value).toBeNull()
	})

	it('should set the initial value after initialization.', () => {
		nullService.initialize(createCommonModel())
		expect(nullService.value).toStrictEqual(createCommonModel())
	})

	it('should return the initial state from observable after initialization.', done => {
		nullService.select().subscribe(value => {
			expect(value).toStrictEqual(createCommonModel())
			done()
		})
		nullService.initialize(createCommonModel())
	}, 100)

	it('should throw on second initialization in development mode.', () => {
		nullService.initialize(createCommonModel())
		expect(() => {
			isDev() && nullService.initialize(createCommonModel())
		}).toThrow()
	})

	it('should not throw on second initialization in production mode.', () => {
		lbrxManager.enableProdMode()
		nullService.initialize(createCommonModel())
		expect(() => {
			nullService.initialize(createCommonModel())
		}).not.toThrow()
	})

	it('should not contain second initialization value in production mode.', () => {
		lbrxManager.enableProdMode()
		nullService.initialize(createCommonModel())
		nullService.initialize({ data: 'test' })
		expect(nullService.value).toStrictEqual(createCommonModel())
	})

	it('should have value after loading is finished.', done => {
		nullService.isLoading$
			.subscribe(value => {
				if (!value) {
					expect(nullService.value).toStrictEqual(createCommonModel())
					done()
				}
			})
		nullService.initialize(createCommonModel())
	}, 100)
})
