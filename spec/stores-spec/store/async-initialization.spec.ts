import { NullStateStore, createCommonModel } from 'test-subjects'
import { LbrXManager as LbrXManager_type } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'
import { of, timer, throwError } from 'rxjs'

describe('Store Async Initialization:', () => {

	let nullStore: NullStateStore
	let LbrXManager: typeof LbrXManager_type
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		nullStore = provider.provide(NullStateStore.name)
		LbrXManager = provider.provide(LbrXManager_type.name)
		isDev = provider.provide(isDevFunc.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should have null as an initial value.', () => {
		expect(nullStore.value).toBeNull()
	})

	it('should set the initial value after async initialization with observable.', async () => {
		await nullStore.initializeAsync(of(createCommonModel()))
		expect(nullStore.value).toStrictEqual(createCommonModel())
	})

	it('should set the initial value after async initialization with promise.', async () => {
		await nullStore.initializeAsync(Promise.resolve(createCommonModel()))
		expect(nullStore.value).toStrictEqual(createCommonModel())
	})

	it('should return the initial state from observable after async initialization.', done => {
		nullStore.select().subscribe(value => {
			if (value) {
				expect(value).toStrictEqual(createCommonModel())
				done()
			}
		})
		nullStore.initializeAsync(of(createCommonModel()))
	}, 100)

	it('should throw on second initialization in development mode.', async () => {
		nullStore.initializeAsync(of(createCommonModel()))
		await expect(isDev() && nullStore.initializeAsync(of(createCommonModel()))).rejects.toBeDefined()
	})

	it('should throw on second initialization with delay in development mode .', async () => {
		nullStore.initializeAsync(of(createCommonModel()))
		await timer(100).toPromise()
		await expect(isDev() && nullStore.initializeAsync(of(createCommonModel()))).rejects.toBeDefined()
	}, 200)

	it('should not throw on second initialization in production mode.', async () => {
		LbrXManager.enableProdMode()
		nullStore.initializeAsync(of(createCommonModel()))
		await expect(nullStore.initializeAsync(of(createCommonModel()))).resolves.toBeUndefined()
	})

	it('should not throw on second initialization with delay in production mode.', async () => {
		LbrXManager.enableProdMode()
		nullStore.initializeAsync(of(createCommonModel()))
		await timer(100).toPromise()
		await expect(nullStore.initializeAsync(of(createCommonModel()))).resolves.toBeUndefined()
	}, 200)

	it('should reject if an observable throws an error.', async () => {
		await expect(nullStore.initializeAsync(throwError('Error'))).rejects.toBeDefined()
	})

	it('should have value after loading is finished.', done => {
		nullStore.isLoading$
			.subscribe(value => {
				if (!value) {
					expect(nullStore.value).toStrictEqual(createCommonModel())
					done()
				}
			})
		nullStore.initializeAsync(Promise.resolve(createCommonModel()))
	}, 100)

	// TODO: hooks test
})
