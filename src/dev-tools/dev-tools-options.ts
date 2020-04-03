// tslint:disable: no-redundant-jsdoc

export type ZoneFunction = <T = void>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]) => T

/**
 * Redux DevTolls options.
 */
export interface DevtoolsOptions {
	/**
	 * The main store name that will be displayed at Redux DevTools.
	 * @default
	 * name = 'LBRX-STORE'
	 */
	name: string,
	/**
	 * A zone that will run callbacks from Redux DevTools.
	 * @example
	 * `Angular:`
	 * zone = NgZone
	 * `Other:`
	 * zone = f => {
	 * 	const r = f()
	 * 	// Some custom logic here...
	 * 	return r
	 * }
	 */
	zone?: ZoneFunction | { run: ZoneFunction },
}
