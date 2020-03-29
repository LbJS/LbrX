import { Store, StoreConfig } from 'lbrx'
import { CommonModel } from './common.model'
import { CustomError } from './error'

export function createCommonModel(): CommonModel {
	return {
		data: {}
	}
}

@StoreConfig({
	name: 'NULL-STATE-STORE'
})
export class NullStateStore extends Store<CommonModel, CustomError> {

	constructor() {
		super(null)
	}
}
