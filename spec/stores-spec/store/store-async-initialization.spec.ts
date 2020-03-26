import { NullStateStore, createCommonModel } from 'test-subjects'
import { LbrXManager } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'
import { of, timer, throwError } from 'rxjs'

describe('Store Async Initialization:', () => {

	let nullStore: NullStateStore
	let lbrxManager: typeof LbrXManager
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		nullStore = provider.provide(NullStateStore.name)
		lbrxManager = provider.provide(LbrXManager.name)
		isDev = provider.provide(isDevFunc.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

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
		lbrxManager.enableProdMode()
		nullStore.initializeAsync(of(createCommonModel()))
		await expect(nullStore.initializeAsync(of(createCommonModel()))).resolves.toBeUndefined()
	})

	it('should not throw on second initialization with delay in production mode.', async () => {
		lbrxManager.enableProdMode()
		nullStore.initializeAsync(of(createCommonModel()))
		await timer(100).toPromise()
		await expect(nullStore.initializeAsync(of(createCommonModel()))).resolves.toBeUndefined()
	}, 200)

	it('should reject if an observable throws an error.', async () => {
		await expect(nullStore.initializeAsync(throwError('Error'))).rejects.toBeDefined()
	})
})
