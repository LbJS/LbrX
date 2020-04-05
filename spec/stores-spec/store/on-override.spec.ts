import { Store } from 'lbrx'
import { TestSubjectA, TestSubjectsFactory } from 'test-subjects'
import { StoreOnOverride } from 'lbrx/hooks'

describe('Store onOverride():', () => {

	const initialState = TestSubjectsFactory.createTestSubjectA_initial()
	const createStateA = () => TestSubjectsFactory.createTestSubjectA_configA()
	const stateA = createStateA()
	let store: Store<TestSubjectA> & StoreOnOverride<TestSubjectA>
	let onOverrideSpy: jest.SpyInstance<void | TestSubjectA, [TestSubjectA, Readonly<TestSubjectA>]>

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		store = providerModule.StoresFactory.createTestStore<TestSubjectA>(initialState)
		onOverrideSpy = jest.spyOn(store, 'onOverride')
	})

	afterEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
	})

	it('should be called if implemented.', () => {
		store.override(stateA)
		expect(onOverrideSpy).toBeCalled()
	})

	it("shouldn't be called if not implemented.", () => {
		delete store.onOverride
		store.override(stateA)
		expect(onOverrideSpy).not.toBeCalled()
	})

	it('should get the nextState and the currState as arguments.', done => {
		onOverrideSpy.mockImplementation((nextState: TestSubjectA, currState: Readonly<TestSubjectA>): void => {
			expect(nextState).toStrictEqual(stateA)
			expect(currState).toStrictEqual(initialState)
			done()
		})
		store.override(stateA)
	})

	it('should change the new state.', () => {
		const localStateA = createStateA()
		onOverrideSpy.mockImplementation((nextState: TestSubjectA): TestSubjectA => {
			nextState.dateValue?.setFullYear(1900)
			return nextState
		})
		store.override(localStateA)
		expect(store.value).not.toStrictEqual(localStateA)
		expect(localStateA.dateValue).toBeTruthy()
		localStateA.dateValue?.setFullYear(1900)
		expect(store.value).toStrictEqual(localStateA)
	})

	it('should supply a readonly currState.', done => {
		onOverrideSpy.mockImplementation((nextState: TestSubjectA, currState: Readonly<TestSubjectA>): void => {
			expect(() => {
				currState.dateValue?.setFullYear(1900)
			}).toThrow()
			done()
		})
		store.override(stateA)
	})

	it("should disconnect nextState object's references.", () => {
		onOverrideSpy.mockImplementation((newState: TestSubjectA): void => {
			newState.dateValue?.setFullYear(1900)
			newState.stringValue = 'some new value'
		})
		store.override(stateA)
		expect(store.value).toStrictEqual(stateA)
		jest.resetAllMocks()
		let tmpState: TestSubjectA | null = null
		onOverrideSpy.mockImplementation((nextState: TestSubjectA): TestSubjectA => {
			tmpState = nextState
			return nextState
		})
		store.override(stateA)
		if (tmpState) {
			(tmpState as TestSubjectA).dateValue?.setFullYear(1900);
			(tmpState as TestSubjectA).stringValue = 'some new value'
		} else {
			fail('Variable: tmpState must exist to pass the test.')
		}
		expect(store.value).toStrictEqual(stateA)
	})
})
