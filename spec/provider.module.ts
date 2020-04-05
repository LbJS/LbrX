import { UiStateStore, NullStateStore } from 'test-subjects'

export * from 'lbrx'
export * from 'lbrx/helpers'
export * from 'lbrx/mode'
export * from 'lbrx/stores/config'
export * from 'test-subjects'

export default class Provider {

	private static _content: { [key: string]: any } = {
		UiStateStore: new UiStateStore(),
		NullStateStore: new NullStateStore(),
	}

	private constructor() { }

	public static provide<T>(constructable: new () => T): T | never {
		const data = this._content[constructable.name]
		if (data) return data
		throw new Error(`This provider doesn't hold a property with an instance of ${constructable}`)
	}
}
