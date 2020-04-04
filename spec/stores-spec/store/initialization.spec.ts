import { createInitialUiState, NullStateStore, UiStateStore, createCommonModel } from 'test-subjects'
import { LbrXManager as LbrXManager_type } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'

describe('Store Initialization: ', () => {

	let uiStore: UiStateStore
	let nullStore: NullStateStore
	let LbrXManager: typeof LbrXManager_type
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		uiStore = provider.provide(UiStateStore.name)
		nullStore = provider.provide(NullStateStore.name)
		LbrXManager = provider.provide(LbrXManager_type.name)
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
		expect(nullStore.value).toBeNull()
	})

	it('should set the initial value after initialization.', () => {
		nullStore.initialize(createCommonModel())
		expect(nullStore.value).toStrictEqual(createCommonModel())
	})

	it('should return the initial state from observable after initialization.', done => {
		nullStore.select().subscribe(value => {
			expect(value).toStrictEqual(createCommonModel())
			done()
		})
		nullStore.initialize(createCommonModel())
	}, 100)

	it('should throw on second initialization in development mode.', () => {
		nullStore.initialize(createCommonModel())
		expect(() => {
			isDev() && nullStore.initialize(createCommonModel())
		}).toThrow()
	})

	it('should not throw on second initialization in production mode.', () => {
		LbrXManager.enableProdMode()
		nullStore.initialize(createCommonModel())
		expect(() => {
			nullStore.initialize(createCommonModel())
		}).not.toThrow()
	})

	it('should not contain second initialization value in production mode.', () => {
		LbrXManager.enableProdMode()
		nullStore.initialize(createCommonModel())
		nullStore.initialize({ data: 'test' })
		expect(nullStore.value).toStrictEqual(createCommonModel())
	})

	it('should have value after loading is finished.', done => {
		nullStore.isLoading$
			.subscribe(value => {
				if (!value) {
					expect(nullStore.value).toStrictEqual(createCommonModel())
					done()
				}
			})
		nullStore.initialize(createCommonModel())
	}, 100)

	// TODO: hooks test
})
