import { Store as Store_type, StoreConfig } from 'lbrx'
import { TestSubjectConfigurations, TestSubjectA, TestSubjectsFactory } from 'test-subjects'
import { StoreOnOverride } from 'lbrx/hooks'

describe('Store onOverride():', () => {

	const initialState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.initial)
	const createNextState = () => TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
	let Store: typeof Store_type
	let store: Store_type<TestSubjectA> & StoreOnOverride<TestSubjectA>

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		Store = providerModule.Store
		@StoreConfig({
			name: 'ON-OVERRIDE-TEST-STORE'
		})
		class OnOverrideTestStore extends Store<TestSubjectA> implements StoreOnOverride {
			constructor() {
				super(initialState)
			}
			onOverride(newState: TestSubjectA, oldState: Readonly<TestSubjectA>): TestSubjectA | void { }
		}
		store = new OnOverrideTestStore()
	})

	afterEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
	})

	it('should be called if implemented.', () => {
		const onOverrideSpy = jest.spyOn(store, 'onOverride')
		const newState = createNextState()
		store.override(newState)
		expect(onOverrideSpy).toBeCalled()
	})

	it("shouldn't be called if not implemented.", () => {
		const onOverrideSpy = jest.spyOn(store, 'onOverride')
		delete store.onOverride
		const newState = createNextState()
		store.override(newState)
		expect(onOverrideSpy).not.toBeCalled()
	})

	it('should get the newState and the oldState as arguments.', done => {
		const nextState = createNextState()
		jest.spyOn(store, 'onOverride')
			.mockImplementation((newState: TestSubjectA, oldState: Readonly<TestSubjectA>): void => {
				expect(newState).toStrictEqual(nextState)
				expect(oldState).toStrictEqual(initialState)
				done()
			})
		store.override(nextState)
	})

	it('should change the new state.', () => {
		const nextState = createNextState()
		jest.spyOn(store, 'onOverride')
			.mockImplementation((newState: TestSubjectA): TestSubjectA => {
				newState.dateValue?.setFullYear(1900)
				return newState
			})
		store.override(nextState)
		expect(store.value).not.toStrictEqual(nextState)
		expect(nextState.dateValue).toBeTruthy()
		nextState.dateValue?.setFullYear(1900)
		expect(store.value).toStrictEqual(nextState)
	})

	it('should supply a readonly oldState.', done => {
		const nextState = createNextState()
		jest.spyOn(store, 'onOverride')
			.mockImplementation((newState: TestSubjectA, oldState: Readonly<TestSubjectA>): void => {
				expect(() => {
					oldState.dateValue?.setFullYear(1900)
				}).toThrow()
				done()
			})
		store.override(nextState)
	})

	it("should disconnect newState object's references.", () => {
		const nextState = createNextState()
		jest.spyOn(store, 'onOverride')
			.mockImplementation((newState: TestSubjectA): void => {
				newState.dateValue?.setFullYear(1900)
				newState.stringValue = 'some new value'
			})
		store.override(nextState)
		expect(store.value).toStrictEqual(nextState)
		jest.resetAllMocks()
		let tmpState: TestSubjectA | null = null
		jest.spyOn(store, 'onOverride')
			.mockImplementation((newState: TestSubjectA): TestSubjectA => {
				tmpState = newState
				return newState
			})
		store.override(nextState)
		if (tmpState) {
			(tmpState as TestSubjectA).dateValue?.setFullYear(1900);
			(tmpState as TestSubjectA).stringValue = 'some new value'
		} else {
			fail('tmpState must exist to pass the test.')
		}
		expect(store.value).toStrictEqual(nextState)
	})
})
