import { Store, StoreConfig } from 'lbrx'
import { CommonModel } from './common.model'

export function createCommonModel(): CommonModel {
	return {
		data: {}
	}
}

@StoreConfig({
	name: 'NULL-STATE-STORE'
})
export class NullStateStore extends Store<CommonModel> {

	constructor() {
		super(null)
	}
}
