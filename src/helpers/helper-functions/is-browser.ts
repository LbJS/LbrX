import { isUndefined } from './is-undefined'

export function isBrowser(): boolean {
	return !isUndefined(window)
}
